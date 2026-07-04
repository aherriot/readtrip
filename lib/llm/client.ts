// Anthropic client singleton + the low-level call wrappers every generation path
// goes through. Server-side only — the API key never reaches the browser.
//
// `callModel` (non-streaming) and `streamModel` (SSE-friendly) are the only two
// places we: build request params (conditionally attaching adaptive thinking +
// effort only on models that support them), read token usage off the response,
// and write an LlmCallLog row. Higher-level helpers (lesson, quiz, normalize,
// safety) call these and never touch the SDK directly.
import Anthropic from "@anthropic-ai/sdk";
import { after } from "next/server";
import { cachedSystem } from "./cache";
import { logLlmCall } from "./log";
import {
  computeCostUsd,
  modelSupportsEffort,
  modelSupportsThinking,
  type TokenUsage,
} from "./models";
import type { Task } from "./router";

// Singleton across dev hot-reloads (mirrors the Drizzle client pattern). Built
// lazily so merely importing this module never throws when ANTHROPIC_API_KEY is
// absent (local dev / CI e2e run the loop's offline path — see hasAnthropicKey).
const globalForLlm = globalThis as unknown as { anthropic?: Anthropic };

function getClient(): Anthropic {
  if (!globalForLlm.anthropic) {
    // The SDK reads ANTHROPIC_API_KEY from the environment.
    globalForLlm.anthropic = new Anthropic();
  }
  return globalForLlm.anthropic;
}

/**
 * Whether generation paths should skip the live API and use their offline/canned
 * fallback. True when no Anthropic key is configured (local dev without a key, CI
 * e2e) — so importing/using the client never throws — or when `READTRIP_OFFLINE_LLM`
 * forces it (e2e sets this so the loop's generative steps stay deterministic and
 * fast even when a real key is present). Real deploys leave the flag unset.
 */
export function isLlmOffline(): boolean {
  return (
    !process.env.ANTHROPIC_API_KEY || process.env.READTRIP_OFFLINE_LLM === "1"
  );
}

export interface CallOptions {
  task: Task;
  model: string;
  /** Stable, cached prefix — must be byte-identical across requests. */
  system: string;
  /** Volatile suffix (topic, reading level, history). */
  user: string;
  maxTokens: number;
  effort?: "low" | "medium" | "high";
  /** For observability attribution (nullable per LlmCallLog). */
  childId?: string | null;
  /** Non-null when a safety layer flagged this call. */
  safetyFlag?: string | null;
}

export interface CallResult {
  text: string;
  usage: TokenUsage;
  latencyMs: number;
  model: string;
}

function toTokenUsage(usage: Anthropic.Usage): TokenUsage {
  return {
    inputTokens: usage.input_tokens ?? 0,
    outputTokens: usage.output_tokens ?? 0,
    cacheReadTokens: usage.cache_read_input_tokens ?? 0,
    cacheCreateTokens: usage.cache_creation_input_tokens ?? 0,
  };
}

function textFrom(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

// Adaptive thinking and `effort` are attached only on models that support them
// (Haiku 4.5 rejects `effort` and doesn't need thinking for its low-stakes
// classification calls). Shared by both the streaming and non-streaming paths.
function buildParams(
  opts: CallOptions
): Anthropic.MessageCreateParamsNonStreaming {
  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model: opts.model,
    max_tokens: opts.maxTokens,
    system: cachedSystem(opts.system),
    messages: [{ role: "user", content: opts.user }],
  };
  if (modelSupportsThinking(opts.model)) {
    params.thinking = { type: "adaptive" };
  }
  if (modelSupportsEffort(opts.model) && opts.effort) {
    params.output_config = { effort: opts.effort };
  }
  return params;
}

// Never skip logging a call (docs/06). If the DB write fails (e.g. no DB in a
// throwaway script), warn but don't lose the generation the caller asked for.
async function recordCall(
  opts: CallOptions,
  usage: TokenUsage,
  latencyMs: number
): Promise<void> {
  await logLlmCall({
    task: opts.task,
    model: opts.model,
    usage,
    costUsd: computeCostUsd(opts.model, usage),
    latencyMs,
    childId: opts.childId ?? null,
    safetyFlag: opts.safetyFlag ?? null,
  }).catch((err) => {
    console.error(`[llm] failed to log ${opts.task} call:`, err);
  });
}

// `after()` only works inside a request scope; it throws synchronously
// otherwise (e.g. scripts/verify-llm.ts calling these helpers directly,
// outside any route). Fall back to firing the write immediately there.
function deferRecordCall(
  opts: CallOptions,
  usage: TokenUsage,
  latencyMs: number
): void {
  try {
    after(() => recordCall(opts, usage, latencyMs));
  } catch {
    void recordCall(opts, usage, latencyMs);
  }
}

/** Make one Claude call, log it, and return the full text + usage. */
export async function callModel(opts: CallOptions): Promise<CallResult> {
  const startedAt = Date.now();
  const response = await getClient().messages.create(buildParams(opts));
  const latencyMs = Date.now() - startedAt;

  const usage = toTokenUsage(response.usage);
  deferRecordCall(opts, usage, latencyMs);

  return {
    text: textFrom(response.content),
    usage,
    latencyMs,
    model: opts.model,
  };
}

/**
 * Stream one Claude call, invoking `onDelta` with each text fragment as it
 * arrives, then log the call from the final assembled message. Used by the
 * lesson route to relay a progressive reveal over SSE. Only *text* deltas reach
 * `onDelta` — any thinking blocks stay server-side.
 */
export async function streamModel(
  opts: CallOptions,
  onDelta: (text: string) => void
): Promise<CallResult> {
  const startedAt = Date.now();
  const stream = getClient().messages.stream(buildParams(opts));
  stream.on("text", (delta) => onDelta(delta));
  const message = await stream.finalMessage();
  const latencyMs = Date.now() - startedAt;

  const usage = toTokenUsage(message.usage);
  deferRecordCall(opts, usage, latencyMs);

  return {
    text: textFrom(message.content),
    usage,
    latencyMs,
    model: opts.model,
  };
}

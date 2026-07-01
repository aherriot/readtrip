// Anthropic client singleton + the low-level call wrapper every generation path
// goes through. Server-side only — the API key never reaches the browser.
//
// `callModel` is the one place we: build request params (conditionally attaching
// adaptive thinking + effort only on models that support them), read token usage
// off the response, and write an LlmCallLog row. Higher-level helpers (lesson,
// quiz, normalize, safety) call this and never touch the SDK directly.
import Anthropic from "@anthropic-ai/sdk";
import { cachedSystem } from "./cache";
import { logLlmCall } from "./log";
import {
  computeCostUsd,
  modelSupportsEffort,
  modelSupportsThinking,
  type TokenUsage,
} from "./models";
import type { Task } from "./router";

// Singleton across dev hot-reloads (mirrors the Drizzle client pattern). The SDK
// reads ANTHROPIC_API_KEY from the environment.
const globalForLlm = globalThis as unknown as { anthropic?: Anthropic };

export const anthropic = globalForLlm.anthropic ?? new Anthropic();

if (process.env.NODE_ENV !== "production") {
  globalForLlm.anthropic = anthropic;
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

/**
 * Make one Claude call, log it, and return the text + usage. Adaptive thinking
 * and `effort` are attached only on models that support them (Haiku 4.5 rejects
 * `effort` and doesn't need thinking for its low-stakes classification calls).
 */
export async function callModel(opts: CallOptions): Promise<CallResult> {
  const { task, model, system, user, maxTokens } = opts;

  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: maxTokens,
    system: cachedSystem(system),
    messages: [{ role: "user", content: user }],
  };

  if (modelSupportsThinking(model)) {
    params.thinking = { type: "adaptive" };
  }
  if (modelSupportsEffort(model) && opts.effort) {
    params.output_config = { effort: opts.effort };
  }

  const startedAt = Date.now();
  const response = await anthropic.messages.create(params);
  const latencyMs = Date.now() - startedAt;

  const usage = toTokenUsage(response.usage);
  const costUsd = computeCostUsd(model, usage);

  // Never skip logging a call (docs/06). If the DB write fails (e.g. no DB in a
  // throwaway script), warn but don't lose the generation the caller asked for.
  await logLlmCall({
    task,
    model,
    usage,
    costUsd,
    latencyMs,
    childId: opts.childId ?? null,
    safetyFlag: opts.safetyFlag ?? null,
  }).catch((err) => {
    console.error(`[llm] failed to log ${task} call:`, err);
  });

  return { text: textFrom(response.content), usage, latencyMs, model };
}

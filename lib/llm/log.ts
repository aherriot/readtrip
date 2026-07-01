// LlmCallLog writes — the backbone of the observability dashboard (docs/07).
// One row per LLM call: model, task, token counts (incl. cache read/create),
// latency, computed cost, and any safety flag. Never skip logging a call.
import { db } from "@/lib/db";
import { llmCallLogs } from "@/lib/db/schema";
import type { TokenUsage } from "./models";
import type { Task } from "./router";

export interface LlmCallRecord {
  task: Task;
  model: string;
  usage: TokenUsage;
  costUsd: number;
  latencyMs: number;
  childId?: string | null;
  safetyFlag?: string | null;
}

export async function logLlmCall(record: LlmCallRecord): Promise<void> {
  await db.insert(llmCallLogs).values({
    childId: record.childId ?? null,
    task: record.task,
    model: record.model,
    inputTokens: record.usage.inputTokens,
    outputTokens: record.usage.outputTokens,
    cacheReadTokens: record.usage.cacheReadTokens,
    cacheCreateTokens: record.usage.cacheCreateTokens,
    latencyMs: record.latencyMs,
    costUsd: record.costUsd,
    safetyFlag: record.safetyFlag ?? null,
  });
}

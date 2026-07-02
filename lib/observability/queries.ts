// Data access for the observability dashboard (docs/09 M6). Both queries are
// scoped to a single parent's children so one parent never sees another's usage:
// LlmCallLog rows are attributed by childId (set on every call path), and loops
// hang off learningSession → child. Rows with a null childId (throwaway scripts,
// unattributed calls) are intentionally excluded — the dashboard is per-parent.
//
// Aggregation itself is pure and lives in metrics.ts; here we only fetch.
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  children,
  learningSessions,
  llmCallLogs,
  loops,
} from "@/lib/db/schema";
import { computeMetrics, type CallRow, type DashboardMetrics } from "./metrics";

/**
 * Compute the dashboard metrics for one parent. Pulls the parent's children's
 * call rows and their completed-loop count, then hands both to `computeMetrics`.
 *
 * The call-row scan is fine at the demo's data volumes and keeps the percentile
 * math in tested TypeScript rather than SQL; if the log ever grows large this is
 * the place to push aggregation into Postgres.
 */
export async function getDashboardMetrics(
  parentId: string
): Promise<DashboardMetrics> {
  const [rows, loopCount] = await Promise.all([
    db
      .select({
        model: llmCallLogs.model,
        inputTokens: llmCallLogs.inputTokens,
        cacheReadTokens: llmCallLogs.cacheReadTokens,
        cacheCreateTokens: llmCallLogs.cacheCreateTokens,
        latencyMs: llmCallLogs.latencyMs,
        costUsd: llmCallLogs.costUsd,
        safetyFlag: llmCallLogs.safetyFlag,
      })
      .from(llmCallLogs)
      .innerJoin(children, eq(llmCallLogs.childId, children.id))
      .where(eq(children.parentId, parentId)),
    db
      .select({ n: count() })
      .from(loops)
      .innerJoin(learningSessions, eq(loops.sessionId, learningSessions.id))
      .innerJoin(children, eq(learningSessions.childId, children.id))
      .where(eq(children.parentId, parentId)),
  ]);

  return computeMetrics(rows as CallRow[], loopCount[0]?.n ?? 0);
}

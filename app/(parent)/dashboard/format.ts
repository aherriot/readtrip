// Pure display formatters for the observability dashboard. Kept out of the page
// component (and free of JSX) so the number-shaping is unit-testable and the page
// stays declarative.
import { MODELS } from "@/lib/llm";

/**
 * Format a USD amount for the dashboard. Costs here are tiny (fractions of a
 * cent per call), so we show up to 4 significant-ish decimals but never fewer
 * than 2 — `$0` reads as broken, `$0.0021` reads as real. `null` → an em dash.
 */
export function formatUsd(value: number | null): string {
  if (value === null) return "—";
  if (value === 0) return "$0.00";
  // Below a cent, widen precision so a real-but-small cost is visible.
  const decimals = value < 0.01 ? 4 : 2;
  return `$${value.toFixed(decimals)}`;
}

/** A 0..1 ratio as a whole-ish percentage. `null` → an em dash. */
export function formatPct(value: number | null): string {
  if (value === null) return "—";
  return `${(value * 100).toFixed(value < 0.1 ? 1 : 0)}%`;
}

/** A latency in ms, thousands-separated. `null` → an em dash. */
export function formatMs(value: number | null): string {
  if (value === null) return "—";
  return `${Math.round(value).toLocaleString("en-US")} ms`;
}

/** A count, thousands-separated. */
export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

// Friendly names for the model IDs the router uses (models.ts). Falls back to
// the raw id so an unrecognised model still renders (never blank).
const MODEL_LABELS: Record<string, string> = {
  [MODELS.haiku]: "Haiku 4.5",
  [MODELS.sonnet]: "Sonnet 4.6",
  [MODELS.opus]: "Opus 4.8",
};

export function modelLabel(model: string): string {
  return MODEL_LABELS[model] ?? model;
}

/**
 * Pure progress math, shared by `ProgressBar` (and later the XP bar + the
 * calibration game). Kept out of the component so it can be unit-tested in node
 * (Vitest) — the component itself is covered by Playwright. See AGENTS.md on the
 * two test layers.
 */

/**
 * Convert a `value` against a `max` into a clamped 0–100 percentage.
 *
 * Defensive on purpose: callers pass live values (XP totals, answered counts)
 * that can momentarily be negative, overshoot `max`, or arrive before `max` is
 * known. We never want a bar wider than its track or a negative width, and a
 * non-positive `max` means "no progress measurable yet" → 0.
 */
export function toPercent(value: number, max = 100): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  if (value <= 0) return 0;
  if (value >= max) return 100;
  return (value / max) * 100;
}

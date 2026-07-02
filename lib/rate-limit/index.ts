// Neon-backed fixed-window rate limiter. Used to cap how many LLM-backed
// requests a single child profile can drive in a window, so a runaway client (or
// a stolen session) can't run up unbounded Anthropic spend — the auth checks
// gate *who* can call, this gates *how fast*.
//
// One row per key. Each call atomically bumps the counter with a single
// INSERT ... ON CONFLICT DO UPDATE, resetting the window in place when it has
// expired. That keeps the table bounded to one row per active key (never one per
// window) and needs no separate sweeper. The whole check is a single round-trip.
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";

export interface RateLimitOptions {
  /** Stable identity for the bucket, e.g. `llm:<childId>`. */
  key: string;
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export interface RateLimitResult {
  /** False once the window's count has exceeded `limit`. */
  ok: boolean;
  limit: number;
  /** Requests left in the current window (0 when blocked). */
  remaining: number;
  /** When the current window ends and the count resets. */
  resetAt: Date;
  /** Seconds until reset — suitable for a `Retry-After` header. */
  retryAfterSeconds: number;
}

/**
 * Record one hit against `key` and report whether it's within `limit` for the
 * current window.
 *
 * Fails **open**: if the counter store is unreachable, we log and allow the
 * request. This is a cost/abuse guard on a kid-facing flow, so a DB blip must
 * never stop a child mid-lesson — availability wins over the cap during an
 * outage (mirrors the rest of the app's best-effort DB stance).
 */
export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const now = Date.now();

  try {
    // Do all time math in SQL against the DB's own `now()` so it's self-
    // consistent (mixing a JS Date with a timestamp-without-tz column invites a
    // timezone-offset bug). A window has expired once its start is more than
    // `windowSeconds` in the past. On conflict: expired → start a fresh window
    // (count=1, windowStart=now()); otherwise increment in place. `resetInMs` is
    // returned from SQL too, so the caller never has to reason about the stored
    // timestamp's zone.
    const expired = sql`${rateLimits.windowStart} <= now() - make_interval(secs => ${windowSeconds})`;
    const [row] = await db
      .insert(rateLimits)
      .values({ key, windowStart: sql`now()`, count: 1 })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`CASE WHEN ${expired} THEN 1 ELSE ${rateLimits.count} + 1 END`,
          windowStart: sql`CASE WHEN ${expired} THEN now() ELSE ${rateLimits.windowStart} END`,
        },
      })
      .returning({
        count: rateLimits.count,
        resetInMs: sql<number>`round(extract(epoch from (${rateLimits.windowStart} + make_interval(secs => ${windowSeconds}) - now())) * 1000)`,
      });

    // `resetInMs` comes back as a numeric string over the wire; coerce it.
    const resetInMs = Math.max(0, Number(row.resetInMs));
    return {
      ok: row.count <= limit,
      limit,
      remaining: Math.max(0, limit - row.count),
      resetAt: new Date(now + resetInMs),
      retryAfterSeconds: Math.max(1, Math.ceil(resetInMs / 1000)),
    };
  } catch (err) {
    console.error(`[rate-limit] check failed for ${key}, allowing:`, err);
    const resetAt = new Date(now + windowMs);
    return {
      ok: true,
      limit,
      remaining: limit,
      resetAt,
      retryAfterSeconds: windowSeconds,
    };
  }
}

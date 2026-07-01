// Content safety guardrails, used by every generation path (docs/07). Two
// layers, both server-side:
//   - Input precheck  — rules layer, then a cheap Haiku classifier.
//   - Output check    — a lightweight rules scan of generated text.
// The philosophy is "redirect, don't scold": a blocked topic gets a gentle
// steer toward something else, never a cold error.
import { callModel } from "@/lib/llm/client";
import { pickModel } from "@/lib/llm/router";
import { extractJson } from "@/lib/llm/schemas";
import {
  REDIRECT_MESSAGE,
  type SafetyCategory,
  rulePrecheck,
  ruleOutputScan,
} from "./rules";

export type PrecheckResult =
  { ok: true } | { ok: false; category: string; redirect: string };

const CLASSIFY_SYSTEM = `You are a strict but fair content-safety classifier for a learning app used by children aged 5 to 12. You are given something a child typed that they want to learn about. Decide whether it is appropriate to generate a wholesome, age-appropriate lesson about it.

Treat as SAFE: any wholesome topic or genuine question a curious child might have, including topics that sound heavy but can be explained gently and factually (war, death, natural disasters, the human body, dangerous animals, historical events).

Treat as UNSAFE only if the request is sexual, pornographic, graphically violent or gory, about self-harm or suicide, about making weapons or drugs, hateful, or otherwise clearly inappropriate for a young child and impossible to make age-appropriate.

Return ONLY a JSON object, no prose, in exactly this shape:
{ "safe": true }
or
{ "safe": false, "category": "sexual" | "self_harm" | "graphic_violence" | "drugs" | "hate" | "weapons" | "other" }`;

export interface SafetyOptions {
  childId?: string | null;
}

/**
 * Input guardrail. Runs the pure rules layer first (free), then a Haiku
 * classifier for nuance. Returns ok, or a category + gentle redirect. On a
 * malformed classifier response we fail *open* to a redirect only if the rules
 * layer already had suspicion; an ambiguous classifier result defaults to safe
 * so genuine curiosity isn't blocked by a parsing hiccup.
 */
export async function safetyPrecheck(
  input: string,
  opts: SafetyOptions = {}
): Promise<PrecheckResult> {
  const rule = rulePrecheck(input);
  if (rule.blocked) {
    return {
      ok: false,
      category: rule.category ?? "other",
      redirect: REDIRECT_MESSAGE,
    };
  }

  const { text } = await callModel({
    task: "safety_precheck",
    model: pickModel("safety_precheck"),
    system: CLASSIFY_SYSTEM,
    user: `Child input: "${input}"\n\nClassify it now.`,
    maxTokens: 100,
    childId: opts.childId ?? null,
  });

  const parsed = extractJson(text) as { safe?: unknown; category?: unknown };
  if (parsed && parsed.safe === false) {
    return {
      ok: false,
      category: typeof parsed.category === "string" ? parsed.category : "other",
      redirect: REDIRECT_MESSAGE,
    };
  }

  return { ok: true };
}

export type OutputCheckResult =
  { ok: true } | { ok: false; category: SafetyCategory };

/**
 * Output guardrail. A lightweight rules scan of generated text (lesson, quiz, or
 * topic-map suggestion) before it reaches the child. Cheap and synchronous — the
 * primary defense is the generation system prompt; this is the backstop.
 */
export function outputCheck(text: string): OutputCheckResult {
  const scan = ruleOutputScan(text);
  return scan.blocked
    ? { ok: false, category: scan.category ?? "graphic_violence" }
    : { ok: true };
}

export { REDIRECT_MESSAGE } from "./rules";

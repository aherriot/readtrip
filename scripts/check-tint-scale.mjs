#!/usr/bin/env node
/**
 * Tint-scale enforcement.
 *
 * ReadTrip's translucent fills (badge/chip backgrounds, hover washes, soft
 * borders) are only ever allowed to use the three named steps defined in
 * styles/tokens.css (--tint-wash/-soft/-fill), applied via Tailwind v4's
 * CSS-variable opacity-modifier shorthand: `bg-sun/(--tint-fill)`. A bare
 * numeric opacity modifier on a token color (`bg-sun/20`, `bg-coral/[37%]`)
 * is a one-off that doesn't belong to the family and is easy to typo into
 * something that clashes with nearby fills.
 *
 * This scans app/ and components/ for token-color utilities with a numeric
 * or arbitrary opacity modifier and fails, naming every offending file/line.
 * Colors NOT backed by a design token (Tailwind's own `black`/`white`/etc.)
 * are out of scope — this only polices the token palette.
 *
 * Wired into `npm run check:tint-scale` (pre-commit via `npm run check`, and
 * the same CI step that runs check:design-system).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const scanDirs = ["app", "components", "lib"].map((d) => join(repoRoot, d));

// Token colors exposed as Tailwind utilities by app/globals.css's @theme
// block — the only colors this check polices (see styles/tokens.css).
const TOKEN_COLORS = [
  "sun",
  "coral",
  "berry",
  "aqua",
  "leaf",
  "violet",
  "sky",
  "night",
  "night-panel",
  "ink-on-night",
  "paper",
  "ink",
  "ink-soft",
  "rule",
  "correct",
  "retry",
  "focus-ring",
  "surface",
  "surface-panel",
  "surface-ink",
  "surface-ink-soft",
  "surface-rule",
  "surface-accent",
  "surface-danger",
];

// e.g. `bg-sun/20`, `border-coral/[37%]`, `hover:bg-surface-ink/15` — a
// token-color utility with a numeric/arbitrary opacity modifier instead of
// the named `/(--tint-*)` shorthand.
const OFFENDER = new RegExp(
  `(?:^|[\\s"'\`:])((?:[a-z-]+:)*(?:bg|border|text|ring|outline|from|to|via)-(?:${TOKEN_COLORS.join(
    "|"
  )})/(?:\\d+|\\[[^\\]]*\\]))(?=[\\s"'\`]|$)`,
  "g"
);
const ALLOWED = /\/\(--tint-(wash|soft|fill)\)$/;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if ([".tsx", ".ts"].includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const problems = [];
for (const dir of scanDirs) {
  for (const file of walk(dir)) {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      for (const match of line.matchAll(OFFENDER)) {
        const utility = match[1];
        if (ALLOWED.test(utility)) continue;
        problems.push(
          `• ${relative(repoRoot, file)}:${i + 1}: \`${utility}\` — use a named tint step ` +
            `(e.g. \`bg-sun/(--tint-fill)\`) instead of a numeric opacity modifier`
        );
      }
    });
  }
}

if (problems.length > 0) {
  console.error(
    `tint-scale check FAILED — ${problems.length} issue(s):\n\n` +
      problems.join("\n") +
      "\n\nSee 'Tint scale (translucent fills)' in " +
      ".claude/skills/design-system/references/tokens.md."
  );
  process.exit(1);
}

console.log("tint-scale check: every token-color fill uses a named step ✓");

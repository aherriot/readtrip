#!/usr/bin/env node
/**
 * Design-system parity check.
 *
 * Every component that EXISTS in components/ui/ must be:
 *   1. documented   — references/<kebab>.md + listed in SKILL.md's index,
 *   2. inspectable   — present in the component gallery (app/dev/components),
 *   3. tested        — referenced by the e2e spec (e2e/design-system.spec.ts).
 *
 * This keeps "how & when to use", manual review, and automated tests in lockstep
 * with the code. The check is keyed off what's in code, so it stays green while
 * the library is still being built out, and turns red the moment a component
 * ships without docs / a gallery entry / a test.
 *
 * Wired into `npm run check:design-system` (pre-commit via `npm run check`, and a
 * dedicated CI step). Exits non-zero and names every gap.
 */
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = join(repoRoot, "components", "ui");
const skillDir = join(repoRoot, ".claude", "skills", "design-system");
const skillIndex = join(skillDir, "SKILL.md");
const refsDir = join(skillDir, "references");
const galleryFile = join(repoRoot, "app", "dev", "components", "page.tsx");
const e2eSpec = join(repoRoot, "e2e", "design-system.spec.ts");

/** PascalCase / ACRONYMCase → kebab-case (Input→input, ProgressBar→progress-bar). */
const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const read = (path) => (existsSync(path) ? readFileSync(path, "utf8") : null);
/** Whole-word match so "Input" doesn't satisfy a hypothetical "InputGroup". */
const mentions = (text, name) => new RegExp(`\\b${name}\\b`).test(text);

if (!existsSync(uiDir)) {
  console.log("design-system parity: no components/ui yet — nothing to check.");
  process.exit(0);
}

const components = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .filter((f) => !/\.(test|stories)\.tsx$/.test(f))
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((name) => name !== "index");

// Coverage sources read once; a missing source is reported per-component below
// (so the message points at the fix, not just "file not found").
const skillText = read(skillIndex);
const galleryText = read(galleryFile);
const e2eText = read(e2eSpec);

const problems = [];
for (const name of components) {
  const refRel = `references/${kebab(name)}.md`;
  if (!existsSync(join(refsDir, `${kebab(name)}.md`))) {
    problems.push(`• ${name}: missing reference file ${refRel}`);
  }
  if (!skillText || !mentions(skillText, name)) {
    problems.push(`• ${name}: not listed in SKILL.md's component index`);
  }
  if (!galleryText || !mentions(galleryText, name)) {
    problems.push(`• ${name}: not shown in the gallery (app/dev/components)`);
  }
  if (!e2eText || !mentions(e2eText, name)) {
    problems.push(`• ${name}: no coverage in e2e/design-system.spec.ts`);
  }
}

if (problems.length > 0) {
  console.error(
    `design-system parity check FAILED — ${problems.length} issue(s):\n\n` +
      problems.join("\n") +
      "\n\nSee the 'Maintaining this skill' section of " +
      ".claude/skills/design-system/SKILL.md."
  );
  process.exit(1);
}

console.log(
  `design-system parity: ${components.length} component(s) documented, ` +
    `in the gallery, and tested ✓`
);

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/ui/cn";
import { LessonChunk } from "@/components/reading/LessonChunk";
import { ReadingView } from "@/components/reading/ReadingView";
import { ModalDemo } from "./ModalDemo";
import { QuizDemo } from "./QuizDemo";
import { RewardsDemo } from "./RewardsDemo";
import { WorldMapDemo } from "./WorldMapDemo";

/*
 * Component gallery — the manual-check surface for the design system.
 *
 * Open it in dev (`npm run dev` → http://localhost:3000/dev/components) to:
 *   • eyeball every variant on BOTH surfaces side by side,
 *   • Tab through to confirm focus rings and keyboard operability,
 *   • run axe DevTools / a screen reader against real rendered markup.
 *
 * It's also the target for e2e/design-system.spec.ts (axe + contract) and the
 * opt-in visual snapshot. When you add a component, add a <Section> here — the
 * parity check (scripts/check-design-system-skill.mjs) requires it.
 */

export const metadata: Metadata = {
  title: "Design system — component gallery",
  robots: { index: false, follow: false },
};

const SearchGlyph = () => (
  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" />
    <path
      d="m13.5 13.5 3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const StarGlyph = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
);

const ArrowGlyph = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 10h11m0 0-4-4m4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** One labelled example block. */
function Variant({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Primitive tokens showcase
 *
 * A high-level tour of the raw material every component composes: the
 * colour palette, the layout tokens (radius + spacing), and the type
 * scale. The swatches read their colour straight from `var(--token)` —
 * the tokens ARE the thing on display here, so we show the source of
 * truth rather than a Tailwind utility standing in for it.
 * ------------------------------------------------------------------ */

type Swatch = { name: string; token: string; meta: string; note: string };

const ACCENTS: Swatch[] = [
  { name: "sun", token: "--sun", meta: "#FFC24B", note: "Primary action · XP" },
  {
    name: "coral",
    token: "--coral",
    meta: "#FF6B5C",
    note: "Wrong answer · delete",
  },
  {
    name: "orchid",
    token: "--orchid",
    meta: "#D65DB1",
    note: "Secondary · playful",
  },
  {
    name: "aqua",
    token: "--aqua",
    meta: "#36D6C3",
    note: "Discovery · “deep”",
  },
  { name: "leaf", token: "--leaf", meta: "#7BD66A", note: "Success · correct" },
  { name: "violet", token: "--violet", meta: "#B388FF", note: "Magic · “new”" },
  {
    name: "sky",
    token: "--sky",
    meta: "#5AB6FF",
    note: "In-progress · explore",
  },
];

const NIGHT_SURFACE: Swatch[] = [
  {
    name: "bg-night",
    token: "--bg-night",
    meta: "#1B1F3B",
    note: "Page background",
  },
  {
    name: "bg-night-panel",
    token: "--bg-night-panel",
    meta: "#2A2F55",
    note: "Cards · inputs",
  },
  {
    name: "ink-on-night",
    token: "--ink-on-night",
    meta: "#F4F2FF",
    note: "Body text",
  },
  {
    name: "ink-soft-on-night",
    token: "--ink-soft-on-night",
    meta: "#C7C4E6",
    note: "Secondary text",
  },
];

const PAPER_SURFACE: Swatch[] = [
  { name: "paper", token: "--paper", meta: "#FFFCF5", note: "Page background" },
  {
    name: "paper-panel",
    token: "--paper-panel",
    meta: "#FFFFFF",
    note: "Cards · inputs",
  },
  { name: "ink", token: "--ink", meta: "#22263F", note: "Body text" },
  {
    name: "ink-soft",
    token: "--ink-soft",
    meta: "#4A4F6B",
    note: "Secondary text",
  },
  {
    name: "rule",
    token: "--rule",
    meta: "#E7E0D0",
    note: "Hairlines · dividers",
  },
];

const SEMANTIC: Swatch[] = [
  {
    name: "correct",
    token: "--correct",
    meta: "= leaf",
    note: "Right answer (+ ✓)",
  },
  {
    name: "retry",
    token: "--retry",
    meta: "= coral",
    note: "Try-again fills (+ ↻)",
  },
  {
    name: "focus-ring",
    token: "--focus-ring",
    meta: "= sun",
    note: "Focus indicator",
  },
];

const RADII = [
  { name: "rounded-sm", cls: "rounded-sm", px: "12px" },
  { name: "rounded-md", cls: "rounded-md", px: "20px" },
  { name: "rounded-lg", cls: "rounded-lg", px: "28px" },
  { name: "rounded-pill", cls: "rounded-pill", px: "999px" },
] as const;

const SPACING = [
  { step: "1", cls: "w-1", px: "4px" },
  { step: "2", cls: "w-2", px: "8px" },
  { step: "3", cls: "w-3", px: "12px" },
  { step: "4", cls: "w-4", px: "16px" },
  { step: "6", cls: "w-6", px: "24px" },
  { step: "8", cls: "w-8", px: "32px" },
  { step: "12", cls: "w-12", px: "48px" },
  { step: "16", cls: "w-16", px: "64px" },
] as const;

const TYPE_SCALE = [
  { name: "text-xs", cls: "text-xs", rem: "0.875rem" },
  { name: "text-sm", cls: "text-sm", rem: "1rem" },
  { name: "text-base", cls: "text-base", rem: "1.125rem" },
  { name: "text-lg", cls: "text-lg", rem: "1.375rem" },
  { name: "text-xl", cls: "text-xl", rem: "1.75rem" },
  { name: "text-2xl", cls: "text-2xl", rem: "2.25rem" },
  { name: "text-3xl", cls: "text-3xl", rem: "3rem" },
] as const;

/** A colour chip labelled with its token name, value, and where it's used. */
function ColorSwatch({ name, token, meta, note }: Swatch) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 rounded-md border border-surface-rule"
        // The token itself is the subject — read it directly, don't proxy it
        // through a utility class.
        style={{ background: `var(${token})` }}
      />
      <span className="font-display text-sm text-surface-ink">{name}</span>
      <code className="font-mono text-xs text-surface-ink-soft">
        {token} · {meta}
      </code>
      <Text as="span" size="xs" tone="soft">
        {note}
      </Text>
    </div>
  );
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {swatches.map((s) => (
        <ColorSwatch key={s.name} {...s} />
      ))}
    </div>
  );
}

/** A live mini-panel that re-themes itself via `data-surface`. */
function SurfacePreview({
  surface,
  title,
  blurb,
}: {
  surface: "night" | "paper";
  title: string;
  blurb: string;
}) {
  return (
    <div
      data-surface={surface}
      className="flex flex-col gap-3 rounded-lg bg-surface p-5 text-surface-ink"
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-pill bg-surface-accent" />
        <span className="font-display text-sm text-surface-ink">{title}</span>
      </div>
      <Card padding="sm">
        <Text as="span" size="sm">
          {blurb}
        </Text>
      </Card>
      <code className="font-mono text-xs text-surface-ink-soft">
        data-surface=&quot;{surface}&quot;
      </code>
    </div>
  );
}

function PrimitiveTokens() {
  return (
    <section data-testid="section-primitives" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-surface-ink">
          Primitive tokens
        </h2>
        <Text tone="soft" measure>
          The raw material of the system — the colour palette, the layout
          tokens, and the type scale that every component below composes. Pages
          never hardcode these values: they reach for the utility (
          <code className="font-mono text-sm">bg-sun</code>,{" "}
          <code className="font-mono text-sm">rounded-lg</code>,{" "}
          <code className="font-mono text-sm">text-2xl</code>) or, when a
          utility can&apos;t express it,{" "}
          <code className="font-mono text-sm">var(--token)</code>.
        </Text>
      </div>

      {/* At a glance: the two surfaces (live) + the two type families. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SurfacePreview
          surface="night"
          title="Night sky — play"
          blurb="Deep indigo, glowing accents. Map, explore, rewards."
        />
        <SurfacePreview
          surface="paper"
          title="Field journal — reading"
          blurb="Warm paper, calm and legible. Lessons and quizzes."
        />
        <Card padding="sm" className="flex flex-col justify-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-xl text-surface-ink">
              Fredoka
            </span>
            <code className="font-mono text-xs text-surface-ink-soft">
              font-display · headings, numbers, buttons
            </code>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-body text-xl text-surface-ink">Lexend</span>
            <code className="font-mono text-xs text-surface-ink-soft">
              font-body · reading + UI body
            </code>
          </div>
        </Card>
      </div>

      {/* Colour palette */}
      <Card className="flex flex-col gap-6">
        <Variant title="Accent palette (surface-independent)">
          <SwatchGrid swatches={ACCENTS} />
        </Variant>
        <Variant title="Night-sky surface palette">
          <SwatchGrid swatches={NIGHT_SURFACE} />
        </Variant>
        <Variant title="Field-journal surface palette">
          <SwatchGrid swatches={PAPER_SURFACE} />
        </Variant>
        <Variant title="Semantic (always paired with an icon + text)">
          <SwatchGrid swatches={SEMANTIC} />
        </Variant>
      </Card>

      {/* Layout tokens */}
      <Card className="flex flex-col gap-6">
        <Variant title="Radius">
          <div className="flex flex-wrap gap-6">
            {RADII.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "h-16 w-16 border border-surface-rule bg-surface-accent/(--tint-fill)",
                    r.cls
                  )}
                />
                <span className="font-display text-sm text-surface-ink">
                  {r.name}
                </span>
                <code className="font-mono text-xs text-surface-ink-soft">
                  {r.px}
                </code>
              </div>
            ))}
          </div>
        </Variant>

        <Variant title="Spacing scale (Tailwind 4-based)">
          <div className="flex flex-col gap-2">
            {SPACING.map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <code className="w-10 shrink-0 font-mono text-xs text-surface-ink-soft">
                  p-{s.step}
                </code>
                <div
                  className={cn("h-3 rounded-sm bg-surface-accent", s.cls)}
                />
                <code className="font-mono text-xs text-surface-ink-soft">
                  {s.px}
                </code>
              </div>
            ))}
          </div>
        </Variant>

        <Variant title="Type scale (rem — respects user zoom)">
          <div className="flex flex-col">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="flex items-baseline gap-4 border-b border-surface-rule py-2 last:border-b-0"
              >
                <code className="w-24 shrink-0 font-mono text-xs text-surface-ink-soft">
                  {t.name}
                </code>
                <span
                  className={cn(
                    "truncate font-display text-surface-ink",
                    t.cls
                  )}
                >
                  Explore &amp; read
                </span>
                <code className="ml-auto shrink-0 font-mono text-xs text-surface-ink-soft">
                  {t.rem}
                </code>
              </div>
            ))}
          </div>
        </Variant>
      </Card>
    </section>
  );
}

function ButtonVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Variants (kid size)">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Start exploring</Button>
          <Button variant="secondary">Maybe later</Button>
          <Button variant="ghost">Skip</Button>
        </div>
      </Variant>
      <Variant title="With icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button leadingIcon={<StarGlyph />}>Earn a stamp</Button>
          <Button variant="secondary" trailingIcon={<ArrowGlyph />}>
            Next
          </Button>
        </div>
      </Variant>
      <Variant title="Icon-only (requires aria-label)">
        <Button aria-label="Search topics" variant="ghost">
          <Icon decorative>
            <SearchGlyph />
          </Icon>
        </Button>
      </Variant>
      <Variant title="Link that looks like a button (renders an <a>)">
        <Button href="/api/health" trailingIcon={<ArrowGlyph />}>
          Check system health
        </Button>
      </Variant>
      <Variant title="md size + disabled">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="md" variant="secondary">
            Dense action
          </Button>
          <Button disabled>Can&apos;t click me</Button>
        </div>
      </Variant>
      <Variant title="Full width (thumb-friendly mobile action)">
        <Button fullWidth>Continue</Button>
      </Variant>
      <Variant title="Loading (spinner + aria-busy, inert)">
        <div className="flex flex-wrap items-center gap-3">
          <Button loading>Charting…</Button>
          <Button variant="secondary" size="md" loading>
            Saving…
          </Button>
        </div>
      </Variant>
    </div>
  );
}

function SpinnerVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Sizes (inherit the surrounding text color)">
        <div className="flex items-center gap-4 text-surface-ink">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Variant>
      <Variant title="Tinted with a token utility">
        <Spinner size="lg" className="text-surface-accent" />
      </Variant>
      <Variant title="Standing alone (named for screen readers) + text">
        <div className="flex items-center gap-3 text-surface-ink-soft">
          <Spinner label="Loading your lesson" />
          <Text tone="soft">Charting your lesson…</Text>
        </div>
      </Variant>
    </div>
  );
}

function BadgeVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Feedback pills (icon + word + color) — the word is the meaning">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="leaf" icon="✓">
            Yes!
          </Badge>
          <Badge tone="coral" icon="↻">
            Try again
          </Badge>
        </div>
      </Variant>
      <Variant title="Tag / eyebrow (xs, uppercase) — the map-node markers, which mirror an sr-only label, so aria-hidden">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            tone="sky"
            size="xs"
            variant="tag"
            icon="🚩"
            aria-hidden="true"
          >
            Exploring
          </Badge>
          <Badge
            tone="aqua"
            size="xs"
            variant="tag"
            icon="🔎"
            aria-hidden="true"
          >
            Dive
          </Badge>
          <Badge
            tone="violet"
            size="xs"
            variant="tag"
            icon="🧭"
            aria-hidden="true"
          >
            New
          </Badge>
        </div>
      </Variant>
      <Variant title="Tones (soft token fill + hued border)">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="leaf">Leaf</Badge>
          <Badge tone="coral">Coral</Badge>
          <Badge tone="orchid">Orchid</Badge>
          <Badge tone="aqua">Aqua</Badge>
          <Badge tone="violet">Violet</Badge>
          <Badge tone="sky">Sky</Badge>
          <Badge tone="sun">Sun</Badge>
        </div>
      </Variant>
    </div>
  );
}

function CardVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Default container">
        <Card>
          <Heading level={3}>Volcanoes</Heading>
          <Text tone="soft">A glowing topic node, waiting to be explored.</Text>
        </Card>
      </Variant>
      <Variant title="Elevated (the Panel look — glow on night, shadow on paper)">
        <Card elevated>
          <Heading level={3}>Today&apos;s expedition</Heading>
          <Text tone="soft">Three topics lit up since yesterday.</Text>
        </Card>
      </Variant>
    </div>
  );
}

function TypographyVariants() {
  return (
    <div className="flex flex-col gap-4">
      <Variant title="Heading levels">
        <div className="flex flex-col gap-2">
          <Heading level={1}>Page title</Heading>
          <Heading level={2}>Section title</Heading>
          <Heading level={3}>Subsection</Heading>
        </div>
      </Variant>
      <Variant title="Text sizes + tone">
        <div className="flex flex-col gap-2">
          <Text size="lg">Lead text introduces a lesson.</Text>
          <Text measure>
            Body copy in Lexend with a capped reading measure so lines stay easy
            to track for early readers. Line height and length are legibility
            settings, not decoration.
          </Text>
          <Text size="sm" tone="soft">
            Secondary, supporting detail.
          </Text>
        </div>
      </Variant>
    </div>
  );
}

function IconVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Sizes (labelled — exposed as role=img)">
        <div className="flex items-center gap-4 text-surface-accent">
          <Icon label="Favorite" size="sm">
            <StarGlyph />
          </Icon>
          <Icon label="Favorite" size="md">
            <StarGlyph />
          </Icon>
          <Icon label="Favorite" size="lg">
            <StarGlyph />
          </Icon>
        </div>
      </Variant>
      <Variant title="Decorative (hidden from assistive tech)">
        <span className="inline-flex items-center gap-2 text-surface-ink">
          <Icon decorative>
            <SearchGlyph />
          </Icon>
          <Text as="span">Search is labelled by this text</Text>
        </span>
      </Variant>
    </div>
  );
}

function ProgressVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Accent fill">
        <ProgressBar label="Reading-level calibration" value={45} />
      </Variant>
      <Variant title="XP (sun) with a value readout">
        <ProgressBar
          label="XP to next level"
          value={7}
          max={12}
          tone="sun"
          showValue
        />
      </Variant>
      <Variant title="Complete (leaf)">
        <ProgressBar
          label="Quiz progress"
          value={5}
          max={5}
          tone="leaf"
          showValue
        />
      </Variant>
    </div>
  );
}

/** Renders a component's variants on both surfaces, side by side. */
function Section({ name, children }: { name: string; children: ReactNode }) {
  const slug = name.toLowerCase();
  return (
    <section
      // Stable per-component hook so the visual suite can snapshot each
      // component in isolation (see e2e/design-system.visual.spec.ts).
      data-testid={`section-${slug}`}
      className="flex flex-col gap-4"
    >
      <h2 className="font-display text-2xl text-surface-ink">{name}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div
          data-surface="night"
          data-testid={`${name.toLowerCase()}-night`}
          className="rounded-lg bg-surface p-6 text-surface-ink"
        >
          <p className="mb-4 font-display text-sm text-surface-ink-soft">
            night surface
          </p>
          {children}
        </div>
        <div
          data-surface="paper"
          data-testid={`${name.toLowerCase()}-paper`}
          className="rounded-lg bg-surface p-6 text-surface-ink"
        >
          <p className="mb-4 font-display text-sm text-surface-ink-soft">
            paper surface
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

function InputVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Default (kid size)">
        <Input
          label="Display name"
          hint="Use the name your grown-up gave you."
        />
      </Variant>
      <Variant title="Error (icon + text + color)">
        <Input
          label="Email"
          type="email"
          defaultValue="not-an-email"
          error="That doesn't look like an email yet."
        />
      </Variant>
      <Variant title="Required + leading icon">
        <Input label="Search topics" leadingIcon={<SearchGlyph />} required />
      </Variant>
      <Variant title="Hidden label + md size (dense)">
        <Input
          label="Filter"
          hideLabel
          size="md"
          type="search"
          placeholder="Filter…"
        />
      </Variant>
      <Variant title="Disabled">
        <Input label="Locked field" defaultValue="Can't edit me" disabled />
      </Variant>
    </div>
  );
}

function SelectVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Default (kid size)">
        <Select
          label="Reading level"
          defaultValue={4}
          hint="Set this yourself anytime — it won't change on its own."
        >
          <option value={3}>Level 3 · Ages 6–7 — 1st–2nd grade</option>
          <option value={4}>Level 4 · Ages 8–9 — 3rd–4th grade</option>
          <option value={5}>Level 5 · Age 10 — 5th grade</option>
        </Select>
      </Variant>
      <Variant title="Error (icon + text + color)">
        <Select
          label="Favorite color"
          defaultValue=""
          error="Pick a color to continue."
        >
          <option value="" disabled>
            Choose one…
          </option>
          <option value="aqua">Aqua</option>
          <option value="coral">Coral</option>
        </Select>
      </Variant>
      <Variant title="Hidden label + md size (dense)">
        <Select label="Sort by" hideLabel size="md" defaultValue="recent">
          <option value="recent">Most recent</option>
          <option value="name">Name</option>
        </Select>
      </Variant>
      <Variant title="Disabled">
        <Select label="Locked field" defaultValue="a" disabled>
          <option value="a">Can&apos;t change me</option>
        </Select>
      </Variant>
    </div>
  );
}

export default function ComponentGallery() {
  return (
    <main
      data-surface="paper"
      className="min-h-screen bg-surface px-6 py-10 text-surface-ink"
    >
      <div
        data-testid="gallery"
        className="mx-auto flex max-w-5xl flex-col gap-12"
      >
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-surface-ink">
            Design System
          </h1>
          <p className="max-w-2xl font-body text-surface-ink-soft">
            Every design-system component, every variant, on both surfaces.
            Mobile-first: resize narrow to check the touch layout. Tab through
            to confirm focus rings; run axe DevTools or a screen reader here to
            spot a11y issues. Dev-only — not indexed, not for production routes.
          </p>
        </header>

        <PrimitiveTokens />

        <Section name="Button">
          <ButtonVariants />
        </Section>

        <Section name="Badge">
          <BadgeVariants />
        </Section>

        <Section name="Card">
          <CardVariants />
        </Section>

        {/* Heading + Text share one section — both enforce the type scale. */}
        <Section name="Heading">
          <TypographyVariants />
        </Section>

        <Section name="Icon">
          <IconVariants />
        </Section>

        <Section name="ProgressBar">
          <ProgressVariants />
        </Section>

        <Section name="Spinner">
          <SpinnerVariants />
        </Section>

        <Section name="Input">
          <InputVariants />
        </Section>

        <Section name="Select">
          <SelectVariants />
        </Section>

        {/* Modal manages its own open state, so it gets a bespoke section with
            one interactive trigger per surface (not the duplicated <Section>). */}
        <section data-testid="section-modal" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">Modal</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ModalDemo surface="night" />
            <ModalDemo surface="paper" />
          </div>
        </section>

        {/* ReadingView forces its own paper surface (the field journal), so it
            gets a bespoke section rather than the two-surface <Section>. */}
        <section
          data-testid="section-readingview"
          className="flex flex-col gap-4"
        >
          <h2 className="font-display text-2xl text-surface-ink">
            ReadingView + LessonChunk
          </h2>
          <ReadingView aria-label="Lesson about the Moon">
            <Heading level={1}>The Moon</Heading>
            <LessonChunk>
              Look up at night and you might see it glowing — the Moon, our
              closest neighbour in space!
            </LessonChunk>
            <LessonChunk>
              The Moon travels all the way around Earth about once a month. It
              has no light of its own; it shines by catching sunlight, like a
              mirror.
            </LessonChunk>
            <LessonChunk>
              What do you think it would feel like to bounce across the Moon?
            </LessonChunk>
          </ReadingView>
        </section>

        {/* QuizChoice + QuizCard are field-journal (paper) components and manage
            their own answer state, so — like ReadingView — they get a bespoke
            single-surface section with an interactive demo island. */}
        <section data-testid="section-quiz" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">
            QuizChoice + QuizCard
          </h2>
          <QuizDemo />
        </section>

        {/* TopicNode + WorldMap are night/play-surface game components with tap
            handlers, so — like QuizDemo — they get a bespoke single-surface
            section driven by a client demo island. */}
        <section data-testid="section-worldmap" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">
            TopicNode + WorldMap
          </h2>
          <WorldMapDemo />
        </section>

        {/* XPBar / RewardBurst / ExpeditionStamp / LevelUpCelebration are the
            night/play-surface reward components; the level-up is an overlay, so
            (like Modal) the demo island supplies a trigger to open it. */}
        <section data-testid="section-rewards" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">
            XPBar + RewardBurst + ExpeditionStamp + LevelUpCelebration
          </h2>
          <RewardsDemo />
        </section>
      </div>
    </main>
  );
}

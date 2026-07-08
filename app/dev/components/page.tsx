import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Highlight } from "@/components/ui/Highlight";
import { Icon } from "@/components/ui/Icon";
import { ICON_NAMES } from "@/components/ui/icons/glyphs";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { StampMark } from "@/components/ui/StampMark";
import { StickyNote } from "@/components/ui/StickyNote";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Text } from "@/components/ui/Text";
import { Wordmark } from "@/components/ui/Wordmark";
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
 *   • eyeball every variant on the field-journal surface,
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

/** One labelled example block. */
function Variant({
  title,
  children,
  size = "xs",
}: {
  title: string;
  children: ReactNode;
  size?: "xs" | "sm";
}) {
  const sizeClass = size === "sm" ? "text-sm" : "text-xs";
  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          "font-display tracking-wide text-surface-ink-soft uppercase",
          sizeClass
        )}
      >
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

// Layer 1 — PRIMITIVES: every raw color value in the system (see styles/tokens.css).
const PRIMITIVES: Swatch[] = [
  { name: "sun", token: "--sun", meta: "#FFC24B", note: "Primary action · XP" },
  {
    name: "coral",
    token: "--coral",
    meta: "#FF6B5C",
    note: "Alarm accent · fills",
  },
  {
    name: "coral-strong",
    token: "--coral-strong",
    meta: "#B23A2E",
    note: "Coral as small text (AA)",
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
  { name: "leaf", token: "--leaf", meta: "#7BD66A", note: "Success · fills" },
  {
    name: "leaf-strong",
    token: "--leaf-strong",
    meta: "#2E7D32",
    note: "Leaf as small text (AA)",
  },
  { name: "violet", token: "--violet", meta: "#B388FF", note: "Magic · “new”" },
  {
    name: "sky",
    token: "--sky",
    meta: "#5AB6FF",
    note: "In-progress · explore",
  },
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
  {
    name: "periwinkle",
    token: "--periwinkle",
    meta: "#D7DFF0",
    note: "Ruled lines",
  },
  { name: "blush", token: "--blush", meta: "#F0B3AA", note: "Margin rule" },
  { name: "desk", token: "--desk", meta: "#E7E2D7", note: "Desk" },
  { name: "cover", token: "--cover", meta: "#6F5238", note: "Leather cover" },
  { name: "stitch", token: "--stitch", meta: "#D8C39A", note: "Cover stitch" },
];

// Layer 2 — SEMANTIC: meaning mapped onto primitives. Components read THESE.
const SEMANTIC: Swatch[] = [
  {
    name: "surface",
    token: "--surface-bg",
    meta: "= paper",
    note: "Page background",
  },
  {
    name: "surface-panel",
    token: "--surface-panel",
    meta: "= paper-panel",
    note: "Cards · inputs",
  },
  {
    name: "surface-ink",
    token: "--surface-ink",
    meta: "= ink",
    note: "Body text",
  },
  {
    name: "surface-ink-soft",
    token: "--surface-ink-soft",
    meta: "= ink-soft",
    note: "Secondary text",
  },
  {
    name: "surface-rule",
    token: "--surface-rule",
    meta: "= rule",
    note: "Dividers",
  },
  {
    name: "surface-accent",
    token: "--surface-accent",
    meta: "= orchid",
    note: "The surface accent",
  },
  {
    name: "correct",
    token: "--correct",
    meta: "= leaf",
    note: "Right answer · fills (+ ✓)",
  },
  {
    name: "retry",
    token: "--retry",
    meta: "= coral",
    note: "Try-again · fills (+ ↻)",
  },
  {
    name: "surface-success",
    token: "--surface-success",
    meta: "= leaf-strong",
    note: "Correct — small text",
  },
  {
    name: "surface-danger",
    token: "--surface-danger",
    meta: "= coral-strong",
    note: "Error — small text",
  },
  {
    name: "journal-line",
    token: "--journal-line",
    meta: "= periwinkle",
    note: "Ruled lines",
  },
  {
    name: "journal-margin",
    token: "--journal-margin",
    meta: "= blush",
    note: "Margin rule",
  },
  {
    name: "surface-desk",
    token: "--surface-desk",
    meta: "= desk",
    note: "Desk",
  },
  {
    name: "surface-cover",
    token: "--surface-cover",
    meta: "= cover",
    note: "Leather cover",
  },
  {
    name: "surface-stitch",
    token: "--surface-stitch",
    meta: "= stitch",
    note: "Cover stitch",
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

/** Stable hand-placed tilt (deg) from a string, so a swatch keeps its angle. */
function swatchTilt(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ((h % 5) - 2) * 1.4; // -2.8° … +2.8°
}

/**
 * A colour chip — drawn as if someone swatched the marker on the paper to test
 * it: the real token colour with uneven, hand-run edges (the #rt-sketch
 * turbulence filter) and a hand-placed tilt, so it reads as laid down by hand
 * rather than a printed chip.
 */
function ColorSwatch({ name, token, meta, note }: Swatch) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-14" style={{ rotate: `${swatchTilt(name)}deg` }}>
        <div
          aria-hidden="true"
          className="h-full w-full rounded-[3px] [filter:url(#rt-sketch)]"
          // The token itself is the subject — read it directly, don't proxy it
          // through a utility class.
          style={{ backgroundColor: `var(${token})` }}
        />
      </div>
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

/** A live mini-panel showing the field-journal surface. */
function SurfacePreview({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface p-5 text-surface-ink">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-pill bg-surface-accent" />
        <span className="font-display text-sm text-surface-ink">{title}</span>
      </div>
      <Card padding="sm">
        <Text as="span" size="sm">
          {blurb}
        </Text>
      </Card>
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

      {/* At a glance: the one surface (live) + the type families. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SurfacePreview
          title="The field journal"
          blurb="Warm lined paper, hand-drawn ink, one handwritten voice. The single surface."
        />
        <Card padding="sm" className="flex flex-col justify-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-xl text-surface-ink">
              Shantell Sans
            </span>
            <code className="font-mono text-xs text-surface-ink-soft">
              font-display + font-body · one handwritten voice
            </code>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xl text-surface-ink [font-family:var(--font-lexend)]">
              Lexend
            </span>
            <code className="font-mono text-xs text-surface-ink-soft">
              fallback only · if the hand fails to load
            </code>
          </div>
        </Card>
      </div>

      {/* Colour palette — the two-layer token system. */}
      <Card className="flex flex-col gap-6">
        <Variant
          size="sm"
          title="Layer 1 · Primitives — every raw colour (styles/tokens.css)"
        >
          <SwatchGrid swatches={PRIMITIVES} />
        </Variant>
        <Variant
          size="sm"
          title="Layer 2 · Semantic — meaning mapped onto primitives (components read these)"
        >
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
          <Button leadingIcon={<Icon name="star" decorative size="sm" />}>
            Earn a stamp
          </Button>
          <Button
            variant="secondary"
            trailingIcon={<Icon name="arrow-right" decorative size="sm" />}
          >
            Next
          </Button>
        </div>
      </Variant>
      <Variant title="Icon-only (requires aria-label)">
        <Button aria-label="Search topics" variant="ghost">
          <Icon name="search" decorative />
        </Button>
      </Variant>
      <Variant title="Link that looks like a button (renders an <a>)">
        <Button
          href="/api/health"
          trailingIcon={<Icon name="arrow-right" decorative size="sm" />}
        >
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

function SubmitButtonVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Submits its enclosing form; goes busy while pending">
        {/* An empty server action gives the form a real submit target so the
            button renders in its resting state here. Its pending spinner only
            appears mid-submit — see it live on /profiles (select an explorer)
            or /play ("Switch explorer"). */}
        <form
          action={async () => {
            "use server";
          }}
          className="flex flex-wrap gap-3"
        >
          <SubmitButton>Save changes</SubmitButton>
          <SubmitButton variant="ghost" size="md">
            Not yet
          </SubmitButton>
          <SubmitButton loading>Always busy (loading forced)</SubmitButton>
        </form>
      </Variant>
    </div>
  );
}

function StickyNoteVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Tones (accent paper) + tape + a hand-placed tilt">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <StickyNote tone="sun" tape tilt={-1.5}>
            <Heading level={3} size="lg">
              Volcanoes
            </Heading>
            <Text size="sm">Mastered</Text>
          </StickyNote>
          <StickyNote tone="aqua" tape tilt={1.2}>
            <Heading level={3} size="lg">
              Tides
            </Heading>
            <Text size="sm">Dive in</Text>
          </StickyNote>
          <StickyNote tone="sky" tape tilt={-0.8}>
            <Heading level={3} size="lg">
              The Moon
            </Heading>
            <Text size="sm">Continue</Text>
          </StickyNote>
          <StickyNote tone="violet" tape tilt={1.6}>
            <Heading level={3} size="lg">
              Comets
            </Heading>
            <Text size="sm">New</Text>
          </StickyNote>
        </div>
      </Variant>
      <Variant title="Untaped, flat (tilt 0) — for calmer groupings">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <StickyNote tone="leaf">
            <Text>Collected: 12 leaves</Text>
          </StickyNote>
          <StickyNote tone="coral">
            <Text>3 tricky words</Text>
          </StickyNote>
          <StickyNote tone="orchid">
            <Text>A note to self</Text>
          </StickyNote>
        </div>
      </Variant>
    </div>
  );
}

function StampMarkVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Pressed over content (as on a resolved quiz choice)">
        <div className="flex flex-wrap items-center gap-10 py-4">
          <StampMark
            tone="leaf"
            tilt={-7}
            icon={
              <Icon name="check" decorative size="sm" accent="currentColor" />
            }
          >
            Yes!
          </StampMark>
          <StampMark
            tone="coral"
            tilt={5}
            icon={
              <Icon name="retry" decorative size="sm" accent="currentColor" />
            }
          >
            Try again
          </StampMark>
        </div>
      </Variant>
    </div>
  );
}

function HighlightVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="A marker swipe over written text (the journal alt to a pill)">
        <div className="flex flex-wrap items-center gap-6 text-lg text-surface-ink">
          <span>
            <Highlight tone="sun">Lvl 4</Highlight>
          </span>
          <span>
            <Highlight tone="aqua">New</Highlight>
          </span>
          <span>
            <Highlight tone="orchid">Mastered</Highlight>
          </span>
          <span>
            You&apos;ve read <Highlight tone="leaf">12 topics</Highlight> so
            far.
          </span>
        </div>
      </Variant>
    </div>
  );
}

function WordmarkVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="The mark — ink letters on a gold offset shadow, pen underline">
        <Wordmark className="h-14" />
      </Variant>
      <Variant title="Header size (as used on /play)">
        <Wordmark className="h-9" />
      </Variant>
      <Variant title="Decorative (a heading already names the region)">
        <Wordmark className="h-9" decorative />
      </Variant>
    </div>
  );
}

function CardVariants() {
  return (
    <div className="flex flex-col gap-6">
      <Variant title="Default container (a pen box drawn on the paper)">
        <Card>
          <Heading level={3}>Volcanoes</Heading>
          <Text tone="soft">A topic waiting to be explored.</Text>
        </Card>
      </Variant>
      <Variant title="Elevated (the Panel look — a heavier, drawn-twice outline)">
        <Card elevated>
          <Heading level={3}>Today&apos;s expedition</Heading>
          <Text tone="soft">Three topics explored since yesterday.</Text>
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
      <Variant title="The unified set (hand-drawn doodle; token accent per glyph)">
        <div className="grid grid-cols-6 gap-x-3 gap-y-4 sm:grid-cols-9">
          {ICON_NAMES.map((name) => (
            <span key={name} className="flex flex-col items-center gap-1">
              <Icon name={name} size="lg" label={name} />
              <span className="font-body text-[0.6rem] text-surface-ink-soft">
                {name}
              </span>
            </span>
          ))}
        </div>
      </Variant>
      <Variant title="Sizes (sm · md · lg · xl)">
        <div className="flex items-end gap-4">
          <Icon name="rocket" size="sm" label="rocket small" />
          <Icon name="rocket" size="md" label="rocket medium" />
          <Icon name="rocket" size="lg" label="rocket large" />
          <Icon name="rocket" size="xl" label="rocket extra large" />
        </div>
      </Variant>
      <Variant title="Accent override + a bespoke child <svg> (the escape hatch)">
        <span className="inline-flex items-center gap-3 text-surface-ink">
          <Icon name="star" accent="var(--sky)" label="Sky star" />
          <Icon decorative>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle
                cx="9"
                cy="9"
                r="5.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m13.5 13.5 3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Icon>
          <Text as="span">A custom glyph still works</Text>
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

/** Renders a component's variants on the field-journal surface. */
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
      <div
        data-testid={slug}
        className="rounded-lg bg-surface p-6 text-surface-ink"
      >
        {children}
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
        <Input
          label="Search topics"
          leadingIcon={<Icon name="search" decorative />}
          required
        />
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
          <option value={3}>Level 3 · Ages 6–7</option>
          <option value={4}>Level 4 · Ages 8–9</option>
          <option value={5}>Level 5 · Age 10</option>
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

/* Field-journal surface showcase — the signature look: warm lined paper, one
   handwritten voice (Shantell Sans), and text resting ON the ruled lines. This
   is a surface/treatment demo (not a single component), so it composes tokens +
   the `.rt-lined` helper directly. Colors are kept AA: ink text throughout, with
   accents carried by borders/underlines/fills (which only need 3:1), never as
   small colored text. */
function JournalEntry() {
  return (
    <div
      data-testid="journal"
      // padding-top is one --journal-period so the first line lands on the grid.
      className="rt-lined rt-inkbox rounded-lg bg-surface pt-[var(--journal-period)] pr-5 pb-4 text-surface-ink"
    >
      <p className="text-[1.3rem] font-semibold">
        Field Notes — How Plants Eat Sunlight{" "}
        <span className="text-surface-ink-soft">· Day 3</span>
      </p>
      <p className="text-[1.15rem]">
        Today I learned that a leaf is a tiny green factory. It catches
        sunlight, drinks water up from the roots, and pulls in air through holes
        too small to see. Inside, it mixes them into sugar — the plant&apos;s
        own food — and breathes out the oxygen we need.{" "}
        <span className="font-semibold underline decoration-orchid decoration-2 underline-offset-4">
          No sunlight, no sugar.
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-[var(--journal-period)]">
        <span className="rounded-[8px_10px_9px_11px] border-2 border-surface-ink px-3 py-0.5 text-[0.95rem] font-semibold">
          Photosynthesis
        </span>
        <span className="rounded-pill bg-sun px-2.5 py-0.5 text-[0.95rem] font-semibold text-[var(--ink)]">
          +40 XP
        </span>
        <span className="-rotate-6 rounded-md border-[2.5px] border-surface-accent px-2.5 py-0.5 text-[0.85rem] font-semibold tracking-wider uppercase">
          Explored
        </span>
      </div>
    </div>
  );
}

export default function ComponentGallery() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10 text-surface-ink">
      <div
        data-testid="gallery"
        className="mx-auto flex max-w-5xl flex-col gap-12"
      >
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-surface-ink">
            Design System
          </h1>
          <p className="max-w-2xl font-body text-surface-ink-soft">
            Every design-system component, every variant, on the field-journal
            surface. Mobile-first: resize narrow to check the touch layout. Tab
            through to confirm focus rings; run axe DevTools or a screen reader
            here to spot a11y issues. Dev-only — not indexed, not for
            production.
          </p>
        </header>

        {/* The signature surface — the whole app is now this field journal. */}
        <section
          data-testid="section-fieldjournal"
          className="flex flex-col gap-4"
        >
          <h2 className="font-display text-2xl text-surface-ink">
            Field journal — the surface
          </h2>
          <p className="max-w-2xl font-body text-surface-ink-soft">
            The whole app is one explorer&apos;s journal: warm lined paper, a
            single handwritten voice (Shantell Sans), hand-drawn ink boxes, and
            text that rests on the ruled lines.
          </p>
          <div className="max-w-2xl">
            <JournalEntry />
          </div>
        </section>

        <PrimitiveTokens />

        <Section name="Button">
          <ButtonVariants />
        </Section>

        <Section name="StampMark">
          <StampMarkVariants />
        </Section>

        <Section name="Highlight">
          <HighlightVariants />
        </Section>

        <Section name="Card">
          <CardVariants />
        </Section>

        <Section name="StickyNote">
          <StickyNoteVariants />
        </Section>

        <Section name="Wordmark">
          <WordmarkVariants />
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

        <Section name="SubmitButton">
          <SubmitButtonVariants />
        </Section>

        <Section name="Input">
          <InputVariants />
        </Section>

        <Section name="Select">
          <SelectVariants />
        </Section>

        {/* Modal manages its own open state, so it gets a bespoke section with
            an interactive trigger (not the duplicated <Section>). */}
        <section data-testid="section-modal" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">Modal</h2>
          <ModalDemo />
        </section>

        {/* ReadingView is a transparent pen box on the journal page (like the
            quiz), so it gets its own section rather than the shared <Section>. */}
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

        {/* TopicNode + WorldMap are game components with tap handlers, so — like
            QuizDemo — they get a bespoke section driven by a client demo island. */}
        <section data-testid="section-worldmap" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl text-surface-ink">
            TopicNode + WorldMap
          </h2>
          <WorldMapDemo />
        </section>

        {/* XPBar / RewardBurst / ExpeditionStamp / LevelUpCelebration are the
            reward components; the level-up is an overlay, so (like Modal) the
            demo island supplies a trigger to open it. */}
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

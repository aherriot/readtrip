import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import { LessonChunk } from "@/components/reading/LessonChunk";
import { ReadingView } from "@/components/reading/ReadingView";
import { ModalDemo } from "./ModalDemo";
import { QuizDemo } from "./QuizDemo";

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
            Component gallery
          </h1>
          <p className="max-w-2xl font-body text-surface-ink-soft">
            Every design-system component, every variant, on both surfaces.
            Mobile-first: resize narrow to check the touch layout. Tab through
            to confirm focus rings; run axe DevTools or a screen reader here to
            spot a11y issues. Dev-only — not indexed, not for production routes.
          </p>
        </header>

        <Section name="Button">
          <ButtonVariants />
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

        <Section name="Input">
          <InputVariants />
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
      </div>
    </main>
  );
}

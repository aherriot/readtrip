import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/Input";

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

/**
 * The variants for a component, rendered once per surface by <Section>. Keep
 * every meaningful state here so manual review and the visual snapshot cover it.
 */
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

/** Renders a component's variants on both surfaces, side by side. */
function Section({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
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
            Every design-system component, every variant, on both surfaces. Tab
            through to check focus rings; run axe DevTools or a screen reader
            here to spot a11y issues. Dev-only — not indexed, not for production
            routes.
          </p>
        </header>

        <Section name="Input">
          <InputVariants />
        </Section>
      </div>
    </main>
  );
}

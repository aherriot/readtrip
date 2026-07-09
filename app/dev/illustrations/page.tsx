import type { Metadata } from "next";
import { Heading } from "@/components/ui/Heading";
import {
  ILLUSTRATION_CATALOG,
  ILLUSTRATION_NAMES,
} from "@/components/ui/illustrations/catalog";
import { JournalSheet } from "@/components/layout/JournalSheet";
import { IllustrationGallery } from "./IllustrationGallery";

export const metadata: Metadata = {
  title: "Illustration gallery",
  robots: { index: false, follow: false },
};

// Scratch preview page for iterating on illustrations on the real
// field-journal surface. Not part of the app nav — see the illustrations
// skill (.claude/skills/illustrations) for how to add a new piece.
export default function IllustrationsGalleryPage() {
  const entries = ILLUSTRATION_NAMES.map((name) => ({
    name,
    ...ILLUSTRATION_CATALOG[name],
  }));

  return (
    <JournalSheet contentClassName="max-w-4xl gap-8 py-8">
      <Heading level={1}>Illustration gallery</Heading>
      <IllustrationGallery entries={entries} />
    </JournalSheet>
  );
}

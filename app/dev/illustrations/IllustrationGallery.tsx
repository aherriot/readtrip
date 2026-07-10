"use client";

import { useMemo, useState } from "react";
import { Illustration } from "@/components/ui/illustrations/Illustration";
import type {
  IllustrationMeta,
  IllustrationName,
} from "@/components/ui/illustrations/catalog";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

type Entry = IllustrationMeta & { name: IllustrationName };

/**
 * Client-side search over the illustration catalog — filters by name, tag, or
 * category as you type. Scratch/dev tooling for eyeballing the set, not part
 * of the app; see the illustrations skill for how to add new pieces.
 */
export function IllustrationGallery({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) =>
      [entry.name, entry.tag, entry.category, entry.label]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [entries, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-sm">
        <Input
          label="Search illustrations"
          size="md"
          placeholder="Search by name, tag, or category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Text tone="soft">No illustrations match “{query}”.</Text>
      ) : (
        <div className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center gap-2">
              <Illustration name={entry.name} size="xl" label={entry.label} />
              <div className="flex flex-col items-center gap-0.5 text-center">
                <Text className="font-medium">{entry.label}</Text>
                <Text tone="soft" size="xs">
                  tag: {entry.tag}
                </Text>
                <Text tone="soft" size="xs">
                  category: {entry.category}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

-- The reading-level scale widened from 1..5 to 1..7 (docs/04): a new, simpler
-- level 1 was inserted below the old floor and a new, harder level 7 was added
-- above the old ceiling. Every existing stored level therefore shifts up by one
-- so its *meaning* (age band / style guidance) stays the same as before.
UPDATE "Child" SET "readingLevel" = "readingLevel" + 1;
UPDATE "Child" SET "suggestedReadingLevel" = "suggestedReadingLevel" + 1 WHERE "suggestedReadingLevel" IS NOT NULL;
UPDATE "Child" SET "readingSuggestionSnoozedLevel" = "readingSuggestionSnoozedLevel" + 1 WHERE "readingSuggestionSnoozedLevel" IS NOT NULL;
UPDATE "Loop" SET "readingLevel" = "readingLevel" + 1;
-- recentQuizScores is a jsonb array of { level, pct, at } records (lib/reading/adapt.ts)
-- storing the reading level a quiz was taken at, so its embedded levels need the
-- same +1 shift or ongoing adaptation would silently stop matching any history.
UPDATE "Child"
SET "recentQuizScores" = (
  SELECT jsonb_agg(jsonb_set(elem, '{level}', to_jsonb((elem->>'level')::int + 1)))
  FROM jsonb_array_elements("recentQuizScores") elem
)
WHERE jsonb_array_length("recentQuizScores") > 0;
--> statement-breakpoint
ALTER TABLE "Child" ALTER COLUMN "readingLevel" SET DEFAULT 4;
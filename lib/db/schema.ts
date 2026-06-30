// M0 skeleton schema. The full data model (User/Account/Session, Child, progress,
// badges, map, logs) lands in M2 — see docs/06-data-model.md.
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Trivial table so M0 can prove an end-to-end DB round-trip on Neon.
export const ping = pgTable("Ping", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
});

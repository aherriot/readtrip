import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Singleton Drizzle client over Neon's HTTP driver. The HTTP driver is
// connectionless (one fetch per query), so it's serverless-safe by design and
// won't exhaust Neon connections from function reuse / dev hot-reload.
// See docs/02-architecture.md.
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

// The HTTP driver never opens a connection here — `neon()`/`drizzle()` only
// build a client; a fetch happens on the first *query*. So constructing this is
// safe without a reachable database. `neon()` does require a non-empty URL
// string though, and the client is constructed at import (the Auth.js Drizzle
// adapter probes it during module init, so it can't be deferred). A build with
// no database — a Vercel preview build — has no DATABASE_URL, so fall back to an
// unreachable placeholder: the build constructs fine and never queries, while
// runtime (which sets DATABASE_URL) uses the real connection. A runtime that
// somehow lacks DATABASE_URL fails loudly on its first query against the
// obviously-fake `.invalid` host rather than silently reading the wrong DB.
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://build:build@build.invalid/placeholder";

const sql = neon(connectionString);

export const db = globalForDb.db ?? drizzle(sql, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export { schema };

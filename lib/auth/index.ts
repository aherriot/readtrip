import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { authConfig } from "./config";

// The dev Credentials provider is a local-only convenience (and what the e2e
// route-protection tests sign in through). It is a backdoor, so it is enabled
// ONLY outside production — never ship it to a real deployment.
const devCredentialsEnabled = process.env.NODE_ENV !== "production";

const resendApiKey = process.env.AUTH_RESEND_KEY;
// Resend allows sending to your own account email from this address without
// verifying a domain — handy for a first deploy. Override with a verified
// sender via EMAIL_FROM.
const emailFrom = process.env.EMAIL_FROM ?? "ReadTrip <onboarding@resend.dev>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    // Email magic link via Resend's HTTP API. With AUTH_RESEND_KEY set, the
    // provider sends a real email. Without a key (typical local dev), we
    // override to log the link to the server console so you can sign in with no
    // email infrastructure — and in production we throw instead of silently
    // pretending to send (the verify-request page would otherwise lie).
    Resend({
      apiKey: resendApiKey ?? "resend-key-unset",
      from: emailFrom,
      ...(resendApiKey
        ? {}
        : {
            async sendVerificationRequest({ identifier, url }) {
              if (process.env.NODE_ENV === "production") {
                throw new Error(
                  "AUTH_RESEND_KEY is not set — cannot send the sign-in email."
                );
              }
              console.log(
                `\n🔗 ReadTrip sign-in link for ${identifier}:\n   ${url}\n`
              );
            },
          }),
    }),
    // Dev-only: sign in with just an email (+ optional name). Upserts a real
    // parent User row so child profiles can be created against it.
    ...(devCredentialsEnabled
      ? [
          Credentials({
            id: "dev-credentials",
            name: "Dev sign-in",
            credentials: {
              email: { label: "Email", type: "email" },
              name: { label: "Name", type: "text" },
            },
            async authorize(credentials) {
              const email =
                typeof credentials?.email === "string"
                  ? credentials.email.trim().toLowerCase()
                  : "";
              if (!email) return null;
              const name =
                typeof credentials?.name === "string" && credentials.name.trim()
                  ? credentials.name.trim()
                  : null;

              const existing = await db.query.users.findFirst({
                where: eq(users.email, email),
              });
              if (existing) {
                return {
                  id: existing.id,
                  email: existing.email,
                  name: existing.name,
                };
              }

              const [created] = await db
                .insert(users)
                .values({ email, name })
                .returning();
              return {
                id: created.id,
                email: created.email,
                name: created.name,
              };
            },
          }),
        ]
      : []),
  ],
});

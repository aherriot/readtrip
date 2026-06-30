import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { createTransport } from "nodemailer";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { authConfig } from "./config";

// The dev Credentials provider is a local-only convenience (and what the e2e
// route-protection tests sign in through). It is a backdoor, so it is enabled
// ONLY outside production — never ship it to a real deployment.
const devCredentialsEnabled = process.env.NODE_ENV !== "production";

const emailFrom = process.env.EMAIL_FROM ?? "ReadTrip <login@readtrip.app>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    // Email magic link. In dev (no SMTP configured) the link is logged to the
    // server console so you can sign in without any email infrastructure; in
    // production it is sent over SMTP from EMAIL_SERVER.
    Nodemailer({
      // The provider requires a truthy `server` at construction. When no SMTP is
      // configured (dev), use a no-op JSON transport — sendVerificationRequest
      // below short-circuits to console logging before it's ever used.
      server: process.env.EMAIL_SERVER ?? { jsonTransport: true },
      from: emailFrom,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (!process.env.EMAIL_SERVER) {
          console.log(
            `\n🔗 ReadTrip sign-in link for ${identifier}:\n   ${url}\n`
          );
          return;
        }
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Sign in to ReadTrip",
          text: `Sign in to ReadTrip:\n${url}\n\nIf you didn't request this, you can ignore this email.`,
          html: `<p>Sign in to <strong>ReadTrip</strong>:</p><p><a href="${url}">Continue to ReadTrip →</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
        });
      },
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

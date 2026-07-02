import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config. Contains NO database adapter (the Drizzle adapter + pg
 * driver are Node-only) and no providers — so it can run in the Next.js
 * middleware (Edge runtime). The full config in `./index.ts` spreads this and
 * adds the adapter + providers for the Node runtime (API route, server actions).
 *
 * This is the Auth.js "split config" pattern for Next.js middleware.
 */
export const authConfig = {
  // No providers here — the real ones (email + dev credentials) are added in the
  // Node-runtime config (./index.ts). Middleware only needs the callbacks below
  // to authorize from the JWT.
  providers: [],
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/sign-in/check-email",
  },
  session: {
    // JWT strategy is required because (a) the dev Credentials provider only
    // works with JWT sessions, and (b) middleware can then authorize from the
    // cookie without a DB round-trip. The email magic-link flow still uses the
    // adapter for verification tokens + user creation.
    strategy: "jwt",
    // Keep parents signed in for weeks. Setting an explicit maxAge makes the
    // session cookie *persistent* (Auth.js emits a Max-Age/Expires) instead of
    // a browser session cookie that would be dropped when the tab/browser
    // closes, and pins the JWT's own expiry to the same window.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Re-issue the cookie (sliding the 30-day window forward) at most once a
    // day of activity, so an active parent effectively never gets logged out.
    updateAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    // Runs in middleware for every matched request. Return `true` to allow,
    // `false` to bounce to the sign-in page, or a redirect Response to send
    // somewhere specific.
    authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = nextUrl;

      const isParentArea =
        pathname.startsWith("/profiles") || pathname.startsWith("/dashboard");
      const isChildArea = pathname.startsWith("/play");

      if (!isParentArea && !isChildArea) return true;

      // Both areas require an authenticated parent.
      if (!isLoggedIn) return false;

      // The child app additionally requires a selected child profile; without
      // one, send the parent to pick a profile first.
      if (isChildArea && !cookies.get("selectedChildId")) {
        return Response.redirect(new URL("/profiles", nextUrl));
      }

      return true;
    },
    // Persist the DB user id onto the token at sign-in so it survives in the JWT.
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Expose the user id on the session for server components / actions.
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

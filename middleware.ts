import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

// Middleware runs on the Edge runtime, so it uses the adapter-free, provider-free
// base config. Route protection lives in the `authorized` callback there.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Run on the protected areas only. Excludes API/auth, static, and image
  // optimization paths so we never gate Next internals or the sign-in flow.
  matcher: ["/profiles/:path*", "/play/:path*"],
};

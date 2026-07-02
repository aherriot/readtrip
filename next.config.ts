import type { NextConfig } from "next";

// Baseline security response headers, applied to every route. These are
// defense-in-depth on top of the app's auth checks — they harden the parent's
// authenticated session against clickjacking, protocol downgrade, and MIME
// sniffing without changing any behaviour.
//
// Deliberately NOT a full content CSP (script-src/style-src): Next.js relies on
// inline hydration scripts, so a strict policy needs per-request nonces wired
// through middleware. That's a larger change tracked separately; the one CSP
// directive here — `frame-ancestors` — is the anti-clickjacking piece and is
// safe to set on its own. `X-Frame-Options` is kept alongside it for older
// browsers that don't honour `frame-ancestors`.
const securityHeaders = [
  // Force HTTPS for two years, including subdomains. Ignored by browsers when
  // served over plain HTTP (local dev), so it's safe to send everywhere.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disallow being framed by any origin (clickjacking).
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Don't let browsers MIME-sniff responses away from their declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin on cross-origin navigations; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The app uses none of these powerful features — deny them outright.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

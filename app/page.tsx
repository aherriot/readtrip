export default function Home() {
  return (
    <main
      style={{ background: "var(--bg-night)", color: "var(--ink-on-night)" }}
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <h1 className="text-5xl font-bold" style={{ color: "var(--sun)" }}>
        ReadTrip
      </h1>
      <p className="max-w-md text-lg">
        A curiosity engine for kids. The skeleton is live — the expedition starts soon.
      </p>
      <a
        href="/api/health"
        className="rounded-full px-6 py-3 text-lg font-semibold"
        style={{ background: "var(--aqua)", color: "var(--bg-night)" }}
      >
        Check system health →
      </a>
    </main>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { requireParent } from "@/lib/auth/session";
import { getDashboardMetrics } from "@/lib/observability/queries";
import type { DashboardMetrics } from "@/lib/observability/metrics";
import {
  formatCount,
  formatMs,
  formatPct,
  formatUsd,
  modelLabel,
} from "./format";

export const metadata: Metadata = {
  title: "Usage & cost — ReadTrip",
};

// One headline metric: a big value with a label above and a quiet hint below.
function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card as="li" elevated className="flex flex-col gap-1">
      <Text as="span" size="sm" tone="soft" className="font-medium">
        {label}
      </Text>
      <span className="font-display text-3xl font-semibold text-surface-ink tabular-nums">
        {value}
      </span>
      <Text as="span" size="xs" tone="soft">
        {hint}
      </Text>
    </Card>
  );
}

// The per-model call breakdown. Each row pairs a labelled bar with the exact
// counts and cost, so the mix is never conveyed by bar length (color) alone.
function ModelMix({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Card elevated className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Heading level={2} size="lg">
          Model mix
        </Heading>
        <Text size="sm" tone="soft">
          Which models handled the {formatCount(metrics.totalCalls)} calls, and
          what each cost.
        </Text>
      </div>
      <ul className="flex flex-col gap-3">
        {metrics.modelMix.map((entry) => (
          <li key={entry.model} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <Text
                as="span"
                size="sm"
                className="min-w-0 truncate font-medium"
              >
                {modelLabel(entry.model)}
              </Text>
              <Text
                as="span"
                size="sm"
                tone="soft"
                className="shrink-0 tabular-nums"
              >
                {formatCount(entry.calls)} calls · {formatPct(entry.share)} ·{" "}
                {formatUsd(entry.costUsd)}
              </Text>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-pill bg-surface-ink/(--tint-wash)"
              role="presentation"
            >
              <div
                className="h-full rounded-pill bg-surface-accent"
                style={{ width: `${Math.max(entry.share * 100, 2)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card elevated className="flex flex-col items-start gap-2">
      <Heading level={2} size="lg">
        No activity yet
      </Heading>
      <Text tone="soft" measure>
        Once your explorers start reading lessons and taking quizzes, this page
        will show the real cost, cache savings, and latency of every AI call.
      </Text>
      <Button href="/profiles" variant="secondary" size="md" className="mt-2">
        Back to profiles
      </Button>
    </Card>
  );
}

export default async function DashboardPage() {
  const parent = await requireParent();
  const metrics = await getDashboardMetrics(parent.id);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading level={1}>Usage &amp; cost</Heading>
          <Text tone="soft">
            Live numbers from every AI call your explorers make.
          </Text>
        </div>
        <Button href="/profiles" variant="ghost" size="md">
          ← Profiles
        </Button>
      </header>

      {metrics.totalCalls === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-6">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Cost per loop"
              value={formatUsd(metrics.costPerLoopUsd)}
              hint={`Blended across ${formatCount(metrics.totalLoops)} completed ${
                metrics.totalLoops === 1 ? "loop" : "loops"
              }`}
            />
            <StatCard
              label="Cache hit rate"
              value={formatPct(metrics.cacheHitRate)}
              hint="Of input tokens served from the prompt cache"
            />
            <StatCard
              label="Total AI cost"
              value={formatUsd(metrics.totalCostUsd)}
              hint={`Across ${formatCount(metrics.totalCalls)} logged calls`}
            />
            <StatCard
              label="Latency (p50)"
              value={formatMs(metrics.p50LatencyMs)}
              hint="Median call round-trip"
            />
            <StatCard
              label="Latency (p95)"
              value={formatMs(metrics.p95LatencyMs)}
              hint="Slowest 5% of calls are above this"
            />
            <StatCard
              label="Safety flags"
              value={formatPct(metrics.safetyFlagRate)}
              hint="Of calls a safety layer redirected"
            />
          </ul>

          <ModelMix metrics={metrics} />
        </div>
      )}
    </main>
  );
}

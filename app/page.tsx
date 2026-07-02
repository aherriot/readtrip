import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "ReadTrip — a curiosity engine for kids",
  description:
    "ReadTrip turns a child's questions into guided reading adventures, tuned to their level and rewarding real understanding.",
};

const features = [
  {
    emoji: "🚀",
    title: "Ask anything",
    body: "“Why is the sky blue?” “Tell me about sharks.” Every question becomes a short, guided reading adventure.",
  },
  {
    emoji: "📚",
    title: "Right-sized reading",
    body: "Explanations are tuned to each child's reading level — a 6- and an 11-year-old get the same wonder, different words.",
  },
  {
    emoji: "⭐",
    title: "Rewards for understanding",
    body: "Quick quizzes check what they learned. Points, levels, and badges celebrate comprehension — not just clicks.",
  },
];

export default async function Home() {
  const session = await auth();
  const isSignedIn = Boolean(session?.user?.id);
  const primaryHref = isSignedIn ? "/profiles" : "/sign-in";

  return (
    <main className="flex min-h-screen flex-col items-center gap-16 px-6 py-16 text-center sm:py-24">
      {/* Hero */}
      <section className="flex max-w-2xl flex-col items-center gap-6">
        <Heading level={1} size="3xl">
          <span className="text-sun">ReadTrip</span>
        </Heading>
        <Text size="lg" className="max-w-xl">
          A curiosity engine for kids. Turn “why is the sky blue?” into a guided
          learning session — a clear explanation at exactly the right reading
          level, a quick check that it stuck, and a reward for the effort.
        </Text>
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Button href={primaryHref}>
            {isSignedIn ? "Go to profiles →" : "Get started →"}
          </Button>
        </div>
        <Text size="sm" tone="soft">
          For parents and teachers of curious 6–11 year-olds.
        </Text>
      </section>

      {/* What it does */}
      <section className="flex w-full max-w-5xl flex-col gap-8">
        <Heading level={2} size="xl">
          How ReadTrip works
        </Heading>
        <ul className="grid gap-6 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} as="li" className="flex flex-col gap-3">
              <span aria-hidden="true" className="text-3xl">
                {feature.emoji}
              </span>
              <Heading level={3} size="lg">
                {feature.title}
              </Heading>
              <Text tone="soft">{feature.body}</Text>
            </Card>
          ))}
        </ul>
      </section>

      {/* Who it's for */}
      <section className="w-full max-w-3xl">
        <Card
          elevated
          padding="lg"
          className="flex flex-col items-center gap-4"
        >
          <Heading level={2} size="xl">
            Learning kids actually want to do
          </Heading>
          <Text measure className="text-center">
            Children are naturally curious — ReadTrip meets that curiosity
            instead of railing them down a fixed track. Every input and output
            passes through guardrails, so parents and teachers can trust it by
            default.
          </Text>
          <Button href={primaryHref} variant="secondary">
            {isSignedIn
              ? "Set up your explorers"
              : "Sign in to set up your explorers"}
          </Button>
        </Card>
      </section>
    </main>
  );
}

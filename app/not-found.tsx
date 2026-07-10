import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { JournalSheet } from "@/components/layout/JournalSheet";
import { Illustration } from "@/components/ui/illustrations/Illustration";

export const metadata: Metadata = {
  title: "Page not found — ReadTrip",
};

export default function NotFound() {
  return (
    <JournalSheet contentClassName="items-center justify-center">
      <Card elevated padding="lg" className="w-full max-w-md text-center">
        <div className="mb-2 flex justify-center">
          <Illustration name="compass" size="xl" decorative />
        </div>
        <Heading level={1} size="2xl">
          Off the map
        </Heading>
        <Text tone="soft" className="mt-2">
          We looked everywhere in the journal, but this page isn&apos;t here. It
          may have moved, or the trail led somewhere else.
        </Text>
        <Button href="/" className="mt-6" fullWidth>
          Back to base camp
        </Button>
      </Card>
    </JournalSheet>
  );
}

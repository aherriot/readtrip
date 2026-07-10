"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { JournalSheet } from "@/components/layout/JournalSheet";
import { Illustration } from "@/components/ui/illustrations/Illustration";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <JournalSheet contentClassName="items-center justify-center">
      <Card elevated padding="lg" className="w-full max-w-md text-center">
        <div className="mb-2 flex justify-center">
          <Illustration name="storm" size="xl" decorative />
        </div>
        <Heading level={1} size="2xl">
          Rough weather
        </Heading>
        <Text tone="soft" className="mt-2">
          Something went wrong on our end. The trail is still here — let&apos;s
          try that again.
        </Text>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={reset} fullWidth>
            Try again
          </Button>
          <Button href="/" variant="secondary" fullWidth>
            Back to base camp
          </Button>
        </div>
      </Card>
    </JournalSheet>
  );
}

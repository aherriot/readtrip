import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Check your email — ReadTrip",
};

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card elevated padding="lg" className="w-full max-w-md text-center">
        <div className="mb-6 flex flex-col gap-2">
          <Heading level={1} size="2xl">
            Check your email
          </Heading>
          <Text tone="soft">
            We sent you a sign-in link. Open it on this device to continue to
            ReadTrip.
          </Text>
        </div>
        <Button href="/sign-in" variant="ghost" fullWidth>
          Back to sign in
        </Button>
      </Card>
    </main>
  );
}

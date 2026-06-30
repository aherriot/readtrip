import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in — ReadTrip",
};

export default function SignInPage() {
  const devEnabled = process.env.NODE_ENV !== "production";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card elevated padding="lg" className="w-full max-w-md">
        <div className="mb-6 flex flex-col gap-2 text-center">
          <Heading level={1} size="2xl">
            Welcome to ReadTrip
          </Heading>
          <Text tone="soft">
            Sign in to set up your young explorers and track their journey.
          </Text>
        </div>
        <SignInForm devEnabled={devEnabled} />
      </Card>
    </main>
  );
}

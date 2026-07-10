"use client";

import { useEffect } from "react";
import { Shantell_Sans } from "next/font/google";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { JournalSheet } from "@/components/layout/JournalSheet";
import { Illustration } from "@/components/ui/illustrations/Illustration";
import "./globals.css";

const shantell = Shantell_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shantell",
  weight: ["400", "500", "600", "700"],
});

// Only mounts when the root layout itself throws, so it must render its own
// <html>/<body> — there is no surviving layout to supply them. Re-declares
// the font variable so the field-journal type still loads.
export default function GlobalError({
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
    <html lang="en" className={shantell.variable}>
      <body>
        <JournalSheet contentClassName="items-center justify-center">
          <Card elevated padding="lg" className="w-full max-w-md text-center">
            <div className="mb-2 flex justify-center">
              <Illustration name="storm" size="xl" decorative />
            </div>
            <Heading level={1} size="2xl">
              Rough weather
            </Heading>
            <Text tone="soft" className="mt-2">
              Something went wrong loading ReadTrip. Let&apos;s try that again.
            </Text>
            <Button onClick={reset} className="mt-6" fullWidth>
              Try again
            </Button>
          </Card>
        </JournalSheet>
      </body>
    </html>
  );
}

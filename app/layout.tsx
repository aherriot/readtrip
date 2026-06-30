import type { Metadata } from "next";
import { Fredoka, Lexend } from "next/font/google";
import "./globals.css";

// Display — Fredoka: rounded, warm, friendly without being babyish.
const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
});

// Body / reading — Lexend: engineered to improve reading proficiency; the most
// important type choice in a reading app for kids. See docs/10-design-system.md.
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "ReadTrip — a curiosity engine for kids",
  description:
    "Dive into any topic, learn at your level, and explore a world of knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${lexend.variable}`}>
      {/* Default surface is the night-sky play canvas; reading views opt into
          data-surface="paper" on their own container. */}
      <body data-surface="night">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Shantell_Sans, Lexend } from "next/font/google";
import "./globals.css";
import { IconDefs } from "@/components/ui/icons/IconDefs";

// The one voice — Shantell Sans: a legibility-engineered handwritten face (real
// 400–700 weights) that carries the "explorer's field journal" identity across
// the whole app — headings, UI, AND lesson body. Chosen over a cursive hand
// precisely because it stays readable for early/struggling readers.
const shantell = Shantell_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shantell",
  weight: ["400", "500", "600", "700"],
});

// Kept only as the ultimate reading fallback if Shantell fails to load — Lexend
// is still the most legible non-hand face. Not applied directly anywhere now.
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
    <html lang="en" className={`${shantell.variable} ${lexend.variable}`}>
      {/* One surface: the field journal (warm lined paper). Tokens come from
          :root, so no data-surface is needed. */}
      <body>
        <IconDefs />
        {children}
      </body>
    </html>
  );
}

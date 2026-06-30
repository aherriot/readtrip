import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadTrip — a curiosity engine for kids",
  description: "Dive into any topic, learn at your level, and explore a world of knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

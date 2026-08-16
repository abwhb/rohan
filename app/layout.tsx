import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rohan Study System",
  description: "A topic-first Cambridge AS Mathematics and Business study dashboard.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

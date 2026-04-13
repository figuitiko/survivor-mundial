import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Survivor Mundial",
  description: "A polished survivor pool and stat challenge MVP built with Next.js."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SaaS Dashboard Demo",
  description:
    "A polished AI SaaS dashboard demo for portfolio presentations, analytics workflows, and admin platform showcases."
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

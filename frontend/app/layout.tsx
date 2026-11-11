import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Anshuu Singh — Site Under Maintenance",
    template: "%s — Anshuu Singh",
  },
  description:
    "Anshuu Singh's website is under maintenance. Please check back in one week for his personal notebook.",
  openGraph: {
    title: "Anshuu Singh — Site Under Maintenance",
    description:
      "Please check back in one week for Anshuu's personal notebook.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-motion="on">
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}

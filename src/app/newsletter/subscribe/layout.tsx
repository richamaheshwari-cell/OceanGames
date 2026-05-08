import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Subscribe to Newsletter",
  description:
    "Subscribe to TheOceanGame newsletter for the latest casino news, bonus offers, and expert guides.",
  alternates: buildLocaleAlternates("/newsletter/subscribe"),
};

export default function NewsletterSubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter",
  description:
    "Unsubscribe from TheOceanGame newsletter and promotional emails.",
  alternates: buildLocaleAlternates("/newsletter/unsubscribe"),
};

export default function NewsletterUnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

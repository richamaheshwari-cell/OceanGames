import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

const META_TITLE = "Privacy Policy | The Ocean Game Data Protection Hub";
const META_DESC =
  "Read The Ocean Game privacy policy to learn how we collect, use, and protect your data while ensuring transparency and user security.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: buildLocaleAlternates("/privacy"),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
  ),
  openGraph: { title: META_TITLE, description: META_DESC, url: "/privacy" },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

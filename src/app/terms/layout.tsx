import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

const META_TITLE = "Terms and Conditions | TheOceanGame";
const META_DESC =
  "Read the Terms and Conditions for TheOceanGame. Please read these terms carefully before using our website.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: buildLocaleAlternates("/terms"),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
  ),
  openGraph: { title: META_TITLE, description: META_DESC, url: "/terms" },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

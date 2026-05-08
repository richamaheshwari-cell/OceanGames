import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

const META_TITLE = "Responsible Gaming | TheOceanGame";
const META_DESC =
  "At TheOceanGame we promote responsible gaming. Learn warning signs, self-assessment, and how to set your limits.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: buildLocaleAlternates("/responsible-gaming"),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
  ),
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: "/responsible-gaming",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

export default function ResponsibleGamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

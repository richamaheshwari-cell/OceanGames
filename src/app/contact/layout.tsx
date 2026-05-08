import type { Metadata } from "next";
import { buildLocaleAlternates } from "@/lib/seo";

const META_TITLE = "Contact Us | TheOceanGame";
const META_DESC =
  "Get in touch with TheOceanGame. Send your questions, feedback, or partnership inquiries. We're here to help.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: buildLocaleAlternates("/contact"),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
  ),
  openGraph: { title: META_TITLE, description: META_DESC, url: "/contact" },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

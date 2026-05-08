import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  SITE_URL,
} from "@/lib/seo";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { LatestBonusHighlightsServer } from "../LatestBonusHighlightsServer";
import { BonusHighlightsHero } from "./BonusHighlightsHero";

const TITLE = "Bonus Highlights | Latest Offers | TheOceanGame";
const DESC =
  "Stay updated with the latest casino bonus launches, limited-time promotions, and exclusive offers from The Ocean Game.";

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "/" },
  { name: "Bonus", url: "/bonus" },
  { name: "Bonus Highlights", url: "/bonus/highlights" },
];

type PageProps = {
  searchParams?: Promise<QueryMap>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);
  const title =
    page > 1 ? `Bonus Highlights | Page ${page} | TheOceanGame` : TITLE;
  const canonicalPath =
    page > 1 ? `/bonus/highlights?page=${page}` : "/bonus/highlights";
  const description = DESC;
  return {
    title,
    description,
    alternates: buildLocaleAlternates(`${SITE_URL}${canonicalPath}`),
    metadataBase: new URL(SITE_URL),
    openGraph: { title, description, url: canonicalPath },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BonusHighlightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
      <BonusHighlightsHero />
      <LatestBonusHighlightsServer
        page={page}
        queryKey="page"
        showSectionHeader={false}
      />
    </>
  );
}

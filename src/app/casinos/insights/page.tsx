import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  SITE_URL,
} from "@/lib/seo";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { LatestCasinoInsightsServer } from "../LatestCasinoInsightsServer";
import { CasinoInsightsHero } from "./CasinoInsightsHero";

const TITLE = "Casino Insights | Guides & News | TheOceanGame";
const DESC =
  "Expert casino articles: strategies, guides, and industry news. Browse all insights from The Ocean Game.";

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "/" },
  { name: "Casinos", url: "/casinos" },
  { name: "Casino Insights", url: "/casinos/insights" },
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
    page > 1 ? `Casino Insights | Page ${page} | TheOceanGame` : TITLE;
  const canonicalPath =
    page > 1 ? `/casinos/insights?page=${page}` : "/casinos/insights";
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

export default async function CasinoInsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
      <CasinoInsightsHero />
      <LatestCasinoInsightsServer
        page={page}
        queryKey="page"
        showSectionHeader={false}
      />
    </>
  );
}

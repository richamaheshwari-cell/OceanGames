import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  SITE_URL,
} from "@/lib/seo";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { LatestGameInsightsServer } from "../LatestGameInsightsServer";
import { GamesInsightsHero } from "./GamesInsightsHero";

const TITLE = "Games Insights | Guides & News | TheOceanGame";
const DESC =
  "Expert game articles: strategies, RTP insights, and guides. Browse all games insights from The Ocean Game.";

const BREADCRUMB_ITEMS = [
  { name: "Home", url: "/" },
  { name: "Games", url: "/games" },
  { name: "Games Insights", url: "/games/insights" },
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
    page > 1 ? `Games Insights | Page ${page} | TheOceanGame` : TITLE;
  const canonicalPath =
    page > 1 ? `/games/insights?page=${page}` : "/games/insights";
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

export default async function GamesInsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
      <GamesInsightsHero />
      <LatestGameInsightsServer
        page={page}
        queryKey="page"
        showSectionHeader={false}
      />
    </>
  );
}

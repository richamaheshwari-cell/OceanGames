import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildCollectionJsonLd,
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  SITE_URL,
} from "@/lib/seo";
import { ENDPOINTS } from "@/lib/api";
import { buildItemListJsonLd, fetchItemListSnapshot } from "@/lib/seo-itemlist";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { CasinoHero } from "./CasinoHero";
import { LatestCasinoInsightsServer } from "./LatestCasinoInsightsServer";
import { ExploreCasinoGamesServer } from "./ExploreCasinoGamesServer";
import { TopRatedCasinos } from "@/components/TopRatedCasinos";

const TITLE = "Online Casinos | Top Rated Casino Reviews | TheOceanGame";
const DESC =
  "Find the best online casinos with expert reviews, ratings, and exclusive bonuses. Compare top-rated casinos and start playing safely.";

type PageProps = {
  searchParams?: QueryMap;
};

export async function generateMetadata(): Promise<Metadata> {
  // Use static SEO for now; dynamic SEO can be added later
  return {
    title: TITLE,
    description: DESC,
    alternates: buildLocaleAlternates(`${SITE_URL}/casinos`),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
    ),
    openGraph: { title: TITLE, description: DESC, url: "/casinos" },
    twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  };
}

export default async function CasinosPage({ searchParams }: PageProps) {
  const params = await searchParams ?? {};
  const page = readPageParam(params.page, 1);
  const snapshot = await fetchItemListSnapshot(ENDPOINTS.casinos, "casinos", 8);

  return (
    <>
      <JsonLdScript
        data={buildCollectionJsonLd({
          name: TITLE,
          url: "/casinos",
          description: DESC,
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Casinos", url: "/casinos" },
        ])}
      />
      {snapshot.length > 0 && (
        <JsonLdScript
          data={buildItemListJsonLd("Top Online Casinos", snapshot)}
        />
      )}
      <CasinoHero />
      <TopRatedCasinos page={page} queryKey="page" showPagination />
      <LatestCasinoInsightsServer teaser />
      <ExploreCasinoGamesServer />
    </>
  );
}

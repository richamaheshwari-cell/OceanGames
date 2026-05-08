import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildCollectionJsonLd,
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  SITE_URL,
} from "@/lib/seo";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { buildItemListJsonLd, fetchItemListSnapshot } from "@/lib/seo-itemlist";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { BonusHero } from "./BonusHero";
import { ExploreCasinoBonusesServer } from "@/components/ExploreCasinoBonusesServer";
import { UnderstandingCasinoBonuses } from "./UnderstandingCasinoBonuses";
import { LatestBonusHighlightsServer } from "./LatestBonusHighlightsServer";

const TITLE = "Casino Bonuses | Exclusive Offers | TheOceanGame";
const DESC =
  "Unlock exclusive casino bonuses, welcome offers, free spins, and cashback. Compare the best bonus deals.";

type PageProps = {
  searchParams?: Promise<QueryMap>;
};

type CmsSeoRecord = {
  seoTitle?: string | null;
  seoDesc?: string | null;
  focusKeywords?: string[] | null;
};

async function getCmsSeo(slug: string): Promise<CmsSeoRecord | null> {
  const res = await fetch(ENDPOINTS.pages(slug), {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? json) as CmsSeoRecord;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const cms = await getCmsSeo("bonus");
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);
  const title =
    page > 1
      ? `${cms?.seoTitle?.trim() || TITLE.replace(" | TheOceanGame", "")} | Page ${page} | TheOceanGame`
      : cms?.seoTitle?.trim() || TITLE;
  const description = cms?.seoDesc?.trim() || DESC;
  const canonicalPath = page > 1 ? `/bonus?page=${page}` : "/bonus";
  return {
    title,
    description,
    keywords: Array.isArray(cms?.focusKeywords)
      ? cms?.focusKeywords
      : undefined,
    alternates: buildLocaleAlternates(`${SITE_URL}${canonicalPath}`),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
    ),
    openGraph: { title, description, url: canonicalPath },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BonusPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const page = readPageParam(params.page, 1);
  const snapshot = await fetchItemListSnapshot(
    ENDPOINTS.bonusArticles,
    "bonus-articles",
    8,
  );
  return (
    <>
      <JsonLdScript
        data={buildCollectionJsonLd({
          name: TITLE,
          url: "/bonus",
          description: DESC,
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Bonus", url: "/bonus" },
        ])}
      />
      {snapshot.length > 0 && (
        <JsonLdScript
          data={buildItemListJsonLd("Casino Bonus Highlights", snapshot)}
        />
      )}
      <BonusHero />
      <ExploreCasinoBonusesServer page={page} queryKey="page" />
      <UnderstandingCasinoBonuses />
      <LatestBonusHighlightsServer teaser />
    </>
  );
}

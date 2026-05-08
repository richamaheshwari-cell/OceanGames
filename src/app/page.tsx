import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { TopRatedCasinos } from "@/components/TopRatedCasinos";
import { GamesSection } from "@/components/GamesSection";
import { BlogSection } from "@/components/BlogSection";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { buildLocaleAlternates } from "@/lib/seo";
import { buildItemListJsonLd, fetchItemListSnapshot } from "@/lib/seo-itemlist";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com";
const SITE_NAME = "TheOceanGame";

const OG_IMAGE = "/og-responsible.png";

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

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsSeo("home");
  const title =
    cms?.seoTitle?.trim() || "Online Casino Reviews, Bonuses & Game Guides";
  const description =
    cms?.seoDesc?.trim() ||
    "Compare online casinos with independent reviews, bonus breakdowns, game guides, and responsible iGaming information. Explore top picks, features, and how offers work.";
  return {
    alternates: buildLocaleAlternates("/"),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: Array.isArray(cms?.focusKeywords)
      ? cms?.focusKeywords
      : undefined,
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Online Casino Reviews & Guides`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function Home() {
  const homeCasinoSnapshot = await fetchItemListSnapshot(
    ENDPOINTS.casinos,
    "casinos",
    4,
  );
  const homeGamesSnapshot = await fetchItemListSnapshot(
    ENDPOINTS.games,
    "games",
    4,
  );
  const homeBlogSnapshot = await fetchItemListSnapshot(
    ENDPOINTS.blogs,
    "blog",
    8,
  );
  // JSON-LD: WebSite + SearchAction (enables sitelinks search box if eligible)
  // IMPORTANT: Update "/search" to your real search route (or remove SearchAction if you don’t have search).
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Optional: if you already added Organization JSON-LD in layout,
  // you can remove this to avoid duplication.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
  };

  return (
    <>
      {/* SEO H1 without changing design */}
      <h1
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        TheOceanGame — Online Casino Reviews, Bonuses, and Game Guides
      </h1>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {homeCasinoSnapshot.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildItemListJsonLd("Top Rated Casinos", homeCasinoSnapshot),
            ),
          }}
        />
      )}
      {homeGamesSnapshot.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildItemListJsonLd("Popular Casino Games", homeGamesSnapshot),
            ),
          }}
        />
      )}
      {homeBlogSnapshot.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildItemListJsonLd("Latest Blog Guides", homeBlogSnapshot),
            ),
          }}
        />
      )}

      <HeroSection />
      <TopRatedCasinos variant="home" />
      <GamesSection />
      <BlogSection />
    </>
  );
}

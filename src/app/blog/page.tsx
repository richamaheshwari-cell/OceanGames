import type { Metadata } from "next";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildCollectionJsonLd,
  buildBreadcrumbJsonLd,
  buildOpenGraph,
  buildTwitter,
  buildLocaleAlternates,
  resolveImageUrl,
} from "@/lib/seo";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { buildItemListJsonLd, fetchItemListSnapshot } from "@/lib/seo-itemlist";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { BlogHero } from "./BlogHero";
import { FeaturedArticlesServer } from "./FeaturedArticlesServer";
import { AllCasinoArticlesServer } from "./AllCasinoArticlesServer";
//added comment to test ci/cd pipeline
const TITLE = "Casino Blogs & Insights | Expert Guides | TheOceanGame";
const DESC =
  "Master casino strategies, discover winning guides, stay updated with platform news, and explore the latest iGaming industry trends.";

type CmsSeoRecord = {
  seoTitle?: string | null;
  seoDesc?: string | null;
  focusKeywords?: string[] | null;
  seoImage?: string | null;
  featureImg?: string | null;
  image?: string | null;
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
  const cms = await getCmsSeo("blog");
  const title = cms?.seoTitle?.trim() || TITLE;
  const description = cms?.seoDesc?.trim() || DESC;
  const ogImage = resolveImageUrl(
    cms?.seoImage ?? cms?.featureImg ?? cms?.image,
  );
  return {
    title,
    description,
    keywords: Array.isArray(cms?.focusKeywords)
      ? cms?.focusKeywords
      : undefined,
    alternates: buildLocaleAlternates("/blog"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
    ),
    openGraph: buildOpenGraph({
      title,
      description,
      url: "/blog",
      image: ogImage ?? undefined,
      type: "website",
    }),
    twitter: buildTwitter({
      title,
      description,
      image: ogImage ?? undefined,
    }),
  };
}

type PageProps = {
  searchParams?: Promise<QueryMap>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const featuredBlogsPage = readPageParam(params.featuredBlogsPage, 1);
  const blogsPage = readPageParam(params.blogsPage, 1);
  const snapshot = await fetchItemListSnapshot(ENDPOINTS.blogs, "blog", 8);
  return (
    <>
      {/* SEO and JSON-LD handled by generateMetadata and JsonLdScript. Headline is rendered by BlogHero as <h1>. */}
      <JsonLdScript
        data={buildCollectionJsonLd({
          name: TITLE,
          url: "/blog",
          description: DESC,
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      {snapshot.length > 0 && (
        <JsonLdScript
          data={buildItemListJsonLd("Casino Blog Articles", snapshot)}
        />
      )}
      <BlogHero />
      <FeaturedArticlesServer
        page={featuredBlogsPage}
        queryKey="featuredBlogsPage"
      />
      <AllCasinoArticlesServer page={blogsPage} queryKey="blogsPage" />
    </>
  );
}

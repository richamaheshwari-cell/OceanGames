import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { API_BASE, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { TiptapHtmlServer } from "@/components/TiptapHtmlServer";
import { JsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { contentToMetadata, getTitle } from "@/lib/seo";

type PageResponse = {
  id: string;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  content?: object | string | null;
  featureImg?: string | null;
  image?: string | null;
  shortDesc?: string | null;
  excerpt?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  updatedAt?: string | null;
  status?: string | null;
};

async function getPage(slug: string): Promise<PageResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "https://api.theoceangame.com";
  const res = await fetch(`${base}/api/v1/public/pages/${slug}`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? json) as PageResponse;
}

function asContentRecord(page: PageResponse) {
  return {
    slug: page.slug,
    title: page.seoTitle ?? page.title ?? page.name,
    name: page.title ?? page.name,
    seoTitle: page.seoTitle,
    seoDesc: page.seoDesc,
    shortDesc: page.shortDesc ?? page.excerpt ?? page.description,
    excerpt: page.excerpt ?? page.shortDesc ?? page.description,
    description: page.description ?? page.shortDesc ?? page.excerpt,
    featureImg: page.featureImg ?? page.image,
    image: page.image ?? page.featureImg,
    updatedAt: page.updatedAt,
    status: page.status,
  };
}

const RESERVED_SLUGS = new Set([
  "blog", "news", "casinos", "games", "bonus", "bonus-articles", "casino-articles", "game-articles",
  "authors", "editors", "newsletter", "favicon", "api", "sitemap", "robots",
]);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const page = await getPage(slug);
  if (!page) return { title: "Page | TheOceanGame" };
  return contentToMetadata(asContentRecord(page), { routeBase: "pages", isArticle: false });
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();

  const page = await getPage(slug);

  if (!page) notFound();

  const record = asContentRecord(page);
  const h1Title = getTitle(record);
  const content = page.content ?? "";

  const path = `/${slug}`;
  const breadcrumbItems = [{ name: "Home", url: "/" }, { name: h1Title, url: path }];
  return (
    <>
      <JsonLd record={record} routeBase="pages" schemaType="WebPage" />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BreadcrumbNav items={breadcrumbItems} />
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: 2,
          py: 4,
          animation: "articleFadeIn 0.4s ease-out forwards",
          "@keyframes articleFadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        }}
      >
        <Typography component="title" variant="h3" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: "28px", md: "38px" } }}>
          {h1Title}
        </Typography>
        {content ? (
          <TiptapHtmlServer content={content} />
        ) : (
          <Typography color="text.secondary">No content available.</Typography>
        )}
      </Box>
    </>
  );
}

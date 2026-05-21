/**
 * Unified SEO + Author mapping for all routes.
 * Field mapping (frontend-only): seoTitle||title||name, seoDesc||shortDesc||excerpt,
 * featureImg||image, editor?.name (author), focusKeywords||tags.
 */

import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const SITE_NAME = "TheOceanGame";
export const SITE_LANGUAGE = "en-US";
const PUBLISHER_LOGO = `${SITE_URL}/favicon/favicon-96x96.png`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-responsible.png`;

export type RouteBase =
  | "blog"
  | "news"
  | "casino-articles"
  | "casinos"
  | "game-articles"
  | "games"
  | "bonus-articles"
  | "bonuses"
  | "pages"
  | "authors";

export interface ContentRecord {
  slug?: string | null;
  title?: string | null;
  name?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  seoImage?: string | null;
  shortDesc?: string | null;
  excerpt?: string | null;
  description?: string | null;
  featureImg?: string | null;
  image?: string | null;
  publishDate?: string | null;
  updatedAt?: string | null;
  status?: string | null;
  metaRobots?: string | null;
  robots?: string | null;
  editor?: { id?: string | null; name?: string | null } | null;
  createdBy?: { id?: string | null; name?: string | null } | null;
  updatedBy?: { id?: string | null; name?: string | null } | null;
  focusKeywords?: string[] | null;
  tags?: string[] | null;
}

export interface SeoOptions {
  routeBase: RouteBase;
  isArticle?: boolean;
  robotsOverride?: "index,follow" | "noindex,nofollow";
}

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function getTitle(record: ContentRecord): string {
  return (record.seoTitle ?? record.title ?? record.name ?? "").trim() || "Article";
}

export function getDescription(record: ContentRecord, fallback?: string): string {
  const d =
    record.seoDesc ??
    record.shortDesc ??
    record.excerpt ??
    record.description ??
    fallback ??
    `Read ${getTitle(record)} on ${SITE_NAME}`;
  return String(d).trim();
}

export function getCanonicalPath(record: ContentRecord, routeBase: RouteBase): string {
  const slug = (record.slug ?? "").trim();
  if (!slug) return "/";
  if (routeBase === "pages") return `/${slug}`;
  if (routeBase === "authors") return `/${slug}`;
  return `/${routeBase}/${slug}`;
}

/** Author display name for meta/og. */
export function getAuthorName(record: ContentRecord): string | undefined {
  const n =
    record.editor?.name ??
    record.createdBy?.name ??
    record.updatedBy?.name;
  return n ? String(n).trim() : undefined;
}

/** Author profile URL when id available. */
/** Author profile URL when name available. */
export function getAuthorUrl(record: ContentRecord): string | undefined {
  const name =
    record.editor?.name ??
    record.createdBy?.name ??
    record.updatedBy?.name;
  return name ? `${SITE_URL}/authors/${encodeURIComponent(name)}` : undefined;
}

/** Canonical full URL. Always production domain. */
export function buildCanonical(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export function buildLocaleAlternates(canonical: string): NonNullable<Metadata["alternates"]> {
  const canonicalUrl = canonical.startsWith("http") ? canonical : buildCanonical(canonical);
  return {
    canonical,
    languages: {
      [SITE_LANGUAGE]: canonicalUrl,
      "x-default": canonicalUrl,
    },
  };
}

export function buildOpenGraph(p: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  siteName?: string;
}): NonNullable<Metadata["openGraph"]> {
  const image = p.image ?? DEFAULT_OG_IMAGE;
  const fullUrl = p.url.startsWith("http") ? p.url : buildCanonical(p.url);
  return {
    type: p.type ?? "website",
    title: p.title,
    description: p.description,
    url: fullUrl,
    images: [{ url: image }],
    siteName: p.siteName ?? SITE_NAME,
    ...(p.type === "article" && {
      publishedTime: p.publishedTime ?? undefined,
      modifiedTime: p.modifiedTime ?? undefined,
      authors: p.authors?.length ? p.authors : undefined,
    }),
  };
}

export function buildTwitter(p: {
  title: string;
  description: string;
  image?: string | null;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: p.title,
    description: p.description,
    images: [p.image ?? DEFAULT_OG_IMAGE],
  };
}

function ensureAbsUrl(url: string): string {
  return url.startsWith("http") ? url : buildCanonical(url);
}

const ARTICLE_SECTION_MAP: Record<string, string> = {
  blog: "Blog",
  news: "News",
  "casino-articles": "Casino Reviews",
  "game-articles": "Game Guides",
  "bonus-articles": "Bonus Guides",
};

/** Count words from HTML string (strips tags). */
export function getWordCountFromHtml(html: string): number {
  if (!html || typeof html !== "string") return 0;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").filter(Boolean).length : 0;
}

/** Article or NewsArticle JSON-LD. Author = Person with name + optional url. */
export function buildArticleJsonLd(
  record: ContentRecord,
  routeBase: RouteBase,
  opts?: {
    isNews?: boolean;
    articleSection?: string;
    keywords?: string[];
    wordCount?: number;
  }
): object {
  const path = getCanonicalPath(record, routeBase);
  const url = ensureAbsUrl(path);
  const img = resolveImageUrl(record.featureImg ?? record.image);
  const authorName = getAuthorName(record);
  const authorUrl = getAuthorUrl(record);
  const articleSection =
    opts?.articleSection ?? (ARTICLE_SECTION_MAP[routeBase] ?? routeBase);
  const keywords =
    opts?.keywords?.length ? opts.keywords : record.focusKeywords ?? record.tags;

  return {
    "@context": "https://schema.org",
    "@type": opts?.isNews ? "NewsArticle" : "Article",
    headline: getTitle(record),
    description: getDescription(record, undefined) || undefined,
    image: img ? [img] : undefined,
    datePublished: record.publishDate ?? undefined,
    dateModified: record.updatedAt ?? record.publishDate ?? undefined,
    author: authorName
      ? { "@type": "Person", name: authorName, ...(authorUrl && { url: authorUrl }) }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(articleSection && { articleSection }),
    ...(keywords?.length && { keywords: keywords.join(", ") }),
    ...(typeof opts?.wordCount === "number" && opts.wordCount > 0 && { wordCount: opts.wordCount }),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList JSON-LD. */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : ensureAbsUrl(item.url),
    })),
  };
}

/** CollectionPage JSON-LD for listing pages. */
export function buildCollectionJsonLd(p: { name: string; url: string; description?: string }): object {
  const url = ensureAbsUrl(p.url);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: p.name,
    url,
    ...(p.description && { description: p.description }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
  };
}

/** ItemList JSON-LD for listing cards. */
export function buildItemListJsonLd(p: {
  items: Array<{ name: string; url: string; image?: string | null }>;
  name?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(p.name && { name: p.name }),
    numberOfItems: p.items.length,
    itemListElement: p.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : ensureAbsUrl(item.url),
      ...(item.image && { image: item.image }),
    })),
  };
}

/** WebPage JSON-LD for casino/game/cms pages. */
export function buildWebPageJsonLd(
  record: ContentRecord,
  routeBase: RouteBase
): object {
  const path = getCanonicalPath(record, routeBase);
  const url = ensureAbsUrl(path);
  const img = resolveImageUrl(record.featureImg ?? record.image);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: getTitle(record),
    description: getDescription(record, undefined) || undefined,
    url,
    ...(img && { image: [img] }),
    dateModified: record.updatedAt ?? record.publishDate ?? undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
  };
}

/** ProfilePage + Person JSON-LD for author pages. */
export function buildAuthorJsonLd(p: {
  id: string;
  name: string;
  bio?: string | null;
  image?: string | null;
  items?: Array<{ name: string; url: string }>;
}): object {
  const url = `${SITE_URL}/authors/${encodeURIComponent(p.name)}`;
  const img = p.image?.startsWith("http")
    ? p.image
    : p.image
      ? `${API_BASE}${p.image.startsWith("/") ? "" : "/"}${p.image}`
      : undefined;

  const person: object = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url,
    ...(p.bio && { description: p.bio }),
    ...(img && { image: img }),
  };

  if (p.items && p.items.length > 0) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          mainEntity: person,
          url,
        },
        {
          "@type": "ItemList",
          itemListElement: p.items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            url: it.url.startsWith("http") ? it.url : ensureAbsUrl(it.url),
          })),
        },
      ],
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: person,
    url,
  };
}

function resolveRobots(
  record: ContentRecord,
  override?: SeoOptions["robotsOverride"]
): Metadata["robots"] {
  if (override) {
    const [index, follow] = override.split(",").map((s) => s.trim());
    return { index: index === "index", follow: follow === "follow" };
  }
  const custom = record.metaRobots ?? record.robots;
  if (custom) {
    const idx = !custom.toLowerCase().includes("noindex");
    const flw = !custom.toLowerCase().includes("nofollow");
    return { index: idx, follow: flw };
  }
  const status = (record.status ?? "published").toLowerCase();
  if (status !== "published") return { index: false, follow: true };
  return { index: true, follow: true };
}

/**
 * Build Next.js Metadata from content record.
 * For articles: authors = Person (author name), publisher = Organization. meta author = author displayName.
 */
export function contentToMetadata(record: ContentRecord, options: SeoOptions): Metadata {
  const title = getTitle(record);
  const desc = getDescription(record);
  const path = getCanonicalPath(record, options.routeBase);
  const imageUrl =
    resolveImageUrl(record.seoImage ?? record.featureImg ?? record.image) ??
    DEFAULT_OG_IMAGE;
  const isArticle = options.isArticle ?? false;
  const metaTitle = `${title} | ${SITE_NAME}`;

  const authorName = getAuthorName(record);
  const authorUrl = getAuthorUrl(record);
  const authorsMeta: Metadata["authors"] =
    authorName && isArticle
      ? authorUrl
        ? [{ name: authorName, url: authorUrl }]
        : [{ name: authorName }]
      : undefined;

  const ogAuthors: string[] | undefined =
    isArticle && authorName
      ? authorUrl
        ? [authorUrl]
        : [authorName]
      : undefined;

  const openGraph = buildOpenGraph({
    title: metaTitle,
    description: desc,
    url: path,
    image: imageUrl,
    type: isArticle ? "article" : "website",
    publishedTime: isArticle ? record.publishDate : undefined,
    modifiedTime: isArticle ? record.updatedAt : undefined,
    authors: ogAuthors,
  });

  const twitter = buildTwitter({ title: metaTitle, description: desc, image: imageUrl });

  return {
    title,
    description: desc,
    authors: authorsMeta,
    publisher: SITE_NAME,
    alternates: buildLocaleAlternates(path),
    metadataBase: new URL(SITE_URL),
    openGraph,
    twitter,
    robots: resolveRobots(record, options.robotsOverride),
  };
}

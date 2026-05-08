/**
 * Fetches all published slugs for sitemap generation.
 * Uses existing API endpoints - no backend changes.
 */

import { API_PUBLIC } from "./api";

const SITEMAP_REVALIDATE_SECONDS = 3600;
const CACHE = { next: { revalidate: SITEMAP_REVALIDATE_SECONDS } } as RequestInit;

async function fetchAllSlugsWithLastmod(
  endpoint: string,
  key: string = "slug"
): Promise<{ slug: string; lastmod?: string }[]> {
  const results: { slug: string; lastmod?: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${API_PUBLIC}${endpoint}?page=${page}&limit=100`, CACHE);
    if (!res.ok) break;
    const json = await res.json();
    const data = json.data ?? json;
    const items = Array.isArray(data.items) ? data.items : [];
    for (const item of items) {
      const s = item[key] ?? item.slug;
      if (s && typeof s === "string") {
        const lastmod = item.updatedAt ?? item.updated_at ?? item.publishDate ?? item.publish_date ?? undefined;
        results.push({ slug: s, lastmod: typeof lastmod === "string" ? lastmod : undefined });
      }
    }
    const totalPages = data.totalPages ?? 1;
    hasMore = page < totalPages;
    page++;
  }
  return results;
}

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export async function getAllSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  const [
    blogItems,
    featuredBlogItems,
    newsItems,
    trendingNewsItems,
    casinoArticleItems,
    gameArticleItems,
    bonusArticleItems,
  ] = await Promise.all([
    fetchAllSlugsWithLastmod("/blogs"),
    fetchAllSlugsWithLastmod("/featuredBlogs"),
    fetchAllSlugsWithLastmod("/news"),
    fetchAllSlugsWithLastmod("/trendingNews"),
    fetchAllSlugsWithLastmod("/casino-articles"),
    fetchAllSlugsWithLastmod("/game-articles"),
    fetchAllSlugsWithLastmod("/bonus-articles"),
  ]);
  // Note: Pages API has no list endpoint - CMS pages cannot be auto-discovered for sitemap

  const seen = new Set<string>();

  for (const { slug, lastmod } of blogItems) {
    if (slug && !seen.has(`blog/${slug}`)) {
      seen.add(`blog/${slug}`);
      entries.push({ path: `/blog/${slug}`, lastmod });
    }
  }
  for (const { slug, lastmod } of featuredBlogItems) {
    if (slug && !seen.has(`blog/${slug}`)) {
      seen.add(`blog/${slug}`);
      entries.push({ path: `/blog/${slug}`, lastmod });
    }
  }
  for (const { slug, lastmod } of newsItems) {
    if (slug && !seen.has(`news/${slug}`)) {
      seen.add(`news/${slug}`);
      entries.push({ path: `/news/${slug}`, lastmod });
    }
  }
  for (const { slug, lastmod } of trendingNewsItems) {
    if (slug && !seen.has(`news/${slug}`)) {
      seen.add(`news/${slug}`);
      entries.push({ path: `/news/${slug}`, lastmod });
    }
  }
  for (const { slug, lastmod } of casinoArticleItems) {
    if (slug) entries.push({ path: `/casino-articles/${slug}`, lastmod });
  }
  for (const { slug, lastmod } of gameArticleItems) {
    if (slug) entries.push({ path: `/game-articles/${slug}`, lastmod });
  }
  for (const { slug, lastmod } of bonusArticleItems) {
    if (slug) entries.push({ path: `/bonus-articles/${slug}`, lastmod });
  }

  return entries;
}

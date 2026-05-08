import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllSitemapEntries } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dynamicEntries: { path: string; lastmod?: string }[] = [];
  try {
    dynamicEntries = await getAllSitemapEntries();
  } catch {
    // API may be unavailable at build/request time; sitemap will include only static pages
  }

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/casinos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/games`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/bonus`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/responsible-gaming`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const articleEntries: MetadataRoute.Sitemap = dynamicEntries.map((e) => ({
    url: `${SITE_URL}${e.path.startsWith("/") ? "" : "/"}${e.path}`,
    lastModified: e.lastmod ? new Date(e.lastmod) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articleEntries];
}

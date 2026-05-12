import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { getAllSitemapEntries } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getAllSitemapEntries();
  // Only include category-related URLs, exclude pagination
  const categoryEntries = entries.filter(e =>
    (
      e.path.startsWith("/casinos") ||
      e.path.startsWith("/games") ||
      e.path.startsWith("/bonus")
    ) && !e.path.match(/\?page=\d+/)
  );

  // Add static category pages if needed
  const staticCategories = [
    "/casinos",
    "/casinos/insights",
    "/games",
    "/games/insights",
    "/bonus",
    "/bonus/highlights"
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set([
  ...staticCategories,
  ...categoryEntries.map(e => e.path)
])]
    .map(
      (path) => `<url><loc>${SITE_URL}${path}</loc></url>`
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { getAllSitemapEntries } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getAllSitemapEntries();
  // Only include news URLs, exclude pagination
  const newsEntries = entries.filter(e =>
    e.path.startsWith("/news/") && !e.path.match(/\?page=\d+/)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries
    .map(
      (e) => {
        const published = e.lastmod ? new Date(e.lastmod).toISOString() : new Date().toISOString();
        return `<url>
  <loc>${SITE_URL}${e.path}</loc>
  <news:news>
    <news:publication>
      <news:name>Ocean Games News</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${published}</news:publication_date>
    <news:title>${escapeXml(e.title || "Untitled News")}</news:title>
  </news:news>
  <lastmod>${published}</lastmod>
  <priority>0.8</priority>
  <changefreq>daily</changefreq>
</url>`;
      }
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

// Helper to escape XML special chars
function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c] || c));
}

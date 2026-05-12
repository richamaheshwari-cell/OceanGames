import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { getAllSitemapEntries } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getAllSitemapEntries();
  // Only include blog URLs, exclude pagination
  const blogEntries = entries.filter(e =>
    e.path.startsWith("/blog/") && !e.path.match(/\?page=\d+/)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogEntries
    .map(
      (e) => `<url><loc>${SITE_URL}${e.path}</loc></url>`
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

import { SITE_URL } from "@/lib/seo";


export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /_next/\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/categories-sitemap.xml\nSitemap: ${SITE_URL}/blogs-sitemap.xml\nSitemap: ${SITE_URL}/news-sitemap.xml`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export const GET = () => {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Sitemap: ${SITE_URL}/sitemap.xml
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

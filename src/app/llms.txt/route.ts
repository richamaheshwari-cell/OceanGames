import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

const LLMS_TXT = `${SITE_NAME}

> Independent online casino reviews, bonus analysis, game guides, and responsible iGaming resources. Compare top-rated casinos, explore offers, and learn how features work.

## Main

- [Home](${SITE_URL}/): Landing and overview
- [Casinos](${SITE_URL}/casinos): Top rated online casinos
- [Games](${SITE_URL}/games): Casino games and slots
- [Bonus](${SITE_URL}/bonus): Casino bonuses and offers
- [Blog](${SITE_URL}/blog): Expert insights and guides
- [News](${SITE_URL}/news): Casino industry news and updates

## Legal & information

- [Privacy Policy](${SITE_URL}/privacy): Data protection and privacy
- [Terms and Conditions](${SITE_URL}/terms): Terms of use
- [Responsible Gaming](${SITE_URL}/responsible-gaming): Safer play and support
- [Contact](${SITE_URL}/contact): Get in touch
- [About Us](${SITE_URL}/about-us): About ${SITE_NAME}

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml): Full list of indexable URLs
- [Newsletter subscribe](${SITE_URL}/newsletter/subscribe): Subscribe to updates
`;

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

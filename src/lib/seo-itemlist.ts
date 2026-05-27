import { API_BASE, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-url";
import { SITE_URL } from "@/lib/seo";

type SnapshotItem = { title: string; slug: string; image?: string | null; featureImg?: string | null };

function toAbsoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function toImage(url: string | null | undefined) {
  if (!url) return undefined;
  const candidate = url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  return normalizeImageUrl(candidate) ?? undefined;
}

export async function fetchItemListSnapshot(
  endpoint: string,
  routeBase: string,
  limit = 8
): Promise<Array<{ name: string; url: string; image: string | undefined }>> {
  const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=1&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  const json = await res.json();
  const root = (json.data ?? json) as { items?: SnapshotItem[] } | SnapshotItem[];
  const items = Array.isArray(root) ? root : Array.isArray(root.items) ? root.items : [];
  const mapped = items
    .map((x) => {
      const title = String(x.title ?? "").trim();
      const slug = String(x.slug ?? "").trim();
      if (!title || !slug) return null;
      return {
        name: title,
        url: toAbsoluteUrl(`/${routeBase}/${slug}`),
        image: toImage(x.image ?? x.featureImg ?? null),
      };
    })
    .filter((x): x is { name: string; url: string; image: string | undefined } => x != null);
  return mapped;
}

// export function buildItemListJsonLd(name: string, items: Array<{ name: string; url: string; image?: string }>) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name,
//     itemListElement: items.map((item, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Thing",
//         name: item.name,
//         url: item.url,
//         ...(item.image ? { image: item.image } : {}),
//       },
//     })),
//   };
// }

export function buildItemListJsonLd(
  name: string,
  items: Array<{
    name: string;
    url: string;
    image?: string;
  }>
) {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/casinos#webpage`,
        url: `${SITE_URL}/casinos`,
        name: "Top Rated Online Casinos",
        description:
          "Find the best online casinos with expert reviews, ratings, and exclusive bonuses.",
      },

      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/casinos#itemlist`,
        name,

        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",

          position: i + 1,

          url: item.url,

          item: {
            "@type": "Organization",

            name: item.name,

            url: item.url,

            ...(item.image ? { image: item.image } : {}),

            description: `${item.name} offers a welcome bonus package for new users`,

            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 4.5,
              reviewCount: 1,
              bestRating: 5,
              worstRating: 1,
            },

            keywords: `${item.name} casino, online casino, casino bonus`,

            makesOffer: {
              "@type": "Offer",

              name: `${item.name} Casino Bonus`,

              description: `${item.name} offers a welcome bonus package for new users`,

              price: "1000",

              priceCurrency: "USD",
            },
          },
        })),
      },

      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: "TheOceanGame",
        url: SITE_URL,
      },
    ],
  };
}

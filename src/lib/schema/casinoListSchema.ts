type CasinoCardList = {
  casinoName: string;
  slug: string;
  featureImg?: string | null;
  bonusAmt?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  tags?: string[] | null;
  bonusDetails?: string[] | null;
};
 
export function generateCasinoListSchema(cardList: CasinoCardList[]) {
  const baseUrl = "https://theoceangame.com";
  const pageUrl = `${baseUrl}/casinos`;
 
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Top Rated Online Casinos",
        description:
          "Comprehensive reviews, expert ratings, and bonuses for top online casinos.",
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "Top Rated Casinos",
        itemListElement: cardList.map((casino, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/casinos/${casino.slug}`,
          item: {
            "@type": "Organization",
            name: casino.casinoName,
            image: casino.featureImg || undefined,
            url: `${baseUrl}/casinos/${casino.slug}`,
            description: casino.bonusDetails?.[0] || undefined,
            aggregateRating: casino.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: casino.rating,
                  reviewCount: casino.reviewCount || 1,
                  bestRating: 5,
                  worstRating: 1,
                }
              : undefined,
            keywords: casino.tags?.join(", "),
            offers: casino.bonusAmt
              ? {
                  "@type": "Offer",
                  name: `${casino.casinoName} Casino Bonus`,
                  description: casino.bonusDetails?.[0] || "",
                  price: casino.bonusAmt?.replace(/[^0-9.]/g, ""),
                  priceCurrency: "USD",
                }
              : undefined,
          },
        })),
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "TheOceanGame",
        url: baseUrl,
      },
    ],
  };
}
 
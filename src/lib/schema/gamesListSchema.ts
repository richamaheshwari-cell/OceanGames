// Games Card Schema
 
interface GameCardItem {
  title: string;
  slug: string;
  featureImg?: string | null;
  image?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  gameDetails?: string[] | null;
}
 
export function generateGamesCardSchema(items: GameCardItem[]) {
  const baseUrl = "https://theoceangame.com";
 
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/games#recommended-games`,
        name: "Recommended Casino Games",
        itemListElement: items.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoGame",
            name: game.title,
            url: `${baseUrl}/games/${game.slug}`,
            image: game.featureImg || game.image || undefined,
            description: game.gameDetails?.length
              ? game.gameDetails.join(", ")
              : undefined,
            genre: game.tag || "Casino Game",
            publisher: game.gameProvider?.[0]
              ? {
                  "@type": "Organization",
                  name: game.gameProvider[0],
                }
              : undefined,
          },
        })),
      },
    ],
  };
}
 
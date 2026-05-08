import { JsonLdScript } from "@/components/JsonLd";
import { buildCollectionJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { ENDPOINTS } from "@/lib/api";
import { buildItemListJsonLd, fetchItemListSnapshot } from "@/lib/seo-itemlist";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { NewsHero } from "./NewsHero";
import { FeaturedHeadlinesServer } from "./FeaturedHeadlinesServer";
import { AllCasinoNewsServer } from "./AllCasinoNewsServer";
import { NewsletterStrip } from "./NewsletterStrip";

const TITLE = "Casino News | Latest Updates | TheOceanGame";
const DESC =
  "Stay updated with the latest casino news, industry updates, and iGaming trends.";

type PageProps = {
  searchParams?: QueryMap;
};

export default async function NewsPage({ searchParams }: PageProps) {
  const params = searchParams ?? {};
  const featuredNewsPage = readPageParam(params.featuredNewsPage, 1);
  const newsPage = readPageParam(params.newsPage, 1);
  const snapshot = await fetchItemListSnapshot(ENDPOINTS.news, "news", 8);
  return (
    <>
      <JsonLdScript
        data={buildCollectionJsonLd({
          name: TITLE,
          url: "/news",
          description: DESC,
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "News", url: "/news" },
        ])}
      />
      {snapshot.length > 0 && (
        <JsonLdScript
          data={buildItemListJsonLd("Latest Casino News", snapshot)}
        />
      )}
      <NewsHero />
      <FeaturedHeadlinesServer
        page={featuredNewsPage}
        queryKey="featuredNewsPage"
      />
      <AllCasinoNewsServer page={newsPage} queryKey="newsPage" />
      <NewsletterStrip />
    </>
  );
}

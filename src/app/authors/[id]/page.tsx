import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { AuthorHero } from "@/components/author/AuthorHero";
import { AuthorStats } from "@/components/author/AuthorStats";
import { AuthorSectionGrid } from "@/components/author/AuthorSectionGrid";
import { AuthorBreadcrumbs } from "@/components/author/AuthorBreadcrumbs";
import { API_BASE, ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildAuthorJsonLd,
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
} from "@/lib/seo";
import { QueryPagination } from "@/components/QueryPagination";
import { readPageParam, type QueryMap } from "@/lib/pagination-query";
import { normalizeImageUrl } from "@/lib/image-url";

type AuthorStats = {
  casinos?: number;
  casinoArticles?: number;
  games?: number;
  gameArticles?: number;
  blogs?: number;
  news?: number;
  bonuses?: number;
  bonusArticles?: number;
};

type AuthorProfile = {
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  email?: string | null;
  stats?: AuthorStats | null;
  sections?: {
    casinos?: any[];
    casinoArticles?: any[];
    gameArticles?: any[];
    blogs?: any[];
    news?: any[];
    bonusArticles?: any[];
    bonuses?: any[];
  };
};

type AuthorTab =
  | "all"
  | "casino-articles"
  | "game-articles"
  | "bonus-articles"
  | "blogs"
  | "news";

type PostItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
};

type FeedItem = PostItem & { type: Exclude<AuthorTab, "all"> };

const POSTS_PER_PAGE = 8;
const TAB_QUERY_KEY = "tab";
const PAGE_QUERY_KEY = "page";
const ALL_FETCH_LIMIT = 100;

const TABS: Array<{ key: AuthorTab; label: string }> = [
  { key: "all", label: "All" },
  { key: "casino-articles", label: "Casino Articles" },
  { key: "game-articles", label: "Game Articles" },
  { key: "bonus-articles", label: "Bonus Articles" },
  { key: "blogs", label: "Blogs" },
  { key: "news", label: "News" },
];

const TAB_LABELS: Record<Exclude<AuthorTab, "all">, string> = {
  "casino-articles": "Casino Article",
  "game-articles": "Game Article",
  "bonus-articles": "Bonus Article",
  blogs: "Blog",
  news: "News",
};

function readTab(raw: string | string[] | undefined): AuthorTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const valid: AuthorTab[] = [
    "all",
    "casino-articles",
    "game-articles",
    "bonus-articles",
    "blogs",
    "news",
  ];
  return valid.includes(value as AuthorTab) ? (value as AuthorTab) : "all";
}

/** Aggregate stats into 4 categories for UI */
function getAggregatedStats(stats: AuthorStats | null | undefined) {
  const s = stats ?? {};
  return {
    Casino: (s.casinos ?? 0) + (s.casinoArticles ?? 0),
    Bonus: (s.bonuses ?? 0) + (s.bonusArticles ?? 0),
    Blog: s.blogs ?? 0,
    News: s.news ?? 0,
  };
}

function imgSrc(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatPublishedDate(s: string | null | undefined) {
  if (!s) return "";

  try {
    const d = new Date(s);

    return d.toLocaleString("en-US", {
      timeZone: "America/New_York", // ✅ important
      month: "long", // April
      day: "numeric", // 19
      year: "numeric", // 2026
      hour: "numeric", // 1
      minute: "2-digit", // 32
      hour12: true, // PM format
    });
  } catch {
    return s;
  }
}

function postHref(type: Exclude<AuthorTab, "all">, slug: string) {
  if (type === "blogs") return `/blog/${slug}`;
  if (type === "news") return `/news/${slug}`;
  if (type === "casino-articles") return `/casino-articles/${slug}`;
  if (type === "game-articles") return `/game-articles/${slug}`;
  return `/bonus-articles/${slug}`;
}

function hrefForTab(authorName: string, tab: AuthorTab) {
  const encodedName = encodeURIComponent(authorName.toLowerCase());
  if (tab === "all") return `/authors/test/${encodedName}`;
  return `/authors/test/${encodedName}?${TAB_QUERY_KEY}=${tab}`;
}

// Fetch author by name using the correct API endpoint and preserve case
async function getAuthorByName(name: string): Promise<AuthorProfile | null> {
  try {
    // Use API_PUBLIC and preserve case
    const url = `${API_BASE}/api/v1/public/author/test/${encodeURIComponent(name)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as AuthorProfile;
  } catch (error) {
    console.error("Error fetching author by name:", error);
    return null;
  }
}

async function getTypedPosts(
  tab: Exclude<AuthorTab, "all">,
  editorId: string,
  page: number,
  limit: number,
): Promise<{ items: FeedItem[]; totalPages: number }> {
  try {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(ALL_FETCH_LIMIT));
    const endpoint = `${API_BASE}/api/v1/public/${tab}?${p.toString()}`;
    const res = await fetch(endpoint, {
      next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
    });
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: PostItem[];
      totalPages?: number;
    } | null;
    const listItems = Array.isArray(root?.items) ? root!.items : [];

    const detailUrlFor = (slug: string) => {
      if (tab === "blogs") return ENDPOINTS.blog(slug);
      if (tab === "news") return ENDPOINTS.newsItem(slug);
      if (tab === "casino-articles") return ENDPOINTS.casinoArticle(slug);
      if (tab === "game-articles") return ENDPOINTS.gameArticle(slug);
      return ENDPOINTS.bonusArticle(slug);
    };

    const checks = await Promise.all(
      listItems.map(async (item) => {
        try {
          const detailRes = await fetch(detailUrlFor(item.slug), {
            next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
          });
          if (!detailRes.ok) return null;
          const detailJson = await detailRes.json().catch(() => null);
          const detail = (detailJson?.data ?? detailJson) as {
            editor?: { id?: string | null } | null;
            createdById?: string | null;
          } | null;
          const ownerId = detail?.editor?.id ?? detail?.createdById ?? null;
          if (!ownerId || ownerId !== editorId) return null;
          return { ...item, type: tab } as FeedItem;
        } catch {
          return null;
        }
      }),
    );

    const filtered = checks.filter(Boolean) as FeedItem[];
    const totalPages = Math.max(
      1,
      Math.ceil(filtered.length / Math.max(limit, 1)),
    );
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * limit;
    return { items: filtered.slice(start, start + limit), totalPages };
  } catch {
    return { items: [], totalPages: 1 };
  }
}

async function getAuthorFeed(
  editorId: string,
  tab: AuthorTab,
  page: number,
): Promise<{ items: FeedItem[]; totalPages: number; safePage: number }> {
  if (tab !== "all") {
    const { items, totalPages } = await getTypedPosts(
      tab,
      editorId,
      page,
      POSTS_PER_PAGE,
    );
    const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    return { items, totalPages, safePage };
  }

  const sources: Exclude<AuthorTab, "all">[] = [
    "casino-articles",
    "game-articles",
    "bonus-articles",
    "blogs",
    "news",
  ];
  const results = await Promise.all(
    sources.map((t) => getTypedPosts(t, editorId, 1, ALL_FETCH_LIMIT)),
  );
  const allItems = results
    .flatMap((result) => result.items)
    .sort((a, b) => {
      const ta = new Date(a.publishDate ?? "").getTime() || 0;
      const tb = new Date(b.publishDate ?? "").getTime() || 0;
      return tb - ta;
    });

  const totalPages = Math.max(1, Math.ceil(allItems.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const items = allItems.slice(start, start + POSTS_PER_PAGE);
  return { items, totalPages, safePage };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<QueryMap>;
}): Promise<Metadata> {
  const { id } = await params;
  const qp = await searchParams;
  const tab = readTab(qp[TAB_QUERY_KEY]);
  const author = await getAuthorByName(id);
  if (!author) return { title: "Author | TheOceanGame" };
  // Use slug (lowercase name) for canonical and schema URLs
  const slug = encodeURIComponent(author.name.toLowerCase());
  const canonicalUrl = `/authors/${slug}`;
  const tabSuffix =
    tab === "all"
      ? ""
      : ` – ${TABS.find((t) => t.key === tab)?.label ?? "Posts"}`;
  // Improved title format
  const title = `${author.name} – Casino & Sports Betting Expert | TheOceanGame`;
  const desc =
    author.bio ??
    `View profile and articles by ${author.name} on TheOceanGame.`;
  return {
    title,
    description: desc,
    alternates: buildLocaleAlternates(canonicalUrl),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
    ),
    authors: [
      {
        name: author.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com"}${canonicalUrl}`,
      },
    ],
    openGraph: { type: "profile", title, description: desc, url: canonicalUrl },
    twitter: { card: "summary", title, description: desc },
    robots: { index: true, follow: true },
    // Canonical link
    other: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com"}${canonicalUrl}`,
    },
  };
}

const AGGREGATED_STAT_KEYS = ["Casino", "Bonus", "Blog", "News"] as const;

export default async function AuthorProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<QueryMap>;
}) {
  const { id: nameParam } = await params;
  const qp = await searchParams;
  const tab = readTab(qp[TAB_QUERY_KEY]);
  const page = readPageParam(qp[PAGE_QUERY_KEY], 1);
  const author = await getAuthorByName(nameParam);

  if (!author) notFound();

  const stats = getAggregatedStats(author.stats);
  const encodedName = encodeURIComponent(author.name.toLowerCase());
  const authorUrl = `/authors/${encodedName}`;

  return (
    <>
      {/* Schema: use slug-based URL for ProfilePage and BreadcrumbList */}
      <JsonLdScript
        data={buildAuthorJsonLd({
          id: author.name,
          name: author.name,
          bio: author.bio,
          image: author.avatarUrl,
        })}
      />
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Authors", url: "/authors" },
          {
            name: author.name,
            url: `/authors/${encodeURIComponent(author.name.toLowerCase())}`,
          },
        ])}
      />

      {/* Hero: no card, full-width dark section */}

      <AuthorHero
        name={author.name}
        avatarUrl={author.avatarUrl}
        bio={author.bio}
        email={author.email}
      />

      <Box
        sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}
      >
        <AuthorBreadcrumbs authorName={author.name} authorSlug={encodedName} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {author.bio && (
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "text.primary",
                }}
              >
                {author.bio}
              </Typography>
            )}
          </Box>
          <AuthorStats
            stats={stats}
            labels={AGGREGATED_STAT_KEYS as unknown as string[]}
          />
        </Box>

        {/* Render each section if present using AuthorSectionGrid */}
        {author.sections?.blogs?.length ? (
          <AuthorSectionGrid
            title="Latest Blogs"
            items={author.sections.blogs}
            hrefPrefix="blog"
          />
        ) : null}
        {author.sections?.news?.length ? (
          <AuthorSectionGrid
            title="Latest News"
            items={author.sections.news}
            hrefPrefix="news"
          />
        ) : null}
        {author.sections?.casinoArticles?.length ? (
          <AuthorSectionGrid
            title="Latest Casino Articles"
            items={author.sections.casinoArticles}
            hrefPrefix="casino-articles"
          />
        ) : null}
        {author.sections?.gameArticles?.length ? (
          <AuthorSectionGrid
            title="Latest Game Articles"
            items={author.sections.gameArticles}
            hrefPrefix="game-articles"
          />
        ) : null}
        {author.sections?.bonusArticles?.length ? (
          <AuthorSectionGrid
            title="Latest Bonus Articles"
            items={author.sections.bonusArticles}
            hrefPrefix="bonus-articles"
          />
        ) : null}
        {author.sections?.casinos?.length ? (
          <AuthorSectionGrid
            title="Latest Casinos"
            items={author.sections.casinos}
            hrefPrefix="casinos"
          />
        ) : null}
        {author.sections?.bonuses?.length ? (
          <AuthorSectionGrid
            title="Latest Bonuses"
            items={author.sections.bonuses}
            hrefPrefix="bonus"
          />
        ) : null}
      </Box>
    </>
  );
}

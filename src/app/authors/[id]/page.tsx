import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import ArrowForward from "@mui/icons-material/ArrowForward";
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
  pagesCreated?: number;
  casinosCreated?: number;
  casinoArticlesCreated?: number;
  gamesCreated?: number;
  gameArticlesCreated?: number;
  blogsCreated?: number;
  newsCreated?: number;
  bonusesCreated?: number;
  bonusArticlesCreated?: number;
};

type AuthorProfile = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  email?: string | null;
  stats?: AuthorStats | null;
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
    Casino: (s.casinosCreated ?? 0) + (s.casinoArticlesCreated ?? 0),
    Bonus: (s.bonusesCreated ?? 0) + (s.bonusArticlesCreated ?? 0),
    Blog: s.blogsCreated ?? 0,
    News: s.newsCreated ?? 0,
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

function hrefForTab(authorId: string, tab: AuthorTab) {
  if (tab === "all") return `/authors/${authorId}`;
  return `/authors/${authorId}?${TAB_QUERY_KEY}=${tab}`;
}

async function getAuthor(id: string): Promise<AuthorProfile | null> {
  try {
    const res = await fetch(ENDPOINTS.editors(id), {
      next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as AuthorProfile;
  } catch {
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
  const author = await getAuthor(id);
  if (!author) return { title: "Author | TheOceanGame" };
  const tabSuffix =
    tab === "all"
      ? ""
      : ` - ${TABS.find((t) => t.key === tab)?.label ?? "Posts"}`;
  const title = `${author.name}${tabSuffix} | Author | TheOceanGame`;
  const desc =
    author.bio ??
    `View profile and articles by ${author.name} on TheOceanGame.`;
  const url = `/authors/${id}`;
  return {
    title,
    description: desc,
    alternates: buildLocaleAlternates(url),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
    ),
    authors: [
      {
        name: author.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com"}${url}`,
      },
    ],
    openGraph: { type: "profile", title, description: desc, url },
    twitter: { card: "summary", title, description: desc },
    robots: { index: true, follow: true },
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
  const { id } = await params;
  const qp = await searchParams;
  const tab = readTab(qp[TAB_QUERY_KEY]);
  const page = readPageParam(qp[PAGE_QUERY_KEY], 1);
  const author = await getAuthor(id);

  if (!author) notFound();

  const avatarSrc = imgSrc(author.avatarUrl);
  const initial = author.name?.trim().charAt(0).toUpperCase() || "?";
  const stats = getAggregatedStats(author.stats);
  const authorUrl = `/authors/${author.id}`;
  const {
    items: feedItems,
    totalPages,
    safePage,
  } = await getAuthorFeed(author.id, tab, page);
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Authors", url: "/" },
    { name: author.name, url: authorUrl },
  ];

  return (
    <>
      <JsonLdScript
        data={buildAuthorJsonLd({
          id: author.id,
          name: author.name,
          bio: author.bio,
          image: author.avatarUrl,
        })}
      />
      <JsonLdScript data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      {/* Hero: no card, full-width dark section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 280, md: 320 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #8b1538 0%, #5c0e25 50%, #1a0a0f 100%)",
        }}
      >
        <Box
          sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "primary.main",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              fontSize: "0.7rem",
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            AUTHOR PROFILE
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              color: "white",
            }}
          >
            {author.name}
          </Typography>
        </Box>
      </Box>

      <BreadcrumbNav items={breadcrumbItems} />

      {/* Author details: no card, direct layout */}
      <Box
        sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Left: avatar + name + bio */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 3,
                  overflow: "hidden",
                  flexShrink: 0,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={author.name}
                    width={120}
                    height={120}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Typography
                    sx={{ fontSize: "3rem", fontWeight: 700, color: "white" }}
                  >
                    {initial}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "1.75rem", fontWeight: 700, mb: 0.5 }}
                >
                  {author.name}
                </Typography>
                {author.email && (
                  <Typography
                    component="a"
                    href={`mailto:${author.email}`}
                    sx={{
                      fontSize: "0.9rem",
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {author.email}
                  </Typography>
                )}
              </Box>
            </Box>

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

          {/* Right: 4 stats, no card containers */}
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 2, flexShrink: 0 }}
          >
            {AGGREGATED_STAT_KEYS.map((label) => (
              <Box key={label} sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {stats[label]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.6rem" },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Posts by {author.name}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
            {TABS.map((tabItem) => {
              const active = tabItem.key === tab;
              return (
                <Link
                  key={tabItem.key}
                  href={hrefForTab(author.id, tabItem.key)}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "999px",
                      border: "1px solid",
                      borderColor: active ? "primary.main" : "divider",
                      bgcolor: active ? "primary.main" : "background.paper",
                      color: active ? "primary.contrastText" : "text.primary",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                    }}
                  >
                    {tabItem.label}
                  </Box>
                </Link>
              );
            })}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {feedItems.length > 0 ? (
              feedItems.map((item) => {
                const img = normalizeImageUrl(item.featureImg) ?? null;
                const href = postHref(item.type, item.slug);
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 2,
                        },
                        display: "block",
                      }}
                    >
                      <Box sx={{ position: "relative", height: 150 }}>
                        {img ? (
                          <Box
                            component="img"
                            src={img}
                            alt={item.title}
                            sx={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              bgcolor: "grey.300",
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography
                          sx={{
                            display: "inline-flex",
                            mb: 0.75,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: "rgba(198,40,40,0.08)",
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {TAB_LABELS[item.type]}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            mb: 1,
                            color: "text.secondary",
                            fontSize: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarToday
                              sx={{ fontSize: 14, color: "primary.main" }}
                            />
                            {formatPublishedDate(item.publishDate)}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Schedule
                              sx={{ fontSize: 14, color: "primary.main" }}
                            />
                            {item.readTime ?? "—"}
                          </Box>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.shortDesc ?? ""}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          Read{" "}
                          <ArrowForward
                            sx={{ fontSize: 14, verticalAlign: "middle" }}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                );
              })
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 3 }}
              >
                No posts found for this section.
              </Typography>
            )}
          </Box>

          <QueryPagination
            page={safePage}
            totalPages={totalPages}
            queryKey={PAGE_QUERY_KEY}
          />
        </Box>
      </Box>
    </>
  );
}

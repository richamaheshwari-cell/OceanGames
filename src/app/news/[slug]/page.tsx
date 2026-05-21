import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import MenuBook from "@mui/icons-material/MenuBook";
import Newspaper from "@mui/icons-material/Newspaper";
import { API_BASE, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { TiptapHtmlServer } from "@/components/TiptapHtmlServer";
import { JsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { contentToMetadata, getTitle, getWordCountFromHtml } from "@/lib/seo";
import { tiptapJsonToHtml } from "@/lib/tiptap-server";
import EditIcon from "@mui/icons-material/Edit";
type Editor = { id: string; name: string; avatarUrl?: string | null };
type RelatedItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  readTime?: string | null;
};

type NewsResponse = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  shortDesc?: string | null;
  content?: object | string | null;
  publishDate?: string | null;
  updatedAt?: string | null;
  readTime?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  editor?: Editor | null;
  relatedNews?: RelatedItem[];
  relatedByTag?: RelatedItem[];
  latestArticleNews?: RelatedItem[];
  latestArticleBlogs?: RelatedItem[];
};

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

function imgSrc(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getNews(slug: string): Promise<NewsResponse | null> {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.theoceangame.com";
  let res = await fetch(`${base}/api/v1/public/news/${slug}`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    res = await fetch(`${base}/api/v1/public/trendingNews/${slug}`, {
      next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
    });
  }
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? json) as NewsResponse;
}

function SidebarItem({
  item,
  basePath,
  isDark,
}: {
  item: RelatedItem;
  basePath: "blog" | "news";
  isDark: boolean;
}) {
  const href =
    basePath === "blog" ? `/blog/${item.slug}` : `/news/${item.slug}`;
  const src = imgSrc(item.featureImg);

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          py: 2,
          px: 1,
          minHeight: 44,
          borderBottom: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.15)" : "divider",
          "&:last-child": { borderBottom: "none" },
          "&:hover": {
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "action.hover",
          },
          borderRadius: 1,
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.25,
              color: isDark ? "white" : "text.primary",
              wordBreak: "break-word",
            }}
          >
            {item.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: isDark ? "grey.400" : "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            <Schedule sx={{ fontSize: 14, color: "primary.main" }} />
            {item.readTime ?? "—"} read
          </Box>
        </Box>
        {src && (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* <Image
              src={src}
              alt={item.title}
              width={56}
              height={56}
              loading="lazy"
              style={{ objectFit: "cover" }}
              unoptimized
            /> */}
            <img
              src={src}
              alt={item.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>
    </Link>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return { title: "News | TheOceanGame" };
  return contentToMetadata(news, { routeBase: "news", isArticle: true });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) notFound();

  const currentSlug = news.slug ?? slug;
  const relatedNewsRaw = news.relatedNews ?? news.latestArticleNews ?? [];
  const relatedNews = relatedNewsRaw.filter(
    (item) => item.slug !== currentSlug,
  );
  const relatedBlogs = (news.latestArticleBlogs ?? []).filter(
    (item) => item.slug !== currentSlug,
  );
  const editor = news.editor;
  const content = news.content ?? "";
  const h1Title = getTitle(news);
  const contentHtml = tiptapJsonToHtml(content);
  const wordCount = getWordCountFromHtml(contentHtml);

  const path = `/news/${news.slug}`;
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: h1Title, url: path },
  ];
  return (
    <>
      <ReadingProgressBar />
      <JsonLd
        record={news}
        routeBase="news"
        schemaType="Article"
        isNews
        wordCount={wordCount}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 400, md: 500 },
          display: "flex",
          alignItems: "flex-end",
          pb: 3,
          px: 2,
        }}
      >
        {news.featureImg && (
          <img
            src={imgSrc(news.featureImg)!}
            alt={h1Title}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
          }}
        >
          <Typography
            component="title"
            variant="h3"
            sx={{
              fontSize: { xs: "28px", md: "38px" },
              fontWeight: 700,
              color: "white",
              mb: 1,
            }}
          >
            {h1Title}
          </Typography>
          <Typography sx={{ color: "grey.300", mb: 2 }}>
            {news.shortDesc}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              color: "grey.300",
              fontSize: "0.9rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 18, color: "primary.main" }} />
              Published: {formatPublishedDate(news.publishDate)} UTC
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 18, color: "primary.main" }} />
              {news.readTime ?? "—"}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "white",
            }}
          >
            <EditIcon sx={{ fontSize: 18, color: "primary.main" }} />
            {editor?.id ? (
              <Link
                href={`/authors/${encodeURIComponent(editor.name)}`}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                By: {editor.name}
              </Link>
            ) : null}
          </Box>
        </Box>
      </Box>

      <BreadcrumbNav items={breadcrumbItems} />

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 0 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              maxWidth: 800,
              mx: { xs: 0, lg: "auto" },
              animation: "articleFadeIn 0.4s ease-out forwards",
              "@keyframes articleFadeIn": {
                "0%": { opacity: 0 },
                "100%": { opacity: 1 },
              },
              paddingBottom: { xs: 0, md: 6 },
            }}
          >
            {(editor?.name || editor?.avatarUrl) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 2,
                  mt: 2,
                }}
              >
                {editor?.avatarUrl ? (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={imgSrc(editor.avatarUrl)!}
                      alt={editor.name}
                      width={40}
                      height={40}
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      flexShrink: 0,
                      bgcolor: "grey.300",
                      color: "grey.600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {editor?.name?.trim().charAt(0).toUpperCase() || "?"}
                  </Box>
                )}
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                  >
                    Author{" "}
                  </Typography>
                  {editor?.id ? (
                    <Link
                      href={`/authors/${encodeURIComponent(editor.name)}`}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "text.primary",
                        textDecoration: "none",
                      }}
                    >
                      {editor.name}
                    </Link>
                  ) : (
                    <Typography
                      component="span"
                      sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      {editor?.name ?? "Staff"}
                    </Typography>
                  )}
                  <Typography
                    component="div"
                    sx={{
                      fontSize: "0.8rem",
                      color: "text.secondary",
                      mt: 0.25,
                    }}
                  >
                    Published {formatPublishedDate(news.publishDate)}
                  </Typography>
                </Box>
              </Box>
            )}
            {content ? (
              <TiptapHtmlServer content={content} />
            ) : (
              <Typography color="text.secondary">
                No content available.
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: { md: "sticky" },
              top: { md: 100 },
              paddingBottom: { xs: 3, md: 6 },
            }}
          >
            {relatedNews.length > 0 && (
              <Box
                sx={{
                  bgcolor: "grey.900",
                  color: "white",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 1.5,
                  }}
                >
                  <Newspaper sx={{ color: "primary.main", fontSize: 22 }} />
                  <Typography
                    component="h2"
                    variant="subtitle1"
                    sx={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    Related News
                  </Typography>
                </Box>
                {relatedNews.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    basePath="news"
                    isDark
                  />
                ))}
              </Box>
            )}
            {relatedBlogs.length > 0 && (
              <Box
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 1.5,
                  }}
                >
                  <MenuBook sx={{ color: "primary.main", fontSize: 22 }} />
                  <Typography
                    component="h2"
                    variant="subtitle1"
                    sx={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    Latest Blogs
                  </Typography>
                </Box>
                {relatedBlogs.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    basePath="blog"
                    isDark={false}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

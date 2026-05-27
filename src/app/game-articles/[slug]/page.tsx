import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import { API_BASE, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { TiptapHtmlServer } from "@/components/TiptapHtmlServer";
import { JsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { contentToMetadata, getTitle, getWordCountFromHtml } from "@/lib/seo";
import { tiptapJsonToHtml } from "@/lib/tiptap-server";

type Editor = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  profilePublic?: boolean;
};
type RelatedItem = {
  id: string;
  title: string;
  slug: string;
  href?: string | null;
  featureImg?: string | null;
  readTime?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
};
type GameItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  gameDetails?: string[] | null;
  clientLink?: string | null;
};

type ArticleResponse = {
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
  relatedArticleGames?: RelatedItem[];
  relatedArticleBonus?: RelatedItem[];
  games?: GameItem[];
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
async function getArticle(slug: string): Promise<ArticleResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE}/api/v1/public/game-articles/${slug}`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? json) as ArticleResponse;
}

function SidebarItem({
  item,
  basePath,
  isDark,
}: {
  item: RelatedItem;
  basePath: "game-articles" | "bonus-articles";
  isDark: boolean;
}) {
  const href = item.href ?? `/${basePath}/${item.slug}`;
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
            <Image
              src={src}
              alt={item.title}
              width={56}
              height={56}
              loading="lazy"
              style={{ objectFit: "cover" }}
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
  const article = await getArticle(slug);
  if (!article) return { title: "Article | TheOceanGame" };
  return contentToMetadata(article, {
    routeBase: "game-articles",
    isArticle: true,
  });
}

export default async function GameArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const relatedGames = article.relatedArticleGames ?? [];
  const relatedBonus = article.relatedArticleBonus ?? [];
  const games = article.games ?? [];
  const editor = article.editor;
  const content = article.content ?? "";
  const contentHtml = tiptapJsonToHtml(content);
  const wordCount = getWordCountFromHtml(contentHtml);

  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/game-articles/${article.slug}`;
  const h1Title = getTitle(article);
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Games", url: "/games" },
    { name: h1Title, url: path },
  ];

  return (
    <>
      <ReadingProgressBar />
      <JsonLd
        record={article}
        routeBase="game-articles"
        schemaType="Article"
        wordCount={wordCount}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* Hero */}
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
        {article.featureImg && (
          <Image
            src={imgSrc(article.featureImg)!}
            alt={h1Title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", zIndex: 0 }}
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
            {article.shortDesc}
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
              Published: {formatPublishedDate(article.publishDate)} UTC
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 18, color: "primary.main" }} />
              {article.readTime ?? "—"} read
            </Box>
          </Box>
          <Box
            sx={{
              width: 60,
              height: 3,
              bgcolor: "primary.main",
              mt: 2,
              borderRadius: 1,
            }}
          />
        </Box>
        <Box>
          <Typography
            component="span"
            sx={{ fontSize: "0.875rem", color: "text.secondary" }}
          >
            Author{" "}
          </Typography>
          {editor?.id ? (
            <Link
              href={`/authors/${editor.id}`}
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
            sx={{ fontSize: "0.8rem", color: "text.secondary" }}
          >
            Published {formatPublishedDate(article.publishDate)}
          </Typography>
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
                      href={`/authors/${editor.id}`}
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
                    Published {formatPublishedDate(article.publishDate)}
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
            {relatedGames.length > 0 && (
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
                  <LocalFireDepartment
                    sx={{ color: "primary.main", fontSize: 22 }}
                  />
                  <Typography
                    component="h2"
                    variant="subtitle1"
                    sx={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    Related Game Articles
                  </Typography>
                </Box>
                {relatedGames.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    basePath="game-articles"
                    isDark
                  />
                ))}
              </Box>
            )}

            {relatedBonus.length > 0 && (
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
                  <CardGiftcard sx={{ color: "primary.main", fontSize: 22 }} />
                  <Typography
                    component="h2"
                    variant="subtitle1"
                    sx={{ fontWeight: 700, fontSize: "1rem" }}
                  >
                    Related Bonus Articles
                  </Typography>
                </Box>
                {relatedBonus.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    basePath="bonus-articles"
                    isDark={false}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Games from article response */}
      {games.length > 0 && (
        <Box component="section" sx={{ py: 6, px: 2, bgcolor: "#fafafa" }}>
          <Box sx={{ maxWidth: 1280, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: 0.5,
                    fontSize: "1.5rem",
                  }}
                >
                  Related{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Games
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Games featured in this article
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              {games.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 200, md: 220 },
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                    }}
                  >
                    <Box sx={{ position: "relative", height: 140 }}>
                      {game.featureImg ? (
                        <Image
                          src={
                            game.featureImg.startsWith("http")
                              ? game.featureImg
                              : `${API_BASE}${game.featureImg.startsWith("/") ? "" : "/"}${game.featureImg}`
                          }
                          alt={game.title}
                          fill
                          loading="lazy"
                          style={{ objectFit: "cover" }}
                          // sizes="220px"
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
                    <Box sx={{ p: 1.5 }}>
                      <Typography
                        component="h3"
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {game.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {game.tag ?? (game.gameProvider ?? [])[0] ?? "Game"}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

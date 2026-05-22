import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
import { QueryPagination } from "@/components/QueryPagination";
import { Suspense } from "react";
import { JsonLdScript } from "@/components/JsonLd";
import { generateCasinoSchema } from "@/lib/schema/casinoSchema";

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
  tag?: string | null;
};

function formatPublishedDate(s: string | null | undefined) {
  if (!s) return "";

  try {
    const d = new Date(s);

    return d.toLocaleString("en-US", {
      timeZone: "America/New_York", // important
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

const CATEGORY_COLORS: Record<string, string> = {
  strategy: "#c62828",
  guide: "#e65100",
  trends: "#7b1fa2",
  technology: "#00695c",
  analysis: "#5d4037",
  mobile: "#4527a0",
  default: "#c62828",
};

type LatestCasinoInsightsServerProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
  /** First 12 articles only, no pagination; “View all” → /casinos/insights */
  teaser?: boolean;
  /** Set false on /casinos/insights when the hero already shows the title */
  showSectionHeader?: boolean;
};

export async function LatestCasinoInsightsServer({
  page = 1,
  limit = 12,
  queryKey = "page",
  teaser = false,
  showSectionHeader = true,
}: LatestCasinoInsightsServerProps = {}) {
  const fetchPage = teaser ? 1 : page;

  let items: ArticleItem[] = [];
  let totalPages = 1;
  try {
    const res = await fetch(
      `${API_PUBLIC}/casino-articles?page=${fetchPage}&limit=${limit}`,
      {
        next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
      },
    );
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: ArticleItem[];
      totalPages?: number;
    } | null;
    items = Array.isArray(root?.items) ? root!.items : [];
    totalPages = Number(root?.totalPages ?? 1) || 1;
  } catch {
    items = [];
    totalPages = 1;
  }
  const safePage = Math.min(Math.max(fetchPage, 1), Math.max(totalPages, 1));

  const titleBlock = teaser ? (
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
      <Box sx={{ flex: "1 1 240px", minWidth: 0 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
        >
          Latest Casino{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Insights
          </Box>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 560 }}
        >
          Expert guides, strategies, and industry news to enhance your gaming
          experience
        </Typography>
      </Box>
      <Link
        href="/casinos/insights"
        style={{ textDecoration: "none", alignSelf: "center" }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "grey.900",
            fontWeight: 600,
            "&:hover": { bgcolor: "primary.main" },
          }}
          endIcon={<ArrowForward />}
        >
          View all articles
        </Button>
      </Link>
    </Box>
  ) : showSectionHeader ? (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
      >
        Latest Casino{" "}
        <Box component="span" sx={{ color: "primary.main" }}>
          Insights
        </Box>
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 560, mx: "auto" }}
      >
        Expert guides, strategies, and industry news to enhance your gaming
        experience
      </Typography>
    </Box>
  ) : null;

  return (
    <Box component="section" sx={{ py: 6, px: 2, bgcolor: "background.paper" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        {titleBlock}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {items.length ? (
            items.map((article) => {
              const img = normalizeImageUrl(article.featureImg) ?? null;
              const category =
                CATEGORY_COLORS[(article.tag ?? "").toLowerCase()] ??
                CATEGORY_COLORS.default;
              const href = `${SITE_URL}/casino-articles/${article.slug}`;

              return (
                <>
                  <JsonLdScript
                    data={generateCasinoSchema({
                      url: href,
                      title: article.title,
                      description: article.shortDesc ?? "",
                      image: article.featureImg || undefined,
                      datePublished: article.publishDate ?? undefined,
                      dateModified: article.publishDate ?? undefined,
                      author: {
                        name: "TheOceanGame",
                        slug: "theoceangame",
                      },
                    })}
                  />
                  <Box
                    key={article.id}
                    component="a"
                    href={href}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                      display: "block",
                    }}
                  >
                    <Box sx={{ position: "relative", height: 160 }}>
                      {img ? (
                        <Box
                          component="img"
                          src={img}
                          alt={article.title}
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
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: category,
                          color: "white",
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {article.tag ?? "Article"}
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
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
                        {article.shortDesc ?? ""}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          color: "text.secondary",
                          fontSize: "0.75rem",
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
                          {formatPublishedDate(article.publishDate)}
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
                          {article.readTime ?? "—"} read
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              );
            })
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ gridColumn: "1 / -1", textAlign: "center" }}
            >
              No casino insights found right now.
            </Typography>
          )}
        </Box>

        {!teaser ? (
          <Suspense fallback={null}>
            <QueryPagination
              page={safePage}
              totalPages={totalPages}
              queryKey={queryKey}
            />
          </Suspense>
        ) : null}
      </Box>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
import { QueryPagination } from "@/components/QueryPagination";
import { generateArticleSchema } from "@/lib/schema/articleSchema";
import { JsonLdScript } from "@/components/JsonLd";

type Item = {
  id: string;
  title: string;
  slug: string;
  href: string;
  contentType:
    | "blog"
    | "casino-article"
    | "game-article"
    | "bonus-article"
    | "news";
  featureImg?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
  author?: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
  };
  reviewedBy?: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
  };
};

function formatPublishedDate(s: string | null | undefined) {
  if (!s) return "";

  try {
    const d = new Date(s);

    return d.toLocaleString("en-US", {
      timeZone: "America/New_York", //important
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

type AllCasinoArticlesServerProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
};

export async function AllCasinoArticlesServer({
  page = 1,
  limit = 12,
  queryKey = "blogsPage",
}: AllCasinoArticlesServerProps = {}) {
  let items: Item[] = [];
  let totalPages = 1;
  try {
    const res = await fetch(
      `${API_PUBLIC}/blogs/content?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      },
    );
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: Item[];
      totalPages?: number;
    } | null;
    items = Array.isArray(root?.items) ? root!.items : [];
    totalPages = Number(root?.totalPages ?? 1) || 1;
  } catch (err) {
    items = [];
    totalPages = 1;
  }
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  return (
    <Box id="all" component="section" sx={{ py: 6, px: 2, bgcolor: "#fafafa" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
          >
            All Blog{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Content
            </Box>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto" }}
          >
            Browse all published content that is marked to appear on the blog
            page
          </Typography>
        </Box>

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
              const href = `${SITE_URL}${article.href}`;
              return (
                <>
                  <JsonLdScript
                    data={generateArticleSchema({
                      url: href,
                      title: article.title,
                      description: article.shortDesc ?? "",
                      image: img || undefined,
                      datePublished: article.publishDate ?? "",
                      author: article.author,
                      reviewedBy: article.reviewedBy,
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
                          loading="lazy"
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
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
                          Published: {formatPublishedDate(article.publishDate)}{" "}
                          UTC
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

                      <Typography
                        component="span"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        Read{" "}
                        <ArrowForward
                          sx={{ fontSize: 14, verticalAlign: "middle" }}
                        />
                      </Typography>
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
              No blog articles found right now.
            </Typography>
          )}
        </Box>
        <QueryPagination
          page={safePage}
          totalPages={totalPages}
          queryKey={queryKey}
        />
      </Box>
    </Box>
  );
}

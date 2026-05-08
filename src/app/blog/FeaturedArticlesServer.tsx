import { Box, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import Star from "@mui/icons-material/Star";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
import { QueryPagination } from "@/components/QueryPagination";

type Item = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
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

type FeaturedArticlesServerProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
};

export async function FeaturedArticlesServer({
  page = 1,
  limit = 6,
  queryKey = "featuredBlogsPage",
}: FeaturedArticlesServerProps = {}) {
  let items: Item[] = [];
  let totalPages = 1;
  try {
    const res = await fetch(
      `${API_PUBLIC}/featuredBlogs?page=${page}&limit=${limit}`,
      {
        next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
      },
    );
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: Item[];
      totalPages?: number;
    } | null;
    items = Array.isArray(root?.items) ? root!.items : [];
    totalPages = Number(root?.totalPages ?? 1) || 1;
  } catch {
    items = [];
    totalPages = 1;
  }
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  return (
    <Box
      id="featured"
      component="section"
      sx={{ py: 6, px: 2, bgcolor: "background.paper" }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 4,
                height: 28,
                bgcolor: "primary.main",
                borderRadius: 0.5,
              }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "grey.900" }}
            >
              Featured{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Articles
              </Box>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Editor&apos;s picks and must-read insights
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {items.length ? (
            items.map((article) => {
              const img = normalizeImageUrl(article.featureImg) ?? null;
              const href = `${SITE_URL}/blog/${article.slug}`;
              return (
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
                  <Box sx={{ position: "relative", height: 180 }}>
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
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "primary.main",
                        color: "white",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      <Star sx={{ fontSize: 14 }} />
                      FEATURED
                    </Box>
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
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 14, color: "primary.main" }}
                        />
                        {formatPublishedDate(article.publishDate)}
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
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
                        mb: 1,
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
                        mb: 1.5,
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
                      Read More{" "}
                      <ArrowForward
                        sx={{ fontSize: 14, verticalAlign: "middle", ml: 0.25 }}
                      />
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ gridColumn: "1 / -1", textAlign: "center" }}
            >
              No featured articles found right now.
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

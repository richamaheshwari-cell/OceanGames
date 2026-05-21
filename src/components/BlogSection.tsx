import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Schedule from "@mui/icons-material/Schedule";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-url";

type BlogItem = {
  id: string;
  title: string;
  slug: string;
  href?: string | null;
  contentType?:
    | "blog"
    | "casino-article"
    | "game-article"
    | "bonus-article"
    | "news";
  featureImg?: string | null;
  image?: string | null;
  shortDesc?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
  isFeatured?: boolean;
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

const blogsFetcher = async () => {
  const res = await fetch(`${API_PUBLIC}/blogs/content?page=1&limit=6`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  const data = json.data ?? json;
  return Array.isArray(data.items) ? data.items : [];
};

function getContentLabel(item: BlogItem) {
  switch (item.contentType) {
    case "casino-article":
      return "Casino Article";
    case "game-article":
      return "Game Article";
    case "bonus-article":
      return "Bonus Article";
    case "news":
      return "News";
    default:
      return "Blog";
  }
}

export async function BlogSection() {
  const items = (await blogsFetcher()) as BlogItem[];

  return (
    <Box
      component="section"
      id="blog"
      sx={{ py: 6, px: 3, bgcolor: "background.paper" }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
          >
            Expert{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Insights & Guides
            </Box>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto" }}
          >
            Stay informed with our latest articles, betting strategies, and
            industry analysis
          </Typography>
        </Box>

        {items.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {items.map((article) => {
              if (!article || !article.id || !article.slug || !article.title)
                return null;
              console.log("Article:", article);
              const resolvedImg = normalizeImageUrl(
                article.featureImg ?? article.image ?? null,
              );
              const articleHref = article.href ?? `/blog/${article.slug}`;
              return (
                <Link
                  href={articleHref}
                  key={article.id}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      border: "2px solid",
                      borderColor: "grey.300",
                      borderRadius: 3,
                      overflow: "hidden",
                      "&:hover": { borderColor: "primary.main", boxShadow: 4 },
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 225,
                        overflow: "hidden",
                      }}
                    >
                      {resolvedImg ? (
                        <img
                          src={resolvedImg || "/placeholder.png"}
                          alt={article.title}
                          style={{
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
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "primary.main",
                          color: "white",
                          px: 1,
                          py: 0.25,
                          borderRadius: 2,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {getContentLabel(article)}
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
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "0.75rem",
                          }}
                        >
                          <CalendarToday
                            sx={{ fontSize: 14, color: "primary.main" }}
                          />
                          <span>
                            Published:{" "}
                            {formatPublishedDate(article.publishDate)}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "0.75rem",
                          }}
                        >
                          <Schedule
                            sx={{ fontSize: 14, color: "primary.main" }}
                          />
                          <span>{article.readTime ?? "—"}</span>
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          TheOceanGame
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          Read More{" "}
                          <ArrowForward
                            sx={{
                              fontSize: 14,
                              verticalAlign: "middle",
                              ml: 0.25,
                            }}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              );
            })}
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            No blog articles available right now.
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "grey.900",
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                boxShadow: 2,
                "&:hover": { bgcolor: "primary.main" },
              }}
              endIcon={<ArrowForward />}
            >
              View All Articles
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

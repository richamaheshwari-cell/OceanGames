import { Box, Typography, Button } from "@mui/material";
import Business from "@mui/icons-material/Business";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
import { QueryPagination } from "@/components/QueryPagination";

type GameItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  clientLink?: string | null;
};

type RecommendedGamesServerProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
};

export async function RecommendedGamesServer({
  page = 1,
  limit = 12,
  queryKey = "page",
}: RecommendedGamesServerProps = {}) {
  let items: GameItem[] = [];
  let totalPages = 1;
  try {
    const res = await fetch(`${API_PUBLIC}/games?page=${page}&limit=${limit}`, {
      next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
    });
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: GameItem[];
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
      id="recommended"
      component="section"
      sx={{ py: 6, px: 2, bgcolor: "background.paper" }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ textAlign: "left", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
          >
            Recommended{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Casino Games
            </Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Top-performing and most-played casino games curated for you.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            alignItems: "stretch",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 2.5,
          }}
        >
          {items.length ? (
            items.map((game) => {
              const img = normalizeImageUrl(game.featureImg) ?? null;
              const categoryLabel =
                game.tag ?? (game.gameProvider ?? [])[0] ?? "Game";
              const providerName = (game.gameProvider ?? [])[0] ?? "—";
              const detailsHref = `${SITE_URL}/games/${game.slug}`;
              const playHref = game.clientLink?.trim() || null;

              return (
                <Box
                  key={game.id}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 160,
                      borderRadius: "8px 8px 0 0",
                      overflow: "hidden",
                    }}
                  >
                    {img ? (
                      <Box
                        component="img"
                        src={img}
                        alt={game.title}
                        loading="lazy"
                        width="400"
                        height="160"
                        decoding="async"
                        fetchPriority="low"
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
                        right: 12,
                        bgcolor: "primary.main",
                        color: "white",
                        px: 1.25,
                        py: 0.35,
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {categoryLabel}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 0.5, color: "grey.900" }}
                      component="a"
                      href={detailsHref}
                      style={{ textDecoration: "none" }}
                    >
                      {game.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0,
                        color: "text.secondary",
                        fontSize: "0.8rem",
                        flex: 1,
                      }}
                    >
                      <Business sx={{ fontSize: 16, color: "grey.500" }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {providerName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: "auto",
                        pt: 1.5,
                      }}
                    >
                      {playHref ? (
                        <Button
                          component="a"
                          href={playHref}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          variant="contained"
                          sx={{
                            flex: 1,
                            bgcolor: "grey.900",
                            color: "white",
                            fontWeight: 600,
                            py: 1,
                            "&:hover": { bgcolor: "grey.800" },
                          }}
                        >
                          Play Game
                        </Button>
                      ) : null}
                      <Button
                        component="a"
                        href={detailsHref}
                        variant="outlined"
                        sx={{ flex: 1, fontWeight: 600, py: 1 }}
                      >
                        View Detail
                      </Button>
                    </Box>
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
              No games available right now.
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

import { Box, Typography, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
type GameItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  clientLink?: string | null;
};

type ExploreCasinoGamesServerProps = {
  /** How many games to show in this teaser (first page only). */
  limit?: number;
};

export async function ExploreCasinoGamesServer({ limit = 5 }: ExploreCasinoGamesServerProps = {}) {
  let items: GameItem[] = [];
  try {
    const res = await fetch(`${API_PUBLIC}/games?page=1&limit=${limit}`, {
      next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
    });
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as { items?: GameItem[] } | null;
    items = Array.isArray(root?.items) ? root!.items : [];
  } catch {
    items = [];
  }

  return (
    <Box component="section" sx={{ py: 6, px: 2, bgcolor: "#fafafa" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}>
              Explore Casino <Box component="span" sx={{ color: "primary.main" }}>Games</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">Discover the most popular and exciting casino games</Typography>
          </Box>
          <Button
            component="a"
            href={`${SITE_URL}/games`}
            variant="contained"
            sx={{ bgcolor: "grey.900", color: "white", fontWeight: 600, "&:hover": { bgcolor: "grey.800" } }}
            endIcon={<ArrowForward />}
          >
            View All Games
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "stretch", gap: 2.25, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
          {items.map((game) => {
            const img = normalizeImageUrl(game.featureImg) ?? null;
            const detailsHref = `${SITE_URL}/games/${game.slug}`;
            const playHref = game.clientLink?.trim() || null;
            const chip = (game.gameProvider ?? [])[0] ?? game.tag ?? "Game";

            return (
              <Box
                key={game.id}
                sx={{
                  width: { xs: "100%", sm: 200, md: 240 },
                  flexShrink: 0,
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
                <Box sx={{ position: "relative", height: 180 }}>
                  {img ? (
                    <Box
                      component="img"
                      src={img}
                      alt={game.title}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box sx={{ width: "100%", height: "100%", bgcolor: "grey.300" }} />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "grey.900",
                      color: "white",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {chip}
                  </Box>
                </Box>
                <Box sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{game.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 0 }}>{game.tag ?? "Casino Game"}</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1.25 }}>
                    {playHref ? (
                      <Button
                        component="a"
                        href={playHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        variant="contained"
                        size="small"
                        sx={{ flex: 1, fontWeight: 700 }}
                      >
                        Play Game
                      </Button>
                    ) : null}
                    <Button
                      component="a"
                      href={detailsHref}
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, fontWeight: 700 }}
                    >
                      View Detail
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}


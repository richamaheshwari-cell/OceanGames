import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-url";

type GameItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  image?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  gameDetails?: string[] | null;
  clientLink?: string | null;
};

const gamesFetcher = async () => {
  const res = await fetch(`${ENDPOINTS.games}?page=1&limit=4`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const json = await res.json();
  const data = json.data ?? json;
  return Array.isArray(data.items) ? data.items : [];
};

export async function GamesSection() {
  const items = (await gamesFetcher()) as GameItem[];

  return (
    <Box component="section" id="games" sx={{ py: 5, px: 3, background: "linear-gradient(135deg, #fef2f2 0%, #fff 100%)" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}>
            Popular <Box component="span" sx={{ color: "primary.main" }}>Casino Games</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
            Explore thousands of exciting casino games from top providers worldwide
          </Typography>
        </Box>

        {items.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              flexWrap: "nowrap",
              gap: 2.5,
              overflowX: "auto",
              overflowY: "hidden",
              pb: 1,
              justifyContent: { xs: "flex-start", lg: "center" },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.map((game) => {
              const resolvedImg = normalizeImageUrl(game.featureImg ?? game.image ?? null);

              const playHref = game.clientLink?.trim() || "";

              return (
              <Box key={game.id} sx={{ flex: "0 0 auto", width: { xs: 260, sm: 280 }, display: "flex", alignItems: "stretch" }}>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    border: "2px solid",
                    borderColor: "grey.300",
                    borderRadius: 3,
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": { borderColor: "primary.main", boxShadow: 4 },
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block", flexShrink: 0 }}>
                    <Box sx={{ position: "relative", height: 144, overflow: "hidden" }}>
                      {resolvedImg ? (
                        <Image
                          src={resolvedImg}
                          alt={game.title}
                          fill
                          unoptimized
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 320px"
                        />
                      ) : (
                        <Box sx={{ width: "100%", height: "100%", bgcolor: "grey.300" }} />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "primary.main",
                          color: "white",
                          px: 1,
                          py: 0.25,
                          borderRadius: 2,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {game.tag ?? "Game"}
                      </Box>
                    </Box>
                  </Link>
                  <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        {game.title}
                      </Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 0,
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {Array.isArray(game.gameDetails) && game.gameDetails[0] ? game.gameDetails[0] : "Explore this game"}
                    </Typography>
                    {playHref ? (
                      <Button
                        component="a"
                        href={playHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{
                          mt: "auto",
                          pt: 1.5,
                          fontWeight: 600,
                          borderWidth: 2,
                          "&:hover": { borderWidth: 2, bgcolor: "primary.main", color: "white" },
                        }}
                      >
                        Play Now
                      </Button>
                    ) : null}
                  </Box>
                </Box>
              </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            No games available right now.
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Link href="/games" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "grey.900",
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": { bgcolor: "primary.main" },
              }}
              endIcon={<ArrowForward />}
            >
              See more
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

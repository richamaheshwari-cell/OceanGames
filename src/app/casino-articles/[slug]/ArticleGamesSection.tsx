import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC, API_BASE } from "@/lib/api";

type GameItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
};

async function getGames(): Promise<GameItem[]> {
  try {
    const res = await fetch(`${API_PUBLIC}/games?page=1&limit=5`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const data = json.data ?? json;

    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function ArticleGamesSection() {
  const items = await getGames();

  return (
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
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "grey.900",
                mb: 0.5,
              }}
            >
              Explore Casino <span style={{ color: "#d32f2f" }}>Games</span>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Discover the most popular and exciting casino games
            </Typography>
          </Box>

          <Link href="/games" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "grey.900",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "grey.800",
                },
              }}
              endIcon={<ArrowForward />}
            >
              View All Games
            </Button>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2.25,
            flexWrap: "wrap",
            justifyContent: {
              xs: "center",
              md: "flex-start",
            },
          }}
        >
          {items.map((game) => {
            const imageSrc = game.featureImg
              ? game.featureImg.startsWith("http")
                ? game.featureImg
                : `${API_BASE}${
                    game.featureImg.startsWith("/") ? "" : "/"
                  }${game.featureImg}`
              : null;

            return (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: 200,
                      md: 240,
                    },
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 180,
                    }}
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={game.title}
                        width={240}
                        height={180}
                        unoptimized
                        loading="lazy"
                        decoding="async"
                        sizes="220px"
                        style={{
                          objectFit: "cover",
                          backgroundColor: "#f5f5f5",
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
                        bgcolor: "grey.900",
                        color: "white",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {(game.gameProvider ?? [])[0] ?? game.tag ?? "Game"}
                    </Box>
                  </Box>

                  <Box sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {game.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {game.tag ?? "Casino Game"}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

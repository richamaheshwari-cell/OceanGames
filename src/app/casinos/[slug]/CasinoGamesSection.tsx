import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Apartment from "@mui/icons-material/Apartment";
import { normalizeImageUrl } from "@/lib/image-url";
import { CASINO_RED, CASINO_RED_HOVER, PAGE_BG } from "./casino-detail-tokens";

export type CasinoPageGame = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  rtp?: string | number | null;
  volatility?: string | null;
  category?: string | null;
};

function gameImg(url: string | null | undefined) {
  return normalizeImageUrl(url);
}

function volatilityColor(v: string | undefined) {
  const x = (v ?? "").toLowerCase();
  if (x.includes("low")) return "#2e7d32";
  if (x.includes("high")) return "#c62828";
  if (x.includes("med")) return "#ed6c02";
  return "#424242";
}

export function CasinoGamesSection({
  casinoName,
  games,
}: {
  casinoName: string;
  games: CasinoPageGame[];
}) {
  const count = games.length;

  return (
    <Box
      component="section"
      sx={{
        bgcolor: PAGE_BG,
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 5,
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.5rem", md: "1.85rem" },
                color: "#111",
                letterSpacing: "-0.02em",
                mb: 0.75,
              }}
            >
              Games at{" "}
              <Box component="span" sx={{ color: CASINO_RED }}>
                {casinoName}
              </Box>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.95rem" }}
            >
              {count === 0
                ? "Games from this casino will appear here."
                : `${count} featured game${count === 1 ? "" : "s"} available`}
            </Typography>
          </Box>
          <Link href="/games" style={{ textDecoration: "none" }}>
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              sx={{
                fontWeight: 700,
                color: CASINO_RED,
                fontSize: "0.95rem",
                "&:hover": { bgcolor: "rgba(229, 57, 53, 0.06)" },
              }}
            >
              Browse All Games
            </Button>
          </Link>
        </Box>

        {count === 0 && (
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: "center",
              borderRadius: "18px",
              border: "1px dashed rgba(0,0,0,0.12)",
              bgcolor: "rgba(255,255,255,0.8)",
            }}
          >
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 420, mx: "auto" }}
            >
              No games are linked to this casino yet. Browse our full library to
              find slots and table games.
            </Typography>
          </Box>
        )}

        {count > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {games.map((game) => {
              console.log("game", game);
              const src = gameImg(game.featureImg);
              const provider = (game.gameProvider ?? [])[0];
              const rtp =
                game.rtp != null && String(game.rtp).trim() !== ""
                  ? typeof game.rtp === "number"
                    ? `${game.rtp}% RTP`
                    : String(game.rtp).includes("RTP")
                      ? String(game.rtp)
                      : `${game.rtp}% RTP`
                  : null;

              return (
                <Box
                  key={game.id}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 188,
                      overflow: "hidden",
                      borderRadius: "18px 18px 0 0",
                      "& img": {
                        transition:
                          "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                      },
                      "&:hover img": { transform: "scale(1.08)" },
                    }}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: "grey.200",
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />
                    {game.volatility && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          px: 1,
                          py: 0.35,
                          borderRadius: 1.5,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: volatilityColor(game.volatility),
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        {game.volatility}
                      </Box>
                    )}
                    {rtp && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          px: 1,
                          py: 0.35,
                          borderRadius: 1.5,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: "rgba(0,0,0,0.7)",
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        {rtp}
                      </Box>
                    )}
                    {(game.category || game.tag) && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          px: 1.2,
                          py: 0.35,
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          bgcolor: CASINO_RED,
                          color: "white",
                          zIndex: 1,
                          maxWidth: "70%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {game.category ?? game.tag}
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      p: 2.25,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        lineHeight: 1.35,
                        color: "#111",
                        mb: 0.5,
                      }}
                    >
                      {game.title}
                    </Typography>
                    {provider && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ mb: 2, color: "text.secondary" }}
                      >
                        <Apartment sx={{ fontSize: 16, opacity: 0.85 }} />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {provider}
                        </Typography>
                      </Stack>
                    )}
                    <Box sx={{ mt: "auto" }}>
                      <Link
                        href={`/games/${game.slug}`}
                        style={{ textDecoration: "none", display: "block" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          disableElevation
                          sx={{
                            background: `linear-gradient(180deg, ${CASINO_RED} 0%, ${CASINO_RED_HOVER} 100%)`,
                            color: "white",
                            fontWeight: 700,
                            py: 1.35,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontSize: "0.9rem",
                            boxShadow: "0 4px 14px rgba(229, 57, 53, 0.35)",
                            "&:hover": {
                              background: CASINO_RED_HOVER,
                              boxShadow: "0 6px 18px rgba(229, 57, 53, 0.45)",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

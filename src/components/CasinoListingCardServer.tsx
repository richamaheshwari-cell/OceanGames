import Image from "next/image";
import { Box, Typography, Button, Chip, Stack } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Check from "@mui/icons-material/Check";
import Star from "@mui/icons-material/Star";
import StarHalf from "@mui/icons-material/StarHalf";
import StarBorder from "@mui/icons-material/StarBorder";
import { API_BASE } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-url";

export type CasinoItem = {
  id: string;
  casinoName: string;
  slug: string;
  featureImg?: string | null;
  image?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  bonusAmt?: string | null;
  bonusDetails?: string[] | null;
  totalGames?: number | null;
  tags?: string[] | null;
  payoutSpeed?: string | null;
  clientLink?: string | null;
};

/** Design tokens — casino card (maroon header, red accents) */
const HEADER_MAROON = "#4A1C1C";
const ACCENT_RED = "#dc2626";
const STAT_BORDER = "rgba(220, 38, 38, 0.28)";
const TAG_BG = "#fce7e7";
const STAR_COLOR = "#facc15";

export const CASINO_CARD_WIDTH = 300;

function imgUrl(path: string | null | undefined) {
  if (!path) return null;
  const candidate = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  return normalizeImageUrl(candidate);
}

function StarRow({ rating }: { rating: number }) {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }

  return (
    <Stack direction="row" alignItems="center" spacing={0.25} component="span">
      {stars.map((kind, i) => {
        const sx = { fontSize: "1.05rem", color: STAR_COLOR };
        if (kind === "full") return <Star key={i} sx={sx} aria-hidden />;
        if (kind === "half") return <StarHalf key={i} sx={sx} aria-hidden />;
        return (
          <StarBorder
            key={i}
            sx={{ ...sx, color: "rgba(255,255,255,0.45)" }}
            aria-hidden
          />
        );
      })}
    </Stack>
  );
}

type CasinoListingCardServerProps = {
  casino: CasinoItem;
  /** Home row: equal card heights + aligned header */
  variant?: "default" | "home";
};

export function CasinoListingCardServer({
  casino,
  variant = "default",
}: CasinoListingCardServerProps) {
  const rating = Math.min(5, Math.max(0, casino.rating ?? 0));
  const gamesLabel =
    casino.totalGames != null && casino.totalGames > 0
      ? `${casino.totalGames.toLocaleString()}+`
      : "—";

  const visitHref = casino.clientLink?.trim() || undefined;
  const canVisit = Boolean(casino.clientLink?.trim());

  const featureSrc = imgUrl(casino.featureImg ?? casino.image);
  const isHome = variant === "home";

  return (
    <Box
      sx={{
        ...(isHome
          ? {
              width: "100%",
              maxWidth: CASINO_CARD_WIDTH,
              minWidth: 0,
              mx: "auto",
            }
          : { width: CASINO_CARD_WIDTH, flexShrink: 0 }),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: ACCENT_RED,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header — name + rating bottom-left over image */}
      <Box
        sx={{
          position: "relative",
          height: isHome ? 170 : undefined,
          minHeight: 170,
          flexShrink: 0,
          bgcolor: HEADER_MAROON,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {featureSrc && (
          <Image
            src={featureSrc}
            alt={casino.casinoName}
            fill
            unoptimized
            loading="lazy"
            quality={70}
            sizes="(max-width: 768px) 100vw, 300px"
            style={{
              objectFit: "cover",
              opacity: 0.7,
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            alignSelf: "stretch",
            px: 2,
            pb: 2,
            pt: 0,
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              color: "white",
              fontSize: "1.15rem",
              lineHeight: 1.25,
              mb: 0.75,
              ...(isHome
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
                : {}),
            }}
          >
            {casino.casinoName}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            <StarRow rating={rating} />
            <Typography
              component="span"
              sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}
            >
              {rating > 0 ? rating.toFixed(1) : "—"}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Stats + tags + actions (actions pinned to bottom) */}
      <Box
        sx={{
          p: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: STAT_BORDER,
              borderRadius: 1.5,
              bgcolor: "background.paper",
              p: 1.25,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Welcome Bonus
            </Typography>
            <Typography
              sx={{
                color: ACCENT_RED,
                fontWeight: 800,
                fontSize: "1.05rem",
                lineHeight: 1.2,
              }}
            >
              {casino.bonusAmt ?? "—"}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: STAT_BORDER,
              borderRadius: 1.5,
              bgcolor: "background.paper",
              p: 1.25,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Games
            </Typography>
            <Typography
              sx={{
                color: ACCENT_RED,
                fontWeight: 800,
                fontSize: "1.05rem",
                lineHeight: 1.2,
              }}
            >
              {gamesLabel}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          sx={{ mb: 2, flex: 1, alignContent: "flex-start" }}
        >
          {(casino.tags ?? []).slice(0, 3).map((t) => (
            <Chip
              key={t}
              size="small"
              icon={
                <Check
                  sx={{
                    fontSize: 16,
                    color: `${ACCENT_RED} !important`,
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
              }
              label={t}
              sx={{
                bgcolor: TAG_BG,
                color: "#7f1d1d",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 28,
                "& .MuiChip-icon": { ml: 0.75 },
              }}
            />
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="stretch"
          sx={{ mt: "auto", pt: 0.5 }}
        >
          {canVisit ? (
            <Button
              component="a"
              href={visitHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<OpenInNew sx={{ fontSize: 18 }} />}
              sx={{
                flex: 1,
                py: 1.25,
                fontWeight: 700,
                bgcolor: "#0a0a0a",
                color: "white",
                boxShadow: "none",
                "&:hover": { bgcolor: "#1a1a1a", boxShadow: "none" },
              }}
            >
              Visit Casino
            </Button>
          ) : null}

          <Button
            component="a"
            href={`/casinos/${casino.slug}`}
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 0,
              py: 1.25,
              fontWeight: 700,
              borderColor: ACCENT_RED,
              color: ACCENT_RED,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                borderColor: ACCENT_RED,
                bgcolor: "rgba(220,38,38,0.04)",
              },
            }}
          >
            Details
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

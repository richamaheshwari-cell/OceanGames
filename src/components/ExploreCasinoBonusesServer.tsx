import { Box, Typography, Button } from "@mui/material";
import Diamond from "@mui/icons-material/Diamond";
import Check from "@mui/icons-material/Check";
import type { SvgIconComponent } from "@mui/icons-material";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import LocalOffer from "@mui/icons-material/LocalOffer";
import FlashOn from "@mui/icons-material/FlashOn";
import Verified from "@mui/icons-material/Verified";
import Casino from "@mui/icons-material/Casino";
import Whatshot from "@mui/icons-material/Whatshot";
import Redeem from "@mui/icons-material/Redeem";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { API_PUBLIC, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { normalizeImageUrl } from "@/lib/image-url";
import { QueryPagination } from "@/components/QueryPagination";

type BonusItem = {
  id: string;
  title?: string | null;
  slug?: string | null;
  featureImg?: string | null;
  bonusAmt?: string | null;
  bonusValue?: string | null;
  shortDesc?: string | null;
  bonusType?: string | null;
  tag?: string | null;
  highlight?: string | null;
  iconKey?: string | null;
  features?: string[] | null;
  clientLink?: string | null;
};

const LIMIT = 8;
const TEASER_LIMIT = 4;
const ICON_BY_KEY: Record<string, SvgIconComponent> = {
  LocalFireDepartment,
  CardGiftcard,
  LocalOffer,
  FlashOn,
  Verified,
  Casino,
  Whatshot,
  Redeem,
};

function resolveBonusIcon(
  iconKey: string | null | undefined,
): SvgIconComponent | undefined {
  if (!iconKey) return undefined;
  const direct = ICON_BY_KEY[iconKey];
  if (direct) return direct;

  const normalized = iconKey.replace(/[^a-z]/gi, "").toLowerCase();
  if (!normalized) return undefined;

  const aliases: Record<string, keyof typeof ICON_BY_KEY> = {
    localfiredepartment: "LocalFireDepartment",
    cardgiftcard: "CardGiftcard",
    localoffer: "LocalOffer",
    flashon: "FlashOn",
    verified: "Verified",
    casino: "Casino",
    whatshot: "Whatshot",
    redeem: "Redeem",
  };
  const mapped = aliases[normalized];
  return mapped ? ICON_BY_KEY[mapped] : undefined;
}

function BonusCard({ item }: { item: BonusItem }) {
  const value = item.bonusAmt ?? item.bonusValue ?? "";
  const category = item.bonusType ?? item.tag ?? "BONUS";
  const title = item.title ?? "Casino Bonus";
  const feature =
    item.highlight?.trim() ||
    (Array.isArray(item.features) && item.features[0]
      ? item.features[0]
      : "Exclusive offer");
  const Icon = resolveBonusIcon(item.iconKey);
  const link = item.clientLink?.trim() || "";
  const src = normalizeImageUrl(item.featureImg) ?? null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 140,
          flexShrink: 0,
          bgcolor: "grey.900",
        }}
      >
        {src ? (
          <Box
            component="img"
            src={src}
            alt=""
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />
        ) : null}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 800,
              lineHeight: 1.2,
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            {value || "Bonus"}
          </Typography>
          {item.tag ? (
            <Box
              sx={{
                flexShrink: 0,
                bgcolor: "primary.main",
                color: "white",
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: "0.7rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {item.tag}
            </Box>
          ) : null}
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          pt: 2,
          pb: 2,
          bgcolor: "white",
          color: "grey.900",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "primary.main",
              mb: 0.5,
              textTransform: "uppercase",
              lineHeight: 1.3,
            }}
          >
            {category}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              mb: 1.5,
              fontSize: "1rem",
              lineHeight: 1.25,
              color: "grey.900",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Fills remaining height; keeps description top-aligned so CTAs line up across the row */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.5,
              fontSize: "0.875rem",
              lineHeight: 1.45,
              color: "grey.900",
            }}
          >
            {Icon ? (
              <Icon
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                  flexShrink: 0,
                  mt: "3px",
                }}
                aria-hidden
              />
            ) : (
              <Check
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                  flexShrink: 0,
                  mt: "3px",
                }}
                aria-hidden
              />
            )}
            <Box component="span" sx={{ minWidth: 0 }}>
              {feature}
            </Box>
          </Box>
        </Box>

        {link ? (
          <Button
            component="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ flexShrink: 0, fontWeight: 800, py: 1, mt: 2 }}
          >
            Claim Bonus →
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

type ExploreCasinoBonusesServerProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
  /** First-page preview: fixed count, no pagination, link to full /bonus listing */
  teaser?: boolean;
};

export async function ExploreCasinoBonusesServer({
  page = 1,
  limit,
  queryKey = "page",
  teaser = false,
}: ExploreCasinoBonusesServerProps = {}) {
  const effectiveLimit = limit ?? (teaser ? TEASER_LIMIT : LIMIT);
  const fetchPage = teaser ? 1 : page;

  let items: BonusItem[] = [];
  let totalPages = 1;
  try {
    const res = await fetch(
      `${API_PUBLIC}/bonuses?page=${fetchPage}&limit=${effectiveLimit}`,
      {
        next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
      },
    );
    const json = await res.json().catch(() => null);
    const root = (json?.data ?? json) as {
      items?: BonusItem[];
      totalPages?: number;
    } | null;
    items = Array.isArray(root?.items) ? root!.items : [];
    totalPages = Number(root?.totalPages ?? 1) || 1;
  } catch {
    items = [];
    totalPages = 1;
  }
  const safePage = Math.min(Math.max(fetchPage, 1), Math.max(totalPages, 1));

  const headerIntro = (
    <>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          bgcolor: "primary.main",
          color: "white",
          px: 1.5,
          py: 0.5,
          borderRadius: 3,
          fontSize: "0.7rem",
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        <Diamond sx={{ fontSize: 16 }} />
        PREMIUM OFFERS
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color: "white", mb: 0.5 }}
      >
        Explore{" "}
        <Box component="span" sx={{ color: "primary.main" }}>
          Casino Bonuses
        </Box>
      </Typography>
      <Typography
        sx={{ color: "grey.400", maxWidth: 560, mx: teaser ? 0 : "auto" }}
      >
        Unlock exclusive rewards and maximize your winnings with our handpicked
        bonus offers
      </Typography>
    </>
  );

  return (
    <Box
      id="bonuses"
      component="section"
      sx={{
        py: 6,
        px: 2,
        background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto", position: "relative", zIndex: 1 }}>
        {teaser ? (
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
            <Box sx={{ flex: "1 1 240px", minWidth: 0 }}>{headerIntro}</Box>
            <Button
              component="a"
              href={`${SITE_URL}/bonus`}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                fontWeight: 600,
                "&:hover": { bgcolor: "primary.dark" },
              }}
              endIcon={<ArrowForward />}
            >
              View All Bonuses
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mb: 4 }}>{headerIntro}</Box>
        )}

        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "grid",
              alignItems: "stretch",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1.5, sm: 2, md: 2 },
              px: { xs: 0, md: 1 },
            }}
          >
            {items.length ? (
              items.map((item) => <BonusCard key={item.id} item={item} />)
            ) : (
              <Typography sx={{ color: "grey.400", px: 1 }}>
                No bonus offers found right now.
              </Typography>
            )}
          </Box>
        </Box>
        {!teaser ? (
          <QueryPagination
            page={safePage}
            totalPages={totalPages}
            queryKey={queryKey}
          />
        ) : null}
      </Box>
    </Box>
  );
}

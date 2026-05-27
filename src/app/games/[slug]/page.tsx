import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack, Chip, Divider } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import OpenInNew from "@mui/icons-material/OpenInNew";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Casino from "@mui/icons-material/Casino";
import Apartment from "@mui/icons-material/Apartment";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/image-url";
import { JsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { TiptapHtmlServer } from "@/components/TiptapHtmlServer";
import { contentToMetadata, type ContentRecord } from "@/lib/seo";
import {
  CasinoGamesSection,
  type CasinoPageGame,
} from "@/app/casinos/[slug]/CasinoGamesSection";
import {
  CASINO_RED,
  CASINO_RED_HOVER,
  PAGE_BG,
  TEXT_PRIMARY,
  CARD_RADIUS,
  CARD_SHADOW,
} from "@/app/casinos/[slug]/casino-detail-tokens";
import {
  parseGameDetailResponse,
  parseGameListResponse,
  type GameCardItem,
  type GameDetailRecord,
} from "./gameDetailFetch";
import { generateGamesCardSchema } from "@/lib/schema/gamesListSchema";

function imgSrc(url: string | null | undefined) {
  return normalizeImageUrl(url);
}

function mapCardToCasinoGame(x: GameCardItem): CasinoPageGame {
  return {
    id: x.id,
    title: x.title,
    slug: x.slug,
    featureImg: x.featureImg ?? null,
    tag: x.tag ?? null,
    gameProvider: x.gameProvider ?? null,
    rtp: x.rtp ?? null,
    volatility: x.volatility ?? null,
    category: x.category ?? null,
  };
}

async function getGame(slug: string): Promise<GameDetailRecord | null> {
  const res = await fetch(ENDPOINTS.game(slug), {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return parseGameDetailResponse(json);
}

async function getCasinoNameBySlug(slug: string): Promise<string | null> {
  const res = await fetch(ENDPOINTS.casino(slug), {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });

  if (!res.ok) return null;

  const json = await res.json();
  const root = (json?.data ?? json) as {
    casinoName?: string;
    name?: string;
  } | null;
  return (root?.casinoName ?? root?.name ?? null) as string | null;
}

async function resolveCasinoSlugByName(name: string): Promise<string | null> {
  const res = await fetch(ENDPOINTS.casinos, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const root = (json?.data ?? json) as
    | { items?: unknown; casinos?: unknown; results?: unknown }
    | unknown;
  if (!root || typeof root !== "object") return null;
  const list =
    (root as { items?: unknown; casinos?: unknown; results?: unknown }).items ??
    (root as { items?: unknown; casinos?: unknown; results?: unknown })
      .casinos ??
    (root as { items?: unknown; casinos?: unknown; results?: unknown }).results;
  if (!Array.isArray(list)) return null;
  const target = name.trim().toLowerCase();
  const match = list.find((x) => {
    if (!x || typeof x !== "object") return false;
    const r = x as { casinoName?: string; name?: string };
    const n = (r.casinoName ?? r.name ?? "").trim().toLowerCase();
    return n === target;
  }) as { slug?: string } | undefined;
  return match?.slug?.trim() || null;
}

async function getRelatedGames(
  game: GameDetailRecord,
): Promise<{ casinoName: string | null; items: CasinoPageGame[] }> {
  let casinoSlug = game.casinoRef.slug;
  let casinoName = game.casinoRef.name;

  if (!casinoSlug && casinoName) {
    casinoSlug = await resolveCasinoSlugByName(casinoName);
  }

  if (casinoSlug) {
    const res = await fetch(
      ENDPOINTS.casinoGames(casinoSlug, {
        page: 1,
        limit: 12,
        excludeSlug: game.slug,
        excludeId: game.id,
      }),
      { next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS } },
    );
    if (res.ok) {
      const json = await res.json();
      const list = parseGameListResponse(json).filter(
        (x) => x.slug !== game.slug && x.id !== game.id,
      );
      if (!casinoName) casinoName = await getCasinoNameBySlug(casinoSlug);
      return { casinoName, items: list.map(mapCardToCasinoGame) };
    }
  }

  // Fallback when game does not expose a casino relation in API.
  const fallbackRes = await fetch(`${ENDPOINTS.games}?page=1&limit=12`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!fallbackRes.ok) return { casinoName, items: [] };
  const fallbackJson = await fallbackRes.json();
  const fallbackItems = parseGameListResponse(fallbackJson).filter(
    (x) => x.slug !== game.slug && x.id !== game.id,
  );
  return { casinoName, items: fallbackItems.map(mapCardToCasinoGame) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Game | TheOceanGame" };
  return contentToMetadata(
    {
      slug: game.slug,
      title: game.title,
      seoTitle: game.seoTitle,
      seoDesc: game.seoDesc,
      shortDesc: game.shortDesc,
      featureImg: game.featureImg,
    },
    { routeBase: "games", isArticle: false },
  );
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const hero = "/hero.webp";
  const cover = imgSrc(game.featureImg);
  const provider = (game.gameProvider ?? [])[0] ?? null;
  const record: ContentRecord = {
    slug: game.slug,
    title: game.title,
    seoTitle: game.seoTitle,
    seoDesc: game.seoDesc,
    shortDesc: game.shortDesc,
    featureImg: game.featureImg ?? null,
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Games", url: "/games" },
    { name: game.title, url: `/games/${game.slug}` },
  ];

  const { casinoName, items: relatedGames } = await getRelatedGames(game);
  const relatedTitle = casinoName?.trim() || "Related Games";
  const playHref = game.clientLink?.trim() || "";

  const gamesCardSchema = generateGamesCardSchema(
    relatedGames.map((game) => ({
      title: game.title,
      slug: game.slug,
      featureImg: game.featureImg,
      tag: game.tag,
      gameProvider: game.gameProvider,
    })),
  );
  return (
    <>
      <JsonLd record={record} routeBase="games" schemaType="WebPage" />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gamesCardSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Box component="article" sx={{ bgcolor: PAGE_BG, minHeight: "100%" }}>
        <Box
          sx={{
            position: "relative",
            height: { xs: 250, sm: 280, md: 320 },
            width: "100%",
            overflow: "hidden",
            mt: { xs: "-56px", md: "-64px" },
            pt: { xs: "56px", md: "64px" },
          }}
        >
          <Image
            src={hero}
            alt=""
            fill
            priority
            // sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.04)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              maxWidth: 1200,
              mx: "auto",
              px: { xs: 2, md: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              pb: { xs: 6, sm: 7, md: 8 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                padding: 1,
              }}
            >
              <Link
                href="/games"
                style={{ textDecoration: "none", display: "inline-flex" }}
              >
                <Button
                  variant="contained"
                  startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "white",
                    fontWeight: 700,
                    textTransform: "none",
                    px: 2.25,
                    py: 1,
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  }}
                >
                  All Games
                </Button>
              </Link>
              <BreadcrumbNav items={breadcrumbItems} variant="overlay" />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 2, md: 3 },
            pb: { xs: 5, md: 7 },
            pt: 0,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box
              sx={{
                mt: { xs: -6, sm: -7, md: -8 },
                bgcolor: "#fff",
                borderRadius: `${CARD_RADIUS}px`,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: CARD_SHADOW,
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    {cover && (
                      <Box
                        sx={{
                          width: { xs: 92, md: 112 },
                          height: { xs: 92, md: 112 },
                          borderRadius: "16px",
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={cover}
                          alt={game.title}
                          fill
                          // sizes="112px"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="div"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: "1.45rem", md: "2rem" },
                          color: TEXT_PRIMARY,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                          mb: 1,
                        }}
                      >
                        {game.title}
                      </Typography>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ mb: 1.25 }}
                      >
                        {game.tag && (
                          <Chip
                            size="small"
                            label={game.tag}
                            sx={{
                              bgcolor: "rgba(229,57,53,0.12)",
                              color: CASINO_RED,
                              fontWeight: 700,
                            }}
                          />
                        )}
                        {provider && (
                          <Chip
                            size="small"
                            icon={<Apartment sx={{ fontSize: 16 }} />}
                            label={provider}
                            sx={{
                              bgcolor: "rgba(0,0,0,0.05)",
                              color: TEXT_PRIMARY,
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {casinoName && (
                          <Chip
                            size="small"
                            icon={<Casino sx={{ fontSize: 16 }} />}
                            label={casinoName}
                            sx={{
                              bgcolor: "#e8f5e9",
                              color: "#1b5e20",
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>

                  {playHref ? (
                    <Stack sx={{ width: { xs: "100%", md: 260 } }}>
                      <Button
                        component="a"
                        href={playHref}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        variant="contained"
                        fullWidth
                        disableElevation
                        endIcon={<ArrowForward />}
                        sx={{
                          bgcolor: CASINO_RED,
                          color: "#fff",
                          fontWeight: 800,
                          py: 1.7,
                          fontSize: "1rem",
                          borderRadius: "14px",
                          textTransform: "none",
                          boxShadow: "0 8px 24px rgba(229, 57, 53, 0.4)",
                          "&:hover": { bgcolor: CASINO_RED_HOVER },
                        }}
                      >
                        Play Game
                      </Button>
                    </Stack>
                  ) : null}
                </Stack>

                {game.shortDesc && (
                  <>
                    <Divider sx={{ my: { xs: 3, md: 4 } }} />
                    <Typography
                      sx={{
                        color: TEXT_PRIMARY,
                        fontSize: { xs: "1.03rem", md: "1.1rem" },
                        lineHeight: 1.75,
                        fontWeight: 500,
                      }}
                    >
                      {game.shortDesc}
                    </Typography>
                  </>
                )}

                {game.content && (
                  <>
                    <Divider sx={{ my: { xs: 3, md: 4 } }} />
                    <Box
                      sx={{
                        "& .tiptap-viewer .ProseMirror": {
                          color: TEXT_PRIMARY,
                          fontSize: "1rem",
                          lineHeight: 1.8,
                        },
                        "& .tiptap-viewer .ProseMirror p:first-of-type": {
                          mt: 0,
                        },
                        "& .tiptap-viewer .ProseMirror p:last-of-type": {
                          mb: 0,
                        },
                      }}
                    >
                      <TiptapHtmlServer content={game.content} />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <CasinoGamesSection casinoName={relatedTitle} games={relatedGames} />
      </Box>
    </>
  );
}

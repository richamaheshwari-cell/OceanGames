import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Rating,
} from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Check from "@mui/icons-material/Check";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Schedule from "@mui/icons-material/Schedule";
import Casino from "@mui/icons-material/Casino";
import {
  CASINO_RED,
  CASINO_RED_HOVER,
  PAGE_BG,
  TEXT_PRIMARY,
  CARD_RADIUS,
  CARD_SHADOW,
} from "./casino-detail-tokens";
import { API_BASE, ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import { TiptapHtmlServer } from "@/components/TiptapHtmlServer";
import { tiptapJsonToHtml } from "@/lib/tiptap-server";
import { JsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { contentToMetadata, getTitle, type ContentRecord } from "@/lib/seo";
import { CasinoGamesSection, type CasinoPageGame } from "./CasinoGamesSection";
import { parseCasinoGamesResponse } from "./casinoGamesFetch";
import {
  CasinoRatingBreakdown,
  type RatingBreakdownRow,
} from "./CasinoRatingBreakdown";

/** Public casino detail — only render optional UI when fields exist */
type CasinoDetail = {
  id: string;
  casinoName: string;
  slug: string;
  featureImg?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  shortDesc?: string | null;
  content?: object | string | null;
  clientLink?: string | null;
  bonusAmt?: string | null;
  bonusSubtitle?: string | null;
  bonusDetails?: string[] | null;
  totalGames?: number | null;
  tags?: string[] | null;
  payoutSpeed?: string | null;
  licensed?: boolean | null;
  licenseLabel?: string | null;
  establishedYear?: string | null;
  minDeposit?: string | null;
  softwareProviders?: string[] | null;
  ratingBreakdown?: RatingBreakdownRow[] | null;
  categoryRatings?: Array<{
    category?: string;
    name?: string;
    rating?: string;
    score?: string;
  }> | null;
};

function imgSrc(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function getRatingBreakdownRows(c: CasinoDetail): RatingBreakdownRow[] {
  if (Array.isArray(c.ratingBreakdown) && c.ratingBreakdown.length > 0) {
    return c.ratingBreakdown
      .map((r) => ({
        category: String(r.category ?? "").trim(),
        rating: String(r.rating ?? "").trim(),
      }))
      .filter((row) => row.category && row.rating);
  }
  const raw = c.categoryRatings;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({
      category: String(r.category ?? r.name ?? "").trim(),
      rating: String(r.rating ?? r.score ?? "").trim(),
    }))
    .filter((row) => row.category && row.rating);
}

async function getCasino(slug: string): Promise<CasinoDetail | null> {
  const res = await fetch(ENDPOINTS.casino(slug), {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? json) as CasinoDetail;
}

async function getCasinoGames(slug: string): Promise<CasinoPageGame[]> {
  const res = await fetch(ENDPOINTS.casinoGames(slug, { page: 1, limit: 24 }), {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return parseCasinoGamesResponse(json);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) return { title: "Casino | TheOceanGame" };
  return contentToMetadata(
    {
      slug: casino.slug,
      title: casino.casinoName,
      name: casino.casinoName,
      seoTitle: casino.seoTitle,
      seoDesc: casino.seoDesc,
      featureImg: casino.featureImg,
    },
    { routeBase: "casinos", isArticle: false },
  );
}

export default async function CasinoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [casino, games] = await Promise.all([
    getCasino(slug),
    getCasinoGames(slug),
  ]);
  if (!casino) notFound();

  const title = getTitle({
    seoTitle: casino.seoTitle,
    title: casino.casinoName,
    name: casino.casinoName,
  });
  const logo = imgSrc(casino.featureImg);
  const heroBackgroundSrc = "/hero.webp";
  const path = `/casinos/${casino.slug}`;
  const visit = casino.clientLink?.trim();
  const rating = Math.min(5, Math.max(0, casino.rating ?? 0));
  const bodyHtml = tiptapJsonToHtml(casino.content);
  const showBody = bodyHtml.trim().length > 0;

  const record: ContentRecord = {
    slug: casino.slug,
    title: casino.casinoName,
    name: casino.casinoName,
    seoTitle: casino.seoTitle,
    seoDesc: casino.seoDesc,
    featureImg: casino.featureImg,
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Casinos", url: "/casinos" },
    { name: title, url: path },
  ];

  type StatStrip = {
    key: string;
    value: string;
    label: string;
    sub?: string;
    icon: ReactNode;
    highlight?: boolean;
  };
  const statsStrip: StatStrip[] = [];
  if (casino.bonusAmt) {
    statsStrip.push({
      key: "bonus",
      value: casino.bonusAmt,
      label: "Bonus",
      sub: casino.bonusSubtitle ?? undefined,
      icon: <CardGiftcard sx={{ fontSize: 22, opacity: 0.9 }} />,
      highlight: true,
    });
  }
  if (casino.totalGames != null && casino.totalGames > 0) {
    statsStrip.push({
      key: "games",
      value: `${casino.totalGames.toLocaleString()}+`,
      label: "Total Games",
      icon: <Casino sx={{ fontSize: 22, opacity: 0.9 }} />,
    });
  }
  if (casino.payoutSpeed?.trim()) {
    statsStrip.push({
      key: "payout",
      value: casino.payoutSpeed.trim(),
      label: "Payout Speed",
      icon: <Schedule sx={{ fontSize: 22, opacity: 0.9 }} />,
    });
  }

  const quickMeta: { k: string; v: string }[] = [];
  if (casino.establishedYear?.trim()) {
    quickMeta.push({ k: "Est.", v: casino.establishedYear.trim() });
  }
  if (casino.minDeposit?.trim()) {
    quickMeta.push({ k: "Min. deposit", v: casino.minDeposit.trim() });
  }

  const showLicensedChip =
    casino.licensed === true || Boolean(casino.licenseLabel?.trim());
  const tags = (casino.tags ?? []).filter(Boolean);
  const providers = (casino.softwareProviders ?? []).filter(Boolean);
  const ratingBreakdownRows = getRatingBreakdownRows(casino);
  const bonusDetails = (casino.bonusDetails ?? [])
    .map((detail) => String(detail ?? "").trim())
    .filter(Boolean);
  const hasBonusDetails =
    Boolean(casino.bonusAmt?.trim()) ||
    Boolean(casino.bonusSubtitle?.trim()) ||
    bonusDetails.length > 0;

  return (
    <>
      <JsonLd record={record} routeBase="casinos" schemaType="WebPage" />
      <BreadcrumbJsonLd items={breadcrumbItems} />

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
          <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Image
              src={heroBackgroundSrc}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                transform: "scale(1.04)",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.78) 100%)",
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
                p: 1,
              }}
            >
              <Link
                href="/casinos"
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
                  All Casinos
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
                bgcolor: "#ffffff",
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
                  alignItems={{ md: "flex-start" }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    {logo && (
                      <Box
                        sx={{
                          width: { xs: 88, sm: 96, md: 112 },
                          height: { xs: 88, sm: 96, md: 112 },
                          borderRadius: "18px",
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: "grey.100",
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={logo}
                          alt=""
                          fill
                          sizes="112px"
                          fetchPriority="low"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            fontWeight: 800,
                            fontSize: {
                              xs: "1.45rem",
                              sm: "1.65rem",
                              md: "2rem",
                            },
                            color: TEXT_PRIMARY,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                          }}
                        >
                          {casino.casinoName}
                        </Typography>
                        {showLicensedChip && (
                          <Chip
                            size="small"
                            icon={
                              <Check sx={{ color: "#2e7d32 !important" }} />
                            }
                            label={
                              casino.licenseLabel?.trim()
                                ? `Licensed (${casino.licenseLabel.trim()})`
                                : "Licensed"
                            }
                            sx={{
                              bgcolor: "#e8f5e9",
                              color: "#1b5e20",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          />
                        )}
                      </Stack>

                      {rating > 0 && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mb: 1 }}
                        >
                          <Rating
                            value={rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ color: "#facc15" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {rating.toFixed(1)}
                            {casino.reviewCount != null &&
                            casino.reviewCount > 0
                              ? ` (${casino.reviewCount.toLocaleString()} reviews)`
                              : ""}
                          </Typography>
                        </Stack>
                      )}

                      {casino.payoutSpeed?.trim() && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                          sx={{
                            mb: 1.5,
                            color: "text.secondary",
                            fontSize: "0.875rem",
                          }}
                        >
                          <Schedule
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            <Box
                              component="span"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              Payout:
                            </Box>{" "}
                            {casino.payoutSpeed.trim()}
                          </Typography>
                        </Stack>
                      )}

                      {quickMeta.length > 0 && (
                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={{ xs: 1, md: 2 }}
                          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                        >
                          {quickMeta.map(({ k, v }) => (
                            <Typography key={k + v} component="span">
                              <Box
                                component="span"
                                sx={{ fontWeight: 600, color: "text.primary" }}
                              >
                                {k}:
                              </Box>{" "}
                              {v}
                            </Typography>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Stack>

                  {visit ? (
                    <Stack
                      spacing={1.5}
                      sx={{ width: { xs: "100%", md: 280 }, flexShrink: 0 }}
                    >
                      <Button
                        component="a"
                        href={visit}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        variant="contained"
                        size="large"
                        fullWidth
                        disableElevation
                        startIcon={<OpenInNew />}
                        sx={{
                          bgcolor: CASINO_RED,
                          color: "#fff",
                          fontWeight: 800,
                          py: 1.75,
                          fontSize: "1rem",
                          borderRadius: "14px",
                          textTransform: "none",
                          boxShadow: "0 8px 24px rgba(229, 57, 53, 0.4)",
                          "&:hover": {
                            bgcolor: CASINO_RED_HOVER,
                            boxShadow: "0 10px 28px rgba(198, 40, 40, 0.45)",
                          },
                        }}
                      >
                        Visit Casino
                      </Button>
                      {casino.bonusAmt ? (
                        <Button
                          component="a"
                          href={visit}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          variant="contained"
                          size="large"
                          fullWidth
                          disableElevation
                          startIcon={<CardGiftcard />}
                          sx={{
                            background: `linear-gradient(180deg, ${CASINO_RED} 0%, ${CASINO_RED_HOVER} 100%)`,
                            color: "white",
                            fontWeight: 800,
                            py: 1.5,
                            borderRadius: "14px",
                            textTransform: "none",
                            boxShadow: "0 4px 16px rgba(229, 57, 53, 0.3)",
                            "&:hover": {
                              background: CASINO_RED_HOVER,
                              boxShadow: "0 6px 20px rgba(229, 57, 53, 0.4)",
                            },
                          }}
                        >
                          Claim {casino.bonusAmt}
                        </Button>
                      ) : null}
                    </Stack>
                  ) : null}
                </Stack>

                {statsStrip.length > 0 && (
                  <>
                    <Divider
                      sx={{
                        mt: { xs: 3, md: 4 },
                        mb: { xs: 2.5, md: 3 },
                        borderColor: "rgba(17,17,17,0.06)",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2.5, sm: 0 },
                        alignItems: "stretch",
                      }}
                    >
                      {statsStrip.map((s) => (
                        <Box
                          key={s.key}
                          sx={{
                            flex: { sm: "1 1 0" },
                            minWidth: 0,
                            px: { xs: 0, sm: 2 },
                            py: { xs: 0.25, sm: 0.5 },
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: s.highlight ? CASINO_RED : TEXT_PRIMARY,
                              fontWeight: 800,
                              fontSize: { xs: "1.45rem", md: "1.7rem" },
                              lineHeight: 1.15,
                            }}
                          >
                            {s.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.25,
                              fontSize: "0.72rem",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {s.label}
                          </Typography>
                          {s.sub && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                mt: 0.25,
                                lineHeight: 1.25,
                                fontSize: "0.72rem",
                              }}
                            >
                              {s.sub}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </>
                )}

                {hasBonusDetails && (
                  <>
                    <Divider
                      sx={{
                        mt: { xs: 2.5, md: 3 },
                        mb: { xs: 1.5, md: 2 },
                        borderColor: "rgba(17,17,17,0.06)",
                      }}
                    />
                    <Box
                      sx={{
                        border: "1px solid rgba(229, 57, 53, 0.2)",
                        bgcolor: "rgba(229, 57, 53, 0.04)",
                        borderRadius: "14px",
                        p: { xs: 1.5, md: 2 },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <CardGiftcard
                          sx={{ color: CASINO_RED, fontSize: 18 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ color: TEXT_PRIMARY, fontWeight: 800 }}
                        >
                          Bonus details
                        </Typography>
                      </Stack>
                      <Stack spacing={0.75}>
                        {casino.bonusAmt?.trim() && (
                          <Typography
                            variant="body2"
                            sx={{ color: TEXT_PRIMARY, lineHeight: 1.55 }}
                          >
                            <Box
                              component="span"
                              sx={{ color: CASINO_RED, fontWeight: 700 }}
                            >
                              Offer:
                            </Box>{" "}
                            {casino.bonusAmt.trim()}
                          </Typography>
                        )}
                        {casino.bonusSubtitle?.trim() && (
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", lineHeight: 1.55 }}
                          >
                            {casino.bonusSubtitle.trim()}
                          </Typography>
                        )}
                        {bonusDetails.map((detail) => (
                          <Stack
                            key={detail}
                            direction="row"
                            spacing={0.75}
                            alignItems="flex-start"
                          >
                            <Check
                              sx={{
                                color: CASINO_RED,
                                fontSize: 16,
                                mt: "2px",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: TEXT_PRIMARY, lineHeight: 1.5 }}
                            >
                              {detail}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                {(casino.shortDesc?.trim() || showBody) && (
                  <>
                    <Divider
                      sx={{
                        mt: { xs: 2.5, md: 3 },
                        mb: { xs: 1.25, md: 1.5 },
                        borderColor: "rgba(17,17,17,0.06)",
                      }}
                    />
                    {casino.shortDesc?.trim() && (
                      <Typography
                        sx={{
                          color: TEXT_PRIMARY,
                          fontSize: { xs: "1.05rem", md: "1.1rem" },
                          lineHeight: 1.75,
                          fontWeight: 500,
                          mb: showBody ? 2.5 : 0,
                        }}
                      >
                        {casino.shortDesc.trim()}
                      </Typography>
                    )}
                    {showBody && (
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
                        <TiptapHtmlServer content={casino.content} />
                      </Box>
                    )}
                  </>
                )}

                {tags.length > 0 && (
                  <>
                    <Divider sx={{ my: { xs: 3, md: 4 } }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 800,
                        color: "text.secondary",
                        letterSpacing: "0.12em",
                        display: "block",
                        mb: 2,
                      }}
                    >
                      Features
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1.25}>
                      {tags.map((t) => (
                        <Chip
                          key={t}
                          variant="outlined"
                          icon={
                            <Check
                              sx={{
                                fontSize: 18,
                                color: `${CASINO_RED} !important`,
                              }}
                            />
                          }
                          label={t}
                          sx={{
                            borderColor: "rgba(0,0,0,0.12)",
                            bgcolor: "#fff",
                            color: TEXT_PRIMARY,
                            fontWeight: 600,
                            py: 2.5,
                            borderRadius: "999px",
                            "& .MuiChip-icon": { ml: 0.5 },
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {ratingBreakdownRows.length > 0 && (
                  <>
                    <Divider sx={{ my: { xs: 3, md: 4 } }} />
                    <CasinoRatingBreakdown rows={ratingBreakdownRows} />
                  </>
                )}

                {providers.length > 0 && (
                  <>
                    <Divider sx={{ my: { xs: 3, md: 4 } }} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 800,
                        color: "text.secondary",
                        letterSpacing: "0.12em",
                        display: "block",
                        mb: 2,
                      }}
                    >
                      Software providers
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1.25}>
                      {providers.map((p) => (
                        <Chip
                          key={p}
                          size="medium"
                          label={p}
                          sx={{
                            bgcolor: "rgba(0,0,0,0.04)",
                            border: "1px solid rgba(0,0,0,0.08)",
                            fontWeight: 600,
                            borderRadius: "12px",
                          }}
                        />
                      ))}
                    </Stack>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <CasinoGamesSection casinoName={casino.casinoName} games={games} />
      </Box>
    </>
  );
}

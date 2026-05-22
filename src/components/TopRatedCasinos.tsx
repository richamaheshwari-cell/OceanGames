import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { ENDPOINTS, SEO_CACHE_REVALIDATE_SECONDS } from "@/lib/api";
import {
  CasinoListingCardServer,
  type CasinoItem,
} from "@/components/CasinoListingCardServer";
import { QueryPagination } from "@/components/QueryPagination";
import { Suspense } from "react";
import { generateCasinoListSchema } from "@/lib/schema/casinoListSchema";
import { JsonLdScript } from "./JsonLd";

export type { CasinoItem };

const casinosFetcher = async (page: number, limit: number) => {
  const res = await fetch(`${ENDPOINTS.casinos}?page=${page}&limit=${limit}`, {
    next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS },
  });
  if (!res.ok) return { items: [], totalPages: 1 };
  const json = await res.json();
  const data = json.data ?? json;
  return {
    items: Array.isArray(data.items) ? data.items : [],
    totalPages: Number(data.totalPages ?? 1) || 1,
  };
};

type TopRatedCasinosProps = {
  page?: number;
  limit?: number;
  queryKey?: string;
  showPagination?: boolean;
  /** Home: one row of cards, no pagination, “See more” → /casinos */
  variant?: "default" | "home";
};

export async function TopRatedCasinos({
  page = 1,
  limit = 12,
  queryKey = "page",
  showPagination = false,
  variant = "default",
}: TopRatedCasinosProps = {}) {
  const resolvedLimit = variant === "home" ? 4 : limit;
  const isHome = variant === "home";

  const { items, totalPages } = (await casinosFetcher(page, resolvedLimit)) as {
    items: CasinoItem[];
    totalPages: number;
  };
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  return (
    <>
    <JsonLdScript data={generateCasinoListSchema(items)} />
    <Box
      component="section"
      id="casino"
      sx={{ py: 6, px: 3, bgcolor: "background.paper" }}
    >
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
              sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
            >
              Top Rated{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Casinos
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Handpicked casinos with the best ratings and player reviews
            </Typography>
          </Box>
        </Box>

        {items.length > 0 ? (
          <Box
            sx={
              isHome
                ? {
                    display: "grid",
                    alignItems: "stretch",
                    gridTemplateColumns: {
                      xs: `repeat(4, minmax(260px, ${300}px))`,
                      lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2,
                    width: "100%",
                    overflowX: { xs: "auto", lg: "visible" },
                    overflowY: "hidden",
                    pb: 1,
                    WebkitOverflowScrolling: "touch",
                  }
                : {
                    display: "grid",
                    alignItems: "stretch",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "repeat(4, 1fr)",
                      xl: "repeat(4, 1fr)",
                    },
                    justifyItems: "center",
                  }
            }
          >
            {items.map((casino) => (
              <CasinoListingCardServer
                key={casino.id}
                casino={casino}
                variant={isHome ? "home" : "default"}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No casinos available right now.
          </Typography>
        )}

        {showPagination && !isHome ? (
          <Suspense fallback={null}>
            <QueryPagination
              page={safePage}
              totalPages={totalPages}
              queryKey={queryKey}
            />
          </Suspense>
        ) : null}

        {isHome && items.length > 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Link href="/casinos" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "grey.900",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "primary.main" },
                }}
              >
                See more
              </Button>
            </Link>
          </Box>
        ) : null}
      </Box>
    </Box>
    </>
  );
}

import { Box, Typography } from "@mui/material";

export type RatingBreakdownRow = {
  category: string;
  rating: string;
};

/** Parse API rating string → 0–100 for progress bar */
function ratingToPercent(rating: string): number {
  const s = rating.trim();
  const slash = s.match(/^(\d+\.?\d*)\s*\/\s*5$/i);
  if (slash) return Math.min(100, (parseFloat(slash[1]) / 5) * 100);
  const slash10 = s.match(/^(\d+\.?\d*)\s*\/\s*10$/i);
  if (slash10) return Math.min(100, (parseFloat(slash10[1]) / 10) * 100);
  const num = parseFloat(s.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num)) return 72;
  if (num <= 5) return Math.min(100, (num / 5) * 100);
  if (num <= 10) return Math.min(100, (num / 10) * 100);
  return Math.min(100, num);
}

/**
 * Premium rating rows — category + rounded progress bar + value (no plain table).
 */
export function CasinoRatingBreakdown({ rows }: { rows: RatingBreakdownRow[] }) {
  if (!rows.length) return null;

  return (
    <Box component="section" aria-label="Rating breakdown">
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "text.secondary",
          mb: 2.5,
          textTransform: "uppercase",
        }}
      >
        Rating breakdown
      </Typography>
      <StackedRows rows={rows} />
    </Box>
  );
}

function StackedRows({ rows }: { rows: RatingBreakdownRow[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {rows.map((row, index) => {
        const pct = ratingToPercent(row.rating);
        return (
          <Box
            key={`${row.category}-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              py: 2,
              borderBottom: index < rows.length - 1 ? "1px solid" : "none",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              sx={{
                minWidth: { xs: 100, sm: 160 },
                maxWidth: { xs: "40%", sm: "none" },
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "text.primary",
              }}
            >
              {row.category}
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bgcolor: "rgba(0,0,0,0.06)",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #ffb300 0%, #ff8f00 55%, #f57c00 100%)",
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
            <Typography
              sx={{
                minWidth: 52,
                textAlign: "right",
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "text.primary",
              }}
            >
              {row.rating}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

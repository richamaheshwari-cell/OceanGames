import React from "react";
import { Box, Typography } from "@mui/material";

interface AuthorStatsProps {
  stats: Record<string, number>;
  labels?: string[];
}

export const AuthorStats: React.FC<AuthorStatsProps> = ({ stats, labels }) => {
  const keys = labels || Object.keys(stats);
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, flexShrink: 0 }}>
      {keys.map((label) => (
        <Box key={label} sx={{ textAlign: "center", minWidth: 80 }}>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {stats[label] ?? 0}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

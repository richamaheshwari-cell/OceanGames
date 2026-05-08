"use client";

import { Box, LinearProgress } from "@mui/material";

export function PageLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <LinearProgress
        color="primary"
        sx={{
          height: 3,
          "& .MuiLinearProgress-bar": {
            animationDuration: "1.5s",
          },
        }}
      />
    </Box>
  );
}

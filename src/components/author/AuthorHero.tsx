import React from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

interface AuthorHeroProps {
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  email?: string | null;
}

export const AuthorHero: React.FC<AuthorHeroProps> = ({
  name,
  avatarUrl,
  bio,
  email,
}) => {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 280, md: 320 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #8b1538 0%, #5c0e25 50%, #1a0a0f 100%)",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
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
          AUTHOR PROFILE
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "white",
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

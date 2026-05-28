import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { normalizeImageUrl } from "@/lib/image-url";

interface AuthorSectionGridProps {
  title: string;
  items: any[];
  hrefPrefix: string;
}

export const AuthorSectionGrid: React.FC<AuthorSectionGridProps> = ({
  title,
  items,
  hrefPrefix,
}) => {
  if (!items?.length) return null;
  return (
    <Box sx={{ mt: 6 }}>
      <Typography
        variant="h3"
        sx={{ fontSize: "2rem", fontWeight: 800, mb: 3 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4,1fr)",
          },
          gap: 3,
        }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${hrefPrefix}/${item.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
                transition: ".2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <Box sx={{ height: 220, position: "relative" }}>
                <img
                  src={normalizeImageUrl(item.featureImg) || ""}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: ".95rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.shortDesc}
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

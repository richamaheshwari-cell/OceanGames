/**
 * Visible breadcrumb navigation. Use alongside BreadcrumbJsonLd for consistency.
 */

import Link from "next/link";
import { Box } from "@mui/material";

export interface BreadcrumbNavItem {
  name: string;
  url: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[];
  /** `overlay` = light text on dark hero (no paper background) */
  variant?: "default" | "overlay";
}

export function BreadcrumbNav({ items, variant = "default" }: BreadcrumbNavProps) {
  if (!items.length) return null;

  const isOverlay = variant === "overlay";

  return (
    <Box
      sx={{
        px: isOverlay ? 0 : 2,
        py: isOverlay ? 0 : 1.5,
        bgcolor: isOverlay ? "transparent" : "background.paper",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          fontSize: "0.875rem",
          color: isOverlay ? "rgba(255,255,255,0.7)" : "text.secondary",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.5,
          minWidth: 0,
        }}
      >
        {items.map((item, i) => (
          <span key={item.url + item.name}>
            {i > 0 && (
              <Box component="span" sx={{ mr: 0.5, color: isOverlay ? "rgba(255,255,255,0.5)" : "text.disabled" }}>
                /
              </Box>
            )}
            {i === items.length - 1 ? (
              <Box
                component="span"
                sx={{
                  color: isOverlay ? "white" : "text.primary",
                  wordBreak: "break-word",
                  fontWeight: isOverlay ? 500 : 400,
                }}
              >
                {item.name}
              </Box>
            ) : (
              <Link
                href={item.url}
                style={{
                  color: isOverlay ? "rgba(255,255,255,0.9)" : "inherit",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </Link>
            )}
          </span>
        ))}
      </Box>
    </Box>
  );
}

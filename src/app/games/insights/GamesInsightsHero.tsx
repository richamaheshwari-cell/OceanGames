import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

const BREADCRUMBS = [
  { name: "Home", url: "/" },
  { name: "Games", url: "/games" },
  { name: "Games Insights", url: "/games/insights" },
];

export function GamesInsightsHero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 320, md: 350 },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        mt: { xs: "-56px", md: "-64px" },
        pt: { xs: "56px", md: "64px" },
      }}
    >
      <Image
        src="/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
        // unoptimized
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 4, md: 5 },
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <BreadcrumbNav items={BREADCRUMBS} variant="overlay" />
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 800,
            color: "white",
            mb: 1,
          }}
        >
          Games{" "}
          <Box component="span" sx={{ color: "#e57373" }}>
            Insights
          </Box>
        </Typography>
        <Typography sx={{ color: "grey.300", maxWidth: 640 }}>
          Expert guides, RTP notes, and industry news for casino game players
        </Typography>
      </Box>
    </Box>
  );
}

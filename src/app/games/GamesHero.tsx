import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack } from "@mui/material";

export function GamesHero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 600, md: 480 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Image
        src="/hero.webp"
        alt="Casino games"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
        unoptimized
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          width: "100%",
          maxWidth: 1024,
          mx: "auto",
          pt: { xs: 2.5 },
          px: { xs: 2.5, sm: 3 },
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            color: "white",
            mb: 1.5,
          }}
        >
          Top Rated{" "}
          <Box component="span" sx={{ color: "#e57373" }}>
            Casino Games
          </Box>
        </Typography>
        <Typography
          sx={{ color: "grey.300", mb: 3, maxWidth: 560, mx: "auto" }}
        >
          Discover the best online casino games including slots, table games,
          live dealer experiences, and trending titles with expert reviews and
          RTP insights
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Link href="/games#insight" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Explore Casino Games
            </Button>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}

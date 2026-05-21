import Link from "next/link";
import { Box, Typography, Button, Stack } from "@mui/material";
import Image from "next/image";
import Description from "@mui/icons-material/Description";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Article from "@mui/icons-material/Article";
import Update from "@mui/icons-material/Update";
import School from "@mui/icons-material/School";

export function BlogHero() {
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
        alt="Casino Blogs & Insights"
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
          <Description sx={{ fontSize: 16 }} />
          EXPERT INSIGHTS
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "white",
            mb: 1.5,
          }}
        >
          Casino Blogs &{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Insights
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "grey.300",
            mb: 3,
            maxWidth: 600,
            mx: "auto",
            fontSize: "1rem",
          }}
        >
          Master casino strategies, discover winning guides, stay updated with
          platform news, and explore the latest iGaming industry trends and
          expert opinions.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={3}
        >
          <Link href="/blog#featured" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600 }}
              startIcon={<Article />}
            >
              Explore All Articles
            </Button>
          </Link>
          <Link href="/blog#all" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
              startIcon={<TrendingUp />}
            >
              Trending Topics
            </Button>
          </Link>
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
          spacing={{ xs: 1.5, sm: 3 }}
          justifyContent="center"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          useFlexGap
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "grey.300",
              fontSize: "0.875rem",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
                flexShrink: 0,
              }}
            />
            <span>500+ Expert Articles</span>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "grey.300",
              fontSize: "0.875rem",
            }}
          >
            <Update
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <span>Updated Daily</span>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "grey.300",
              fontSize: "0.875rem",
            }}
          >
            <School
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <span>Industry Experts</span>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

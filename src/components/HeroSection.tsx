import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack } from "@mui/material";

const STATS = [
  { value: "500+", label: "Casinos Reviewed" },
  { value: "$2M+", label: "Bonuses Available" },
  { value: "24/7", label: "Expert Support" },
  { value: "100%", label: "Trusted Reviews" },
];

export function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 620, md: 700 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",

        // Hero goes behind fixed navbar
        mt: { xs: "-56px", md: "-64px" },

        // push content down so it doesn't hide behind navbar
        pt: { xs: "56px", md: "64px" },
      }}
    >
      <Image
        src="/hero.webp"
        alt="Casino Interior"
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          width: "100%",
          maxWidth: 1024,
          mx: "auto",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 8, md: 10 },
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.2rem", sm: "3.2rem", md: "4rem" },
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
            mb: 3,
          }}
        >
          Discover the{" "}
          <Box component="span" sx={{ color: "#f87171" }}>
            Best Online Casinos
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1.05rem", md: "1.25rem" },
            color: "grey.200",
            mb: 4,
            maxWidth: 672,
            mx: "auto",
          }}
        >
          Expert reviews, exclusive bonuses, and trusted recommendations for the
          ultimate online casino experience
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Link href="/casinos" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1.125rem",
                boxShadow: 3,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Explore Top Casinos
            </Button>
          </Link>

          <Link href="/bonus" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              sx={{
                bgcolor: "transparent",
                color: "white",
                borderColor: "white",
                borderWidth: 2,
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1.125rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
            >
              View Bonuses
            </Button>
          </Link>
        </Stack>

        <Box
          sx={{
            mt: 6,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: { xs: 2, sm: 3 },
            maxWidth: 896,
            mx: "auto",
            width: "100%",
          }}
        >
          {STATS.map(({ value, label }) => (
            <Box
              key={label}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "white",
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "grey.300" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

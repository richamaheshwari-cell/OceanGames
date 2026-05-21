import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack } from "@mui/material";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Check from "@mui/icons-material/Check";
import Description from "@mui/icons-material/Description";
import Update from "@mui/icons-material/Update";

export function BonusHero() {
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
        alt="Casino Bonuses"
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
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 3,
            fontSize: "0.7rem",
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          <CardGiftcard sx={{ fontSize: 16 }} />
          Verified Bonus Offers
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            color: "white",
            mb: 1.5,
          }}
        >
          Top Casino{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Bonuses
          </Box>
        </Typography>
        <Typography
          sx={{ color: "grey.300", mb: 3, maxWidth: 560, mx: "auto" }}
        >
          Discover the best casino bonuses available online. From welcome
          bonuses and free spins to no-deposit bonuses and reload offers, we
          bring you verified offers with clear wagering requirements and real
          value.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={3}
        >
          <Link href="/bonus#highlights" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              View Welcome Offers
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
            <Check
              sx={{ fontSize: 18, color: "#4ade80", flexShrink: 0 }}
              aria-hidden
            />
            <span>Verified Offers</span>
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
            <Description
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <span>Clear Terms</span>
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
        </Stack>
      </Box>
    </Box>
  );
}

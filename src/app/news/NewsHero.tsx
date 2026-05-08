import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack } from "@mui/material";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import Verified from "@mui/icons-material/Verified";
import Groups from "@mui/icons-material/Groups";
import Casino from "@mui/icons-material/Casino";

export function NewsHero() {
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
        alt="Casino News & Updates"
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
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
          <Casino sx={{ fontSize: 16 }} />
          LATEST UPDATES
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
          Casino News &{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            Updates
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "grey.300",
            mb: 3,
            maxWidth: 620,
            mx: "auto",
            fontSize: "1rem",
          }}
        >
          Stay informed with the latest casino industry news, regulatory
          updates, big wins, new game releases, and breaking stories from the
          iGaming world.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={3}
        >
          <Link href="/news#featured" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600 }}
              startIcon={<LocalFireDepartment />}
            >
              Breaking News
            </Button>
          </Link>
          <Link href="/news#newsletter" style={{ textDecoration: "none" }}>
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
              startIcon={<NotificationsActive />}
            >
              Subscribe to Updates
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
            <span>24/7 Coverage</span>
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
            <Verified
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <span>Verified Sources</span>
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
            <Groups
              sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
            />
            <span>Industry Experts</span>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

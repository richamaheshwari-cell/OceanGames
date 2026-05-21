import Link from "next/link";
import { Box, Container, Typography, Stack } from "@mui/material";
import { SITE_URL } from "@/lib/seo";
import { FooterNewsletter } from "./FooterNewsletter";

const QUICK_LINKS = [
  { label: "Casinos", href: "/casinos" },
  { label: "Games", href: "/games" },
  { label: "Bonus", href: "/bonus" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "Latest News", href: "/news" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Responsible Gaming", href: "/responsible-gaming" },
  { label: "Contact Us", href: "/contact" },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0d0d0d",
        color: "common.white",
        pt: 6,
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1.5fr 1fr 1fr 1.2fr",
            },
            gap: 4,
            pb: 4,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Logo + Description */}
          <Box>
            <Link
              href="/"
              style={{
                display: "inline-block",
                textDecoration: "none",
                marginBottom: 0,
              }}
            >
              <Box
                component="img"
                src={`${SITE_URL}/tog_logo.svg`}
                alt="TheOceanGame"
                sx={{
                  height: 60,
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Link>

            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                mb: 2,
                maxWidth: 280,
              }}
            >
              Your trusted source for online casino reviews, bonuses, and expert
              iGaming insights. We help players make informed decisions.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: "grey.300",
              }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1}>
              {QUICK_LINKS.map(({ label, href }) => (
                <Link href={href} key={href} style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.400",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: "grey.300",
              }}
            >
              Information
            </Typography>

            <Stack spacing={1}>
              {INFO_LINKS.map(({ label, href }) => (
                <Link href={href} key={href} style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.400",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Newsletter */}
          <Box>
            <FooterNewsletter />
          </Box>
        </Box>

        {/* Bottom Copyright */}
        <Box
          sx={{
            py: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "grey.500" }}>
            © 2026 TheOceanGame. All rights reserved. | 18+ Only | Play
            Responsibly
          </Typography>
        </Box>

        {/* Disclaimer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "grey.600",
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          Disclaimer: iGaming can be addictive. Please play responsibly. This
          website contains affiliate links, and we may receive compensation if
          you sign up through our links. All casino reviews are based on our
          independent research and expert analysis. Players must be 18+ or of
          legal age in their jurisdiction.
        </Typography>
      </Container>
    </Box>
  );
}

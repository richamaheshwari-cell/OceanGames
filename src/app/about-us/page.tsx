import type { Metadata } from "next";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import Flag from "@mui/icons-material/Flag";
import Visibility from "@mui/icons-material/Visibility";
import Shield from "@mui/icons-material/Shield";
import Person from "@mui/icons-material/Person";
import Search from "@mui/icons-material/Search";
import Favorite from "@mui/icons-material/Favorite";
import MenuBook from "@mui/icons-material/MenuBook";
import SportsEsports from "@mui/icons-material/SportsEsports";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import { JsonLdScript } from "@/components/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildLocaleAlternates,
  buildWebPageJsonLd,
} from "@/lib/seo";

const META_TITLE = "About The Ocean Game | Smart Betting Knowledge Hub";
const META_DESC =
  "Discover The Ocean Game, a research-driven platform offering clear betting insights, casino analysis, and responsible gaming education.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: buildLocaleAlternates("/about-us"),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://theoceangame.com",
  ),
  openGraph: { title: META_TITLE, description: META_DESC, url: "/about-us" },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "/about-us" },
];

const MISSION_VISION = [
  {
    icon: Flag,
    title: "Our Mission",
    bg: "rgba(198, 40, 40, 0.08)",
    iconBg: "#c62828",
    text: "The Ocean Game was developed to turn betting into a knowledge-based game rather than a game of chance. We aim to alter the narrative by explaining how betting systems, casino games, and platforms operate in real-world situations.",
  },
  {
    icon: Visibility,
    title: "Our Vision",
    bg: "#fff",
    iconBg: "#1a1a1a",
    text: "To be a complete betting wisdom center. The Ocean Game integrates online casinos, bonuses, and expanded betting principles into one learning environment. Through clarity, transparency, and strategic thinking, we enable users to bet with confidence, responsibility, and smarts.",
  },
];

const WHY_TRUST = [
  {
    icon: Shield,
    title: "100% Independent",
    text: "We maintain complete editorial independence. Our reviews are never influenced by casino operators or affiliate partnerships. We offer objective evaluations of usability, game diversity, and security.",
  },
  {
    icon: Person,
    title: "Knowledge-First",
    text: "We break down intricate concepts like odds, house edge, RTP, volatility, and wagering requirements into simple, easy-to-comprehend explanations. Both novices and professionals can navigate with certainty.",
  },
  {
    icon: Search,
    title: "Objective Analysis",
    text: "We offer objective reviews of online casino sites. We concentrate on evaluation rather than promotion, allowing users to recognize reputable websites and avoid untrustworthy or inadequately controlled ones.",
  },
  {
    icon: Favorite,
    title: "Responsible Betting",
    text: "Our platform is based on responsible betting. We encourage realistic expectations, awareness of risks, and the need for boundaries. Betting should be a well-educated process, not an uncontrolled habit.",
  },
];

const WHAT_WE_DO = [
  {
    icon: MenuBook,
    title: "Casino Reviews",
    text: "Comprehensive evaluations of online casinos covering security, games, bonuses, usability, and payment options to help you choose trusted platforms.",
  },
  {
    icon: SportsEsports,
    title: "Game Analysis",
    text: "In-depth breakdowns of slots, table games, and live dealer games. Learn RTP, volatility, and strategies so you can play with confidence.",
  },
  {
    icon: CardGiftcard,
    title: "Bonus Guides",
    text: "Expert analysis of casino bonuses, wagering terms, rollover, and provisions. We treat bonuses as a tool of strategy, not assured benefits.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <JsonLdScript
        data={buildWebPageJsonLd(
          { slug: "about-us", title: META_TITLE, shortDesc: META_DESC },
          "pages",
        )}
      />

      {/* Hero */}
      <Box
        sx={{
          bgcolor: "#0d0d0d",
          pt: { xs: 10, md: 16 },
          pb: { xs: 6, md: 8 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box sx={{ fontSize: "0.875rem", color: "grey.400", mb: 3 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            <span style={{ margin: "0 0.35rem" }}>/</span>
            <span style={{ color: "white" }}>About Us</span>
          </Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              color: "white",
              mb: 2,
            }}
          >
            About The Ocean Game
          </Typography>
          <Typography
            sx={{
              color: "grey.300",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: 720,
            }}
          >
            Your trusted partner in navigating the world of online casinos. We
            provide independent, expert reviews and insights to help players
            make informed decisions.
          </Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ bgcolor: "#fff", py: 6, px: 2 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Our Story */}
          <Typography
            component="h2"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "grey.900",
              mb: 2,
            }}
          >
            Our Story
          </Typography>
          <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 4 }}>
            The Ocean Game is a research-driven single-user information site
            designed to provide clarity and order to the betting and online
            casino system. We are not a betting company, and we do not provide
            betting services. We are here to educate, analyze, and inform so
            that better betting decisions can be made by readers based on facts
            and not on hype.
          </Typography>

          {/* Mission & Vision */}
          <Typography
            component="h2"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "grey.900",
              mb: 3,
            }}
          >
            Mission & Vision
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 6,
            }}
          >
            {MISSION_VISION.map((item) => (
              <Box
                key={item.title}
                sx={{
                  bgcolor: item.bg,
                  borderRadius: 2,
                  p: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: item.iconBg,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <item.icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "grey.900",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ color: "grey.600", lineHeight: 1.7 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Why Trust */}
          <Typography
            component="h2"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "grey.900",
              mb: 3,
            }}
          >
            Why Trust The Ocean Game?
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 6,
            }}
          >
            {WHY_TRUST.map((item) => (
              <Box
                key={item.title}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    bgcolor: "rgba(198, 40, 40, 0.12)",
                    color: "#c62828",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <item.icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "grey.900",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ color: "grey.600", lineHeight: 1.7 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* What We Do */}
          <Typography
            component="h2"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "grey.900",
              mb: 3,
            }}
          >
            What We Do
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              gap: 3,
              mb: 6,
            }}
          >
            {WHAT_WE_DO.map((item) => (
              <Box
                key={item.title}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    bgcolor: "rgba(198, 40, 40, 0.12)",
                    color: "#c62828",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <item.icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "grey.900",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ color: "grey.600", lineHeight: 1.7 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA */}
          <Box
            sx={{
              bgcolor: "#c62828",
              borderRadius: 2,
              py: 5,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                color: "white",
                mb: 1.5,
              }}
            >
              Ready to Make Smarter Betting Decisions?
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 3,
                maxWidth: 560,
                mx: "auto",
              }}
            >
              Explore our expert reviews and discover safe, trusted online
              casinos that match your preferences.
            </Typography>
            <Link href="/casinos" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#c62828",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Browse Casino Reviews
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}

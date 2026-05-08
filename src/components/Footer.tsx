"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Container, Typography, IconButton, TextField, Button, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendIcon from "@mui/icons-material/Send";
import { ENDPOINTS } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

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

const SOCIAL = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: TwitterIcon, href: "#", label: "X" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: YouTubeIcon, href: "#", label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(ENDPOINTS.newsletterSubscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (res.status === 429) {
        setMessage({ type: "error", text: "Too many requests. Try again later." });
        return;
      }
      if (!res.ok) {
        setMessage({ type: "error", text: json?.error?.message ?? "Subscription failed." });
        return;
      }
      const data = json.data ?? json;
      setMessage({ type: "success", text: data.message ?? "Subscribed successfully!" });
      setEmail("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

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
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.5fr 1fr 1fr 1.2fr" },
            gap: 4,
            pb: 4,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Box>
            <Link href="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: 0 }}>
              <Box
                component="img"
                src={`${SITE_URL}/tog_logo.svg`}
                alt="TheOceanGame"
                sx={{ height: 60, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 2, maxWidth: 280 }}>
              Your trusted source for online casino reviews, bonuses, and expert iGaming insights. We help players make
              informed decisions.
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {SOCIAL.map(({ Icon, href, label }) => (
                <IconButton key={label} href={href} sx={{ color: "grey.400", "&:hover": { color: "primary.main" } }} aria-label={label}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "grey.300" }}>
              Quick Links
            </Typography>
            <Stack spacing={0.75}>
              {QUICK_LINKS.map(({ label, href }) => (
                <Typography key={href} component={Link} href={href} variant="body2" sx={{ color: "grey.400", "&:hover": { color: "primary.main" } }}>
                  {label}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "grey.300" }}>
              Information
            </Typography>
            <Stack spacing={0.75}>
              {INFO_LINKS.map(({ label, href }) => (
                <Typography key={href} component={Link} href={href} variant="body2" sx={{ color: "grey.400", "&:hover": { color: "primary.main" } }}>
                  {label}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "grey.300" }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 1.5 }}>
              Subscribe to get the latest casino bonuses and exclusive offers delivered to your inbox.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              <TextField
                size="small"
                placeholder="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={{
                  flex: 1,
                  minWidth: 140,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  },
                }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 44, px: 1 }} aria-label="Subscribe" disabled={loading}>
                <SendIcon fontSize="small" />
              </Button>
            </Box>
            {message && (
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: message.type === "success" ? "success.main" : "error.main" }}>
                {message.text}
              </Typography>
            )}
            <Typography component={Link} href="/newsletter/unsubscribe" variant="caption" sx={{ display: "block", mt: 0.5, color: "grey.500", "&:hover": { color: "grey.400" } }}>
              Unsubscribe
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: 2, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "grey.500" }}>
            © {new Date().getFullYear()} TheOceanGame. All rights reserved. | 18+ Only | Play Responsibly
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ display: "block", color: "grey.600", maxWidth: 720, lineHeight: 1.5 }}>
          Disclaimer: iGaming can be addictive. Please play responsibly. This website contains affiliate links, and we
          may receive compensation if you sign up through our links. All casino reviews are based on our independent
          research and expert analysis. Players must be 18+ or of legal age in their jurisdiction.
        </Typography>
      </Container>
    </Box>
  );
}

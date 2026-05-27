"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Button, IconButton, Box } from "@mui/material";
import { PageLoader } from "@/components/PageLoader";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { SITE_URL } from "@/lib/seo";
import { NavbarDrawer } from "@/components/NavbarDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import "./style.css";

const NAV_LINKS = [
  { label: "Casinos", href: "/casinos" },
  { label: "Games", href: "/games" },
  { label: "Bonus", href: "/bonus" },
  { label: "Blog", href: "/blog" },
  { label: "News", href: "/news" },
] as const;

/** Paths where there is no hero/feature image; navbar logo is the LCP candidate. */
const LOGO_LCP_PATHS = new Set([
  "/privacy",
  "/terms",
  "/contact",
  "/about-us",
  "/responsible-gaming",
]);

/** Hero/listing routes that have their own LCP image; logo must not compete. */
const HERO_ROUTES = new Set([
  "/",
  "/casinos",
  "/games",
  "/bonus",
  "/blog",
  "/news",
]);

// Static imports above

function isLogoLcpPage(pathname: string | null): boolean {
  if (!pathname) return false;
  if (LOGO_LCP_PATHS.has(pathname)) return true;
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 && !HERO_ROUTES.has(pathname);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchOrigin, setSearchOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    if (!navigating) return;
    // Reset loader after navigation completes (pathname changed).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNavigating(false);
  }, [pathname, navigating]);

  const openSearch = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    setSearchOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSearchOpen(true);
  };

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const textColor = scrolled ? "text.primary" : "common.white";

  const navLinks = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {NAV_LINKS.map(({ label, href }) => (
        <Button
          key={href}
          component={Link}
          href={href}
          sx={{
            color: textColor,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            borderRadius: 999,
            px: 1.25,
            "&:hover": {
              bgcolor: scrolled ? "action.hover" : "rgba(255,255,255,0.12)",
            },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // ✅ EXACT behavior you want:
          // top: fully transparent (no gradient, no blur)
          // scrolled: solid white
          backgroundColor: scrolled ? "#ffffff" : "transparent",
          backgroundImage: "none",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
          transition: "background-color .25s ease, box-shadow .25s ease",
          zIndex: (t) => t.zIndex.appBar,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, md: 64 },
          }}
        >
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" }, color: textColor }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Link href="/" className="navbar-link">
            <Box
              component="img"
              src={`${SITE_URL}/tog_logo.svg`}
              alt="TheOceanGame"
              sx={{
                height: { xs: 56, sm: 48, md: 68 },
                width: "auto",
                minWidth: { sm: 84, md: 84 },
                maxHeight: 68,
                objectFit: "contain",
                objectPosition: "left center",
                filter: scrolled ? "none" : "brightness(0) invert(1)",
              }}
            />
          </Link>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navLinks}
            <IconButton
              onClick={openSearch}
              sx={{ color: textColor }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <IconButton
            onClick={openSearch}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: textColor,
            }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {mobileOpen && (
        <NavbarDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      )}

      {searchOpen && (
        <SearchOverlay
          open={searchOpen}
          onClose={() => {
            setSearchOpen(false);
            setSearchOrigin(null);
          }}
          onNavigate={() => setNavigating(true)}
        />
      )}
      {navigating && <PageLoader />}
    </>
  );
}

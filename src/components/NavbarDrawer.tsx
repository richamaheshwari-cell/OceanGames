"use client";

import Link from "next/link";
import { Drawer, Box, List, ListItem, ListItemButton } from "@mui/material";
import "./style.css";

const NAV_LINKS = [
  { label: "Casinos", href: "/casinos" },
  { label: "Games", href: "/games" },
  { label: "Bonus", href: "/bonus" },
  { label: "Blog", href: "/blog" },
  { label: "News", href: "/news" },
] as const;

export function NavbarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDrawer-paper": { width: 260 } }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Link
          href="/"
          onClick={onClose}
          className="navbar-drawer-link-text-decoration"
        >
          <Box
            component="img"
            src="/tog_logo.svg"
            alt="TheOceanGame"
            sx={{ height: 56, width: "auto", objectFit: "contain" }}
          />
        </Link>
      </Box>
      <List sx={{ pt: 0 }}>
        {NAV_LINKS.map(({ label, href }) => (
          <ListItem key={href} disablePadding>
            <ListItemButton component={Link} href={href} onClick={onClose}>
              {label}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

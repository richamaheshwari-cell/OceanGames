"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type TocSection = { id: string; label: string };

type StickyTocProps = {
  sections: TocSection[];
  offset: number;
};

export function StickyToc({ sections, offset }: StickyTocProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -66% 0px` }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections, offset]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 700,
          color: "grey.900",
          mb: 1.5,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Table of Contents
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        {sections.map((s) => (
          <Box
            key={s.id}
            component="button"
            onClick={() => scrollToSection(s.id)}
            sx={{
              display: "block",
              width: "100%",
              textAlign: "left",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              px: 1.5,
              py: 1,
              borderRadius: 1,
              fontSize: "0.875rem",
              bgcolor: activeSection === s.id ? "rgba(211, 47, 47, 0.08)" : "transparent",
              color: activeSection === s.id ? "error.main" : "grey.600",
              fontWeight: activeSection === s.id ? 600 : 500,
              "&:hover": {
                bgcolor: activeSection === s.id ? "rgba(211, 47, 47, 0.08)" : "grey.100",
                color: activeSection === s.id ? "error.main" : "grey.900",
              },
            }}
          >
            {s.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}


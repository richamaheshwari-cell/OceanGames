"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setProgress(Math.min(100, scrolled));
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        bgcolor: "rgba(198, 40, 40, 0.2)",
        zIndex: 1100,
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${progress}%`,
          bgcolor: "#c62828",
          transition: "width 0.1s ease-out",
        }}
      />
    </Box>
  );
}

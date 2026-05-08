"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  InputBase,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ENDPOINTS } from "@/lib/api";
import {
  getSearchTypeConfig,
  normalizeSearchPath,
  type SearchResult,
  SEARCH_MIN_LENGTH,
  SEARCH_DEBOUNCE_MS,
} from "@/lib/search";

export function SearchOverlay({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const lastRequestedQ = useRef("");

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      lastRequestedQ.current = "";
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < SEARCH_MIN_LENGTH) {
      setResults([]);
      return;
    }
    if (q === lastRequestedQ.current) return;

    const t = setTimeout(async () => {
      lastRequestedQ.current = q;
      setLoading(true);
      try {
        const res = await fetch(ENDPOINTS.search(q));
        const json = await res.json();
        const data = json.data ?? json;
        const raw = Array.isArray(data?.results) ? data.results : [];
        setResults(raw.map((r: SearchResult) => ({ ...r, path: normalizeSearchPath(r.path) })));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  const handleSelect = (path: string) => {
    const fullPath = path.startsWith("/") ? path : `/${path}`;
    onClose();
    onNavigate();
    router.push(fullPath);
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,

        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",

        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",

        pt: { xs: 10, md: 14 },

        animation: "fadeIn 150ms ease",

        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          maxWidth: 680,
          mx: 2,

          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "0 40px 120px rgba(0,0,0,0.35)",

          overflow: "hidden",

          animation: "scaleIn 180ms cubic-bezier(.16,1,.3,1)",

          "@keyframes scaleIn": {
            from: { opacity: 0, transform: "scale(.96)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <SearchIcon sx={{ mr: 2, color: "text.secondary" }} />

          <InputBase
            autoFocus
            fullWidth
            placeholder="Search casinos, games, bonuses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && query.trim().length >= SEARCH_MIN_LENGTH && results.length > 0) {
                handleSelect(results[0].path);
              }
            }}
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
            }}
          />

          <Box
            sx={{
              ml: 2,
              px: 1.5,
              py: 0.5,
              fontSize: "0.75rem",
              bgcolor: "grey.100",
              borderRadius: 1,
              color: "text.secondary",
            }}
          >
            ESC
          </Box>
        </Box>

        {/* Results */}
        <Box
          sx={{
            maxHeight: "55vh",
            overflowY: "auto",
            py: 2,
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 4 }}>
              <CircularProgress size={28} thickness={4} color="primary" />
              <Typography color="text.secondary" fontWeight={500}>
                Searching...
              </Typography>
            </Box>
          )}

          {!loading &&
            results.map((r) => {
              const { label, Icon } = getSearchTypeConfig(r.type);

              return (
                <Box
                  key={`${r.type}-${r.id}`}
                  onClick={() => handleSelect(r.path)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 2,
                    cursor: "pointer",
                    transition: "all 150ms ease",

                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  <Icon sx={{ color: "primary.main" }} />

                  <Box>
                    <Typography fontWeight={600}>
                      {r.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

          {!loading &&
            query.length >= SEARCH_MIN_LENGTH &&
            results.length === 0 && (
              <Typography sx={{ px: 3 }} color="text.secondary">
                No results found.
              </Typography>
            )}
        </Box>
      </Box>
    </Box>
  );
}

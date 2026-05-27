"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import "./style.css";
type QueryPaginationProps = {
  page: number;
  totalPages: number;
  queryKey: string;
};

function getPageWindow(
  page: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
  if (page >= totalPages - 2)
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

export function QueryPagination({
  page,
  totalPages,
  queryKey,
}: QueryPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const windowItems = getPageWindow(safePage, totalPages);

  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    if (clamped <= 1) params.delete(queryKey);
    else params.set(queryKey, String(clamped));
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  const navSx = {
    minWidth: 34,
    height: 34,
    borderRadius: "999px",
    border: "1px solid",
    borderColor: "divider",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.8rem",
    color: "text.primary",
    bgcolor: "background.paper",
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        gap: 0.75,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {safePage > 1 ? (
        <Link
          href={hrefFor(safePage - 1)}
          className="casino-text-decoration"
          scroll={false}
        >
          <Box component="span" sx={navSx} aria-label="Previous page">
            {"<"}
          </Box>
        </Link>
      ) : (
        <Box
          component="span"
          sx={{
            ...navSx,
            color: "text.disabled",
            borderColor: "action.disabledBackground",
          }}
        >
          {"<"}
        </Box>
      )}

      {windowItems.map((item, idx) =>
        item === "..." ? (
          <Box
            key={`ellipsis-${idx}`}
            component="span"
            sx={{ px: 0.5, color: "text.secondary", fontWeight: 700 }}
          >
            ...
          </Box>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            className="casino-text-decoration"
            scroll={false}
          >
            <Box
              component="span"
              sx={{
                ...navSx,
                bgcolor:
                  item === safePage ? "primary.main" : "background.paper",
                borderColor: item === safePage ? "primary.main" : "divider",
                color:
                  item === safePage ? "primary.contrastText" : "text.primary",
              }}
            >
              {item}
            </Box>
          </Link>
        ),
      )}

      {safePage < totalPages ? (
        <Link
          href={hrefFor(safePage + 1)}
          className="column-resize-dragging"
          scroll={false}
        >
          <Box component="span" sx={navSx} aria-label="Next page">
            {">"}
          </Box>
        </Link>
      ) : (
        <Box
          component="span"
          sx={{
            ...navSx,
            color: "text.disabled",
            borderColor: "action.disabledBackground",
          }}
        >
          {">"}
        </Box>
      )}
    </Box>
  );
}

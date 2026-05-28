import React from "react";
import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";

interface AuthorBreadcrumbsProps {
  authorName: string;
  authorSlug: string;
}

export const AuthorBreadcrumbs: React.FC<AuthorBreadcrumbsProps> = ({
  authorName,
  authorSlug,
}) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
      Home
    </Link>
    <Link href="/authors" style={{ textDecoration: "none", color: "inherit" }}>
      Authors
    </Link>
    <Link
      href={`/authors/${authorSlug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Typography color="text.primary" component="span">
        {authorName}
      </Typography>
    </Link>
  </Breadcrumbs>
);

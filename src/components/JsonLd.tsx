/**
 * Renders JSON-LD script from schema object.
 */

export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import type { ContentRecord } from "@/lib/seo";
import type { RouteBase } from "@/lib/seo";
import { buildArticleJsonLd, buildWebPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

export interface JsonLdProps {
  record: ContentRecord;
  routeBase: RouteBase;
  schemaType: "Article" | "WebPage";
  isNews?: boolean;
  wordCount?: number;
}

export function JsonLd({ record, routeBase, schemaType, isNews, wordCount }: JsonLdProps) {
  const data =
    schemaType === "Article"
      ? buildArticleJsonLd(record, routeBase, { isNews, wordCount })
      : buildWebPageJsonLd(record, routeBase);
  return <JsonLdScript data={data} />;
}

export interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLdScript data={buildBreadcrumbJsonLd(items)} />;
}

import { API_BASE } from "@/lib/api";

/**
 * Normalize CMS image URLs for next/image.
 * Handles proxied admin URLs like:
 * http://localhost:3001/_next/image?url=<encoded-remote>&w=...&q=...
 */
export function normalizeImageUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  const absolute = raw.startsWith("http")
    ? raw
    : raw.startsWith("//")
      ? `https:${raw}`
      : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;

  try {
    const parsed = new URL(absolute);
    const nested = parsed.searchParams.get("url");
    if (parsed.pathname === "/_next/image" && nested) {
      const decoded = decodeURIComponent(nested);
      if (decoded.startsWith("//")) return `https:${decoded}`;
      if (decoded.startsWith("http://") || decoded.startsWith("https://")) return decoded;
      if (decoded.startsWith("/")) return `${API_BASE}${decoded}`;
      return decoded || absolute;
    }
    return absolute;
  } catch {
    return absolute;
  }
}

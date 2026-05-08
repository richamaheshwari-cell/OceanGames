/**
 * Search API: GET /api/v1/public/search?q=...
 * Query: q (2–80 chars). Response: { results, suggestions }.
 * results: { id, type, title, slug, path, score }. path = relative URL (e.g. news/slug).
 * type: casino_article | game_article | blog | bonus_article | news | game | bonus | page
 *
 * Search is real-time (no cache): users expect correct results; we debounce to avoid a call per keystroke.
 */

import type { SvgIconComponent } from "@mui/icons-material";
import Article from "@mui/icons-material/Article";
import SportsEsports from "@mui/icons-material/SportsEsports";
import MenuBook from "@mui/icons-material/MenuBook";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Newspaper from "@mui/icons-material/Newspaper";
import Casino from "@mui/icons-material/Casino";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Description from "@mui/icons-material/Description";

export type SearchResultType =
  | "casino_article"
  | "game_article"
  | "blog"
  | "bonus_article"
  | "news"
  | "game"
  | "bonus"
  | "page";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  slug: string;
  path: string;
  score?: number;
};

export type SearchResponse = {
  results: SearchResult[];
  suggestions: string[];
};

const TYPE_CONFIG: Record<
  SearchResultType,
  { label: string; Icon: SvgIconComponent }
> = {
  casino_article: { label: "Casino Article", Icon: Article },
  game_article: { label: "Game Article", Icon: Article },
  blog: { label: "Blog", Icon: MenuBook },
  bonus_article: { label: "Bonus Article", Icon: Article },
  news: { label: "News", Icon: Newspaper },
  game: { label: "Game", Icon: SportsEsports },
  bonus: { label: "Bonus", Icon: CardGiftcard },
  page: { label: "Page", Icon: Description },
};

export function getSearchTypeConfig(type: string): { label: string; Icon: SvgIconComponent } {
  const key = type as SearchResultType;
  return TYPE_CONFIG[key] ?? { label: type.replace(/_/g, " "), Icon: Description };
}

export const SEARCH_MIN_LENGTH = 4;
export const SEARCH_DEBOUNCE_MS = 350;
export const SEARCH_MAX_QUERY_LENGTH = 80;

/**
 * Backend returns path segments that may not match frontend routes (e.g. blogs/slug vs blog/slug).
 * Normalize so navigation and links use correct frontend paths.
 */
const PATH_PREFIX_MAP: Record<string, string> = {
  blogs: "blog",
  // Add other backend→frontend segment mappings if API returns different first segment
};

export function normalizeSearchPath(apiPath: string): string {
  if (!apiPath || typeof apiPath !== "string") return apiPath;
  const trimmed = apiPath.replace(/^\/+/, "").trim();
  const parts = trimmed.split("/");
  const first = parts[0];
  const mapped = PATH_PREFIX_MAP[first];
  if (mapped && parts.length > 1) {
    return [mapped, ...parts.slice(1)].join("/");
  }
  return trimmed;
}

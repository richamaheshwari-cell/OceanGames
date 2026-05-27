/**
 * TOG Backend – Public API
 * Base URL: http://localhost:3000
 * Prefix: /api/v1/public
 *
 * Caching:
 * - Server (SEO pages): use next: { revalidate: SEO_CACHE_REVALIDATE_SECONDS }
 * - Client (lists, feeds): use useSWR with dedupingInterval (60s) to avoid duplicate
 *   calls and reuse cache on back navigation. Search stays real-time + debounce.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.theoceangame.com";
/** Revalidate SEO page data every N seconds (short cache, fewer backend calls). */
export const SEO_CACHE_REVALIDATE_SECONDS = 600;
export const API_PUBLIC = `${API_BASE}/api/v1/public`;

export const ENDPOINTS = {
  health: `${API_BASE}/health`,
  ping: `${API_PUBLIC}/ping`,
  settings: `${API_PUBLIC}/settings`,
  pages: (slug: string) => `${API_PUBLIC}/pages/${slug}`,
  casinos: `${API_PUBLIC}/casinos`,
  casino: (slug: string) => `${API_PUBLIC}/casinos/${slug}`,
  /** Games linked to a casino (published). Query: page, limit (default 6, max 100), optional excludeSlug / excludeId */
  casinoGames: (slug: string, search?: { page?: number; limit?: number; excludeSlug?: string; excludeId?: string }) => {
    const p = new URLSearchParams();
    p.set("page", String(search?.page ?? 1));
    p.set("limit", String(search?.limit ?? 12));
    if (search?.excludeSlug) p.set("excludeSlug", search.excludeSlug);
    if (search?.excludeId) p.set("excludeId", search.excludeId);
    return `${API_PUBLIC}/casinos/${slug}/games?${p.toString()}`;
  },
  casinoArticles: `${API_PUBLIC}/casino-articles`,
  casinoArticle: (slug: string) => `${API_PUBLIC}/casino-articles/${slug}`,
  games: `${API_PUBLIC}/games`,
  game: (slug: string) => `${API_PUBLIC}/games/${slug}`,
  gameArticles: `${API_PUBLIC}/game-articles`,
  gameArticle: (slug: string) => `${API_PUBLIC}/game-articles/${slug}`,
  blogs: `${API_PUBLIC}/blogs`,
  blog: (slug: string) => `${API_PUBLIC}/blogs/${slug}`,
  featuredBlogs: `${API_PUBLIC}/featuredBlogs`,
  featuredBlog: (slug: string) => `${API_PUBLIC}/featuredBlogs/${slug}`,
  news: `${API_PUBLIC}/news`,
  newsItem: (slug: string) => `${API_PUBLIC}/news/${slug}`,
  trendingNews: `${API_PUBLIC}/trendingNews`,
  trendingNewsItem: (slug: string) => `${API_PUBLIC}/trendingNews/${slug}`,
  bonuses: `${API_PUBLIC}/bonuses`,
  bonus: (slug: string) => `${API_PUBLIC}/bonuses/${slug}`,
  bonusArticles: `${API_PUBLIC}/bonus-articles`,
  bonusArticle: (slug: string) => `${API_PUBLIC}/bonus-articles/${slug}`,
  search: (q: string) => `${API_PUBLIC}/search?q=${encodeURIComponent(q)}`,
  editors: (id: string) => `${API_PUBLIC}/editors/${id}`,
  newsletterSubscribe: `${API_PUBLIC}/newsletter/subscribe`,
  newsletterUnsubscribe: `${API_PUBLIC}/newsletter/unsubscribe`,
} as const;

export type ApiSuccess<T> = { data: T };
export type ApiError = { error: { code: string; message: string; details?: object } };

export async function publicFetch<T>(url: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const res = await fetch(url, { ...init, next: {
      revalidate: SEO_CACHE_REVALIDATE_SECONDS,
      ...(init as any)?.next,
    },});
  const json = await res.json();
  if (!res.ok) throw new Error((json as ApiError).error?.message ?? "Request failed");
  return json as ApiSuccess<T>;
}

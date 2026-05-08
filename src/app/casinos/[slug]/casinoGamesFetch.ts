import type { CasinoPageGame } from "./CasinoGamesSection"; // `import type` only — safe from server

/**
 * Normalizes one game object from GET /api/v1/public/casinos/:slug/games
 * (field names may vary by API version).
 */
function normalizeCasinoGameItem(raw: unknown): CasinoPageGame | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? r._id ?? "").trim();
  const slug = String(r.slug ?? "").trim();
  if (!id || !slug) return null;
  const title = String(r.title ?? r.name ?? r.gameName ?? r.gameTitle ?? "Game").trim() || "Game";

  let gameProvider: string[] | null = null;
  if (Array.isArray(r.gameProvider)) {
    gameProvider = r.gameProvider.map((x) => String(x));
  } else if (typeof r.provider === "string" && r.provider.trim()) {
    gameProvider = [r.provider.trim()];
  }

  return {
    id,
    slug,
    title,
    featureImg: r.featureImg != null ? String(r.featureImg) : r.image != null ? String(r.image) : null,
    tag: r.tag != null ? String(r.tag) : null,
    gameProvider,
    rtp: r.rtp as CasinoPageGame["rtp"],
    volatility: r.volatility != null ? String(r.volatility) : null,
    category: r.category != null ? String(r.category) : null,
  };
}

/**
 * Parses list payload: `{ data: { items: [...] } }` or `{ items }` or `{ games }`, etc.
 */
export function parseCasinoGamesResponse(json: unknown): CasinoPageGame[] {
  const root = json && typeof json === "object" && "data" in (json as object) ? (json as { data: unknown }).data : json;
  if (root == null || typeof root !== "object") return [];

  const o = root as Record<string, unknown>;
  const rawList =
    o.items ??
    o.games ??
    o.results ??
    o.records ??
    (Array.isArray(o) ? o : null);

  if (!Array.isArray(rawList)) return [];

  return rawList.map(normalizeCasinoGameItem).filter((g): g is CasinoPageGame => g != null);
}

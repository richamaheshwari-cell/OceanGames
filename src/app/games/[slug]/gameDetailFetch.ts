export type GameCasinoRef = {
  slug: string | null;
  name: string | null;
};

export type GameDetailRecord = {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
  shortDesc?: string | null;
  content?: object | string | null;
  featureImg?: string | null;
  tag?: string | null;
  clientLink?: string | null;
  gameProvider?: string[] | null;
  gameDetails?: string[] | null;
  rtp?: string | number | null;
  volatility?: string | null;
  casinoRef: GameCasinoRef;
};

export type GameCardItem = {
  id: string;
  title: string;
  slug: string;
  featureImg?: string | null;
  tag?: string | null;
  gameProvider?: string[] | null;
  rtp?: string | number | null;
  volatility?: string | null;
  category?: string | null;
};

function toStringOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const x = v.trim();
  return x.length ? x : null;
}

function toStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const arr = v.map((x) => String(x).trim()).filter(Boolean);
  return arr.length ? arr : null;
}

function parseCasinoRef(raw: Record<string, unknown>): GameCasinoRef {
  const fromFlatSlug =
    toStringOrNull(raw.casinoSlug) ??
    toStringOrNull(raw.casino_slug);
  const fromFlatName =
    toStringOrNull(raw.casinoName) ??
    toStringOrNull(raw.casino);

  const casinoObj = raw.casino && typeof raw.casino === "object" ? (raw.casino as Record<string, unknown>) : null;
  const fromObjSlug =
    (casinoObj && (toStringOrNull(casinoObj.slug) ?? toStringOrNull(casinoObj.id))) ?? null;
  const fromObjName =
    (casinoObj && (toStringOrNull(casinoObj.casinoName) ?? toStringOrNull(casinoObj.name) ?? toStringOrNull(casinoObj.title))) ?? null;

  const casinosArr = Array.isArray(raw.casinos) ? raw.casinos : null;
  const firstCasinoString = casinosArr && typeof casinosArr[0] === "string" ? toStringOrNull(casinosArr[0]) : null;
  const firstCasino = casinosArr && casinosArr[0] && typeof casinosArr[0] === "object"
    ? (casinosArr[0] as Record<string, unknown>)
    : null;
  const fromArrSlug =
    (firstCasino && (toStringOrNull(firstCasino.slug) ?? toStringOrNull(firstCasino.id))) ?? null;
  const fromArrName =
    (firstCasino && (toStringOrNull(firstCasino.casinoName) ?? toStringOrNull(firstCasino.name) ?? toStringOrNull(firstCasino.title))) ?? null;

  return {
    slug: fromFlatSlug ?? fromObjSlug ?? fromArrSlug ?? null,
    name: fromFlatName ?? fromObjName ?? fromArrName ?? firstCasinoString ?? null,
  };
}

export function parseGameDetailResponse(json: unknown): GameDetailRecord | null {
  const root = json && typeof json === "object" && "data" in (json as object) ? (json as { data: unknown }).data : json;
  if (!root || typeof root !== "object") return null;
  const raw = root as Record<string, unknown>;

  const id = toStringOrNull(raw.id) ?? toStringOrNull(raw._id);
  const slug = toStringOrNull(raw.slug);
  if (!id || !slug) return null;

  return {
    id,
    slug,
    title:
      toStringOrNull(raw.title) ??
      toStringOrNull(raw.gameName) ??
      toStringOrNull(raw.name) ??
      "Game",
    seoTitle: toStringOrNull(raw.seoTitle),
    seoDesc: toStringOrNull(raw.seoDesc),
    shortDesc: toStringOrNull(raw.shortDesc),
    content: (raw.content as object | string | null | undefined) ?? null,
    featureImg: toStringOrNull(raw.featureImg) ?? toStringOrNull(raw.image),
    tag: toStringOrNull(raw.tag),
    clientLink: toStringOrNull(raw.clientLink) ?? toStringOrNull(raw.playUrl),
    gameProvider: toStringArray(raw.gameProvider) ?? (toStringOrNull(raw.provider) ? [String(raw.provider)] : null),
    gameDetails: toStringArray(raw.gameDetails),
    rtp: raw.rtp as string | number | null | undefined,
    volatility: toStringOrNull(raw.volatility),
    casinoRef: parseCasinoRef(raw),
  };
}

function normalizeGameCard(raw: unknown): GameCardItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = toStringOrNull(r.id) ?? toStringOrNull(r._id);
  const slug = toStringOrNull(r.slug);
  if (!id || !slug) return null;
  return {
    id,
    slug,
    title: toStringOrNull(r.title) ?? toStringOrNull(r.gameName) ?? toStringOrNull(r.name) ?? "Game",
    featureImg: toStringOrNull(r.featureImg) ?? toStringOrNull(r.image),
    tag: toStringOrNull(r.tag),
    gameProvider: toStringArray(r.gameProvider) ?? (toStringOrNull(r.provider) ? [String(r.provider)] : null),
    rtp: r.rtp as string | number | null | undefined,
    volatility: toStringOrNull(r.volatility),
    category: toStringOrNull(r.category),
  };
}

export function parseGameListResponse(json: unknown): GameCardItem[] {
  const root = json && typeof json === "object" && "data" in (json as object) ? (json as { data: unknown }).data : json;
  if (!root || typeof root !== "object") return [];
  const obj = root as Record<string, unknown>;
  const list = obj.items ?? obj.games ?? obj.results ?? obj.records;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeGameCard).filter((x): x is GameCardItem => Boolean(x));
}

export type QueryValue = string | string[] | undefined;
export type QueryMap = Record<string, QueryValue>;

export function readPageParam(raw: QueryValue, fallback = 1): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}


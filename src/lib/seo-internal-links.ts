/**
 * Inject contextual internal links into HTML for SEO.
 * Only links plain text keywords; does not modify existing links.
 */

const KEYWORD_LINKS: Array<{ pattern: RegExp; href: string }> = [
  { pattern: /\bonline casino\b/gi, href: "/casinos" },
  { pattern: /\bonline casinos\b/gi, href: "/casinos" },
  { pattern: /\bcasino bonus\b/gi, href: "/bonus" },
  { pattern: /\bcasino bonuses\b/gi, href: "/bonus" },
  { pattern: /\bgame providers\b/gi, href: "/games" },
  { pattern: /\bgame provider\b/gi, href: "/games" },
  { pattern: /\bslot games\b/gi, href: "/games" },
  { pattern: /\bcasino games\b/gi, href: "/games" },
];

/**
 * Replaces keyword matches with links, but skips text inside existing <a> tags.
 */
export function injectContextualLinks(html: string): string {
  if (!html || typeof html !== "string") return html;

  // Split by <a ...>...</a> to preserve existing links
  const parts: Array<{ type: "text"; content: string } | { type: "link"; content: string }> = [];
  let remaining = html;
  const linkRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = linkRe.exec(html)) !== null) {
    // Text before this link
    const before = html.slice(lastIndex, match.index);
    parts.push({ type: "text" as const, content: before });
    // The link itself (do not modify)
    parts.push({ type: "link" as const, content: match[0] });
    lastIndex = match.index + match[0].length;
  }
  parts.push({ type: "text" as const, content: html.slice(lastIndex) });

  const processText = (text: string): string => {
    let result = text;
   for (const { pattern, href } of KEYWORD_LINKS) {
  let count = 0;
  result = result.replace(pattern, (m) => {
    if (count === 0) {
      count++;
      return `<a href="${href}" class="seo-internal-link">${m}</a>`;
    }
    return m;
  });
}
    return result;
  };

  return parts
    .map((p) => (p.type === "link" ? p.content : processText(p.content)))
    .join("");
}

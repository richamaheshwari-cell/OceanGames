/**
 * Server-side Tiptap content renderer.
 * Converts JSON to HTML on the server for SEO (content in "View Page Source").
 */

import { tiptapJsonToHtml } from "@/lib/tiptap-server";
import { injectContextualLinks } from "@/lib/seo-internal-links";

type TiptapContent = object | string | null | undefined;

interface TiptapHtmlServerProps {
  content: TiptapContent;
  /** Inject internal links for keywords (e.g. "online casino" → /casinos) */
  injectInternalLinks?: boolean;
}

export function TiptapHtmlServer({ content, injectInternalLinks = true }: TiptapHtmlServerProps) {
  const html = tiptapJsonToHtml(content);
  const processed = injectInternalLinks ? injectContextualLinks(html) : html;

  if (!processed) return null;

  return (
    <div className="tiptap-viewer">
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    </div>
  );
}

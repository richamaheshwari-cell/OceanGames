/**
 * Server-side Tiptap JSON → HTML generation for SEO.
 * Must use @tiptap/html/server in Node (Next.js server).
 */

import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import type { JSONContent } from "@tiptap/core";

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  Highlight,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
  }),
  Image.configure({ inline: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TableKit,
];

export function tiptapJsonToHtml(content: object | string | null | undefined): string {
  const parsed = parseContent(content);
  if (!parsed) return "";
  try {
    return generateHTML(parsed as JSONContent, extensions);
  } catch {
    return "";
  }
}

function parseContent(content: object | string | null | undefined): object | null {
  if (content == null) return null;
  if (typeof content === "object") return content;
  if (typeof content === "string") {
    try {
      return JSON.parse(content) as object;
    } catch {
      return null;
    }
  }
  return null;
}

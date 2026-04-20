// ─── Blog utility ─────────────────────────────────────────────────────────
// Loads and parses all markdown files from src/content/blog using Vite's
// import.meta.glob. No build step or external CMS API needed at runtime —
// posts are bundled at build time and served as static assets.

import yaml from "js-yaml";

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  let frontmatter = {};
  try {
    frontmatter = yaml.load(match[1]) || {};
  } catch (err) {
    console.error("Frontmatter parse error:", err);
  }

  // yaml.load may parse dates as Date objects when unquoted (YYYY-MM-DD)
  if (frontmatter.date instanceof Date) {
    frontmatter.date = frontmatter.date.toISOString().slice(0, 10);
  }

  return { frontmatter, content: match[2].trim() };
}

/**
 * Convert simple Markdown to HTML.
 * Handles: headings, bold, italic, links, unordered lists, ordered lists,
 * paragraphs, horizontal rules, and line breaks.
 */
export function markdownToHtml(md) {
  if (!md) return "";

  const lines = md.split("\n");
  const html = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html.push("</ul>"); inUl = false; }
    if (inOl) { html.push("</ol>"); inOl = false; }
  };

  const inline = (text) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
        if (url.startsWith("http")) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        return `<a href="${url}">${text}</a>`;
      });

  lines.forEach((line) => {
    // Headings
    const h = line.match(/^(#{1,4})\s+(.+)/);
    if (h) {
      closeList();
      const level = h[1].length;
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      return;
    }
    // HR
    if (/^---+$/.test(line.trim())) {
      closeList();
      html.push("<hr />");
      return;
    }
    // Unordered list
    const ul = line.match(/^[-*]\s+(.+)/);
    if (ul) {
      if (!inUl) { if (inOl) { html.push("</ol>"); inOl = false; } html.push("<ul>"); inUl = true; }
      html.push(`<li>${inline(ul[1])}</li>`);
      return;
    }
    // Ordered list
    const ol = line.match(/^\d+\.\s+(.+)/);
    if (ol) {
      if (!inOl) { if (inUl) { html.push("</ul>"); inUl = false; } html.push("<ol>"); inOl = true; }
      html.push(`<li>${inline(ol[1])}</li>`);
      return;
    }
    // Empty line
    if (line.trim() === "") {
      closeList();
      html.push("");
      return;
    }
    // Paragraph
    closeList();
    html.push(`<p>${inline(line)}</p>`);
  });

  closeList();
  return html.join("\n");
}

/**
 * Load all blog posts, sorted newest first.
 * Each post includes all frontmatter fields plus:
 *   - slug: URL-friendly identifier derived from filename
 *   - rawContent: the raw markdown body
 */
let cachedPosts = null;

export async function getAllPosts() {
  if (cachedPosts) return cachedPosts;

  // Vite resolves this glob at build time
  const modules = import.meta.glob("/src/content/blog/*.md", { query: "?raw", import: "default", eager: true });

  const posts = Object.entries(modules).map(([path, raw]) => {
    const filename = path.split("/").pop().replace(".md", "");
    // Filename format: YYYY-MM-DD-slug  →  extract the slug portion
    const slugMatch = filename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
    const slug = slugMatch ? slugMatch[1] : filename;

    const { frontmatter, content } = parseFrontmatter(raw);

    return {
      slug,
      title: frontmatter.title || "Untitled",
      date: frontmatter.date || "",
      author: frontmatter.author || "AMM Team",
      category: frontmatter.category || "Digital Marketing",
      excerpt: frontmatter.excerpt || "",
      featuredImage: frontmatter.featuredImage || "",
      featuredImageAlt: frontmatter.featuredImageAlt || "",
      seo: frontmatter.seo || {},
      rawContent: content,
    };
  });

  // Sort newest first
  cachedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return cachedPosts;
}

/**
 * Get a single post by slug.
 */
export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Format a date string (YYYY-MM-DD) for display.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

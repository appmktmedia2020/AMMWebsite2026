import { useEffect } from "react";

/**
 * Injects a JSON-LD structured data script into <head> for the current page.
 * Cleans up on unmount so stale schemas don't persist across route changes.
 *
 * Usage:
 *   <StructuredData schema={{ "@context": "https://schema.org", "@type": "Service", ... }} />
 *   <StructuredData schema={[schema1, schema2]} />  // array for multiple schemas
 */
export default function StructuredData({ schema }) {
  const schemaStr = JSON.stringify(schema);
  useEffect(() => {
    const parsed = JSON.parse(schemaStr);
    const schemas = Array.isArray(parsed) ? parsed : [parsed];
    const scripts = schemas.map(s => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-sd", "page"); // marker for cleanup
      el.textContent = JSON.stringify(s);
      document.head.appendChild(el);
      return el;
    });
    return () => scripts.forEach(el => el.parentNode && el.parentNode.removeChild(el));
  }, [schemaStr]);

  return null;
}

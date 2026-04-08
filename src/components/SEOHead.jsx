import { useEffect } from "react";

/**
 * Sets all document head meta tags for SEO per page.
 * Handles: title, description, canonical, og:*, twitter:*
 */
export default function SEOHead({ title, description, canonical, ogImage }) {
  useEffect(() => {
    document.title = title;

    const BASE_URL = "https://www.appmktmedia.com";
    const image = ogImage
      ? (ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`)
      : `${BASE_URL}/og-image.jpg`;

    const setMeta = (attr, name, content) => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "description", description);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonical || `${BASE_URL}/`);
    setMeta("property", "og:site_name", "Appalachian Marketing & Media");
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:type", "image/jpeg");
    setMeta("property", "og:image:alt", title);

    // Twitter Card — update per page
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical || `${BASE_URL}/`);
  }, [title, description, canonical, ogImage]);

  return null;
}

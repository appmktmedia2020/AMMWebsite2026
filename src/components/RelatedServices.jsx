import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const allServices = [
  { name: "Website Design", href: "/services/website-design", keyword: "website-design" },
  { name: "SEO", href: "/services/seo", keyword: "seo" },
  { name: "Social Media Management", href: "/services/social-media-management", keyword: "social-media-management" },
  { name: "Social Media Advertising", href: "/services/social-media-advertising", keyword: "social-media-advertising" },
  { name: "Graphic Design", href: "/services/graphic-design", keyword: "graphic-design" },
  { name: "Strategic Consulting", href: "/services/strategic-consulting", keyword: "strategic-consulting" },
  { name: "Educational Services", href: "/services/educational-services", keyword: "educational-services" },
];

const topLocations = [
  { name: "Portsmouth, OH", href: "/websites/portsmouth-oh" },
  { name: "Ironton, OH", href: "/websites/ironton-oh" },
  { name: "Ashland, KY", href: "/websites/ashland-ky" },
  { name: "Gallipolis, OH", href: "/websites/gallipolis-oh" },
  { name: "Jackson, OH", href: "/websites/jackson-oh" },
  { name: "Waverly, OH", href: "/websites/waverly-oh" },
];

/**
 * Internal linking section for service pages.
 * Renders "Explore Other Services" + top location links.
 * Pass `current` as the keyword of the current page to exclude it.
 */
export default function RelatedServices({ current }) {
  useScrollAnimation();

  const others = allServices.filter(s => s.keyword !== current);

  return (
    <section style={{ padding: "60px 0", background: "#fff", borderTop: "1px solid rgba(37,81,106,0.06)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          {/* Related services */}
          <div style={{ flex: "1 1 400px" }}>
            <p className="animate-on-scroll" style={{
              fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
              letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: 12,
            }}>Explore Our Other Services</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {others.map((s, i) => (
                <Link key={i} to={s.href} style={{
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
                  color: "var(--color-primary)", background: "var(--color-light-bg)",
                  padding: "8px 18px", borderRadius: 30, textDecoration: "none",
                  border: "1px solid rgba(37,81,106,0.08)", transition: "all .25s ease",
                  display: "inline-block",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--color-light-bg)"; e.currentTarget.style.color = "var(--color-primary)"; }}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Top locations */}
          <div style={{ flex: "1 1 300px" }}>
            <p className="animate-on-scroll" style={{
              fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
              letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: 12,
            }}>Areas We Serve</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topLocations.map((loc, i) => (
                <Link key={i} to={loc.href} style={{
                  fontFamily: "var(--font-body)", fontSize: 14,
                  color: "var(--color-body)", textDecoration: "none",
                  padding: "6px 14px", borderRadius: 20,
                  border: "1px solid rgba(37,81,106,0.1)", transition: "all .25s ease",
                  display: "inline-block",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(37,81,106,0.1)"; e.currentTarget.style.color = "var(--color-body)"; }}>
                  {loc.name}
                </Link>
              ))}
              <Link to="/about/areas-we-service" style={{
                fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--color-accent)", textDecoration: "none",
                padding: "6px 14px", display: "inline-block",
              }}>View all areas →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

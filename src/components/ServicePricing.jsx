import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Link } from "react-router-dom";

/**
 * Reusable pricing section for service pages.
 * Matches the card style from the marketing-packages page.
 * 
 * Props:
 *   overline - small text above heading (default: "Investment")
 *   heading - section heading
 *   description - paragraph below heading (optional)
 *   tiers - array of { name, price, unit, tagline, features[], highlight?, badge? }
 *   footnote - text below the cards (optional)
 */
export default function ServicePricing({
  overline = "Investment",
  heading = "Pricing",
  description,
  tiers = [],
  footnote,
}) {
  useScrollAnimation();

  const checkIcon = (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <section style={{ padding: "80px 0", background: "var(--color-light-bg)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 50px" }}>
          <p className="animate-on-scroll" style={{
            fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
            letterSpacing: "2px", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 14,
          }}>{overline}</p>
          <h2 className="animate-on-scroll delay-1" style={{
            fontFamily: "var(--font-heading)", fontWeight: 700,
            fontSize: "clamp(28px,4vw,36px)", color: "var(--color-dark)",
            lineHeight: 1.25, marginBottom: 16,
          }}>{heading}</h2>
          {description && (
            <p className="animate-on-scroll delay-2" style={{
              fontFamily: "var(--font-body)", fontSize: 16, color: "var(--color-body)",
              lineHeight: 1.7, maxWidth: 560, margin: "0 auto",
            }}>{description}</p>
          )}
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${tiers.length <= 2 ? "300px" : "280px"}, 1fr))`,
          gap: 24,
          alignItems: "stretch",
          maxWidth: tiers.length <= 2 ? 700 : "none",
          margin: "0 auto",
        }}>
          {tiers.map((t, i) => (
            <div key={i} className={`animate-on-scroll delay-${i + 1}`} style={{
              background: t.highlight ? "var(--color-primary)" : "#fff",
              borderRadius: 16,
              padding: t.highlight ? "40px 30px" : "34px 30px",
              boxShadow: t.highlight ? "0 16px 48px rgba(37,81,106,0.15)" : "0 4px 24px rgba(0,0,0,0.06)",
              border: t.highlight ? "2px solid var(--color-accent)" : "1px solid rgba(37,81,106,0.08)",
              position: "relative",
              transition: "all .3s ease",
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Badge */}
              {t.badge && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-heading)",
                  fontWeight: 700, fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "6px 20px", borderRadius: 20, whiteSpace: "nowrap",
                }}>
                  {t.badge}
                </div>
              )}

              {/* Tier name */}
              <p style={{
                fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
                letterSpacing: "1.5px", textTransform: "uppercase",
                color: t.highlight ? "var(--color-accent)" : "var(--color-accent)",
                marginBottom: 8,
              }}>{t.name}</p>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{
                  fontFamily: "var(--font-heading)", fontWeight: 800,
                  fontSize: t.price && t.price.length > 6 ? (t.highlight ? 28 : 26) : (t.highlight ? 44 : 40),
                  color: t.highlight ? "#fff" : "var(--color-dark)",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}>{t.price}</span>
                {t.unit && (
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 15,
                    color: t.highlight ? "rgba(255,255,255,0.6)" : "var(--color-body)",
                  }}>{t.unit}</span>
                )}
              </div>

              {/* Tagline */}
              {t.tagline && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 15,
                  color: t.highlight ? "rgba(255,255,255,0.7)" : "var(--color-body)",
                  lineHeight: 1.6, marginBottom: 20, fontStyle: "italic",
                }}>{t.tagline}</p>
              )}

              {/* Divider */}
              <div style={{
                width: "100%", height: 1,
                background: t.highlight ? "rgba(255,255,255,0.15)" : "rgba(37,81,106,0.08)",
                marginBottom: 20,
              }} />

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {checkIcon}
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 14.5,
                      color: t.highlight ? "rgba(255,255,255,0.85)" : "var(--color-dark)",
                      lineHeight: 1.5,
                    }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link to="/contact" style={{
                display: "block", textAlign: "center", marginTop: 28,
                fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15,
                background: t.highlight ? "var(--color-accent)" : "var(--color-primary)",
                color: "#fff", border: "none", borderRadius: 30,
                padding: "14px 20px", textDecoration: "none",
                transition: "all 0.3s ease", letterSpacing: "0.5px",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Footnote */}
        {footnote && (
          <p className="animate-on-scroll delay-5" style={{
            textAlign: "center", marginTop: 36,
            fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-body)",
            lineHeight: 1.7, maxWidth: 600, margin: "36px auto 0",
          }}>{footnote}</p>
        )}
      </div>
    </section>
  );
}

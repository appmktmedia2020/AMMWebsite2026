import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { styles as s } from "../styles/shared";
import { icons } from "./Icons";
/**
 * Call-to-action section.
 */
export default function CTASection({
  heading = "Let's Talk About What You Need",
  body = "No pressure, no hard sell, just a conversation about how we can help your business grow. Serving businesses across Southern Ohio, Eastern Kentucky, and West Virginia.",
  showMap = true,
}) {
  useScrollAnimation();

  return (
    <>
      <section style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, #1a3d52 100%)",
        padding: "60px 0 80px", position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(0,0,0,0.25)",
      }}>
        <div className="dot-grid" style={{ top: 20, right: 40, opacity: 0.15 }} />

        <div style={{ ...s.container, display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 500px" }}>
            <h2 className="animate-on-scroll" style={{
              fontFamily: "var(--font-heading)", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 38px)", color: "#fff", lineHeight: 1.25, marginBottom: 18,
            }}>
              {heading}
            </h2>
            <p className="animate-on-scroll delay-1" style={{
              fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7, maxWidth: 520, marginBottom: 32,
            }}>
              {body}
            </p>
            <div className="animate-on-scroll delay-2" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <Link to="/contact" style={s.btnPrimary}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-dark)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}>
                Schedule a Consultation
              </Link>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.6)",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: "var(--color-accent)" }}>{icons.phone}</span> Or call{" "}
                <a href="tel:+17406725069" style={{ color: "var(--color-accent)", textDecoration: "none" }}>(740) 672-5069</a>
              </span>
            </div>
          </div>

          {showMap && (
            <div className="animate-on-scroll delay-3" style={{ flex: "1 1 540px", display: "flex", justifyContent: "center", minWidth: 0 }}>
              <div style={{
                width: "100%", maxWidth: 840, aspectRatio: "4/3", borderRadius: 20,
                overflow: "hidden", position: "relative",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}>
                <img loading="lazy" src="/images/cta-background.jpeg"
                  alt="Aerial view of downtown Portsmouth, Ohio - AMM service area"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

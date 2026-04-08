import { styles as s } from "../styles/shared";

/**
 * Reusable hero/page banner for inner pages.
 * Accepts overline, title, and subtitle as props.
 */
export default function PageBanner({ overline, title, subtitle }) {
  return (
    <section style={{
      background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
      paddingTop: 75, position: "relative", overflow: "hidden",
    }}>
      <div className="dot-grid" style={{ top: 100, right: 60, width: 160, height: 160 }} />
      <div style={{
        position: "absolute", top: 0, right: "25%", width: 2, height: "140%",
        background: "linear-gradient(to bottom, transparent, rgba(205,155,66,0.15), transparent)",
        transform: "rotate(15deg)", transformOrigin: "top center",
      }} />

      <div style={{ ...s.container, padding: "80px 20px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        {overline && (
          <p style={{ ...s.overline, color: "var(--color-accent)", marginBottom: 16, animation: "fadeIn 0.6s ease forwards" }}>
            {overline}
          </p>
        )}
        <h1 style={{
          fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff",
          fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.15,
          letterSpacing: "-0.5px", marginBottom: 20, maxWidth: 800, margin: "0 auto 20px",
          animation: "fadeInUp 0.8s ease forwards",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 19, color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7, maxWidth: 600, margin: "0 auto",
            animation: "fadeInUp 0.8s ease 0.15s forwards", opacity: 0,
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";

/**
 * Floating back-to-top button. Previously copy-pasted into all 16 page files.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 997,
        width: 48, height: 48, borderRadius: "50%",
        background: "var(--color-primary)", color: "#fff",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent)"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--color-primary)"}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

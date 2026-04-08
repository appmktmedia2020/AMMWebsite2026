// ─── Shared inline style objects ────────────────────────────────────────────
// Used across all pages for consistent styling

export const styles = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 20px", width: "100%" },
  sectionPad: { padding: "80px 0" },
  // Shorthand aliases used by inner pages
  get pad() { return this.sectionPad; },
  overline: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
    letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase",
    marginBottom: 12,
  },
  h2: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 36px)",
    color: "var(--color-dark)", lineHeight: 1.25, marginBottom: 16,
  },
  h3: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px, 3vw, 24px)",
    color: "var(--color-dark)", lineHeight: 1.3, marginBottom: 8,
  },
  body: {
    fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 17, lineHeight: 1.7,
    color: "var(--color-body)",
  },
  btnPrimary: {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15,
    background: "var(--color-accent)", color: "#fff", border: "none",
    borderRadius: 30, padding: "14px 34px", cursor: "pointer",
    transition: "all 0.3s ease", letterSpacing: "0.5px", display: "inline-flex",
    alignItems: "center", gap: 8, textDecoration: "none",
  },
  // Shorthand alias
  get btnP() { return this.btnPrimary; },
  btnOutline: {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15,
    background: "transparent", color: "var(--color-accent)",
    border: "2px solid var(--color-accent)", borderRadius: 30,
    padding: "12px 32px", cursor: "pointer", transition: "all 0.3s ease",
    letterSpacing: "0.5px", display: "inline-flex", alignItems: "center",
    gap: 8, textDecoration: "none",
  },
  // Shorthand alias
  get btnO() { return this.btnOutline; },
};

// Mobile nav link styles
export const mLinkStyle = {
  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20,
  color: "#fff", textDecoration: "none", letterSpacing: "0.5px",
  padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "block",
};

export const mobileSubLinkStyle = {
  fontFamily: "var(--font-body)", fontSize: 16,
  color: "rgba(255,255,255,0.7)", textDecoration: "none",
  padding: "6px 0 6px 20px", display: "block",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

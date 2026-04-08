import { Link } from "react-router-dom";
import { styles as s } from "../styles/shared";
import { ROUTES, FOOTER_COMPANY_LINKS, FOOTER_SERVICE_LINKS, SOCIAL_LINKS } from "../data/routes";
import { socialIconMap } from "./Icons";

/**
 * Site footer. Previously copy-pasted into all 16 page files.
 */
export default function Footer() {
  const CHARCOAL = "#212529";
  const CHARCOAL_BORDER = "rgba(255,255,255,0.08)";

  const linkStyle = {
    fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.6)",
    textDecoration: "none", display: "block", marginBottom: 4, padding: "6px 0",
    transition: "color 0.2s",
  };
  const headingStyle = {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16,
    color: "var(--color-accent)", marginBottom: 20,
  };

  return (
    <footer style={{ background: CHARCOAL, padding: "60px 0 0" }}>
      <div style={{ ...s.container, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, paddingBottom: 50 }} className="footer-grid">
        {/* Col 1 - Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <img src="/images/amm-logo.png" alt="Appalachian Marketing & Media" style={{ height: 60, width: "auto", marginLeft: -8 }} />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 20 }}>
            Full-Service Marketing | Southern Ohio
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {SOCIAL_LINKS.map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center", color: "#fff",
                transition: "all 0.3s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-accent)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                {socialIconMap[social.name]}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 - Company */}
        <div>
          <h4 style={headingStyle}>Company</h4>
          {FOOTER_COMPANY_LINKS.map((l) => (
            <Link key={l} to={ROUTES[l] || "#"} style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>
              {l}
            </Link>
          ))}
        </div>

        {/* Col 3 - Services */}
        <div>
          <h4 style={headingStyle}>Services</h4>
          {FOOTER_SERVICE_LINKS.map((l) => (
            <Link key={l} to={ROUTES[l] || "#"} style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>
              {l}
            </Link>
          ))}
        </div>

        {/* Col 4 - Contact */}
        <div>
          <h4 style={headingStyle}>Contact</h4>
          <a href="tel:+17406725069" style={{...linkStyle, display:"flex", alignItems:"center", gap:8}}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,flexShrink:0}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            (740) 672-5069
          </a>
          <a href="mailto:contact@appmktmedia.com" style={{...linkStyle, display:"flex", alignItems:"center", gap:8}}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,flexShrink:0}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            contact@appmktmedia.com
          </a>
          <p style={{ ...linkStyle, cursor: "default", lineHeight: 1.6 }}>
            <span style={{display:"flex", alignItems:"flex-start", gap:8}}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,flexShrink:0,marginTop:2}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>3879 Rhodes Ave, Suite 226<br />New Boston, OH 45662</span>
            </span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${CHARCOAL_BORDER}`, padding: "20px 0" }}>
        <div style={{ ...s.container, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontFamily: "var(--font-meta)", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            © 2026 Appalachian Marketing & Media. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {["Terms of Service", "Privacy Policy"].map((l) => (
              <Link key={l} to={ROUTES[l] || "#"} style={{ fontFamily: "var(--font-meta)", fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", padding: "4px 0" }}>{l}</Link>
            ))}
            <a href="https://www.appmktmedia.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-meta)", fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.3px" }}>Designed by</span>
              <img loading="lazy" src="/images/amm-logo-white.png" alt="Appalachian Marketing & Media" style={{ height: 32, width: "auto", opacity: 0.55, transition: "opacity 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.55"} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles as s, mLinkStyle, mobileSubLinkStyle } from "../styles/shared";
import { ROUTES, NAV_SERVICES, NAV_ABOUT } from "../data/routes";
import { icons } from "./Icons";

/**
 * Main navigation bar. Uses react-router <Link> for SPA navigation (no full page reloads).
 * Dropdown delay: 350ms to allow diagonal mouse movement to submenu.
 * Mobile touch targets: min-height 48px on all interactive elements.
 */
export default function Navbar({ activeNav = "" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mSvcOpen, setMSvcOpen] = useState(false);
  const [mAbtOpen, setMAbtOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const navigate = useNavigate();

  const svcTimer = useRef(null);
  const abtTimer = useRef(null);
  const handleSvcEnter = () => { clearTimeout(svcTimer.current); setServicesOpen(true); };
  const handleSvcLeave = () => { svcTimer.current = setTimeout(() => setServicesOpen(false), 350); };
  const handleAbtEnter = () => { clearTimeout(abtTimer.current); setAboutOpen(true); };
  const handleAbtLeave = () => { abtTimer.current = setTimeout(() => setAboutOpen(false), 350); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(svcTimer.current);
      clearTimeout(abtTimer.current);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMSvcOpen(false);
    setMAbtOpen(false);
  }, [activeNav]);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
    background: scrolled ? "rgba(20,40,55,0.97)" : "#0f2a3a",
    backdropFilter: scrolled ? "blur(8px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
    transition: "all 0.3s ease",
    boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "none",
    height: 75,
  };

  const linkStyle = {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
    color: "#fff", textDecoration: "none", letterSpacing: "0.5px",
    transition: "color 0.2s", cursor: "pointer", display: "flex",
    alignItems: "center", gap: 4, whiteSpace: "nowrap",
  };

  const dropdownStyle = {
    position: "absolute", top: "100%", left: 0,
    borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    padding: "12px 0", minWidth: 240, zIndex: 10,
  };

  const dropLinkStyle = {
    display: "block", padding: "12px 24px", fontFamily: "var(--font-body)",
    fontSize: 15, color: "var(--color-dark)", textDecoration: "none",
    transition: "all 0.2s",
  };

  const ChevronIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ width: 18, height: 18, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
      aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <nav style={navStyle} aria-label="Main navigation">
      <div style={{ ...s.container, display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/images/amm-logo.png" alt="Appalachian Marketing & Media" style={{ height: 50, width: "auto" }} />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%" }} className="desktop-nav">
          <Link to="/" style={linkStyle} className={`nav-glass-link ${activeNav === "Home" ? "nav-link-active" : ""}`}>Home</Link>
          <Link to="/marketing-packages" style={linkStyle} className={`nav-glass-link ${activeNav === "Marketing Packages" ? "nav-link-active" : ""}`}>Packages</Link>

          {/* Services dropdown */}
          <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
            onMouseEnter={handleSvcEnter} onMouseLeave={handleSvcLeave}>
            <span style={linkStyle} className={`nav-glass-link ${activeNav === "Services" ? "nav-link-active" : ""}`}
              role="button" tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                  e.preventDefault(); setServicesOpen(true);
                  setTimeout(() => { const first = document.querySelector("#nav-svc-dropdown a"); if (first) first.focus(); }, 50);
                }
                if (e.key === "Escape") setServicesOpen(false);
              }}
              aria-haspopup="true" aria-expanded={servicesOpen} aria-controls="nav-svc-dropdown">
              Services {icons.chevronDown}
            </span>
            {servicesOpen && (
              <div id="nav-svc-dropdown" style={{ ...dropdownStyle, background: "none", boxShadow: "none" }} className="nav-glass-dropdown"
                onMouseEnter={handleSvcEnter} onMouseLeave={handleSvcLeave}
                onKeyDown={e => { if (e.key === "Escape") { setServicesOpen(false); e.currentTarget.previousElementSibling?.focus(); } }}>
                {NAV_SERVICES.map((name, i) => (
                  <Link key={i} to={ROUTES[name] || "#"} style={dropLinkStyle}>
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/our-work" style={linkStyle} className={`nav-glass-link ${activeNav === "Our Work" ? "nav-link-active" : ""}`}>Our Work</Link>
          <Link to="/blog" style={linkStyle} className={`nav-glass-link ${activeNav === "Blog" ? "nav-link-active" : ""}`}>Blog</Link>

          {/* About dropdown */}
          <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
            onMouseEnter={handleAbtEnter} onMouseLeave={handleAbtLeave}>
            <span style={linkStyle} className={`nav-glass-link ${activeNav === "About" ? "nav-link-active" : ""}`}
              role="button" tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter") navigate("/about");
                if (e.key === " " || e.key === "ArrowDown") {
                  e.preventDefault(); setAboutOpen(true);
                  setTimeout(() => { const first = document.querySelector("#nav-abt-dropdown a"); if (first) first.focus(); }, 50);
                }
                if (e.key === "Escape") setAboutOpen(false);
              }}
              aria-haspopup="true" aria-expanded={aboutOpen} aria-controls="nav-abt-dropdown">
              About {icons.chevronDown}
            </span>
            {aboutOpen && (
              <div id="nav-abt-dropdown" style={{ ...dropdownStyle, background: "none", boxShadow: "none" }} className="nav-glass-dropdown"
                onMouseEnter={handleAbtEnter} onMouseLeave={handleAbtLeave}
                onKeyDown={e => { if (e.key === "Escape") { setAboutOpen(false); e.currentTarget.previousElementSibling?.focus(); } }}>
                {NAV_ABOUT.map((name, i) => (
                  <Link key={i} to={ROUTES[name] || "#"} style={dropLinkStyle}>
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/pricing" style={linkStyle} className={`nav-glass-link ${activeNav === "Pricing" ? "nav-link-active" : ""}`}>Pricing</Link>
          <Link to="/contact" style={{ ...s.btnPrimary, padding: "10px 22px", fontSize: 13, whiteSpace: "nowrap" }}>Contact Us</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none", minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center" }}
          className="mobile-menu-btn"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}>
          {mobileOpen ? icons.close : icons.menu}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 75, left: 0, right: 0, bottom: 0,
          background: "var(--color-primary)", zIndex: 998, padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 4, overflowY: "auto",
        }}>
          <Link to="/" style={{ ...mLinkStyle, minHeight: 48, display: "flex", alignItems: "center", color: activeNav === "Home" ? "var(--color-accent)" : "#fff" }}>Home</Link>
          <Link to="/marketing-packages" style={{ ...mLinkStyle, minHeight: 48, display: "flex", alignItems: "center", color: activeNav === "Marketing Packages" ? "var(--color-accent)" : "#fff" }}>Packages</Link>

          {/* Services accordion */}
          <div>
            <button onClick={() => setMSvcOpen(!mSvcOpen)} style={{
              ...mLinkStyle, background: "none", border: "none", width: "100%", textAlign: "left",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              minHeight: 48, color: activeNav === "Services" ? "var(--color-accent)" : "#fff",
            }}>
              Services <ChevronIcon open={mSvcOpen} />
            </button>
            <div className={`mobile-subnav ${mSvcOpen ? "open" : ""}`} style={{ paddingLeft: 16 }}>
              <Link to="/services/website-design" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Website Design</Link>
              <Link to="/services/seo" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>SEO</Link>
              <Link to="/services/social-media-management" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Social Media Management</Link>
              <Link to="/services/social-media-advertising" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Social Media Advertising</Link>
              <Link to="/services/graphic-design" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Graphic Design</Link>
              <Link to="/services/strategic-consulting" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Strategic Consulting</Link>
              <Link to="/services/educational-services" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Educational Services</Link>
            </div>
          </div>

          <Link to="/our-work" style={{ ...mLinkStyle, minHeight: 48, display: "flex", alignItems: "center", color: activeNav === "Our Work" ? "var(--color-accent)" : "#fff" }}>Our Work</Link>
          <Link to="/blog" style={{ ...mLinkStyle, minHeight: 48, display: "flex", alignItems: "center", color: activeNav === "Blog" ? "var(--color-accent)" : "#fff" }}>Blog</Link>

          {/* About accordion */}
          <div>
            <button onClick={() => setMAbtOpen(!mAbtOpen)} style={{
              ...mLinkStyle, background: "none", border: "none", width: "100%", textAlign: "left",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              minHeight: 48, color: activeNav === "About" ? "var(--color-accent)" : "#fff",
            }}>
              About <ChevronIcon open={mAbtOpen} />
            </button>
            <div className={`mobile-subnav ${mAbtOpen ? "open" : ""}`} style={{ paddingLeft: 16 }}>
              <Link to="/about" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>About Us</Link>
              <Link to="/about/areas-we-service" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Areas We Service</Link>
              <Link to="/about/internship-program" style={{ ...mobileSubLinkStyle, minHeight: 48, display: "flex", alignItems: "center" }}>Internship Program</Link>
            </div>
          </div>

          <Link to="/pricing" style={{ ...mLinkStyle, minHeight: 48, display: "flex", alignItems: "center", color: activeNav === "Pricing" ? "var(--color-accent)" : "#fff" }}>Pricing</Link>
          <Link to="/contact" style={{ ...s.btnPrimary, justifyContent: "center", marginTop: 10, minHeight: 48 }}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
}

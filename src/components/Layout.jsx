import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileCTA from "./MobileCTA";
import BackToTop from "./BackToTop";

/**
 * Shared page layout. Wraps every page with Navbar, Footer, MobileCTA, and BackToTop.
 * Pages only need to provide their unique content + the activeNav indicator.
 * Transition: fades in + slides up slightly on every route change.
 */
export default function Layout({ activeNav, children }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [pathname]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
    }}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar activeNav={activeNav} />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <MobileCTA />
      <BackToTop />
    </div>
  );
}

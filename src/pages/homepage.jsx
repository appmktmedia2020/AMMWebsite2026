import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { styles as s } from "../styles/shared";
import { icons } from "../components/Icons";

// ─── Glassmorphism style helpers ────────────────────────────────────────────

const glass = {
  light: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  frosted: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(31,38,53,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  dark: {
    background: "rgba(15,42,58,0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
};

// ─── Homepage-specific sections ─────────────────────────────────────────────

const HERO_PHRASES = ["Real Results.", "Built Local.", "No Contracts.", "Real People."];

function Hero() {
  const phrases = HERO_PHRASES;
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  // Typewriter cycle
  useEffect(() => {
    const target = phrases[phraseIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, phraseIdx]);

  return (
    <section style={{
      background: "linear-gradient(135deg, #0f2a3a 0%, #1a3d52 40%, #1B6FAD 100%)",
      paddingTop: 75, minHeight: "85vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blurred orbs */}
      <div style={{
        position: "absolute", top: "10%", right: "15%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(27,111,173,0.3) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "10%", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(205,155,66,0.15) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }} />
      <div className="dot-grid" style={{ top: 100, right: 60, width: 160, height: 160 }} />
      <div className="dot-grid" style={{ bottom: 40, left: 30, width: 100, height: 100, opacity: 0.2 }} />
      <div style={{
        position: "absolute", top: 0, right: "25%", width: 2, height: "140%",
        background: "linear-gradient(to bottom, transparent, rgba(205,155,66,0.15), transparent)",
        transform: "rotate(15deg)", transformOrigin: "top center",
      }} />

      <div style={{ ...s.container, display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap-reverse", padding: "60px 20px", boxSizing: "border-box", width: "100%" }}>
        <div style={{ flex: "1 1 300px", zIndex: 1, textAlign: "left", minWidth: 0, maxWidth: "100%" }}>
          <p style={{ ...s.overline, color: "var(--color-accent)", marginBottom: 20, animation: "fadeIn 0.6s ease forwards" }}>
            Full-Service Marketing Agency
          </p>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff",
            fontSize: "clamp(36px, 5.5vw, 56px)", lineHeight: 1.15,
            letterSpacing: "-0.5px", marginBottom: 24, animation: "fadeInUp 0.8s ease forwards",
          }}>
            Your Marketing Team.{" "}
            <br />
            <span style={{ fontStyle: "italic", color: "var(--color-accent)", display: "inline", minWidth: "2px" }}>
              {displayed}
              <span style={{
                display: "inline-block", width: 3, height: "0.85em",
                background: "var(--color-accent)", marginLeft: 2, verticalAlign: "middle",
                animation: "cursorBlink 0.8s step-end infinite",
              }} />
            </span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 19, color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7, maxWidth: 520, marginBottom: 36,
            animation: "fadeInUp 0.8s ease 0.15s forwards", opacity: 0,
          }}>
            Full-service marketing for businesses across Southern Ohio, Eastern Kentucky, and West Virginia.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeInUp 0.8s ease 0.3s forwards", opacity: 0 }}>
            <Link to="/contact" style={s.btnPrimary}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Schedule a Consultation
            </Link>
            <Link to="/our-work" style={{
              ...s.btnOutline, color: "#fff", borderColor: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
              View Our Work
            </Link>
          </div>
        </div>

        {/* Hero image with parallax */}
        <div style={{ flex: "1 1 300px", position: "relative", display: "flex", justifyContent: "center", animation: "slideInRight 0.9s ease 0.2s forwards", opacity: 0, minWidth: 0, maxWidth: "100%" }}>
          <div style={{ width: "100%", maxWidth: 840, aspectRatio: "4/3", borderRadius: 20, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <img
              src="/images/team-photo.jpeg"
              alt="AMM team collaborating on a marketing project"
              fetchpriority="high"
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function LogoBanner() {
  // Duplicate logos for seamless infinite scroll
  const logos = [
    { name: "Foundations for the Trades", url: "/images/logos/foundations-trades.png", link: "https://fftohio.org/" },
    { name: "Future Plans", url: "/images/logos/future-plans.png", link: "https://futureplans.org/" },
    { name: "General Heating & Air Conditioning", url: "/images/logos/ghac.png", link: "https://ghacinc.com/" },
    { name: "Glockner", url: "/images/logos/glockner.png", link: "https://glocknerinsurance.com/" },
    { name: "Ohio Pest Control", url: "/images/logos/ohio-pest-control.png", link: "https://www.ohiopest.com/" },
    { name: "Scioto County", url: "/images/logos/scioto-county.png", link: "https://www.sciotocountyoh.com/" },
    { name: "Compass Community Health", url: "/images/logos/compass-health.png", link: "https://www.compasscommunityhealth.org/" },
    { name: "T-Mobile", url: "/images/logos/t-mobile.png", link: "https://www.t-mobile.com/" },
    { name: "Shawnee State University", url: "/images/logos/shawnee-state.png", link: "https://www.shawnee.edu/" },
  ];

  return (
    <section style={{
      background: "#fff",
      padding: "60px 0",
      overflow: "hidden",
      position: "relative",
      borderTop: "1px solid rgba(37,81,106,0.06)",
      borderBottom: "1px solid rgba(37,81,106,0.06)",
    }}>
      <div style={s.container}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...s.overline, color: "var(--color-accent)" }}>Our Clients</p>
          <h2 style={{ ...s.h2, fontSize: 32 }}>Trusted by Leading Brands</h2>
        </div>
      </div>

      {/* Scrolling logo container */}
      <div style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}>
        <div className="logo-scroll-track" style={{
          display: "flex",
          gap: "60px",
          animation: "scroll 30s linear infinite",
          width: "fit-content",
        }}>
          {/* First set of logos */}
          {logos.map((logo, i) => (
            <a key={`logo-1-${i}`} href={logo.link} target="_blank" rel="noopener noreferrer" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "180px",
              height: "80px",
              textDecoration: "none",
            }}>
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                style={{
                  maxWidth: "180px",
                  maxHeight: "80px",
                  width: "auto",
                  height: "auto",
                  opacity: 0.6,
                  filter: "grayscale(100%)",
                  transition: "all 0.3s ease",
                  mixBlendMode: "multiply",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.filter = "grayscale(0%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.6";
                  e.currentTarget.style.filter = "grayscale(100%)";
                }}
              />
            </a>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, i) => (
            <a key={`logo-2-${i}`} href={logo.link} target="_blank" rel="noopener noreferrer" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "180px",
              height: "80px",
              textDecoration: "none",
            }}>
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                style={{
                  maxWidth: "180px",
                  maxHeight: "80px",
                  width: "auto",
                  height: "auto",
                  opacity: 0.6,
                  filter: "grayscale(100%)",
                  transition: "all 0.3s ease",
                  mixBlendMode: "multiply",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.filter = "grayscale(0%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.6";
                  e.currentTarget.style.filter = "grayscale(100%)";
                }}
              />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-scroll-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function ServicesSection() {
  useScrollAnimation();
  const services = [
    { title: "Comprehensive Marketing", desc: "A full marketing team for less than the cost of one employee.", link: "/marketing-packages", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80" },
    { title: "Website Design & Development", desc: "Custom websites built to turn visitors into customers.", link: "/services/website-design", img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80" },
    { title: "SEO", desc: "Get found when people search for what you offer.", link: "/services/seo", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=700&q=80" },
    { title: "Social Media Management", desc: "Show up consistently and build trust with your audience.", link: "/services/social-media-management", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80" },
    { title: "Social Media Advertising", desc: "Get in front of the right people with targeted ad campaigns.", link: "/services/social-media-advertising", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80" },
    { title: "Graphic Design", desc: "Professional visuals that represent your brand across digital and print.", link: "/services/graphic-design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80" },
    { title: "Educational Services", desc: "We teach you how to do your own marketing.", link: "/services/educational-services", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80" },
  ];

  return (
    <section style={{
      ...s.sectionPad,
      background: "linear-gradient(180deg, #e4eef6 0%, #f0f4f8 50%, #e8f1fa 100%)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(27,111,173,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-8%", left: "20%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(205,155,66,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={s.container}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 50px" }}>
          <p className="animate-on-scroll" style={s.overline}>What We Do</p>
          <h2 className="animate-on-scroll delay-1" style={s.h2}>Everything Your Business Needs to Grow</h2>
          <p className="animate-on-scroll delay-2" style={{ ...s.body, maxWidth: 600, margin: "0 auto" }}>
            We offer everything from websites to social media to full-scale marketing strategy. Each service works great on its own, but they work best when they work together.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {services.map((svc, i) => (
            <Link key={i} to={svc.link} className={`animate-on-scroll delay-${Math.min(i + 1, 6)}`}
              style={{
                borderRadius: 18, overflow: "hidden", position: "relative",
                height: 280, display: "flex", flexDirection: "column", justifyContent: "flex-end",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all .4s cubic-bezier(.4,0,.2,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(37,81,106,0.2)";
                const img = e.currentTarget.querySelector("img"); if (img) img.style.transform = "scale(1.08)";
                const ov = e.currentTarget.querySelector(".hp-svc-ov"); if (ov) ov.style.background = "linear-gradient(to top, rgba(10,20,30,0.95) 0%, rgba(10,20,30,0.7) 50%, rgba(10,20,30,0.15) 100%)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                const img = e.currentTarget.querySelector("img"); if (img) img.style.transform = "scale(1)";
                const ov = e.currentTarget.querySelector(".hp-svc-ov"); if (ov) ov.style.background = "linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)";
              }}>
              <img src={svc.img} alt={svc.title} loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }} />
              <div className="hp-svc-ov" style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)",
                transition: "background .4s ease",
              }} />
              <div style={{ position: "relative", zIndex: 1, padding: "0 24px 22px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.3, margin: "0 0 6px" }}>{svc.title}</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>{svc.desc}</p>
                  <span style={{
                    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 12,
                    color: "#fff", background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 24, padding: "5px 14px",
                    display: "flex", alignItems: "center", gap: 3, flexShrink: 0, whiteSpace: "nowrap",
                    transition: "all .3s ease",
                  }}>
                    Learn more <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 12, height: 12 }}><path d="M9 18l6-6-6-6" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  useScrollAnimation();
  const reasons = [
    { icon: icons.team, title: "A Dedicated Team That Knows Your Name", desc: "You get regular check-ins, strategy meetings, and a team that actually picks up the phone. No runaround, no waiting weeks for a response." },
    { icon: icons.mapPin, title: "We Know This Market", desc: "We live here, work here, and understand how people in this region make decisions. A far away agency doesn't know your customers the way we do." },
    { icon: icons.chart, title: "Results You Can Actually See", desc: "We don't hide behind confusing reports. More phone calls, more leads, more customers, that's what we track, and that's what we deliver." },
    { icon: icons.noContract, title: "No Contracts. Ever.", desc: "We're the easiest marketing team to fire, and we say that with confidence. Month-to-month billing, no long-term commitments." },
  ];

  return (
    <section style={{
      ...s.sectionPad,
      background: "linear-gradient(135deg, #0f2a3a 0%, #1a3d52 50%, #25516A 100%)",
      position: "relative",
      paddingTop: 60,
    }}>
      {/* Background image with transparency */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url(/images/team-holiday.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.12,
        pointerEvents: "none",
      }} />
      
      <div style={{
        position: "absolute", top: "20%", left: "5%", width: 350, height: 350,
        background: "radial-gradient(circle, rgba(27,111,173,0.2) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "10%", width: 250, height: 250,
        background: "radial-gradient(circle, rgba(205,155,66,0.12) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={s.container}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 60, flexWrap: "wrap" }}>
          {/* Left glass panel */}
          <div className="animate-on-scroll" style={{ flex: "1 1 380px", position: "relative", minHeight: 420 }}>
            <div style={{
              ...glass.light,
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
              padding: 40,
              background: "rgba(15,42,58,0.75)",
            }}>
              <div style={{ ...s.overline, color: "var(--color-accent)", marginBottom: 20 }}>Trusted Partner</div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, color: "#fff", lineHeight: 1.3, marginBottom: 20 }}>
                Why Businesses Across the Tri-State Choose Us
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                We're not a faceless agency. We're your neighbors, your partners, and your biggest advocates.
              </p>
              <div style={{
                marginTop: 30, padding: "16px 20px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--color-accent)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Serving Since Day One</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Southern Ohio • Eastern Kentucky • West Virginia</div>
              </div>
            </div>
          </div>

          {/* Right - glass reason cards */}
          <div style={{ flex: "1 1 480px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {reasons.map((r, i) => (
              <div key={i} className={`animate-on-scroll delay-${i + 1}`}
                style={{
                  ...glass.light,
                  padding: "28px 24px",
                  transition: "all 0.35s ease",
                  background: "rgba(15,42,58,0.82)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.background = "rgba(15,42,58,0.92)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "rgba(15,42,58,0.82)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                <div style={{ color: "var(--color-accent)", marginBottom: 14 }}>{r.icon}</div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{r.title}</h4>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.85)" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  useScrollAnimation();
  const [activeTest, setActiveTest] = useState(0);
  const pausedRef = useRef(false);

  const testimonials = [
    { quote: "Abe and team have been fabulous to work with! I appreciate their diligence and attention to detail.", name: "Sandy M.", business: "ESC" },
    { quote: "My experience with Appalachian Marketing and Media has been great. The website turned out better than the more expensive company I previously used and it was minimal effort on my part. What makes Appalachian stand out is their superior combination of artistic talent, content creation, and technological know how. I'll definitely use them for everything going forward.", name: "Jared B.", business: "Burnside Brankamp Law" },
    { quote: "Appalachian Marketing did a complete website design for me. They were awesome to work with & so professional! It looks great & is exactly what I wanted. I could tell that everyone was passionate about what they do! They stayed in contact with me & had my site running quickly. Their knowledge & agility blew my mind & I look forward to growing my business with them!", name: "Phil L.", business: "PH Earthworks" },
  ];

  useEffect(() => {
    const interval = setInterval(() => { if (!pausedRef.current) setActiveTest((p) => (p + 1) % 3); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const workImages = [
    { name: "Redline Excavation", src: "/images/portfolio/redline.png", url: "https://redlineexcavationlandscape.com/" },
    { name: "Gallia County Court", src: "/images/portfolio/gallia-court.png", url: "https://www.galliacountycommonpleascourt.gov/" },
    { name: "SCOESC", src: "/images/portfolio/scoesc.png", url: "https://www.scoesc.org/" },
    { name: "Jesse Scott Law", src: "/images/portfolio/jesse-scott-law.png", url: "https://www.southernohiolaw.com/" },
    { name: "Jade Hill", src: "/images/portfolio/jade-hill.png", url: "https://www.jadehillco.com/" },
    { name: "Divine Safety", src: "/images/portfolio/divine-safety.png", url: "https://www.divsafety.com/" },
  ];

  return (
    <section style={{
      ...s.sectionPad,
      background: "linear-gradient(180deg, #f0f4f8 0%, #e8f1fa 50%, #dfe9f3 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "30%", left: "-5%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(37,81,106,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={s.container}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <p className="animate-on-scroll" style={s.overline}>Trusted Partners</p>
          <h2 className="animate-on-scroll delay-1" style={s.h2}>Trusted by Businesses Across the Region</h2>
        </div>

        {/* Glass stat callout */}
        <div className="animate-on-scroll delay-2" style={{
          ...glass.frosted,
          textAlign: "center", marginBottom: 50, padding: "30px 40px",
          display: "inline-flex", width: "100%", justifyContent: "center", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 48, color: "var(--color-primary)", lineHeight: 1 }}>75+</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--color-body)" }}>websites built for businesses just like yours</span>
        </div>

        {/* Client website mockups */}
        <div className="animate-on-scroll delay-3" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 30, 
          marginBottom: 60, 
          padding: "20px 0" 
        }}>
          {workImages.map((work, i) => (
            <a key={i} href={work.url} target="_blank" rel="noopener noreferrer" style={{
              transition: "all 0.35s ease",
              cursor: "pointer",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(37,81,106,0.15)",
              position: "relative",
              display: "block",
              textDecoration: "none",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 52px rgba(37,81,106,0.28)";
                const overlay = e.currentTarget.querySelector(".work-overlay");
                if (overlay) overlay.style.opacity = "1";
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,81,106,0.15)";
                const overlay = e.currentTarget.querySelector(".work-overlay");
                if (overlay) overlay.style.opacity = "0";
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}>
              <img 
                loading="lazy" 
                src={work.src} 
                alt={`${work.name} website mockup`}
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  display: "block",
                  transition: "transform 0.5s ease",
                }} 
              />
              {/* Hover name overlay */}
              <div className="work-overlay" style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,28,44,0.88) 0%, rgba(10,28,44,0.2) 50%, transparent 100%)",
                opacity: 0,
                transition: "opacity 0.35s ease",
                display: "flex", alignItems: "flex-end", padding: "20px 22px",
              }}>
                <div>
                  <div style={{ width: 28, height: 3, background: "var(--color-accent)", borderRadius: 2, marginBottom: 8 }} />
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", margin: 0, lineHeight: 1.2 }}>{work.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>View project →</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Glass testimonial card, fixed-height container, all items stay in DOM as absolute */}
        <div className="animate-on-scroll delay-4" role="region" aria-label="Customer testimonials" aria-roledescription="carousel" style={{
          ...glass.frosted,
          maxWidth: 740, margin: "0 auto", textAlign: "center",
          position: "relative", cursor: "default",
          padding: "40px 24px 30px",
          boxSizing: "border-box",
          width: "100%",
        }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onFocus={() => { pausedRef.current = true; }}
          onBlur={() => { pausedRef.current = false; }}>
          <div style={{ color: "var(--color-accent)", marginBottom: 16, display: "flex", justifyContent: "center" }}>{icons.quote}</div>
          {/* Fixed-height slide area: all items absolutely positioned, no layout reflow */}
          <div className="testimonial-slide-container" style={{ position: "relative", minHeight: 300 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                position: "absolute", top: 0, left: 0, right: 0,
                opacity: activeTest === i ? 1 : 0,
                transform: activeTest === i ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                pointerEvents: activeTest === i ? "auto" : "none",
                // visibility kept visible to prevent flash; opacity handles show/hide
              }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 400, color: "var(--color-dark)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 24 }}>
                  "{t.quote}"
                </p>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-light-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "var(--color-primary)", margin: "0 auto 10px", border: "2px solid rgba(37,81,106,0.12)" }}>
                  {t.name.charAt(0)}
                </div>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, color: "var(--color-dark)" }}>{t.name}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-accent)", marginTop: 2 }}>{t.business}</p>
              </div>
            ))}
          </div>
          {/* Dot navigation */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTest(i)} aria-label={`Show testimonial ${i + 1}`} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: activeTest === i ? "var(--color-accent)" : "rgba(37,81,106,0.2)",
                border: "none", cursor: "pointer", transition: "all 0.3s ease",
                transform: activeTest === i ? "scale(1.4)" : "scale(1)",
                padding: 0,
              }} />
            ))}
          </div>
        </div>

        <p className="animate-on-scroll delay-5" style={{ textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, color: "var(--color-body)", marginTop: 40, letterSpacing: "0.5px" }}>
          Proud to serve our community.
        </p>
      </div>
    </section>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function Homepage() {
  return (
    <Layout activeNav="Home">
      <SEOHead
        title="Marketing Agency in Southern Ohio, KY & WV | Appalachian Marketing & Media"
        description="Full-service marketing agency in Southern Ohio, Eastern Kentucky & West Virginia. 75+ websites built, no contracts. Website design, SEO, social media & more. Call (740) 672-5069."
        canonical="https://www.appmktmedia.com/"
      />
      <Hero />
      <LogoBanner />
<ServicesSection />
      <WhyChoose />
      <div style={{ height: 4, background: "var(--color-accent)", width: "100%" }} />
      <TrustSection />
      <CTASection />
    </Layout>
  );
}

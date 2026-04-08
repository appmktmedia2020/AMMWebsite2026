import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import StructuredData from "../components/StructuredData";
import { useAnim } from "../hooks/useScrollAnimation";
import { locationMap } from "../data/locations";

/* ── Shared inline styles (matching site conventions) ───────────────────── */
const S = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 20px", width: "100%" },
  pad: { padding: "80px 0" },
  overline: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
    letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase",
    marginBottom: 12,
  },
  h2: {
    fontFamily: "var(--font-heading)", fontWeight: 700,
    fontSize: "clamp(28px, 4vw, 36px)", color: "var(--color-dark)",
    lineHeight: 1.25, marginBottom: 16,
  },
  body: {
    fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 17,
    lineHeight: 1.7, color: "var(--color-body)",
  },
  btnP: {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15,
    background: "var(--color-accent)", color: "#fff", border: "none",
    borderRadius: 30, padding: "14px 34px", cursor: "pointer",
    transition: "all .3s ease", letterSpacing: ".5px",
    display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
  },
};

/* ── Inline SVG icons ───────────────────────────────────────────────────── */
const IC = {
  check: (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{ width: 18, height: 18, flexShrink: 0 }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  community: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  handshake: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  education: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  heart: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  home: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  globe: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  users: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  star: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  quote: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--color-accent)" style={{ width: 28, height: 28, opacity: 0.3 }}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
    </svg>
  ),
  mp: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  ),
  sm: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  wd: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  ad: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  seo: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  gd: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  ),
};

const benefitIcons = [IC.community, IC.handshake, IC.education];
const statIcons = [IC.heart, IC.home, IC.globe, IC.users];
const serviceIcons = { mp: IC.mp, sm: IC.sm, wd: IC.wd, ad: IC.ad, seo: IC.seo, gd: IC.gd };
const serviceLabels = {
  mp: "Marketing Packages",
  sm: "Social Media",
  wd: "Website Development",
  ad: "Advertising",
  seo: "SEO Services",
  gd: "Graphic Design",
};

/* ── Hero Section ───────────────────────────────────────────────────────── */
function HeroBanner({ data }) {
  return (
    <section style={{
      background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
      paddingTop: 75, position: "relative", overflow: "hidden",
    }}>
      <div className="dot-grid" style={{ top: 90, right: 60, width: 160, height: 160 }} />
      <div style={{
        position: "absolute", top: 0, right: "30%", width: 2, height: "140%",
        background: "linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",
        transform: "rotate(12deg)", transformOrigin: "top center",
      }} />

      <div style={{
        ...S.container, padding: "80px 20px 60px", position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", gap: 50, flexWrap: "wrap",
      }}>
        <div style={{ flex: "1 1 520px" }}>
          <p style={{ ...S.overline, animation: "fadeIn .6s ease forwards" }}>Website Design & Development</p>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff",
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.12,
            letterSpacing: "-0.5px", marginBottom: 20,
            animation: "fadeInUp .8s ease forwards",
          }}>
            {data.h1}
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 18, color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7, maxWidth: 540, marginBottom: 14,
            animation: "fadeInUp .8s ease .15s forwards", opacity: 0,
          }}>
            {data.subheading}
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, maxWidth: 520, marginBottom: 30,
            animation: "fadeInUp .8s ease .2s forwards", opacity: 0,
          }}>
            {data.heroText}
          </p>
          <div style={{ animation: "fadeInUp .8s ease .3s forwards", opacity: 0 }}>
            <Link to="/contact" style={S.btnP}
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}>
              Schedule a Free Consultation
            </Link>
          </div>
        </div>

        {/* Values pills */}
        <div style={{
          flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 16,
          animation: "fadeInUp .9s ease .25s forwards", opacity: 0,
        }}>
          {data.values.map((v, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
              padding: "18px 24px", display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(205,155,66,0.15)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                color: "var(--color-accent)",
              }}>
                {IC.check}
              </span>
              <span style={{
                fontFamily: "var(--font-heading)", fontWeight: 600,
                fontSize: 15, color: "#fff", letterSpacing: "0.3px",
              }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Stakes / Pain Point ────────────────────────────────────────────────── */
function StakesBar({ text }) {
  return (
    <section style={{ background: "var(--color-accent)", padding: "28px 0" }}>
      <div style={{ ...S.container, textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(15px, 2.2vw, 17px)",
          color: "#fff", lineHeight: 1.6, maxWidth: 720, margin: "0 auto",
        }}>
          {text}
        </p>
      </div>
    </section>
  );
}

/* ── Solution / Features ────────────────────────────────────────────────── */
function SolutionSection({ data }) {
  return (
    <section style={{ ...S.pad, background: "#fff" }}>
      <div style={S.container}>
        <div className="anim" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 50px" }}>
          <p style={S.overline}>{data.h2}</p>
          <h2 style={S.h2}>{data.h2Sub}</h2>
          <p style={S.body}>{data.h2Text}</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {data.features.map((f, i) => (
            <div key={i} className="anim" style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: "var(--color-light-bg)", borderRadius: 14,
              padding: "22px 24px", border: "1px solid rgba(37,81,106,0.06)",
              transitionDelay: `${i * 0.08}s`,
            }}>
              <span style={{ marginTop: 2 }}>{IC.check}</span>
              <span style={{ ...S.body, fontSize: 16 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About / Community ──────────────────────────────────────────────────── */
function CommunitySection({ data }) {
  return (
    <section style={{ ...S.pad, background: "var(--color-light-bg)" }}>
      <div style={S.container}>
        <div style={{ display: "flex", gap: 50, flexWrap: "wrap", alignItems: "center" }}>
          <div className="anim" style={{ flex: "1 1 500px" }}>
            <p style={S.overline}>About Us</p>
            <h2 style={S.h2}>{data.h3}</h2>
            <p style={{ ...S.body, marginBottom: 24 }}>{data.h3Text}</p>
            <img
              loading="lazy"
              src="/images/team-photo.jpeg"
              alt="Appalachian Marketing & Media team"
              style={{
                width: "100%", maxWidth: 480, borderRadius: 16,
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <div style={{ flex: "1 1 400px" }}>
            <h3 className="anim" style={{
              fontFamily: "var(--font-heading)", fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 26px)", color: "var(--color-dark)",
              lineHeight: 1.3, marginBottom: 8,
            }}>
              {data.h4}
            </h3>
            <p className="anim" style={{ ...S.body, fontSize: 14, marginBottom: 28, color: "var(--color-accent)" }}>
              {data.h4Sub}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {data.benefits.map((b, i) => (
                <div key={i} className="anim" style={{
                  display: "flex", gap: 18, alignItems: "flex-start",
                  transitionDelay: `${i * 0.1}s`,
                }}>
                  <span style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "rgba(205,155,66,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                    color: "var(--color-accent)",
                  }}>
                    {benefitIcons[i]}
                  </span>
                  <div>
                    <h4 style={{
                      fontFamily: "var(--font-heading)", fontWeight: 700,
                      fontSize: 17, color: "var(--color-dark)", marginBottom: 4,
                    }}>
                      {b.title}
                    </h4>
                    <p style={{ ...S.body, fontSize: 15 }}>{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats ───────────────────────────────────────────────────────────────── */
function StatsSection({ stats }) {
  return (
    <section style={{
      background: "linear-gradient(135deg, #25516A 0%, #1a3d52 100%)",
      padding: "60px 0",
    }}>
      <div style={{
        ...S.container,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 30,
      }}>
        {stats.map((st, i) => (
          <div key={i} className="anim" style={{
            textAlign: "center", padding: "24px 16px",
            transitionDelay: `${i * 0.1}s`,
          }}>
            <div style={{
              display: "flex", justifyContent: "center", marginBottom: 12,
              color: "var(--color-accent)",
            }}>
              {statIcons[i]}
            </div>
            <p style={{
              fontFamily: "var(--font-heading)", fontWeight: 700,
              fontSize: 14, color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6,
            }}>
              {st.label}
            </p>
            <p style={{
              fontFamily: "var(--font-heading)", fontWeight: 700,
              fontSize: "clamp(16px, 2.5vw, 18px)", color: "#fff", lineHeight: 1.4,
            }}>
              {st.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────────────────── */
function TestimonialsSection({ h5, testimonials }) {
  return (
    <section style={{ ...S.pad, background: "#fff" }}>
      <div style={S.container}>
        <div className="anim" style={{ textAlign: "center", marginBottom: 50 }}>
          <p style={S.overline}>Testimonials</p>
          <h2 style={S.h2}>{h5}</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 28,
        }}>
          {testimonials.map((t, i) => (
            <div key={i} className="anim" style={{
              background: "var(--color-light-bg)", borderRadius: 18,
              padding: "32px 28px", position: "relative",
              border: "1px solid rgba(37,81,106,0.06)",
              transitionDelay: `${i * 0.12}s`,
            }}>
              <div style={{ marginBottom: 16 }}>{IC.quote}</div>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, j) => <span key={j}>{IC.star}</span>)}
              </div>
              <p style={{ ...S.body, fontSize: 15, marginBottom: 18, fontStyle: "italic" }}>
                "{t.text.length > 220 ? t.text.substring(0, 220) + "…" : t.text}"
              </p>
              <p style={{
                fontFamily: "var(--font-heading)", fontWeight: 700,
                fontSize: 14, color: "var(--color-dark)",
              }}>
                {t.name.replace(/^[''-]+/, "")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Additional Services ─────────────────────────────────────────────────── */
function ServicesGrid({ h6, services }) {
  const entries = Object.entries(services);
  return (
    <section style={{ ...S.pad, background: "var(--color-light-bg)" }}>
      <div style={S.container}>
        <div className="anim" style={{ textAlign: "center", marginBottom: 50 }}>
          <p style={S.overline}>Full-Service Marketing</p>
          <h2 style={S.h2}>{h6}</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 22,
        }}>
          {entries.map(([key, desc], i) => (
            <div key={key} className="anim" style={{
              background: "#fff", borderRadius: 16, padding: "28px 24px",
              border: "1px solid rgba(37,81,106,0.06)",
              display: "flex", gap: 16, alignItems: "flex-start",
              transitionDelay: `${i * 0.08}s`,
            }}>
              <span style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(37,81,106,0.06)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                color: "var(--color-primary)",
              }}>
                {serviceIcons[key]}
              </span>
              <div>
                <h4 style={{
                  fontFamily: "var(--font-heading)", fontWeight: 700,
                  fontSize: 16, color: "var(--color-dark)", marginBottom: 6,
                }}>
                  {serviceLabels[key]}
                </h4>
                <p style={{ ...S.body, fontSize: 14 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Bottom CTA ──────────────────────────────────────────────────────────── */
function BottomCTA({ data }) {
  return (
    <section style={{
      background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
      padding: "70px 0", position: "relative", overflow: "hidden",
    }}>
      <div className="dot-grid" style={{ top: 30, left: 40, opacity: 0.12 }} />
      <div style={{ ...S.container, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="anim">
          <p style={{ ...S.overline, color: "var(--color-accent)" }}>{data.h7}</p>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 38px)", color: "#fff",
            lineHeight: 1.25, marginBottom: 12,
          }}>
            {data.h7Sub}
          </h2>
        </div>

        <div className="anim" style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: "var(--font-heading)", fontWeight: 600,
            fontSize: 18, color: "var(--color-accent)", marginBottom: 20,
          }}>
            {data.cta}
          </p>
          <div style={{
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          }}>
            {data.ctaBenefits.map((b, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "var(--font-body)", fontSize: 15,
                color: "rgba(255,255,255,0.75)",
              }}>
                {IC.check} {b}
              </span>
            ))}
          </div>
        </div>

        <div className="anim">
          <Link to="/contact" style={{ ...S.btnP, padding: "16px 40px", fontSize: 16 }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}>
            Schedule Your Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   Main Location Page Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LocationPage() {
  const { locationSlug } = useParams();
  const data = locationMap[locationSlug];
  useAnim();

  if (!data) {
    return (
      <Layout activeNav="Services">
        <div style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", padding: 40,
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 36,
            color: "var(--color-dark)", marginBottom: 16,
          }}>
            Location Not Found
          </h1>
          <p style={S.body}>We couldn't find a page for this location.</p>
          <Link to="/about/areas-we-service" style={{ ...S.btnP, marginTop: 24 }}>
            View All Service Areas
          </Link>
        </div>
      </Layout>
    );
  }

  const BASE = "https://www.appmktmedia.com";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Appalachian Marketing & Media",
    "description": data.heroText,
    "url": `${BASE}${data.slug}`,
    "telephone": "+17406725069",
    "areaServed": {
      "@type": "Place",
      "name": data.h1.replace("Website Design In ", "").replace("Website Design in ", ""),
    },
    "serviceType": "Website Design",
    "priceRange": "$$",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.heroText,
    "url": `${BASE}${data.slug}`,
    "isPartOf": { "@type": "WebSite", "name": "Appalachian Marketing & Media", "url": BASE },
  };

  return (
    <Layout activeNav="Services">
      <SEOHead
        title={`${data.title} | Appalachian Marketing & Media`}
        description={data.heroText}
        canonical={`${BASE}${data.slug}`}
      />
      <StructuredData schema={[localBusinessSchema, webPageSchema]} />

      <HeroBanner data={data} />
      <StakesBar text={data.stakesSentence} />
      <SolutionSection data={data} />
      <CommunitySection data={data} />
      <StatsSection stats={data.stats} />
      <TestimonialsSection h5={data.h5} testimonials={data.testimonials} />
      <ServicesGrid h6={data.h6} services={data.services} />
      <BottomCTA data={data} />
    </Layout>
  );
}

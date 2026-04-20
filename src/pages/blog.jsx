import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import { useAnim } from "../hooks/useScrollAnimation";
import { getAllPosts, formatDate } from "../utils/blog";

const S = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 20px", width: "100%" },
  overline: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
    letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: 12,
  },
  h2: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(28px,4vw,36px)",
    color: "var(--color-dark)", lineHeight: 1.25, marginBottom: 16,
  },
  body: { fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 17, lineHeight: 1.7, color: "var(--color-body)" },
  btnP: {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15,
    background: "var(--color-accent)", color: "#fff", border: "none",
    borderRadius: 30, padding: "10px 24px", cursor: "pointer",
    transition: "all .3s ease", letterSpacing: ".5px",
    display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
  },
};

const CATEGORIES = ["All", "Local SEO", "Social Media", "Website Design", "Graphic Design", "Digital Marketing", "Business Tips", "Agency News"];

function CategoryBadge({ cat }) {
  const colors = {
    "Local SEO": "#1B6FAD",
    "Social Media": "#6B403A",
    "Website Design": "#25516A",
    "Graphic Design": "#4a2a6a",
    "Digital Marketing": "#1a5c4a",
    "Business Tips": "#CD9B42",
    "Agency News": "#1F2235",
  };
  return (
    <span style={{
      fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11,
      letterSpacing: "1.5px", textTransform: "uppercase",
      background: colors[cat] || "#25516A", color: "#fff",
      padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {cat}
    </span>
  );
}

function PostCard({ post, featured = false }) {
  const [hover, setHover] = useState(false);
  const delay = ["d1", "d2", "d3", "d4"];

  if (featured) {
    return (
      <article
        className="anim d1"
        aria-labelledby={`post-title-${post.slug}`}
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: hover ? "0 20px 60px rgba(37,81,106,0.18)" : "0 4px 24px rgba(37,81,106,0.08)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          display: "flex",
          flexWrap: "wrap",
          marginBottom: 40,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Featured image or gradient placeholder */}
        <div style={{
          flex: "1 1 360px",
          minHeight: 280,
          background: post.featuredImage
            ? `url(${post.featuredImage}) center/cover no-repeat`
            : "linear-gradient(135deg, #25516A 0%, #1B6FAD 100%)",
          display: "flex",
          alignItems: "flex-end",
          padding: 28,
          position: "relative",
        }}>
          {!post.featuredImage && (
            <span style={{
              fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(48px,7vw,72px)",
              color: "rgba(255,255,255,0.08)", position: "absolute", top: 16, right: 20,
              lineHeight: 1, letterSpacing: "-2px",
            }}>AMM</span>
          )}
          <CategoryBadge cat={post.category} />
        </div>
        <div style={{ flex: "1 1 360px", padding: "36px 40px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ ...S.overline, marginBottom: 8 }}>Featured Post</p>
          <h2 id={`post-title-${post.slug}`} style={{
            fontFamily: "var(--font-heading)", fontWeight: 800,
            fontSize: "clamp(22px,3vw,30px)", color: "var(--color-dark)",
            lineHeight: 1.25, marginBottom: 16,
          }}>
            {post.title}
          </h2>
          <p style={{ ...S.body, fontSize: 16, marginBottom: 24, flex: 1 }}>{post.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Link
              to={`/blog/${post.slug}`}
              style={S.btnP}
              onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-dark)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}
            >
              Read Article
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-body)", opacity: 0.7 }}>
              {formatDate(post.date)} · {post.author}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`anim`}
      aria-labelledby={`post-title-${post.slug}`}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hover ? "0 12px 40px rgba(37,81,106,0.15)" : "0 2px 16px rgba(37,81,106,0.07)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        height: 180,
        background: post.featuredImage
          ? `url(${post.featuredImage}) center/cover no-repeat`
          : "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: 18,
      }}>
        {!post.featuredImage && (
          <span style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 42,
            color: "rgba(255,255,255,0.07)", position: "absolute", top: 8, right: 14,
            lineHeight: 1,
          }}>AMM</span>
        )}
        <CategoryBadge cat={post.category} />
      </div>
      <div style={{ padding: "24px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 id={`post-title-${post.slug}`} style={{
          fontFamily: "var(--font-heading)", fontWeight: 700,
          fontSize: "clamp(17px,2vw,20px)", color: "var(--color-dark)",
          lineHeight: 1.3, marginBottom: 12, flex: 1,
        }}>
          {post.title}
        </h3>
        <p style={{ ...S.body, fontSize: 15, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-body)", opacity: 0.65 }}>
            {formatDate(post.date)}
          </span>
          <Link
            to={`/blog/${post.slug}`}
            style={{
              fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
              color: "var(--color-primary)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "gap 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.gap = "10px"}
            onMouseLeave={e => e.currentTarget.style.gap = "6px"}
          >
            Read More
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  useAnim([posts, activeCategory]);

  useEffect(() => {
    getAllPosts()
      .then(p => { setPosts(p); })
      .catch(err => console.error("Failed to load blog posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Layout activeNav="Blog">
      <SEOHead
        title="Blog | Appalachian Marketing & Media"
        description="Marketing insights, local SEO tips, and digital strategy for small businesses in Southern Ohio, Eastern Kentucky, and West Virginia."
        canonical="https://www.appmktmedia.com/blog"
      />

      {/* Hero Banner */}
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
        <div style={{ ...S.container, padding: "80px 20px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ ...S.overline, color: "var(--color-accent)", marginBottom: 16, animation: "fadeIn 0.6s ease forwards" }}>
            AMM Blog
          </p>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff",
            fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.15,
            letterSpacing: "-0.5px", marginBottom: 20, maxWidth: 700, margin: "0 auto 20px",
            animation: "fadeInUp 0.8s ease forwards",
          }}>
            Marketing Insights for <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>Real Businesses</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 19, color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7, maxWidth: 580, margin: "0 auto",
            animation: "fadeInUp 0.8s ease 0.15s forwards", opacity: 0,
          }}>
            Practical tips on local SEO, web design, social media, and digital marketing — written for small businesses in our region.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ background: "#fff", borderBottom: "1px solid rgba(37,81,106,0.1)", position: "sticky", top: 75, zIndex: 10 }}>
        <div style={{ ...S.container, padding: "0 20px" }}>
          <div role="tablist" style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13,
                  color: activeCategory === cat ? "var(--color-primary)" : "var(--color-body)",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "16px 20px", whiteSpace: "nowrap",
                  borderBottom: activeCategory === cat ? "2px solid var(--color-accent)" : "2px solid transparent",
                  transition: "all 0.2s ease", letterSpacing: "0.5px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section style={{ background: "var(--color-light-bg)", padding: "60px 0 80px" }}>
        <div style={S.container}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-body)", fontFamily: "var(--font-body)" }}>
              Loading posts…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ ...S.body, fontSize: 18 }}>No posts found in this category yet.</p>
            </div>
          ) : (
            <>
              {featured && <PostCard post={featured} featured />}
              {rest.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 28,
                }}>
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection
        heading="Want Marketing Insights Like This for Your Business?"
        body="AMM works with small businesses across Southern Ohio, Eastern Kentucky, and West Virginia. Schedule a free consultation and let's talk about what's actually holding your business back online."
      />
    </Layout>
  );
}

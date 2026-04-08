import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import StructuredData from "../components/StructuredData";
import { getPostBySlug, getAllPosts, formatDate, markdownToHtml } from "../utils/blog";

const S = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 20px", width: "100%" },
  overline: {
    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13,
    letterSpacing: "2px", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: 12,
  },
  body: { fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 17, lineHeight: 1.7, color: "var(--color-body)" },
  btnO: {
    fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
    background: "transparent", color: "var(--color-primary)",
    border: "2px solid var(--color-primary)", borderRadius: 30,
    padding: "9px 22px", cursor: "pointer", transition: "all .3s ease",
    letterSpacing: ".5px", display: "inline-flex", alignItems: "center",
    gap: 8, textDecoration: "none",
  },
};

function CategoryBadge({ cat }) {
  const colors = {
    "Local SEO": "#1B6FAD", "Social Media": "#6B403A",
    "Website Design": "#25516A", "Graphic Design": "#4a2a6a",
    "Digital Marketing": "#1a5c4a", "Business Tips": "#CD9B42", "Agency News": "#1F2235",
  };
  return (
    <span style={{
      fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11,
      letterSpacing: "1.5px", textTransform: "uppercase",
      background: colors[cat] || "#25516A", color: "#fff",
      padding: "4px 12px", borderRadius: 20,
    }}>{cat}</span>
  );
}

function RelatedCard({ post }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        boxShadow: hover ? "0 12px 40px rgba(37,81,106,0.15)" : "0 2px 16px rgba(37,81,106,0.07)",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        height: 140,
        background: post.featuredImage
          ? `url(${post.featuredImage}) center/cover no-repeat`
          : "linear-gradient(135deg, #25516A 0%, #1B6FAD 100%)",
        display: "flex", alignItems: "flex-end", padding: 14,
      }}>
        <CategoryBadge cat={post.category} />
      </div>
      <div style={{ padding: "20px 24px 24px" }}>
        <h4 style={{
          fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16,
          color: "var(--color-dark)", lineHeight: 1.35, marginBottom: 12,
        }}>{post.title}</h4>
        <Link
          to={`/blog/${post.slug}`}
          style={{
            fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13,
            color: "var(--color-primary)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          Read Article
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </article>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const found = await getPostBySlug(slug);
        if (!found) { navigate("/blog", { replace: true }); return; }
        setPost(found);

        const all = await getAllPosts();
        const rel = all
          .filter(p => p.slug !== slug && p.category === found.category)
          .slice(0, 3);
        // If not enough in same category, fill from others
        if (rel.length < 3) {
          const others = all.filter(p => p.slug !== slug && p.category !== found.category).slice(0, 3 - rel.length);
          setRelated([...rel, ...others]);
        } else {
          setRelated(rel);
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        navigate("/blog", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, navigate]);

  if (loading) {
    return (
      <Layout>
        <div style={{
          minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-body)", color: "var(--color-body)",
        }}>
          Loading…
        </div>
      </Layout>
    );
  }

  if (!post) return null;

  const htmlContent = DOMPurify.sanitize(markdownToHtml(post.rawContent));
  const metaTitle = post.seo?.metaTitle || `${post.title} | AMM Blog`;
  const metaDesc = post.seo?.metaDescription || post.excerpt;

  return (
    <Layout activeNav="Blog">
      <SEOHead
        title={metaTitle}
        description={metaDesc}
        canonical={`https://www.appmktmedia.com/blog/${post.slug}`}
        ogImage={post.featuredImage || undefined}
      />
      <StructuredData schema={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "author": { "@type": "Person", "name": post.author },
        "datePublished": post.date,
        "description": metaDesc,
        "url": `https://www.appmktmedia.com/blog/${post.slug}`,
        "image": post.featuredImage || undefined,
        "publisher": {
          "@type": "Organization",
          "name": "Appalachian Marketing & Media",
          "logo": { "@type": "ImageObject", "url": "https://www.appmktmedia.com/images/amm-logo.png" },
        },
      }} />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
        paddingTop: 75, position: "relative", overflow: "hidden",
      }}>
        <div className="dot-grid" style={{ top: 80, right: 60, width: 160, height: 160 }} />
        <div style={{
          position: "absolute", top: 0, right: "28%", width: 2, height: "140%",
          background: "linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",
          transform: "rotate(14deg)", transformOrigin: "top center",
        }} />

        <div style={{ ...S.container, padding: "60px 20px 56px", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, animation: "fadeIn 0.6s ease forwards" }}>
            <Link to="/blog" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", letterSpacing: "0.5px" }}>
              Blog
            </Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px" }}>
              {post.category}
            </span>
          </nav>

          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 16, animation: "fadeIn 0.6s ease 0.1s forwards", opacity: 0 }}>
              <CategoryBadge cat={post.category} />
            </div>
            <h1 style={{
              fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff",
              fontSize: "clamp(26px,4.5vw,46px)", lineHeight: 1.15,
              letterSpacing: "-0.5px", marginBottom: 24,
              animation: "fadeInUp 0.8s ease 0.1s forwards", opacity: 0,
            }}>
              {post.title}
            </h1>
            <div style={{
              display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
              animation: "fadeInUp 0.8s ease 0.2s forwards", opacity: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "#fff",
                }}>
                  {post.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14, color: "#fff", margin: 0 }}>{post.author}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>{formatDate(post.date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image (if present) */}
      {post.featuredImage && (
        <div style={{ background: "#1a3d52" }}>
          <div style={{ ...S.container }}>
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block", borderRadius: "0 0 16px 16px" }}
            />
          </div>
        </div>
      )}

      {/* Article body + sidebar */}
      <section style={{ background: "var(--color-light-bg)", padding: "60px 0 80px" }}>
        <div style={{ ...S.container, display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Main content */}
          <div style={{ flex: "1 1 560px", minWidth: 0 }}>
            <article style={{
              background: "#fff", borderRadius: 20,
              padding: "clamp(28px, 5vw, 56px)",
              boxShadow: "0 2px 24px rgba(37,81,106,0.08)",
            }}>
              {/* Excerpt lead */}
              {post.excerpt && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.75,
                  color: "var(--color-dark)", fontWeight: 600,
                  borderLeft: "4px solid var(--color-accent)",
                  paddingLeft: 20, marginBottom: 36,
                }}>
                  {post.excerpt}
                </p>
              )}
              {/* Rendered markdown */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </article>

            {/* Back to blog */}
            <div style={{ marginTop: 32 }}>
              <Link
                to="/blog"
                style={S.btnO}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-primary)"; }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15 }}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to All Posts
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ flex: "0 1 300px", minWidth: 260 }}>
            {/* About AMM card */}
            <div style={{
              background: "linear-gradient(135deg, #25516A 0%, #1a3d52 100%)",
              borderRadius: 16, padding: "28px 28px 32px",
              marginBottom: 28, textAlign: "center",
            }}>
              <div className="dot-grid" style={{ top: 0, right: 0, width: 80, height: 80, opacity: 0.2 }} />
              <p style={{ ...S.overline, color: "var(--color-accent)", marginBottom: 10 }}>About AMM</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 20 }}>
                Appalachian Marketing & Media is a full-service digital marketing agency serving small businesses across Southern Ohio, Eastern Kentucky, and West Virginia.
              </p>
              <Link
                to="/contact"
                style={{
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14,
                  background: "var(--color-accent)", color: "#fff", borderRadius: 30,
                  padding: "10px 22px", textDecoration: "none", display: "inline-block",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-dark)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}
              >
                Get a Free Consultation
              </Link>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <p style={{ ...S.overline, marginBottom: 16 }}>More Articles</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {related.map(p => <RelatedCard key={p.slug} post={p} />)}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Blog post content styles */}
      <style>{`
        .blog-content h2 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(20px, 3vw, 26px);
          color: var(--color-dark);
          line-height: 1.3;
          margin: 36px 0 14px;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--color-light-bg);
        }
        .blog-content h3 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(17px, 2.5vw, 21px);
          color: var(--color-dark);
          line-height: 1.35;
          margin: 28px 0 10px;
        }
        .blog-content h4 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 17px;
          color: var(--color-primary);
          margin: 22px 0 8px;
        }
        .blog-content p {
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.8;
          color: var(--color-body);
          margin-bottom: 18px;
        }
        .blog-content ul, .blog-content ol {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.75;
          color: var(--color-body);
          padding-left: 28px;
          margin-bottom: 20px;
        }
        .blog-content li { margin-bottom: 8px; }
        .blog-content ul li::marker { color: var(--color-accent); }
        .blog-content ol li::marker { color: var(--color-primary); font-weight: 700; }
        .blog-content strong { font-weight: 700; color: var(--color-dark); }
        .blog-content em { font-style: italic; }
        .blog-content a {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: var(--color-accent);
          text-underline-offset: 3px;
        }
        .blog-content a:hover { color: var(--color-accent); }
        .blog-content hr {
          border: none;
          border-top: 2px solid var(--color-light-bg);
          margin: 36px 0;
        }
      `}</style>

      <CTASection
        heading="Ready to Grow Your Business Online?"
        body="AMM helps small businesses across Southern Ohio, Eastern Kentucky, and West Virginia get found and get results. Let's have a conversation."
      />
    </Layout>
  );
}

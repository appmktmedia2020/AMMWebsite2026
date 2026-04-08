import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./styles/global.css";

// ── Lazy-loaded page components ────────────────────────────────────────────
const Homepage = lazy(() => import("./pages/homepage"));
const AboutUs = lazy(() => import("./pages/about-us"));

const WebsiteDesign = lazy(() => import("./pages/website-design"));
const SEOPage = lazy(() => import("./pages/seo-page"));
const SocialMediaManagement = lazy(() => import("./pages/social-media-management"));
const SocialMediaAdvertising = lazy(() => import("./pages/social-media-advertising"));
const GraphicDesign = lazy(() => import("./pages/graphic-design"));
const StrategicConsulting = lazy(() => import("./pages/strategic-consulting"));
const EducationalServices = lazy(() => import("./pages/educational-services"));
const OurWork = lazy(() => import("./pages/our-work"));
const MarketingPackages = lazy(() => import("./pages/marketing-packages"));
const Pricing = lazy(() => import("./pages/pricing"));
const Contact = lazy(() => import("./pages/contact"));
const AreasWeService = lazy(() => import("./pages/areas-we-service"));
const InternshipProgram = lazy(() => import("./pages/internship-program"));
const Privacy = lazy(() => import("./pages/privacy"));
const Terms = lazy(() => import("./pages/terms"));
const LocationPage = lazy(() => import("./pages/location-page"));
const BlogPage = lazy(() => import("./pages/blog"));
const BlogPostPage = lazy(() => import("./pages/blog-post"));

// ── Scroll to top on route change ──────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Error Boundary ─────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorKey: props.resetKey };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  // Auto-reset when user navigates to a new route (resetKey = pathname)
  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.errorKey) {
      return { hasError: false, errorKey: props.resetKey };
    }
    return null;
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", fontFamily: "'Nunito', sans-serif", padding: 40, textAlign: "center",
        }}>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, color: "#25516A", marginBottom: 16 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 18, color: "#677294", marginBottom: 24, maxWidth: 500 }}>
            We're sorry, an unexpected error occurred. Please try refreshing the page or return home.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 15,
                background: "#25516A", color: "#fff", border: "none", borderRadius: 30,
                padding: "14px 28px", cursor: "pointer",
              }}>
              Refresh Page
            </button>
            <a
              href="/"
              onClick={() => this.setState({ hasError: false })}
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 15,
                background: "#CD9B42", color: "#fff", border: "none", borderRadius: 30,
                padding: "14px 28px", cursor: "pointer", textDecoration: "none", display: "inline-block",
              }}>
              Return to Homepage
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrapper to give ErrorBoundary access to the current route
function RouteAwareErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
}

// ── Loading spinner ────────────────────────────────────────────────────────
function LoadingFallback() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20,
      background: "linear-gradient(135deg, #0f2a3a 0%, #1a3d52 60%, #1B6FAD 100%)",
    }}>
      <img
        src="/images/amm-logo.png"
        alt="Appalachian Marketing & Media"
        style={{ height: 56, width: "auto", opacity: 0.9 }}
      />
      <div style={{
        width: 36, height: 36, border: "3px solid rgba(255,255,255,0.2)",
        borderTopColor: "#CD9B42", borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}

// ── 404 Page ───────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", fontFamily: "'Nunito', sans-serif", padding: 40, textAlign: "center",
      background: "linear-gradient(135deg, #25516A, #1a3d52)",
    }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 96, color: "#CD9B42", lineHeight: 1 }}>404</h1>
      <p style={{ fontSize: 22, color: "rgba(255,255,255,0.8)", marginBottom: 8, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
        Page not found
      </p>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 32, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{
        fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 15,
        background: "#CD9B42", color: "#fff", border: "none", borderRadius: 30,
        padding: "14px 34px", cursor: "pointer", textDecoration: "none",
      }}>
        Back to Homepage
      </a>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <RouteAwareErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="/services/website-design" element={<WebsiteDesign />} />
            <Route path="/services/seo" element={<SEOPage />} />
            <Route path="/services/social-media-management" element={<SocialMediaManagement />} />
            <Route path="/services/social-media-advertising" element={<SocialMediaAdvertising />} />
            <Route path="/services/graphic-design" element={<GraphicDesign />} />
            <Route path="/services/strategic-consulting" element={<StrategicConsulting />} />
            <Route path="/services/educational-services" element={<EducationalServices />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/marketing-packages" element={<MarketingPackages />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about/areas-we-service" element={<AreasWeService />} />
            <Route path="/about/internship-program" element={<InternshipProgram />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/websites/:locationSlug" element={<LocationPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </RouteAwareErrorBoundary>
    </BrowserRouter>
  );
}

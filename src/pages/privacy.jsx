import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function Privacy() {
  return (
    <Layout activeNav="">
      <SEOHead
        title="Privacy Policy | Appalachian Marketing & Media"
        description="Privacy policy for Appalachian Marketing & Media. How we collect, use, and protect your information."
        canonical="https://www.appmktmedia.com/privacy"
      />
      <section style={{ background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)", paddingTop: 75, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 20px 44px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff", fontSize: "clamp(36px,6vw,58px)", lineHeight: 1.1, marginBottom: 16 }}>Privacy Policy</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto" }}>Last updated: January 2026</p>
        </div>
</section>
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
          {[
            { h: "Information We Collect", p: "We collect information you provide directly, such as your name, email address, phone number, and business information when you fill out a contact form or communicate with us. We may also collect information automatically when you visit our website, including your IP address, browser type, and pages visited." },
            { h: "How We Use Your Information", p: "We use the information we collect to respond to your inquiries, provide our marketing services, send you relevant communications about our services, and improve our website and services. We do not sell, rent, or share your personal information with third parties for their marketing purposes." },
            { h: "Cookies", p: "Our website may use cookies to enhance your browsing experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our site may not function properly." },
            { h: "Data Security", p: "We take reasonable precautions to protect your information. However, no method of transmission over the Internet or method of electronic storage is 100% secure." },
            { h: "Contact Us", p: "If you have any questions about this Privacy Policy, please contact us at contact@appmktmedia.com or call (740) 672-5069." },
          ].map(({ h, p }, i) => (
            <div key={i} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, color: "#25516A", marginBottom: 12 }}>{h}</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#677294", lineHeight: 1.75 }}>{p}</p>
            </div>
          ))}
          <div style={{ marginTop: 60, padding: "24px 32px", background: "#E8F1FA", borderRadius: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#25516A" }}>Questions? We're easy to reach.</span>
            <Link to="/contact" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, background: "#25516A", color: "#fff", border: "none", borderRadius: 30, padding: "10px 22px", textDecoration: "none" }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

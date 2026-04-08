import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function Terms() {
  return (
    <Layout activeNav="">
      <SEOHead
        title="Terms of Service | Appalachian Marketing & Media"
        description="Terms of service for Appalachian Marketing & Media. Our policies for using our website and services."
        canonical="https://www.appmktmedia.com/terms"
      />
      <section style={{ background: "linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)", paddingTop: 75, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 20px 44px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#fff", fontSize: "clamp(36px,6vw,58px)", lineHeight: 1.1, marginBottom: 16 }}>Terms of Service</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto" }}>Last updated: January 2026</p>
        </div>
</section>
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
          {[
            { h: "Acceptance of Terms", p: "By accessing and using the Appalachian Marketing & Media website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website." },
            { h: "Use of Website", p: "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You may not use this site to transmit harmful, offensive, or disruptive content." },
            { h: "Intellectual Property", p: "All content on this website, including text, graphics, logos, and images, is the property of Appalachian Marketing & Media and is protected by applicable copyright and trademark laws." },
            { h: "Services", p: "Our marketing services are provided under separate service agreements. These Terms of Service govern only your use of this website. For specific service terms, please refer to your individual service agreement or contact us." },
            { h: "Disclaimer", p: "This website is provided 'as is' without warranties of any kind. Appalachian Marketing & Media does not warrant that the website will be error-free or uninterrupted." },
            { h: "Limitation of Liability", p: "Appalachian Marketing & Media shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website." },
            { h: "Changes to Terms", p: "We reserve the right to modify these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the revised terms." },
            { h: "Contact", p: "For questions about these Terms of Service, contact us at contact@appmktmedia.com or (740) 672-5069." },
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

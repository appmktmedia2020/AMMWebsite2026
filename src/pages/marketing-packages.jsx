import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useCountUp } from "../hooks/useCountUp";
import CTASection from "../components/CTASection";
import { useAnim } from "../hooks/useScrollAnimation";
// styles defined locally as S below
import { icons } from "../components/Icons";
import StructuredData from "../components/StructuredData";

// ─── Page-specific constants and sections ─────────────────────────────────

const S = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 20px", width: "100%" },
  pad: { padding: "80px 0" },
  overline: { fontFamily:"var(--font-heading)", fontWeight:700, fontSize:13, letterSpacing:"2px", color:"var(--color-accent)", textTransform:"uppercase", marginBottom:12 },
  h2: { fontFamily:"var(--font-heading)", fontWeight:700, fontSize:"clamp(28px,4vw,36px)", color:"var(--color-dark)", lineHeight:1.25, marginBottom:16 },
  h3: { fontFamily:"var(--font-heading)", fontWeight:700, fontSize:"clamp(20px,3vw,24px)", color:"var(--color-dark)", lineHeight:1.3, marginBottom:8 },
  body: { fontFamily:"var(--font-body)", fontWeight:400, fontSize:17, lineHeight:1.7, color:"var(--color-body)" },
  btnP: { fontFamily:"var(--font-heading)", fontWeight:600, fontSize:15, background:"var(--color-accent)", color:"#fff", border:"none", borderRadius:30, padding:"10px 22px", cursor:"pointer", transition:"all .3s ease", letterSpacing:".5px", display:"inline-flex", alignItems:"center", gap:8, textDecoration:"none" },
  btnO: { fontFamily:"var(--font-heading)", fontWeight:600, fontSize:15, background:"transparent", color:"var(--color-accent)", border:"2px solid var(--color-accent)", borderRadius:30, padding:"12px 32px", cursor:"pointer", transition:"all .3s ease", letterSpacing:".5px", display:"inline-flex", alignItems:"center", gap:8, textDecoration:"none" },
};

const I = {
  team: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M17 14a4 4 0 014 4v3"/></svg>,
  calendar: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  grow: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  noLock: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0" strokeDasharray="4 2"/><line x1="12" y1="15" x2="12" y2="18"/></svg>,
  consult: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  social: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17" cy="7" r="1.5" fill="currentColor"/></svg>,
  seo: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  design: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M4 20l3.5-8L18 4l2 2-8 10.5z"/><path d="M14.5 5.5l4 4"/></svg>,
  report: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
  strategy: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  web: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>,
  phone: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  check: <svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  chevDown: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  facebook: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#fff"/></svg>,
  time: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  user: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  rocket: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11.5L12 15z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
};

/* ─── Page Title Banner ───────────────────────────────────────────────── */
function PageBanner() {
  return (
    <section style={{
      background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",
      paddingTop:75, position:"relative", overflow:"hidden",
    }}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}} />
      <div className="dot-grid" style={{bottom:20,left:20,width:80,height:80,opacity:0.2}} />
      <div style={{position:"absolute",top:0,right:"30%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(12deg)",transformOrigin:"top center"}} />

      <div style={{...S.container, padding:"80px 20px 60px", position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:40, flexWrap:"wrap"}}>
        <div style={{flex:"1 1 480px"}}>
          <p style={{...S.overline, animation:"fadeIn .6s ease forwards"}}>Our Packages</p>
          <h1 style={{
            fontFamily:"var(--font-heading)", fontWeight:800, color:"#fff",
            fontSize:"clamp(32px,5vw,50px)", lineHeight:1.15, letterSpacing:"-0.5px",
            marginBottom:20, animation:"fadeInUp .8s ease forwards",
          }}>
            A full marketing team for less than the price of a{" "}
            <span style={{fontStyle:"italic", color:"var(--color-accent)"}}>single in-house marketer.</span>
          </h1>
          <p style={{
            fontFamily:"var(--font-body)", fontSize:19, color:"rgba(255,255,255,0.8)",
            lineHeight:1.7, maxWidth:640,
            animation:"fadeInUp .8s ease .15s forwards", opacity:0,
          }}>
            You don't need to hire a full marketing department. You just need the right one. Our team of strategists, designers, and SEO experts works together every month to grow your business.
          </p>
        </div>
        <div style={{flex:"1 1 380px", display:"flex", justifyContent:"center", animation:"fadeInUp .9s ease .2s forwards", opacity:0}}>
          <img src="/images/team-meeting.jpeg" alt="AMM team in a meeting" style={{width:"100%", maxWidth:480, borderRadius:18, border:"1px solid rgba(255,255,255,0.1)", objectFit:"cover", boxShadow:"0 12px 40px rgba(0,0,0,0.25)"}} />
        </div>
      </div>
</section>
  );
}

/* ─── How It Works ────────────────────────────────────────────────────── */
function HowItWorks() {
  useAnim();
  const items = [
    { icon: I.team, title: "A Dedicated Team on Your Account", desc: "You're not handed off to a rotating cast of strangers. You get a team that knows your business, your goals, and your voice." },
    { icon: I.calendar, title: "Regular Strategy Meetings", desc: "We check in with you through bi-weekly or monthly meetings. You'll always know what we're working on and what's coming next." },
    { icon: I.grow, title: "Flexible Scope That Grows With You", desc: "Start where you're comfortable. As your business grows, your package can grow with it." },
    { icon: I.noLock, title: "Month-to-Month. No Contracts.", desc: "We send you an invoice each month. If you don't want to continue, you stop. No cancellation fees, no awkward breakup conversations." },
  ];

  return (
    <section style={{...S.pad, background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center", maxWidth:600, margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Simple & Transparent</p>
          <h2 className="anim d1" style={S.h2}>How It Works</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px,1fr))", gap:28 }}>
          {items.map((it,i) => (
            <div key={i} className={`anim d${i+1}`} style={{
              background:"var(--color-light-bg)", borderRadius:16, padding:"34px 28px",
              transition:"all .35s ease", position:"relative", overflow:"hidden",
              borderLeft:"4px solid transparent",
            }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-5px)";
                e.currentTarget.style.boxShadow="0 14px 40px rgba(37,81,106,0.11)";
                e.currentTarget.style.background="#fff";
                e.currentTarget.style.borderLeft="4px solid var(--color-accent)";
                const icon = e.currentTarget.querySelector(".hw-icon");
                if(icon){ icon.style.color="var(--color-accent)"; icon.style.transform="scale(1.15)"; }
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.background="var(--color-light-bg)";
                e.currentTarget.style.borderLeft="4px solid transparent";
                const icon = e.currentTarget.querySelector(".hw-icon");
                if(icon){ icon.style.color="var(--color-primary-light)"; icon.style.transform="scale(1)"; }
              }}>
              <div className="hw-icon" style={{color:"var(--color-primary-light)", marginBottom:16, transition:"color .35s ease, transform .35s ease"}}>{it.icon}</div>
              <h3 style={{...S.h3, fontSize:18, marginBottom:10}}>{it.title}</h3>
              <p style={{...S.body, fontSize:15}}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Animated price display ─────────────────────────────────────────── */
function AnimPrice({ price, started }) {
  // price like "$997" or "$1,497"
  const numeric = parseInt(price.replace(/[^0-9]/g, ""), 10);
  const count = useCountUp(numeric, 1100, started);
  const formatted = count.toLocaleString();
  return <>${formatted}</>;
}

/* ─── Tier Cards ──────────────────────────────────────────────────────── */
function TierCards() {
  useAnim();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [countStarted, setCountStarted] = useState(false);
  const sectionRef = useRef(null);

  // Start count-up when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setCountStarted(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shared = ["Dedicated Marketing Team", "Monthly Reporting", "Guaranteed Experts"];
  const tiers = [
    { name:"Starter", price:"$997", tagline:"For businesses just getting started with professional marketing.", shared, features:["1 Custom Graphic Asset","2 Weekly Social Posts","1 Facebook Ad Campaign","2 Hourly Strategy Sessions","One-Time SEO Setup"], seoNote:"Includes one-time Google Business Profile setup and website review", highlight:false },
    { name:"Basic", price:"$1,497", tagline:"More content, more strategy, and added SEO support to build momentum.", shared, features:["1 Custom Graphic Asset","2 Weekly Social Posts","1 Facebook Ad Campaign","2 Hourly Strategy Sessions","SEO Setup + Management"], seoNote:"Includes monthly Google Business Profile and website management", highlight:false },
    { name:"Growth", price:"$2,497", tagline:"The sweet spot. Enough support to see real growth without overspending.", shared, features:["2 Custom Graphic Assets","3 Weekly Social Posts","2 Facebook Ad Campaigns","2 Hourly Strategy Sessions","SEO Setup + Management","2 SEO Blogs"], seoNote:"Includes monthly Google Business Profile and website management", highlight:true, badge:"Best Value" },
    { name:"Enterprise", price:"$3,497", tagline:"Maximum output, maximum attention, maximum results.", shared, features:["3 Custom Graphic Assets","5 Weekly Social Posts","4 Facebook Ad Campaigns","4 Hourly Strategy Sessions","SEO Setup + Management","4 SEO Blogs"], seoNote:"Includes monthly Google Business Profile and website management", highlight:false },
  ];

  const prepay = [
    { tier:"Starter", monthly:"$997", sixMonthly:"$947", twelveMonthly:"$897", six:"$5,682.90", twelve:"$10,767.60", saveSix:"$291.10", saveTwelve:"$1,196.40", perks:["5% off with 6-month commitment", "10% off with 12-month commitment", "Locked-in monthly rate"] },
    { tier:"Basic", monthly:"$1,497", sixMonthly:"$1,422", twelveMonthly:"$1,347", six:"$8,532.90", twelve:"$16,167.60", saveSix:"$449.10", saveTwelve:"$1,796.40", perks:["Save up to $1,796/yr", "Priority onboarding", "Locked-in monthly rate"] },
    { tier:"Growth", monthly:"$2,497", sixMonthly:"$2,372", twelveMonthly:"$2,247", six:"$14,232.90", twelve:"$26,967.60", saveSix:"$749.10", saveTwelve:"$2,996.40", perks:["Save up to $2,996/yr", "Priority onboarding", "Quarterly strategy review"] },
    { tier:"Enterprise", monthly:"$3,497", sixMonthly:"$3,322", twelveMonthly:"$3,147", six:"$19,932.90", twelve:"$37,767.60", saveSix:"$1,049.10", saveTwelve:"$4,196.40", perks:["Save up to $4,196/yr", "Priority onboarding", "Quarterly strategy review", "Dedicated account manager"] },
  ];

  return (
    <>
    <section ref={sectionRef} style={{...S.pad, background:"var(--color-light-bg)"}}>
      <div style={{...S.container, maxWidth:1320}}>
        <div style={{textAlign:"center", maxWidth:600, margin:"0 auto 14px"}}>
          <p className="anim" style={S.overline}>Choose Your Plan</p>
          <h2 className="anim d1" style={S.h2}>Find the Right Fit for Your Business</h2>
          <p className="anim d2" style={{fontFamily:"var(--font-body)", fontSize:14, color:"var(--color-body)", fontStyle:"italic", marginTop:8}}>Ad campaign costs not included</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:24, alignItems:"stretch" }}>
          {tiers.map((t,i) => {
            const isHovered = hoveredIdx === i;
            const isDimmed = hoveredIdx !== null && !isHovered;
            return (
              <div key={i} className={`anim d${i+1}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background:"#fff", borderRadius:16,
                  padding: t.highlight ? "40px 30px 34px" : "34px 30px",
                  border: t.highlight
                    ? "2px solid var(--color-accent)"
                    : isHovered ? "1px solid rgba(205,155,66,0.4)" : "1px solid rgba(37,81,106,0.08)",
                  position:"relative", display:"flex", flexDirection:"column",
                  transition:"all .35s ease",
                  transform: t.highlight
                    ? isHovered ? "scale(1.06) translateY(-4px)" : "scale(1.03)"
                    : isHovered ? "translateY(-8px)" : "none",
                  boxShadow: t.highlight
                    ? isHovered
                      ? "0 0 0 3px rgba(205,155,66,0.25), 0 24px 60px rgba(205,155,66,0.2), 0 8px 30px rgba(0,0,0,0.1)"
                      : "0 0 0 2px rgba(205,155,66,0.15), 0 16px 48px rgba(37,81,106,0.15)"
                    : isHovered
                      ? "0 20px 56px rgba(37,81,106,0.18)"
                      : "0 4px 24px rgba(0,0,0,0.06)",
                  opacity: isDimmed ? 0.62 : 1,
                  filter: isDimmed ? "saturate(0.6)" : "none",
                  zIndex: isHovered ? 2 : 1,
              }}>
                {/* Growth ambient glow behind card */}
                {t.highlight && (
                  <div style={{
                    position:"absolute", inset:-20, borderRadius:24, pointerEvents:"none",
                    background:"radial-gradient(ellipse at 50% 60%, rgba(205,155,66,0.12) 0%, transparent 70%)",
                    zIndex:-1, transition:"opacity .35s ease",
                    opacity: isHovered ? 1 : 0.6,
                  }}/>
                )}

                {t.badge && (
                  <div style={{
                    position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)",
                    background:"var(--color-accent)", color:"#fff", fontFamily:"var(--font-heading)",
                    fontWeight:700, fontSize:12, padding:"6px 20px", borderRadius:20,
                    letterSpacing:"1px", textTransform:"uppercase", whiteSpace:"nowrap",
                    boxShadow:"0 4px 12px rgba(205,155,66,0.35)",
                  }}>
                    {t.badge}
                  </div>
                )}

                <div style={{ marginBottom:16 }}>
                  <p style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:13, color:"var(--color-accent)", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8}}>{t.name}</p>
                  <div style={{display:"flex", alignItems:"baseline", gap:4}}>
                    <span style={{fontFamily:"var(--font-heading)", fontWeight:800, fontSize:40, color:"var(--color-dark)", lineHeight:1}}>
                      <AnimPrice price={t.price} started={countStarted} />
                    </span>
                    <span style={{fontFamily:"var(--font-body)", fontSize:15, color:"var(--color-body)"}}>/month</span>
                  </div>
                </div>

                <p style={{...S.body, fontSize:14, marginBottom:18, fontStyle:"italic", flex:"0 0 auto"}}>{t.tagline}</p>

                {/* Shared features */}
                <div style={{borderTop:"1px solid rgba(37,81,106,0.1)", paddingTop:16, marginBottom:14}}>
                  {t.shared.map((f,j) => (
                    <div key={j} style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
                      {I.check}
                      <span style={{fontFamily:"var(--font-body)", fontSize:13.5, color:"var(--color-body)", lineHeight:1.4}}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Tier-specific features */}
                <div style={{borderTop:"1px solid rgba(37,81,106,0.1)", paddingTop:16, marginBottom:16, flex:1}}>
                  {t.features.map((f,j) => (
                    <div key={j} style={{display:"flex", alignItems:"flex-start", gap:8, marginBottom:10}}>
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-primary)" style={{width:18,height:18,flexShrink:0,marginTop:1}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span style={{fontFamily:"var(--font-body)", fontSize:13.5, color:"var(--color-dark)", lineHeight:1.4, fontWeight: f.includes("SEO Setup") ? 600 : 400}}>{f}</span>
                    </div>
                  ))}
                  {t.seoNote && (
                    <p style={{fontFamily:"var(--font-body)", fontSize:11.5, color:"var(--color-body)", fontStyle:"italic", marginTop:4, paddingLeft:26, lineHeight:1.4}}>{t.seoNote}</p>
                  )}
                </div>

                <Link to="/contact" style={{
                  ...S.btnP,
                  background: t.highlight ? "var(--color-accent)" : "var(--color-primary)",
                  justifyContent:"center", width:"100%", padding:"14px 24px",
                  boxShadow: t.highlight && isHovered ? "0 6px 20px rgba(205,155,66,0.4)" : "none",
                  transition:"all .3s ease",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.opacity="0.9";e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="none";}}>
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>

        <p className="anim d5" style={{textAlign:"center", marginTop:30, fontFamily:"var(--font-body)", fontSize:15, color:"var(--color-body)"}}>
          Not sure which tier fits? <Link to="/contact" style={{color:"var(--color-accent)", fontWeight:600, textDecoration:"none"}}>Schedule a consultation</Link> and we'll help you figure it out.
        </p>
      </div>
    </section>

    {/* Prepay Savings, wave in from light-bg tier cards section */}
<section style={{padding:"60px 0 80px", background:"var(--color-primary)", position:"relative", overflow:"hidden"}}>
      <div className="dot-grid" style={{top:20,right:40,opacity:.08}} />
      <div style={{...S.container, maxWidth:1100}}>
        <div className="anim" style={{textAlign:"center", marginBottom:44}}>
          <p style={{...S.overline, color:"var(--color-accent)"}}>Prepay & Save</p>
          <h2 style={{...S.h2, fontSize:"clamp(24px,3.5vw,32px)", color:"#fff"}}>Commit Longer, Pay Less</h2>
          <p style={{fontFamily:"var(--font-body)", fontSize:15, maxWidth:560, margin:"8px auto 0", color:"rgba(255,255,255,0.65)", lineHeight:1.7}}>Lock in your rate and save 5% on 6&nbsp;months or 10% on 12&nbsp;months, paid up&nbsp;front.</p>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px,1fr))", gap:20, paddingTop:16}}>
          {prepay.map((p,i) => {
            const isGrowth = p.tier === "Growth";
            return (
              <div key={i} className={`anim d${i+1}`} style={{display:"flex", flexDirection:"column", position:"relative"}}>
                {/* Most Popular badge - positioned on top of card */}
                {isGrowth && (
                  <div style={{
                    position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", zIndex:2,
                    fontFamily:"var(--font-heading)", fontWeight:700, fontSize:11,
                    color:"#fff", letterSpacing:"1.5px", textTransform:"uppercase",
                    background:"var(--color-accent)", padding:"5px 18px", borderRadius:20, whiteSpace:"nowrap",
                  }}>Most Popular</div>
                )}
                {/* Card top */}
                <div style={{
                  borderRadius:"16px 16px 0 0", overflow:"hidden",
                  border: isGrowth ? "2px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.12)",
                  borderBottom:"none",
                  background: isGrowth ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  padding:"28px 22px 24px", textAlign:"center",
                }}>
                  <div style={{
                    fontFamily:"var(--font-heading)", fontWeight:700, fontSize:20, color:"#fff",
                    marginBottom:10,
                  }}>{p.tier}</div>
                  <p style={{
                    fontFamily:"var(--font-body)", fontSize:13, color:"rgba(255,255,255,0.55)",
                    lineHeight:1.5, marginBottom:20,
                  }}>{p.monthly}/mo billed monthly</p>
                  <div style={{
                    fontFamily:"var(--font-heading)", fontWeight:800, fontSize:42, color:"#fff", lineHeight:1, marginBottom:6,
                  }}>{p.sixMonthly}</div>
                  <p style={{fontFamily:"var(--font-body)", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:4}}>Per month, billed every 6 months</p>
                  <p style={{fontFamily:"var(--font-body)", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:20}}>{p.twelveMonthly}/mo billed annually</p>
                  <Link to="/contact" style={{
                    fontFamily:"var(--font-heading)", fontWeight:600, fontSize:14,
                    background:"var(--color-accent)", color:"#fff", border:"none", borderRadius:8,
                    padding:"12px 24px", cursor:"pointer", textDecoration:"none",
                    transition:"all .3s ease", display:"block", textAlign:"center",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.9"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    Get Started
                  </Link>
                </div>

                {/* Card bottom - features */}
                <div style={{
                  borderRadius:"0 0 16px 16px",
                  border: isGrowth ? "2px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.12)",
                  borderTop: isGrowth ? "2px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.12)",
                  background: isGrowth ? "rgba(255,255,255,0.04)" : "transparent",
                  padding:"20px 22px", flex:1,
                }}>
                  <div style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:12}}>
                    {i === 0 ? "Savings include:" : `Everything in ${prepay[i-1].tier} plus:`}
                  </div>
                  {p.perks.map((perk,j) => (
                    <div key={j} style={{display:"flex", alignItems:"flex-start", gap:8, marginBottom:8}}>
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:16,height:16,flexShrink:0,marginTop:2}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span style={{fontFamily:"var(--font-body)", fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.4, fontWeight:600}}>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="anim d5" style={{textAlign:"center", marginTop:24, fontFamily:"var(--font-body)", fontSize:13, color:"rgba(255,255,255,0.45)", fontStyle:"italic"}}>
          Bundled purchases not subject to early cancellations.
        </p>
      </div>
    </section>
</>
  );
}

/* ─── What's Included ─────────────────────────────────────────────────── */
function WhatsIncluded() {
  useAnim();
  const items = [
    {
      icon: I.strategy, title: "Strategic Consulting", desc: "Regular strategy sessions, goal setting, and expert guidance to keep your marketing on track.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    },
    {
      icon: I.social, title: "Social Media Management", desc: "Content creation, scheduling, and management across the platforms that matter for your business.",
      img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    },
    {
      icon: I.seo, title: "SEO & Search Visibility", desc: "Keyword research, on-page optimization, local SEO, and ongoing improvements to help you rank.",
      img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80",
    },
    {
      icon: I.design, title: "Graphic Design", desc: "Custom graphics for social media, ads, print materials, and anything else your brand needs.",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    },
    {
      icon: I.web, title: "Website Support", desc: "Ongoing website updates, performance monitoring, and content refreshes to keep your site effective.",
      img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
    },
    {
      icon: I.report, title: "Reporting & Analytics", desc: "Clear monthly reports showing what's working, what's not, and what we're doing about it.",
      img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&q=80",
    },
  ];

  return (
    <section style={{...S.pad, background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center", maxWidth:600, margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Everything You Need</p>
          <h2 className="anim d1" style={S.h2}>What You Get with Every Package</h2>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))", gap:28}}>
          {items.map((it,i) => (
            <div key={i} className={`anim d${Math.min(i+1,6)}`} style={{
              borderRadius:16, overflow:"hidden",
              boxShadow:"0 4px 24px rgba(37,81,106,0.09)",
              background:"#fff",
              transition:"all .35s ease",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(37,81,106,0.16)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 24px rgba(37,81,106,0.09)"; }}>
              {/* Image */}
              <div style={{height:180, overflow:"hidden", position:"relative"}}>
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  style={{width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s ease"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                />
              </div>
              {/* Text */}
              <div style={{padding:"22px 24px"}}>
                <h4 style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:17, color:"var(--color-dark)", marginBottom:8}}>{it.title}</h4>
                <p style={{...S.body, fontSize:15, lineHeight:1.65}}>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="anim d5" style={{textAlign:"center", marginTop:36, fontFamily:"var(--font-body)", fontSize:15, color:"var(--color-body)", fontStyle:"italic"}}>
          Videography and email marketing are available as add-ons for clients who want them.
        </p>
      </div>
    </section>
  );
}

/* ─── Who This Is For ─────────────────────────────────────────────────── */
function WhoIsFor() {
  useAnim();
  const items = [
    { icon: I.time, title:"You don't have time to manage your own marketing.", desc:"You're running a business. You shouldn't also have to figure out what to post on Facebook or how Google rankings work. That's our job." },
    { icon: I.user, title:"You've tried marketing before and didn't see results.", desc:"Maybe you worked with another agency, or tried doing it yourself, and it didn't go anywhere. We hear that a lot. We do things differently." },
    { icon: I.rocket, title:"You're ready to invest in real, sustainable growth.", desc:"Not a quick fix or a one-time project, actual, ongoing growth that you can see in your leads, your phone calls, and your revenue." },
  ];

  return (
    <section style={{
      ...S.pad,
      position:"relative",
      overflow:"hidden",
      background:"var(--color-light-bg)",
    }}>
      {/* Background image */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')",
        backgroundSize:"cover", backgroundPosition:"center",
        opacity:0.07,
      }} />
      <div style={{...S.container, position:"relative", zIndex:1}}>
        <div style={{display:"flex", gap:60, flexWrap:"wrap", alignItems:"center"}}>
          {/* Left - visual */}
          <div className="anim" style={{flex:"1 1 360px", position:"relative"}}>
            <div className="dot-grid" style={{top:-15, left:-15}} />
            <div style={{
              background:"linear-gradient(135deg, var(--color-primary) 0%, #1a3d52 100%)",
              borderRadius:16, padding:40, position:"relative", overflow:"hidden",
            }}>
              <h3 style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:26, color:"#fff", lineHeight:1.3, marginBottom:16, position:"relative", zIndex:1}}>
                Is This Right for You?
              </h3>
              <p style={{fontFamily:"var(--font-body)", fontSize:16, color:"rgba(255,255,255,0.7)", lineHeight:1.7, marginBottom:20, position:"relative", zIndex:1}}>
                We're here to save you time and deliver results you can measure.
              </p>
              <div style={{
                padding:"16px 20px", background:"rgba(255,255,255,0.08)", borderRadius:12,
                border:"1px solid rgba(255,255,255,0.1)", position:"relative", zIndex:1,
              }}>
                <div style={{fontFamily:"var(--font-heading)", fontWeight:600, fontSize:14, color:"#E8B84B"}}>
                  Most of our clients land in the Growth tier
                </div>
                <div style={{fontFamily:"var(--font-body)", fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:4}}>
                  The sweet spot for real results
                </div>
              </div>
            </div>
          </div>

          {/* Right - items */}
          <div style={{flex:"1 1 480px", display:"flex", flexDirection:"column", gap:24}}>
            {items.map((it,i) => (
              <div key={i} className={`anim d${i+1}`} style={{
                display:"flex", gap:18, background:"#fff", borderRadius:14,
                padding:"28px 24px", boxShadow:"0 4px 20px rgba(0,0,0,0.05)",
                transition:"all .3s ease",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateX(6px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.08)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.05)";}}>
                <div style={{color:"var(--color-primary-light)", flexShrink:0, marginTop:2}}>{it.icon}</div>
                <div>
                  <h4 style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:17, color:"var(--color-dark)", marginBottom:6, lineHeight:1.3}}>{it.title}</h4>
                  <p style={{...S.body, fontSize:15}}>{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What to Expect (Timeline) ───────────────────────────────────────── */
function WhatToExpect() {
  useAnim();
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [lineHeight, setLineHeight] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    { num:"1", title:"Free Consultation", desc:"We learn about your business, your goals, and what you've tried before." },
    { num:"2", title:"Custom Strategy", desc:"We build a marketing plan tailored to your business. No templates, no cookie-cutter approaches." },
    { num:"3", title:"Your New Team Gets to Work", desc:"Content creation, SEO, design, strategy, it all starts rolling." },
    { num:"4", title:"Regular Check-Ins", desc:"Bi-weekly or monthly meetings so you always know what's happening." },
    { num:"5", title:"Clear Reporting", desc:"You'll see exactly what we're doing and what results it's driving. No confusing jargon." },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // stagger each step in
        steps.forEach((_, i) => {
          setTimeout(() => setVisibleSteps(prev => [...prev, i]), i * 220);
        });
        // animate line from 0 to 100% over ~1.2s
        let start = null;
        const total = 1100;
        const animate = (ts) => {
          if (!start) start = ts;
          const pct = Math.min(((ts - start) / total) * 100, 100);
          setLineHeight(pct);
          if (pct < 100) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{...S.pad, background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center", maxWidth:600, margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>The Process</p>
          <h2 className="anim d1" style={S.h2}>What Happens After You Sign Up</h2>
        </div>

        <div style={{maxWidth:700, margin:"0 auto", position:"relative"}}>
          {/* Static track */}
          <div style={{position:"absolute", left:24, top:24, bottom:24, width:2, background:"rgba(37,81,106,0.1)", borderRadius:2}} />
          {/* Animated fill line */}
          <div style={{
            position:"absolute", left:24, top:24, width:2, borderRadius:2,
            background:"linear-gradient(to bottom, var(--color-accent), var(--color-primary-light))",
            height:`calc(${lineHeight}% - 24px)`,
            transition:"height 0.05s linear",
          }} />

          {steps.map((st,i) => (
            <div key={i} style={{
              display:"flex", gap:24, marginBottom: i < steps.length-1 ? 36 : 0, position:"relative",
              opacity: visibleSteps.includes(i) ? 1 : 0,
              transform: visibleSteps.includes(i) ? "translateX(0)" : "translateX(-16px)",
              transition:"opacity .4s ease, transform .4s ease",
            }}>
              <div style={{
                width:50, height:50, borderRadius:"50%", flexShrink:0,
                background: i===0 ? "var(--color-accent)" : visibleSteps.includes(i) ? "var(--color-primary)" : "rgba(37,81,106,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"var(--font-heading)", fontWeight:800, fontSize:18, color:"#fff",
                zIndex:1,
                boxShadow: visibleSteps.includes(i) ? "0 4px 14px rgba(0,0,0,0.15)" : "none",
                transform: visibleSteps.includes(i) ? "scale(1)" : "scale(0.7)",
                transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
              }}>
                {st.num}
              </div>
              <div style={{paddingTop:6}}>
                <h4 style={{fontFamily:"var(--font-heading)", fontWeight:700, fontSize:18, color:"var(--color-dark)", marginBottom:6}}>{st.title}</h4>
                <p style={{...S.body, fontSize:15}}>{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="anim d5" style={{textAlign:"center", marginTop:40, fontFamily:"var(--font-body)", fontSize:16, color:"var(--color-dark)", fontWeight:600}}>
          You'll have direct access to your team. No phone trees, no support tickets, just real people who know your account.
        </p>
      </div>
    </section>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────── */
function FAQ() {
  useAnim();
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"What's the first step to get started?", a:"Schedule a strategy consultation where we'll discuss your current marketing and identify if we'll be a good fit for you." },
    { q:"How quickly will we see results?", a:"Social media engagement improves within 30 days, while SEO results typically begin in 60-90 days. We'll show you exactly what to look for so you know your investment is working." },
    { q:"How is this different from hiring a marketer?", a:"A marketing employee costs $50,000+ and can't be an expert in everything from design to SEO to advertising. You get our entire team of specialists working together for a fraction of that cost." },
    { q:"How much should we spend on marketing?", a:"Most successful small businesses invest 5-10% of revenue in marketing for steady growth. Our packages give you an entire marketing team for less than hiring one employee." },
    { q:"Can we change or cancel our package?", a:"Yes, you can upgrade, downgrade, or pause with 30 days' notice. No cancellation fees. We'd rather keep you happy than keep you trapped in a contract." },
    { q:"Can you work with our current team?", a:"Absolutely. We can handle the technical aspects while your person focuses on daily operations. Many clients use us to fill the gaps in their current marketing efforts." },
    { q:"What if marketing hasn't worked in the past?", a:"This usually means previous efforts weren't consistent or properly targeted to the right people. We've helped many 'marketing doesn't work for us' businesses become success stories." },
    { q:"How much time do we need to spend on this?", a:"Very little. That's the whole point of having a marketing team handle everything for you. Most clients spend less than 2 hours monthly in strategy sessions and reviewing reports." },
    { q:"Do you guarantee specific results?", a:"No honest marketing company can guarantee specific numbers because every business is different. However, we guarantee transparency and measurable improvements in your online presence." },
    { q:"What if we're unhappy with the results?", a:"We guarantee clear communication about what we're doing and why it matters to your business. If you're not satisfied, we'll make it right because your success is our success." },
  ];

  return (
    <section style={{...S.pad, background:"var(--color-light-bg)"}}>
      <div style={{...S.container, maxWidth:780}}>
        <div style={{textAlign:"center", marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Our Packages</h2>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          {faqs.map((f,i) => (
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{
              background: open===i ? "#fffdf7" : "#fff",
              borderRadius:12, overflow:"hidden",
              border:"1px solid rgba(37,81,106,0.08)",
              borderLeft: open===i ? "4px solid var(--color-accent)" : "4px solid transparent",
              boxShadow: open===i ? "0 6px 28px rgba(205,155,66,0.10)" : "none",
              transition:"all .3s ease",
            }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{
                width:"100%", padding:"20px 24px", display:"flex", justifyContent:"space-between",
                alignItems:"center", background:"none", border:"none", cursor:"pointer",
                fontFamily:"var(--font-heading)", fontWeight:600, fontSize:16, color:"var(--color-dark)",
                textAlign:"left", lineHeight:1.4,
              }}>
                {f.q}
                <span style={{
                  color:"var(--color-accent)", transform: open===i?"rotate(180deg)":"rotate(0)",
                  transition:"transform .3s ease", flexShrink:0, marginLeft:16,
                }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              <div style={{
                maxHeight: open===i ? 300 : 0, overflow:"hidden",
                transition:"max-height .4s ease",
              }}>
                <div style={{padding:"0 24px 20px"}}>
                  <p style={{...S.body, fontSize:15}}>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─────────────────────────────────────────────────────── */
/* ─── Footer ──────────────────────────────────────────────────────────── */

// ─── Page Export ─────────────────────────────────────────────────────────
export default function MarketingPackages() {
  return (
    <Layout activeNav="Marketing Packages">
      <SEOHead
        title="Marketing Packages | Month-to-Month, No Contracts | AMM"
        description="Month-to-month marketing packages for Southern Ohio businesses. Website, SEO, social media, and more, bundled for maximum impact at an affordable flat rate."
        canonical="https://www.appmktmedia.com/marketing-packages"
        ogImage="/images/team-meeting.jpeg"
      />
      <StructuredData schema={{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What's the first step to get started?", "acceptedAnswer": {"@type": "Answer", "text": "Schedule a strategy consultation where we'll discuss your current marketing and identify if we'll be a good fit for you."}}, {"@type": "Question", "name": "How quickly will we see results?", "acceptedAnswer": {"@type": "Answer", "text": "Social media engagement improves within 30 days, while SEO results typically begin in 60-90 days."}}, {"@type": "Question", "name": "How is this different from hiring a marketer?", "acceptedAnswer": {"@type": "Answer", "text": "A marketing employee costs $50,000+ and can't be an expert in everything from design to SEO to advertising. You get our entire team of specialists for a fraction of that cost."}}, {"@type": "Question", "name": "Can we change or cancel our package?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, you can upgrade, downgrade, or pause with 30 days' notice. No cancellation fees."}}, {"@type": "Question", "name": "Do you guarantee specific results?", "acceptedAnswer": {"@type": "Answer", "text": "No honest marketing company can guarantee specific numbers. However, we guarantee transparency and measurable improvements in your online presence."}}]}} />
      <PageBanner />
      <WhatsIncluded />
<HowItWorks />
<TierCards />
<WhoIsFor />
<WhatToExpect />
<FAQ />
      <CTASection />
    </Layout>
  );
}

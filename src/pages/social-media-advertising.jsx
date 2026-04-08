import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useCountUp } from "../hooks/useCountUp";
import CTASection from "../components/CTASection";
import RelatedServices from "../components/RelatedServices";
import { useAnim } from "../hooks/useScrollAnimation";
import { icons } from "../components/Icons";
import ServicePricing from "../components/ServicePricing";
import StructuredData from "../components/StructuredData";

const S={
  container:{maxWidth:1160,margin:"0 auto",padding:"0 20px",width:"100%"},
  pad:{padding:"80px 0"},
  overline:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12},
  h2:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,36px)",color:"var(--color-dark)",lineHeight:1.25,marginBottom:16},
  body:{fontFamily:"var(--font-body)",fontWeight:400,fontSize:17,lineHeight:1.7,color:"var(--color-body)"},
  btnP:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,background:"var(--color-accent)",color:"#fff",border:"none",borderRadius:30,padding:"10px 22px",cursor:"pointer",transition:"all .3s ease",letterSpacing:".5px",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
};


/* ─── Ad Targeting Mockup ────────────────────────────────────────────── */
function AdTargetingMockup() {
  // Phases: buildingFilters → showAd → showLead → hold → reset (loops)
  const [phase, setPhase]           = useState("buildingFilters");
  const [filtersShown, setFiltersShown] = useState(0);
  const [adVisible, setAdVisible]   = useState(false);
  const [leadVisible, setLeadVisible] = useState(false);
  const [reachCount, setReachCount] = useState(0);

  const filters = [
    { label: "Location",  value: "Portsmouth, OH +25 mi", icon: "📍" },
    { label: "Age",       value: "30–60",                  icon: "👤" },
    { label: "Interests", value: "Home improvement",       icon: "🏠" },
    { label: "Behaviour", value: "Homeowners",             icon: "🔑" },
  ];

  useEffect(() => {
    let t;
    if (phase === "buildingFilters") {
      if (filtersShown < filters.length) {
        t = setTimeout(() => setFiltersShown(n => n + 1), 550);
      } else {
        // animate reach counter
        t = setTimeout(() => setPhase("counting"), 400);
      }
    } else if (phase === "counting") {
      let start = null;
      const target = 14800;
      const dur = 1000;
      const tick = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        setReachCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
        else { setReachCount(target); setPhase("showAd"); }
      };
      requestAnimationFrame(tick);
    } else if (phase === "showAd") {
      t = setTimeout(() => { setAdVisible(true); setPhase("showLead"); }, 400);
    } else if (phase === "showLead") {
      t = setTimeout(() => setLeadVisible(true), 1200);
    } else if (phase === "hold") {
      t = setTimeout(() => {
        setAdVisible(false); setLeadVisible(false);
        setTimeout(() => {
          setFiltersShown(0); setReachCount(0); setPhase("buildingFilters");
        }, 400);
      }, 3500);
    }
    return () => clearTimeout(t);
  }, [phase, filtersShown]);

  // Trigger hold once lead is visible
  useEffect(() => {
    if (leadVisible) {
      const t = setTimeout(() => setPhase("hold"), 2800);
      return () => clearTimeout(t);
    }
  }, [leadVisible]);

  return (
    <div style={{
      width:"100%", maxWidth:360,
      background:"#1c1e21",
      borderRadius:20,
      overflow:"hidden",
      boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily:"system-ui,-apple-system,sans-serif",
    }}>
      {/* Header bar */}
      <div style={{
        background:"#242526", padding:"12px 16px",
        display:"flex", alignItems:"center", gap:10,
        borderBottom:"1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width:30,height:30,borderRadius:8,background:"#1877F2",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:17,fontWeight:900,color:"#fff",
        }}>f</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#e4e6eb"}}>Ads Manager</div>
          <div style={{fontSize:10,color:"#b0b3b8"}}>Campaign Setup</div>
        </div>
        <div style={{
          marginLeft:"auto", fontSize:10, fontWeight:700,
          background:"rgba(26,115,232,0.2)", color:"#8ab4f8",
          padding:"3px 8px", borderRadius:10,
        }}>LIVE</div>
      </div>

      {/* Audience filters */}
      <div style={{padding:"14px 16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#b0b3b8",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>
          Audience Targeting
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {filters.map((f,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:8,
              background: i < filtersShown ? "rgba(24,119,242,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${i < filtersShown ? "rgba(24,119,242,0.35)" : "rgba(255,255,255,0.06)"}`,
              borderRadius:8, padding:"8px 10px",
              opacity: i < filtersShown ? 1 : 0.25,
              transform: i < filtersShown ? "translateX(0)" : "translateX(-8px)",
              transition:"all 0.35s ease",
            }}>
              <span style={{fontSize:14}}>{f.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:"#b0b3b8"}}>{f.label}</div>
                <div style={{fontSize:12,fontWeight:600,color: i < filtersShown ? "#8ab4f8" : "#5f6368"}}>{f.value}</div>
              </div>
              {i < filtersShown && (
                <span style={{fontSize:12,color:"#81c995"}}>✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Reach counter */}
        <div style={{
          marginTop:12, padding:"10px 12px",
          background:"rgba(205,155,66,0.1)",
          border:"1px solid rgba(205,155,66,0.25)",
          borderRadius:8,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          opacity: reachCount > 0 ? 1 : 0,
          transition:"opacity 0.3s ease",
        }}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Estimated Reach</span>
          <span style={{fontSize:14,fontWeight:800,color:"var(--color-accent)"}}>
            {reachCount.toLocaleString()} people
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"0 16px"}}/>

      {/* Ad preview */}
      <div style={{
        padding:"12px 16px",
        opacity: adVisible ? 1 : 0,
        transform: adVisible ? "translateY(0)" : "translateY(10px)",
        transition:"opacity 0.4s ease, transform 0.4s ease",
      }}>
        <div style={{fontSize:11,fontWeight:700,color:"#b0b3b8",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>
          Ad Preview
        </div>
        <div style={{
          background:"#242526",borderRadius:10,overflow:"hidden",
          border:"1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{
              width:28,height:28,borderRadius:"50%",flexShrink:0,
              background:"linear-gradient(135deg,var(--color-accent),var(--color-primary))",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,fontWeight:700,color:"#fff",
            }}>YB</div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#e4e6eb"}}>Your Business</div>
              <div style={{fontSize:9,color:"#b0b3b8"}}>Sponsored · 🌐</div>
            </div>
          </div>
          <div style={{padding:"0 10px 8px",fontSize:11,color:"#e4e6eb",lineHeight:1.4}}>
            Tired of waiting weeks for a callback? We serve Portsmouth & surrounding areas, same week estimates, guaranteed. 📞
          </div>
          <div style={{
            height:70,background:"linear-gradient(135deg,#25516A,#1B6FAD)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <span style={{fontSize:12,fontWeight:700,color:"#fff",opacity:0.9}}>Get Your Free Quote →</span>
          </div>
          <div style={{
            padding:"7px 10px",display:"flex",gap:6,
            borderTop:"1px solid rgba(255,255,255,0.06)",
          }}>
            {["👍 Like","💬 Comment","↗️ Share"].map((b,i)=>(
              <span key={i} style={{fontSize:10,color:"#b0b3b8",flex:1,textAlign:"center"}}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Lead notification */}
      <div style={{
        margin:"0 16px 14px",
        padding:"10px 12px",
        background:"rgba(129,201,149,0.12)",
        border:"1px solid rgba(129,201,149,0.3)",
        borderRadius:10,
        display:"flex",alignItems:"flex-start",gap:10,
        opacity: leadVisible ? 1 : 0,
        transform: leadVisible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.97)",
        transition:"opacity 0.4s ease, transform 0.4s cubic-bezier(.34,1.4,.64,1)",
      }}>
        <span style={{fontSize:18,flexShrink:0}}>🎯</span>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#81c995",marginBottom:2}}>New Lead</div>
          <div style={{fontSize:11,color:"#e4e6eb"}}>Sarah M., "I'm interested in getting a quote."</div>
          <div style={{fontSize:10,color:"#b0b3b8",marginTop:2}}>Portsmouth, OH · just now</div>
        </div>
      </div>

      <style>{`@keyframes adPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
@media(max-width:768px){.sma-metrics-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

const I={
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  target:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  pen:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  filter:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  barChart:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  refresh:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  fbLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:32,height:32}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  igLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:32,height:32}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  liLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:32,height:32}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1, HERO
   ═══════════════════════════════════════════════════════════════════════════ */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Social Media Advertising</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(34px,5vw,52px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Stop Guessing. Start Getting{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Real Leads.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:520,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Organic social media builds trust. Paid ads drive action. We run targeted campaigns on Facebook, Instagram, and LinkedIn focused on one thing: real, measurable leads, not vanity metrics.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            We start with your goals, not a template. We treat your budget like our own, and we'll never recommend spend you don't need.
          </p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Free Consultation</Link>
          </div>
        </div>
        <div style={{flex:"1 1 320px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,animation:"fadeInUp .9s ease .2s forwards",opacity:0}}>
          <AdTargetingMockup />
        </div>
      </div>
</section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2, WHAT WE DO (consolidated from FB/IG, LinkedIn, ServicesGrid)
   ═══════════════════════════════════════════════════════════════════════════ */
function WhatWeDo(){
  useAnim();
  const items = [
    {icon:I.pen,title:"We create ads worth clicking.",desc:"Great targeting means nothing if the ad doesn't stop the scroll. We design the graphics, write the copy, create multiple variations for testing, and build video when it makes sense. Every ad is custom, no templates.",img:"https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=700&q=80"},
    {icon:I.target,title:"We put your ads in front of the right people.",desc:"The goal isn't to reach everyone, it's to reach the people who actually need what you offer. We use demographic, interest, and behavior targeting, custom audiences built from your existing customers, lookalike audiences to find more people just like them, and retargeting for people who visited your site but didn't reach out.",img:"https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=700&q=80"},
    {icon:I.filter,title:"We filter out the noise so you get real leads.",desc:"Getting leads is easy. Getting good leads is the hard part. We build lead forms that filter out unqualified inquiries before they hit your inbox, connect to your CRM, and include a follow-up plan so no lead falls through the cracks.",img:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80"},
    {icon:I.refresh,title:"We manage your campaigns every single day.",desc:"We don't set it and forget it. Your campaigns get daily attention, monitoring performance, running A/B tests, refining targeting, moving budget toward what's working, and shutting down what isn't.",img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80"},
    {icon:I.barChart,title:"You'll always know where your money is going.",desc:"Monthly reports in plain English: cost per lead, return on ad spend, reach, engagement. Every report includes strategy recommendations, and we walk through results with you on a call. No jargon, no sugarcoating.",img:"https://images.unsplash.com/photo-1543286386-713bdd548da4?w=700&q=80"},
  ];

  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{bottom:20,left:30,opacity:.18}}/>
      <div style={S.container}>
        <div style={{maxWidth:680,marginBottom:50}}>
          <p className="anim" style={S.overline}>What We Do</p>
          <h2 className="anim d1" style={S.h2}>Everything Your Campaigns Need to Succeed</h2>
          <p className="anim d2" style={S.body}>
            From strategy and creative to daily optimization and transparent reporting, here's what working with us looks like:
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
          {items.map((item,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 4px 24px rgba(37,81,106,0.09)",transition:"all .35s ease"}}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 12px 40px rgba(37,81,106,0.16)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1.06)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 24px rgba(37,81,106,0.09)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1)";
              }}>
              <div style={{height:200,overflow:"hidden",position:"relative"}}>
                <img className="card-img" src={item.img} alt={item.title} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}/>
              </div>
              <div style={{padding:"22px 24px"}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,lineHeight:1.3}}>{item.title}</h3>
                <p style={{...S.body,fontSize:15,lineHeight:1.65}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Platforms, compact inline with hover glow */}
        <div className="anim d5" style={{marginTop:40,padding:"28px 32px",background:"var(--color-light-bg)",borderRadius:16,display:"flex",gap:32,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
          {[{icon:I.fbLarge,name:"Facebook",color:"#1877F2"},{icon:I.igLarge,name:"Instagram",color:"#E4405F"},{icon:I.liLarge,name:"LinkedIn",color:"#0A66C2"}].map((p,i)=>(
            <div key={i}
              style={{display:"flex",alignItems:"center",gap:10,color:p.color,padding:"10px 18px",borderRadius:12,transition:"all .25s ease",cursor:"default"}}
              onMouseEnter={e=>{
                e.currentTarget.style.background=`${p.color}14`;
                e.currentTarget.style.boxShadow=`0 0 0 1px ${p.color}44, 0 4px 16px ${p.color}22`;
                e.currentTarget.style.transform="translateY(-2px)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background="transparent";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.transform="translateY(0)";
              }}>
              {p.icon}
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-dark)"}}>{p.name}</span>
            </div>
          ))}
          <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",fontStyle:"italic"}}>
            We run campaigns on the platforms where your audience actually is.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3, WHAT WE DON'T DO (kept, strong trust builder)
   ═══════════════════════════════════════════════════════════════════════════ */
function WeDont(){
  useAnim();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items=[
    { text:"We don't promise overnight results or guaranteed leads. Paid advertising is powerful, but it takes testing and optimization to find what works best for your market.", icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { text:"We don't run ads without a strategy. Every campaign has a defined goal and a clear path to get there.", icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { text:"We don't hide behind confusing metrics. If we can't explain a number in plain English, we shouldn't be reporting it.", icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { text:"We don't set up campaigns and disappear. Your campaigns get daily attention, that's the bare minimum, not a bonus.", icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
    { text:"We don't recommend spend you don't need. If ads aren't the right fit for your business right now, we'll tell you.", icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  ];
  return(
    <section style={{padding:"60px 0",background:"var(--color-light-bg)"}} ref={sectionRef}>
      <div style={{...S.container,maxWidth:800}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <p className="anim" style={S.overline}>Full Transparency</p>
          <h2 className="anim d1" style={S.h2}>What We Don't Do</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {items.map((it,i)=>(
            <div key={i} style={{
              display:"flex",gap:16,alignItems:"flex-start",
              background:"#fff",borderRadius:14,padding:"20px 24px",
              border:"1px solid rgba(37,81,106,0.06)",
              borderLeft:"4px solid var(--color-primary)",
              boxShadow:"0 2px 12px rgba(37,81,106,0.05)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition:`opacity 0.5s ease ${i*110}ms, transform 0.5s cubic-bezier(.34,1.2,.64,1) ${i*110}ms`,
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderLeftColor="var(--color-accent)";
              e.currentTarget.style.boxShadow="0 6px 24px rgba(37,81,106,0.1)";
              e.currentTarget.style.transform="translateX(4px)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderLeftColor="var(--color-primary)";
              e.currentTarget.style.boxShadow="0 2px 12px rgba(37,81,106,0.05)";
              e.currentTarget.style.transform="translateX(0)";
            }}>
              <div style={{
                width:36,height:36,borderRadius:10,flexShrink:0,
                background:"rgba(37,81,106,0.06)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"var(--color-primary)",
              }}>{it.icon}</div>
              <p style={{...S.body,fontSize:15,marginTop:6}}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Animated Performance Dashboard ───────────────────────────────── */
function PerfDashboard({ started }) {
  const weeks = ["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6"];
  const spendData  = [500, 500, 500, 500, 500, 500];
  const leadsData  = [4,   7,  11,  16,  21,  28];
  const maxLeads   = 30;
  const [progress, setProgress] = useState(0); // 0→1 drive bar heights

  useEffect(() => {
    if (!started) return;
    let startTs = null;
    const dur = 1400;
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 2));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started]);

  return (
    <div style={{
      background:"#1c1e21", borderRadius:16, padding:"20px 22px",
      border:"1px solid rgba(255,255,255,0.08)",
      fontFamily:"system-ui,-apple-system,sans-serif",
      marginBottom:32,
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#e4e6eb"}}>Campaign Performance</div>
          <div style={{fontSize:10,color:"#b0b3b8"}}>Last 6 weeks · Social Media Ads</div>
        </div>
        <div style={{display:"flex",gap:14}}>
          {[{color:"#1877F2",label:"Ad Spend"},{color:"#81c995",label:"Qualified Leads"}].map((l,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:2,background:l.color}}/>
              <span style={{fontSize:10,color:"#b0b3b8"}}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,marginBottom:8}}>
        {weeks.map((w,i) => {
          const leadsH = (leadsData[i] / maxLeads) * 100 * progress;
          const spendH = 40 * progress; // constant spend bars
          return (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:90}}>
                {/* Spend bar */}
                <div style={{
                  flex:1, height:`${spendH}%`, minHeight:0,
                  background:"rgba(24,119,242,0.5)", borderRadius:"3px 3px 0 0",
                  transition:"height 0.05s linear",
                }}/>
                {/* Leads bar */}
                <div style={{
                  flex:1, height:`${leadsH}%`, minHeight:0,
                  background: i === weeks.length-1 ? "#81c995" : "rgba(129,201,149,0.7)",
                  borderRadius:"3px 3px 0 0",
                  transition:"height 0.05s linear",
                  position:"relative",
                }}>
                  {i === weeks.length-1 && progress > 0.9 && (
                    <div style={{
                      position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",
                      fontSize:9,fontWeight:700,color:"#81c995",whiteSpace:"nowrap",
                    }}>{leadsData[i]}</div>
                  )}
                </div>
              </div>
              <div style={{fontSize:8,color:"#5f6368"}}>{w}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom KPI row */}
      <div style={{display:"flex",gap:12,marginTop:4,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        {[
          {val:`${Math.round(leadsData[5]*progress)} leads`,label:"Total leads",color:"#81c995"},
          {val:`$${Math.round(500*6*progress / Math.max(leadsData[5]*progress,1)).toFixed(0)} CPL`,label:"Cost per lead",color:"var(--color-accent)"},
          {val:`${(3.7 * Math.min(progress, 1)).toFixed(1)}×`,label:"ROAS",color:"#8ab4f8"},
        ].map((k,i)=>(
          <div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:800,color:k.color}}>{k.val}</div>
            <div style={{fontSize:9,color:"#b0b3b8"}}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialProof(){
  useAnim();
  const statsRef   = useRef(null);
  const metricsRef = useRef(null);
  const [statsStarted,   setStatsStarted]   = useState(false);
  const [metricsStarted, setMetricsStarted] = useState(false);

  useEffect(() => {
    const obs = (el, setter) => {
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); o.disconnect(); } }, { threshold: 0.3 });
      o.observe(el); return () => o.disconnect();
    };
    const c1 = obs(statsRef.current,   setStatsStarted);
    const c2 = obs(metricsRef.current, setMetricsStarted);
    return () => { c1?.(); c2?.(); };
  }, []);

  // Stats count-ups
  const c50  = useCountUp(50,  1200, statsStarted);
  const c30  = useCountUp(30,  1400, statsStarted);

  // Case study count-ups  (3.7 → stored as 37, divided by 10 for display)
  const c37  = useCountUp(37,  1300, metricsStarted); // 3.7×
  const c35  = useCountUp(35,  1100, metricsStarted); // $35
  const c115 = useCountUp(115, 1500, metricsStarted); // 115%

  const caseStudy = {
    clientName: "Manufacturing Client",
    businessType: "Manufacturing Industry",
    location: "Southern Ohio",
    quote: "The leads coming in are actually qualified, we're not wasting time chasing people who aren't serious. The cost efficiency has been a real surprise.",
    timeframe: "within 6 months",
    plan: "Social Media Advertising",
  };
  const testimonials = [
    {
      quote: "Appalachian Marketing and Media has been incredible to work with! They've provided amazing support for the Chamber and our new coworking space, making everything easy and quick from start to finish. Their meetings are well-structured, and the team took what I had envisioned and brought it to life perfectly. They've created beautiful physical marketing materials, fresh new logos, and engaging social media content that truly represents us.",
      name: "Bobby S.",
      business: "Hocking Hills Chamber of Commerce",
      location: "Logan, OH",
    },
    {
      quote: "Abe and team have been fabulous to work with! I appreciate their diligence and attention to detail.",
      name: "Sandy M.",
      business: "SCOESC",
      location: "New Boston, OH",
    },
  ];

  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.15}}/>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Results</p>
          <h2 className="anim d1" style={S.h2}>Don't Just Take Our Word for It</h2>
        </div>

        {/* Stats bar with count-ups */}
        <div ref={statsRef} className="anim d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20,marginBottom:50}}>
          {[
            { display:"$3.70", label:"Return Per $1 Invested",      note:"real client campaign results",           color:"var(--color-primary)" },
            { display: statsStarted ? `${c50}+` : "50+", label:"Campaigns Managed", note:"across Facebook, Instagram & LinkedIn", color:"var(--color-primary)" },
            { display: statsStarted ? `${c30}%` : "30%", label:"Avg. Cost Per Lead Reduction", note:"after 90 days of optimization", color:"var(--color-primary)" },
          ].map((st,i)=>(
            <div key={i} style={{
              textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,
              border:"1px solid rgba(37,81,106,0.06)",transition:"all .3s ease",
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(37,81,106,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:st.color,lineHeight:1}}>{st.display}</div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>{st.label}</div>
              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>{st.note}</p>
            </div>
          ))}
        </div>

        {/* Case study with performance dashboard */}
        <div ref={metricsRef} className="anim d3" style={{
          background:"linear-gradient(135deg, var(--color-primary), #1a3d52)",
          borderRadius:20,padding:"40px 36px",marginBottom:40,position:"relative",overflow:"hidden",
        }}>
          <div className="dot-grid" style={{bottom:-10,right:-10,opacity:.1}}/>
          <div style={{position:"relative",zIndex:1}}>
            {/* Top row: Quote left, Chart right */}
            <div style={{display:"flex",gap:40,flexWrap:"wrap",alignItems:"flex-start",marginBottom:28}}>
              <div style={{flex:"1 1 340px"}}>
                <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12}}>Client Spotlight</p>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(20px,3vw,26px)",color:"#fff",lineHeight:1.3,marginBottom:8}}>{caseStudy.clientName}</h3>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:16}}>{caseStudy.businessType} · {caseStudy.location} · {caseStudy.plan}</p>
                <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.85)",lineHeight:1.7,fontStyle:"italic",marginBottom:8}}>"{caseStudy.quote}"</p>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.5)"}}>Results achieved {caseStudy.timeframe}</p>
              </div>
              <div style={{flex:"1 1 300px"}}>
                <PerfDashboard started={metricsStarted} />
              </div>
            </div>
            {/* Bottom row: 3 metrics in a horizontal row */}
            <div className="sma-metrics-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[
                { val: metricsStarted ? `${(c37/10).toFixed(1)}×`  : "3.7×", label:"return on ad spend",        border:"rgba(205,155,66,0.4)" },
                { val: metricsStarted ? `$${c35}`                    : "$35",  label:"cost per qualified lead",   border:"rgba(129,201,149,0.4)" },
                { val: metricsStarted ? `${c115}%`                  : "115%", label:"increase in inquiries",     border:"rgba(138,180,248,0.4)" },
              ].map((r,i)=>(
                <div key={i} style={{
                  background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"18px 22px",
                  border:`1px solid ${r.border}`,
                  textAlign:"center",
                  transition:"border-color 0.5s ease",
                }}>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:32,color:"var(--color-accent)",lineHeight:1,marginBottom:6}}>{r.val}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.7)"}}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))",gap:20}}>
          {testimonials.map((t,i)=>(
            <div key={i} className={`anim d${i+4}`} style={{background:"#fff",borderRadius:16,padding:"32px 28px",border:"1px solid rgba(37,81,106,0.06)",position:"relative"}}>
              <div style={{fontFamily:"Georgia, serif",fontSize:60,color:"var(--color-accent)",opacity:.2,lineHeight:1,position:"absolute",top:16,left:24}}>"</div>
              <p style={{...S.body,fontSize:15.5,fontStyle:"italic",marginBottom:20,position:"relative",zIndex:1,paddingTop:16}}>"{t.quote}"</p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"var(--color-light-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-primary)",border:"2px solid rgba(37,81,106,0.08)"}}>{t.name.charAt(0)}</div>
                <div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)"}}>{t.name}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)"}}>{t.business} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6, FAQ (kept)
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"How much should I spend on ads?",a:"It depends on your goals, your market, and how quickly you want results. For most local businesses, we recommend starting with $500–$1,000/month in ad spend to get enough data to optimize effectively. We'll help you figure out what makes sense during your consultation."},
    {q:"How long before I see results?",a:"Most campaigns start generating data within the first week or two. Meaningful, optimized results usually take 30–60 days as we test and refine targeting and creative. We set realistic expectations before anything goes live."},
    {q:"What's the difference between boosting a post and running an ad?",a:"Boosting is the easy button, it puts a little money behind an existing post. Running a real ad gives you full control over targeting, placement, creative, and objectives. Ads are built for results. Boosts are built for convenience. We focus on running real ads."},
    {q:"Do I need a large following for ads to work?",a:"Not at all. Paid ads reach people based on targeting, not your follower count. You could have 50 followers and still run a successful lead generation campaign to thousands of people in your area."},
    {q:"How do you measure success?",a:"Cost per lead, return on ad spend, conversions, and qualified inquiries. We don't focus on vanity numbers like impressions unless they're tied to a specific awareness goal."},
    {q:"Can you run ads if you don't manage my social media?",a:"Yes. Advertising and organic social media management are separate services. You can have us run ads without managing your day-to-day social content, or vice versa."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Social Media Advertising</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{
              background: open===i ? "#fffdf7" : "#fff",
              borderRadius:12, overflow:"hidden",
              border:"1px solid rgba(37,81,106,0.06)",
              borderLeft: open===i ? "4px solid var(--color-accent)" : "4px solid transparent",
              boxShadow: open===i ? "0 6px 28px rgba(205,155,66,0.10)" : "none",
              transition:"all .3s ease",
            }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-heading)",fontWeight:600,fontSize:16,color:"var(--color-dark)",textAlign:"left",lineHeight:1.4}}>
                {f.q}
                <span style={{color:"var(--color-accent)",transform:open===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s ease",flexShrink:0,marginLeft:16}}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              <div style={{maxHeight:open===i?400:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                <div style={{padding:"0 24px 20px"}}><p style={{...S.body,fontSize:15}}>{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   Old: Hero → FacebookInstagram → LinkedIn → ServicesGrid → Approach → WeDont → Pricing → FAQ → CTA (9)
   New: Hero → WhatWeDo → WeDont → Pricing → SocialProof → FAQ → CTA (7)
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SocialMediaAdvertising() {
  return (
    <Layout activeNav="Services">
      <SEOHead
        title="Social Media Advertising | Targeted Ads for Local Businesses | AMM"
        description="Targeted Facebook, Instagram, and LinkedIn ad campaigns that generate real leads, not vanity metrics. AMM manages your budget and delivers measurable results."
        canonical="https://www.appmktmedia.com/services/social-media-advertising"
        ogImage="/images/social-media-advertising-page-hero-section.jpeg"
      />
      <StructuredData schema={[
        {
          "@context": "https://schema.org", "@type": "Service",
          "name": "Social Media Advertising",
          "description": "Targeted Facebook, Instagram, and LinkedIn ad campaigns that generate real leads, not vanity metrics.",
          "provider": { "@type": "LocalBusiness", "name": "Appalachian Marketing & Media", "url": "https://www.appmktmedia.com" },
          "areaServed": ["Southern Ohio", "Eastern Kentucky", "West Virginia"], "url": "https://www.appmktmedia.com/services/social-media-advertising",
          "serviceType": "Digital Advertising"
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.appmktmedia.com/services" },
            { "@type": "ListItem", "position": 3, "name": "Social Media Advertising", "item": "https://www.appmktmedia.com/services/social-media-advertising" }
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much should I spend on ads?","acceptedAnswer":{"@type":"Answer","text":"It depends on your goals, your market, and how quickly you want results. For most local businesses, we recommend starting with $500–$1,000/month in ad spend to get enough data to optimize effectively. We'll help you figure out what makes sense during your consultation."}},{"@type":"Question","name":"How long before I see results?","acceptedAnswer":{"@type":"Answer","text":"Most campaigns start generating data within the first week or two. Meaningful, optimized results usually take 30–60 days as we test and refine targeting and creative. We set realistic expectations before anything goes live."}},{"@type":"Question","name":"What's the difference between boosting a post and running an ad?","acceptedAnswer":{"@type":"Answer","text":"Boosting is the easy button, it puts a little money behind an existing post. Running a real ad gives you full control over targeting, placement, creative, and objectives. Ads are built for results. Boosts are built for convenience. We focus on running real ads."}},{"@type":"Question","name":"Do I need a large following for ads to work?","acceptedAnswer":{"@type":"Answer","text":"Not at all. Paid ads reach people based on targeting, not your follower count. You could have 50 followers and still run a successful lead generation campaign to thousands of people in your area."}},{"@type":"Question","name":"How do you measure success?","acceptedAnswer":{"@type":"Answer","text":"Cost per lead, return on ad spend, conversions, and qualified inquiries. We don't focus on vanity numbers like impressions unless they're tied to a specific awareness goal."}},{"@type":"Question","name":"Can you run ads if you don't manage my social media?","acceptedAnswer":{"@type":"Answer","text":"Yes. Advertising and organic social media management are separate services. You can have us run ads without managing your day-to-day social content, or vice versa."}}]}]} />
      <HeroBanner />
      <WhatWeDo />
<WeDont />
      <ServicePricing
        heading="Advertising Pricing"
        description="Simple, transparent pricing. One campaign, one monthly fee. Your ad budget is separate, we'll recommend what makes sense for your goals."
        tiers={[
          { name: "Social Media Advertising", price: "$299", unit: "/campaign/month", tagline: "Per campaign, per month. No minimum ad spend required.", features: [
            "One fully managed ad campaign on your choice of platform",
            "Custom ad creative, graphics, copy, and multiple variations",
            "Lead collection forms built and connected to your workflow",
            "Daily monitoring and weekly optimization",
            "Monthly plain-English report with strategy recommendations",
            "No minimum ad spend requirement, we'll recommend a budget",
          ], highlight: true, badge: "Per Campaign" },
        ]}
        footnote="Ad spend is separate from management fees. Save 5% on 6 months up front or 10% on 12 months up front. No contracts. Cancel anytime."
      />
      <SocialProof />
<FAQ />
      <RelatedServices current="social-media-advertising" />
      <CTASection heading="Ready to Get Real Leads from Social Media Ads?" body="We'll walk you through how targeted advertising works, what to expect, and whether it's the right move for your business right now. No pressure, just a straight conversation." />
    </Layout>
  );
}

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

const I={
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  palette:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.55.45-1 1-1h.5c2.76 0 5-2.24 5-5C20.5 6.76 16.69 2 12 2z"/></svg>,
  monitor:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  printer:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  flag:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  chat:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  brush:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L4.68 13 11 19.32l8.45-8.36a5.5 5.5 0 00.39-6.35z"/><path d="M7.64 13.77c-1.27 1.42-1.79 3.5-1.64 4.23.73.15 2.81-.37 4.23-1.64"/></svg>,
  pencil:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  download:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

/* Brand Identity Reveal Mockup */
function BrandRevealMockup() {
  const [phase, setPhase]           = useState("blank");
  const [logoProgress, setLogoP]    = useState(0);
  const [typedName, setTypedName]   = useState("");
  const [swatchCount, setSwatchCount] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [tagVisible, setTagVisible]   = useState(false);

  const bizName  = "Ridgeline Co.";
  const swatches = ["#25516A","#CD9B42","#1B6FAD","#F5F0E8","#1a3d52"];

  useEffect(() => {
    let t;
    if (phase === "blank") {
      t = setTimeout(() => setPhase("logoReveal"), 600);
    } else if (phase === "logoReveal") {
      if (logoProgress < 1) {
        t = setTimeout(() => setLogoP(p => Math.min(p + 0.04, 1)), 30);
      } else {
        t = setTimeout(() => setPhase("nameType"), 300);
      }
    } else if (phase === "nameType") {
      if (typedName.length < bizName.length) {
        t = setTimeout(() => setTypedName(bizName.slice(0, typedName.length + 1)), 75);
      } else {
        t = setTimeout(() => setPhase("swatches"), 400);
      }
    } else if (phase === "swatches") {
      if (swatchCount < swatches.length) {
        t = setTimeout(() => setSwatchCount(n => n + 1), 180);
      } else {
        t = setTimeout(() => setPhase("card"), 400);
      }
    } else if (phase === "card") {
      setCardVisible(true);
      t = setTimeout(() => { setTagVisible(true); setPhase("hold"); }, 600);
    } else if (phase === "hold") {
      t = setTimeout(() => {
        setCardVisible(false);
        setTagVisible(false);
        setTimeout(() => {
          setLogoP(0);
          setTypedName("");
          setSwatchCount(0);
          setPhase("blank");
        }, 500);
      }, 4000);
    }
    return () => clearTimeout(t);
  }, [phase, logoProgress, typedName, swatchCount]);

  const circumference = 2 * Math.PI * 28;
  const strokeDash    = circumference * logoProgress;

  return (
    <div style={{
      width:"100%", maxWidth:360,
      background:"#1a1a2e",
      borderRadius:20,
      overflow:"hidden",
      boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily:"system-ui,-apple-system,sans-serif",
      padding:"28px 24px 24px",
      minHeight:360,
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{fontSize:11,fontWeight:700,color:"#b0b3b8",letterSpacing:"1.5px",textTransform:"uppercase"}}>Brand Identity</div>
        <div style={{
          fontSize:10,fontWeight:700,
          background: phase==="hold" ? "rgba(129,201,149,0.2)" : "rgba(205,155,66,0.2)",
          color: phase==="hold" ? "#81c995" : "var(--color-accent)",
          padding:"3px 10px",borderRadius:10,transition:"all 0.4s ease",
        }}>
          {phase==="hold" ? "✓ COMPLETE" : "IN PROGRESS"}
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
        <div style={{position:"relative",width:72,height:72,flexShrink:0}}>
          <svg viewBox="0 0 72 72" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
          </svg>
          <svg viewBox="0 0 72 72" style={{position:"absolute",inset:0,width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
            <circle cx="36" cy="36" r="28" fill="none" stroke="var(--color-accent)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}/>
          </svg>
          <div style={{
            position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
            opacity: logoProgress > 0.7 ? 1 : 0, transition:"opacity 0.4s ease",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{width:28,height:28}}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        </div>
        <div>
          <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:"#e4e6eb",letterSpacing:"-0.5px",minHeight:30}}>
            {typedName}
            {phase === "nameType" && (
              <span style={{display:"inline-block",width:2,height:"0.9em",background:"var(--color-accent)",marginLeft:2,verticalAlign:"text-bottom",animation:"cursorBlink 0.7s step-end infinite"}}/>
            )}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:"2px",textTransform:"uppercase",marginTop:4,opacity:typedName.length>0?1:0,transition:"opacity 0.3s ease"}}>
            Established 2019
          </div>
        </div>
      </div>

      <div style={{marginBottom:22}}>
        <div style={{fontSize:10,color:"#5f6368",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>Color Palette</div>
        <div style={{display:"flex",gap:8}}>
          {swatches.map((color, i) => (
            <div key={i} style={{
              width:36, height:36, borderRadius:8,
              background:color, border:"1px solid rgba(255,255,255,0.1)",
              opacity: i < swatchCount ? 1 : 0,
              transform: i < swatchCount ? "scale(1) translateY(0)" : "scale(0.6) translateY(8px)",
              transition:"opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1)",
            }}/>
          ))}
        </div>
      </div>

      <div style={{
        borderRadius:12, overflow:"hidden",
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
        transition:"opacity 0.45s ease, transform 0.45s cubic-bezier(.34,1.2,.64,1)",
      }}>
        <div style={{background:"linear-gradient(135deg,#25516A 0%,#1B6FAD 100%)",borderRadius:"12px 12px 0 0",padding:"18px 20px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:28,height:28,borderRadius:6,background:"rgba(205,155,66,0.25)",border:"1.5px solid var(--color-accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{width:14,height:14}}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,color:"#fff"}}>{bizName}</span>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
              Sarah Mitchell · Owner<br/>
              <span style={{color:"var(--color-accent)"}}>sarah@ridgelineco.com</span><br/>
              (740) 555-0192
            </div>
          </div>
        </div>
        <div style={{
          background:"rgba(129,201,149,0.1)", border:"1px solid rgba(129,201,149,0.25)",
          borderTop:"none", borderRadius:"0 0 12px 12px",
          padding:"8px 14px", display:"flex", alignItems:"center", gap:8,
          opacity: tagVisible ? 1 : 0, transition:"opacity 0.4s ease 0.2s",
        }}>
          <span style={{fontSize:13}}>✅</span>
          <span style={{fontSize:11,color:"#81c995",fontWeight:600}}>Print-ready · All formats delivered</span>
        </div>
      </div>

      <style>{`@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Graphic Design</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(32px,5vw,50px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Design That Demands Attention{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>and Builds Credibility.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:520,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Your brand is judged before a single word is read. We create bold, professional design for print and digital that reflects the quality of your business.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            No templates. No generic artwork. We design for your audience, not for awards. Clean, professional work delivered in every format you need, with quick turnaround.
          </p>
          <div style={{animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Free Consultation</Link>
          </div>
        </div>
        <div style={{flex:"1 1 340px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .25s forwards",opacity:0}}>
          <BrandRevealMockup />
        </div>
      </div>
</section>
  );
}

function WhatWeDesign(){
  useAnim();
  const items=[
    {icon:I.palette,title:"Brand identity that makes people recognize you.",desc:"Your brand is more than a logo. We help build and refine your visual identity: logo, color palette, typography, and brand style guide, so everything looks consistent and professional, no matter where it shows up.",img:"https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?w=700&q=80"},
    {icon:I.monitor,title:"Digital design that looks right on every screen.",desc:"Social media graphics, email newsletters, digital ad creative, website graphics, presentation design, and infographics. Every asset is sized correctly, on-brand, and built to perform.",img:"https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=700&q=80"},
    {icon:I.printer,title:"Print design that people can hold and hand out.",desc:"Business cards, brochures, flyers, rack cards, postcards, event signage, standing banners, trade show materials, and vehicle wrap design. Designed for your audience, print-ready, and delivered in the formats your printer needs.",img:"https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=700&q=80"},
    {icon:I.flag,title:"Marketing collateral for everything else.",desc:"Sales sheets, one-pagers, proposal templates, event banners, yard signs, billboard design, window graphics, branded merchandise. If your business needs it designed, we can handle it.",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"},
  ];
  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{bottom:20,left:30,opacity:.18}}/>
      <div style={S.container}>
        <div style={{maxWidth:680,marginBottom:50}}>
          <p className="anim" style={S.overline}>What We Design</p>
          <h2 className="anim d1" style={S.h2}>From Screen to Print, Custom-Made for Your Brand</h2>
          <p className="anim d2" style={S.body}>Every visual either builds trust or weakens it. Here's what we create:</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
          {items.map((item,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`}
              style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 4px 24px rgba(37,81,106,0.09)",transition:"all .35s ease"}}
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
                <img className="card-img" src={item.img} alt={item.title} loading="lazy"
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}/>
              </div>
              <div style={{padding:"22px 24px"}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,lineHeight:1.3}}>{item.title}</h3>
                <p style={{...S.body,fontSize:15,lineHeight:1.65}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process(){
  useAnim();
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [lineWidth, setLineW] = useState(0);
  const [stepsOn, setStepsOn] = useState([]);

  const steps=[
    {num:1,icon:I.chat,    title:"Discovery Conversation", desc:"We learn what you need and review any existing brand assets. No assumptions. We ask the right questions upfront."},
    {num:2,icon:I.brush,   title:"Initial Concepts",        desc:"We create design options for your review. Real choices to react to, not just one direction to approve or reject."},
    {num:3,icon:I.pencil,  title:"Feedback & Revisions",    desc:"You tell us what you like, what to change, and we refine it. Revisions are included. We work until you're happy."},
    {num:4,icon:I.download,title:"Final Delivery",          desc:"Finished files in every format you need: PDF, PNG, SVG, print-ready, web-optimized. Organized and labeled."},
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTs = null;
    const dur = 1200;
    const stepTriggers = [0, 0.2, 0.5, 0.78];
    const tick = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setLineW(eased * 100);
      stepTriggers.forEach((trigger, i) => {
        if (eased >= trigger) setStepsOn(prev => prev.includes(i) ? prev : [...prev, i]);
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started]);

  return(
    <section style={{...S.pad,background:"var(--color-light-bg)"}} ref={sectionRef}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 60px"}}>
          <p className="anim" style={S.overline}>Our Process</p>
          <h2 className="anim d1" style={S.h2}>How We Work</h2>
          <p className="anim d2" style={S.body}>Four clear steps. No confusion, no surprises, no chasing us down for updates.</p>
        </div>
        <div style={{maxWidth:960,margin:"0 auto",position:"relative"}}>
          {/* Line track */}
          <div style={{position:"absolute",top:36,left:"12.5%",right:"12.5%",height:3,background:"rgba(37,81,106,0.12)",borderRadius:2,zIndex:0}}>
            <div style={{height:"100%",width:`${lineWidth}%`,background:"linear-gradient(to right, var(--color-primary), var(--color-accent))",borderRadius:2,boxShadow:"0 0 8px rgba(205,155,66,0.3)"}}/>
          </div>
          {/* Steps grid */}
          <div className="gd-process-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,position:"relative",zIndex:1}}>
            {steps.map((st,i)=>(
              <div key={i} style={{
                padding:"0 12px",textAlign:"center",
                opacity: stepsOn.includes(i) ? 1 : 0,
                transform: stepsOn.includes(i) ? "translateY(0)" : "translateY(16px)",
                transition:"opacity 0.4s ease, transform 0.5s cubic-bezier(.34,1.4,.64,1)",
              }}>
                <div style={{
                  width:72,height:72,borderRadius:"50%",
                  background: stepsOn.includes(i) ? "var(--color-primary)" : "rgba(37,81,106,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  margin:"0 auto 20px",position:"relative",zIndex:1,
                  boxShadow: stepsOn.includes(i) ? "0 8px 20px rgba(37,81,106,0.3)" : "none",
                  transform: stepsOn.includes(i) ? "scale(1)" : "scale(0.7)",
                  transition:"all 0.5s cubic-bezier(.34,1.56,.64,1)",
                }}>
                  <div style={{color:"var(--color-accent)"}}>{st.icon}</div>
                  <div style={{
                    position:"absolute",top:-6,right:-6,width:24,height:24,borderRadius:"50%",
                    background:"var(--color-accent)",display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"var(--font-heading)",fontWeight:800,fontSize:11,color:"#fff",
                    transform: stepsOn.includes(i) ? "scale(1)" : "scale(0)",
                    transition:"transform 0.4s cubic-bezier(.34,1.56,.64,1) 0.15s",
                  }}>{st.num}</div>
                </div>
                <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-dark)",marginBottom:10,lineHeight:1.3}}>{st.title}</h4>
                <p style={{...S.body,fontSize:14,lineHeight:1.6}}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="anim d5" style={{textAlign:"center", marginTop:44}}>
          <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Start Your Design Project</Link>
        </div>
        <style>{`@media(max-width:768px){.gd-process-grid{grid-template-columns:repeat(2,1fr) !important;gap:24px !important;}}`}</style>
      </div>
    </section>
  );
}


function SocialProof(){
  useAnim();
  const statsRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c200 = useCountUp(200, 1400, started);
  const c100 = useCountUp(100, 1600, started);

  const testimonials=[
    {quote:"Exceptional service from our advertising team! Their creativity and dedication have transformed our campaigns, resulting in increased engagement and brand visibility. Each member brings unique skills and insights, contributing to our success. Highly recommend their expertise to anyone looking for impactful advertising solutions! Outstanding job and amazing people. Abe, Kady, Katlyn, Carly & Eli!!!!",name:"Brandy L.",business:"Advanced Building Restorations",location:"South Point, OH"},
    {quote:"Great team to do work with. Love the results that they've done for our company.",name:"Sabrina S.",business:"Compass Community Health",location:"Portsmouth, OH"},
  ];

  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.15}}/>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Results</p>
          <h2 className="anim d1" style={S.h2}>Don't Just Take Our Word for It</h2>
        </div>
        <div ref={statsRef} className="anim d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20,marginBottom:50}}>
          {[
            {display: started ? `${c200}+` : "200+", label:"Designs Delivered",  note:"logos, cards, brochures, and more"},
            {display: "4–5",                          label:"Business Days",      note:"typical turnaround for standalone work"},
            {display: started ? `${c100}%` : "100%", label:"File Ownership",     note:"every format you need, organized and labeled"},
          ].map((st,i)=>(
            <div key={i} style={{textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,border:"1px solid rgba(37,81,106,0.06)",transition:"all .3s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(37,81,106,0.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>{st.display}</div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>{st.label}</div>
              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>{st.note}</p>
            </div>
          ))}
        </div>
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

function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"What file formats do you deliver?",a:"Whatever you need: PDF, PNG, JPG, SVG, print-ready files, web-optimized files. We deliver in the formats that make sense for your project, organized and labeled."},
    {q:"How many revisions are included?",a:"Revisions are included in every quoted price. We want you to be happy with the final product, and we'll work with you until you are. We agree on scope upfront so there are no surprises."},
    {q:"Can you match our existing brand?",a:"Absolutely. If you have a style guide or existing assets, we work within those guidelines. If you don't, we can help you build one from the ground up as part of the project."},
    {q:"Do you design logos?",a:"Yes. Logo design is part of our brand identity services. We work with you through concepts, revisions, and final delivery in all the formats you need."},
    {q:"What's your turnaround time?",a:"Most standalone design work is completed within a few business days. We'll give you a clear timeline upfront before work begins so you can plan around it."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Graphic Design</h2>
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
              <div style={{maxHeight:open===i?300:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                <div style={{padding:"0 24px 20px"}}><p style={{...S.body,fontSize:15}}>{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GraphicDesign() {
  return (
    <Layout activeNav="Services">
      <SEOHead title="Graphic Design & Branding | Southern Ohio Small Business | AMM" description="Logo design, brand identity, business cards, brochures, and everything your business needs to look professional, custom-made, never recycled." canonical="https://www.appmktmedia.com/services/graphic-design" ogImage="/images/graphic-design-page-hero-section.jpeg"/>
      <StructuredData schema={[
        {"@context":"https://schema.org","@type":"Service","name":"Graphic Design","description":"Logo design, brand identity, business cards, brochures, custom-made, never recycled.","provider":{"@type":"LocalBusiness","name":"Appalachian Marketing & Media","url":"https://www.appmktmedia.com"},"areaServed":["Southern Ohio","Eastern Kentucky","West Virginia"],"url":"https://www.appmktmedia.com/services/graphic-design","serviceType":"Graphic Design"},
        {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.appmktmedia.com/"},{"@type":"ListItem","position":2,"name":"Services","item":"https://www.appmktmedia.com/services"},{"@type":"ListItem","position":3,"name":"Graphic Design","item":"https://www.appmktmedia.com/services/graphic-design"}]}
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What file formats do you deliver?","acceptedAnswer":{"@type":"Answer","text":"Whatever you need: PDF, PNG, JPG, SVG, print-ready files, web-optimized files. We deliver in the formats that make sense for your project, organized and labeled."}},{"@type":"Question","name":"How many revisions are included?","acceptedAnswer":{"@type":"Answer","text":"Revisions are included in every quoted price. We want you to be happy with the final product, and we'll work with you until you are. We agree on scope upfront so there are no surprises."}},{"@type":"Question","name":"Can you match our existing brand?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. If you have a style guide or existing assets, we work within those guidelines. If you don't, we can help you build one from the ground up as part of the project."}},{"@type":"Question","name":"Do you design logos?","acceptedAnswer":{"@type":"Answer","text":"Yes. Logo design is part of our brand identity services. We work with you through concepts, revisions, and final delivery in all the formats you need."}},{"@type":"Question","name":"What's your turnaround time?","acceptedAnswer":{"@type":"Answer","text":"Most standalone design work is completed within a few business days. We'll give you a clear timeline upfront before work begins so you can plan around it."}}]}]} />
      <HeroBanner />
      <WhatWeDesign />
<Process />
      <ServicePricing overline="What's Included" heading="Design Pricing" description="Flexible pricing based on what you need. From basic print materials to complex branding projects." tiers={[
        {name:"Tier 1",price:"$150",unit:"per design",tagline:"Essential print materials for everyday business needs.",features:["Flyers","Business Cards","Post Cards","Clothing (Shirts, Hats, etc.)","Labels / Stickers","Office Supplies"],highlight:false},
        {name:"Tier 2",price:"$250",unit:"per design",tagline:"Polished materials that elevate your professional presence.",features:["Menus","Wall Art","Sponsor Signage","Yard Signs","Custom Notepads","Presentation Folders"],highlight:true,badge:"Most Popular"},
        {name:"Tier 3",price:"$350",unit:"per design",tagline:"Complex, high-impact pieces that demand attention.",features:["Brochures","Billboards","Banners","Booklet Design","Storefront Signage","Table Tents"],highlight:false},
      ]} footnote="Item not listed? Give us a call, we'll create a custom solution and quote tailored to your needs."/>
      <ServicePricing overline="Brand Identity" heading="Logo Design" description="Ready for a logo that represents you? We build your brand identity from the ground up." tiers={[
        {name:"Logo Package",price:"$699",unit:"one-time",tagline:"A complete logo and brand identity built from scratch.",features:["Designed from scratch for your business","Tailored to your industry and audience","Several rounds of revisions included","Brand guide with fonts, colors, and usage rules","Final files in every format you need","Vertical, horizontal, and icon-only variations"],highlight:true,badge:"Complete Package"},
      ]}/>
      <SocialProof />
<FAQ />
      <RelatedServices current="graphic-design" />
      <CTASection heading="Ready for Design That Actually Represents Your Business?" body="From logos to brochures to full brand identity, we create professional visuals that make your business look as good as it actually is." />
    </Layout>
  );
}

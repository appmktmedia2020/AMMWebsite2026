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
  clipboard:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  map:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  binoculars:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><circle cx="6" cy="14" r="4"/><circle cx="18" cy="14" r="4"/><path d="M2 14h4M18 14h4M10 14h4M10 6l-4 8M14 6l4 8M10 6h4"/></svg>,
  flag:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  users:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════════
   MARKETING AUDIT SCORECARD MOCKUP
   ═══════════════════════════════════════════════════════════════════ */
function AuditScorecardMockup() {
  // Phases: typing → scoring (one category at a time) → actions → hold → reset
  const [phase, setPhase]         = useState("typing");
  const [typedBiz, setTypedBiz]   = useState("");
  const [scores, setScores]       = useState([]); // [{label, score, color, pct}]
  const [actionsVisible, setActV] = useState(false);
  const [scoringIdx, setScoringIdx] = useState(0);
  const [barProgress, setBarP]    = useState(0); // 0→1 for current bar

  const bizName = "Ridgeline Plumbing";
  const categories = [
    { label:"Website",     score:58, color:"#f59e0b", grade:"C+" },
    { label:"SEO",         score:32, color:"#ef4444", grade:"D"  },
    { label:"Social Media",score:74, color:"#22c55e", grade:"B"  },
    { label:"Paid Ads",    score:20, color:"#ef4444", grade:"F"  },
    { label:"Branding",    score:81, color:"#22c55e", grade:"B+" },
  ];
  const actions = [
    "Claim & optimize Google Business Profile",
    "Rebuild homepage for local keyword intent",
    "Launch 1 targeted Facebook ad campaign",
  ];

  // Typing phase
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedBiz.length < bizName.length) {
      const t = setTimeout(() => setTypedBiz(bizName.slice(0, typedBiz.length + 1)), 70);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setPhase("scoring"); setScoringIdx(0); setBarP(0); }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, typedBiz]);

  // Bar animation for current category
  useEffect(() => {
    if (phase !== "scoring") return;
    if (scoringIdx >= categories.length) {
      const t = setTimeout(() => setActV(true), 300);
      const t2 = setTimeout(() => setPhase("hold"), 800);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    let s = null;
    const target = categories[scoringIdx].score / 100;
    const dur = 700;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setBarP(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else {
        setScores(prev => [...prev, categories[scoringIdx]]);
        setScoringIdx(i => i + 1);
        setBarP(0);
      }
    };
    requestAnimationFrame(tick);
  }, [phase, scoringIdx]);

  // Hold then reset
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => {
      setActV(false);
      setScores([]);
      setScoringIdx(0);
      setBarP(0);
      setTypedBiz("");
      setTimeout(() => setPhase("typing"), 400);
    }, 4500);
    return () => clearTimeout(t);
  }, [phase]);

  const overallScore = scores.length
    ? Math.round(scores.reduce((a,s)=>a+s.score,0)/scores.length)
    : null;

  return (
    <div style={{
      width:"100%", maxWidth:380,
      background:"#1a1a2e",
      borderRadius:20,
      overflow:"hidden",
      boxShadow:"0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily:"system-ui,-apple-system,sans-serif",
      padding:"24px 22px 20px",
    }}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#b0b3b8",letterSpacing:"1.5px",textTransform:"uppercase"}}>Marketing Audit</div>
          <div style={{fontSize:10,color:"#5f6368",marginTop:2}}>Appalachian Marketing & Media</div>
        </div>
        {overallScore !== null && (
          <div style={{
            width:48,height:48,borderRadius:"50%",
            background: overallScore>=70?"rgba(34,197,94,0.15)":overallScore>=50?"rgba(245,158,11,0.15)":"rgba(239,68,68,0.15)",
            border:`2px solid ${overallScore>=70?"#22c55e":overallScore>=50?"#f59e0b":"#ef4444"}`,
            display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
            transition:"all 0.4s ease",
          }}>
            <div style={{fontSize:14,fontWeight:800,color:overallScore>=70?"#22c55e":overallScore>=50?"#f59e0b":"#ef4444",lineHeight:1}}>{overallScore}</div>
            <div style={{fontSize:8,color:"#b0b3b8"}}>/ 100</div>
          </div>
        )}
      </div>

      {/* Business name field */}
      <div style={{
        background:"rgba(255,255,255,0.04)",
        border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:8,padding:"8px 12px",
        marginBottom:16,display:"flex",alignItems:"center",gap:8,
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span style={{fontSize:12,color:"#e4e6eb",flex:1}}>
          {typedBiz}
          {phase==="typing"&&<span style={{display:"inline-block",width:1.5,height:"0.85em",background:"var(--color-accent)",marginLeft:1,verticalAlign:"text-bottom",animation:"sblink 0.7s step-end infinite"}}/>}
        </span>
        {scores.length===categories.length&&(
          <span style={{fontSize:9,fontWeight:700,color:"#22c55e",background:"rgba(34,197,94,0.1)",padding:"2px 6px",borderRadius:4}}>COMPLETE</span>
        )}
      </div>

      {/* Score bars */}
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
        {categories.map((cat, i) => {
          const isScored  = i < scores.length;
          const isCurrent = i === scoringIdx && phase === "scoring";
          const pct = isScored ? cat.score : isCurrent ? Math.round(barProgress * 100) : 0;
          const color = isScored ? cat.color : isCurrent
            ? (pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444")
            : "rgba(255,255,255,0.08)";
          return (
            <div key={i}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color: (isScored||isCurrent) ? "#e4e6eb" : "#5f6368",fontWeight: (isScored||isCurrent) ? 600 : 400,transition:"color 0.3s"}}>{cat.label}</span>
                <span style={{fontSize:10,fontWeight:700,color: isScored ? cat.color : "#5f6368",transition:"color 0.3s"}}>
                  {isScored ? `${cat.score}  ${cat.grade}` : isCurrent ? `${pct}` : ", "}
                </span>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                <div style={{
                  height:"100%",
                  width:`${pct}%`,
                  background:color,
                  borderRadius:3,
                  transition: isScored ? "none" : "width 0.02s linear",
                  boxShadow: (isScored||isCurrent) ? `0 0 6px ${color}66` : "none",
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority actions */}
      <div style={{
        background:"rgba(205,155,66,0.08)",
        border:"1px solid rgba(205,155,66,0.2)",
        borderRadius:10,padding:"12px 14px",
        opacity: actionsVisible ? 1 : 0,
        transform: actionsVisible ? "translateY(0)" : "translateY(8px)",
        transition:"opacity 0.4s ease, transform 0.4s ease",
      }}>
        <div style={{fontSize:10,fontWeight:700,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>
          Priority Actions
        </div>
        {actions.map((a,i)=>(
          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<actions.length-1?6:0}}>
            <span style={{fontSize:11,color:"var(--color-accent)",marginTop:1,flexShrink:0}}>→</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.75)",lineHeight:1.4}}>{a}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes sblink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 1, HERO
   ═══════════════════════════════════════════════════════════════════ */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 520px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Strategic Consulting</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(32px,5vw,50px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Marketing Advice You Can{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Actually Trust.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:560,marginBottom:30,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Sometimes you don't need someone to do your marketing, you need someone to tell you what to do. We offer audits, strategic planning, and ongoing advisory for businesses that want expert direction.
          </p>
          <div style={{animation:"fadeInUp .8s ease .25s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Free Consultation</Link>
          </div>
        </div>
        <div style={{flex:"1 1 300px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .25s forwards",opacity:0}}>
          <AuditScorecardMockup />
        </div>
      </div>
</section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 2, SERVICES GRID  (card-img hover fix)
   ═══════════════════════════════════════════════════════════════════ */
function ServicesGrid(){
  useAnim();
  const services=[
    {icon:I.clipboard,overline:"Diagnose",title:"Marketing Audits",desc:"Not sure what's working? We review everything you're doing and give you a clear picture.",bullets:["Website performance analysis","Social media presence evaluation","SEO and search visibility assessment","Competitive landscape overview","Actionable recommendations you can use immediately"],closing:"We'll tell you what's working, what's not, and where to focus.",img:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=80"},
    {icon:I.map,overline:"Plan",title:"Strategic Planning",desc:"Once you know where you stand, you need a plan. We build strategies tailored to your business, not a generic playbook.",bullets:["Marketing strategy development","Goal setting and KPI definition","Channel selection and prioritization","Budget allocation recommendations","Timeline and milestone planning"],closing:"You'll walk away with a clear roadmap and the confidence to execute it.",img:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80"},
    {icon:I.binoculars,overline:"Understand",title:"Competitive Analysis",desc:"Understanding your competition helps you stand out. We research who you're up against and find where the real opportunities are.",bullets:["Competitor identification and research","Strengths and weaknesses assessment","Market positioning opportunities","Differentiation strategy"],closing:null,img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&q=80"},
    {icon:I.flag,overline:"Execute",title:"Campaign Planning",desc:"Have a specific initiative coming up? We plan the campaign from start to finish before you spend a dollar.",bullets:["Target audience definition","Messaging and positioning","Channel strategy and budget","Success metrics and KPIs"],closing:"All mapped out before you spend a dollar.",img:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80"},
    {icon:I.users,overline:"Partner",title:"Ongoing Advisory",desc:"Think of us as your outsourced marketing director. Regular strategy sessions, decision support, and honest guidance.",bullets:["Monthly or bi-weekly strategy sessions","In-house team direction and oversight","Performance review and course correction","On-call guidance for decisions as they come up"],closing:"You don't have to figure it out alone.",img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80"},
  ];

  /* First row = 3 cards, second row = 2 centered. CSS grid with named areas. */
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>What We Offer</p>
          <h2 className="anim d1" style={S.h2}>Consulting Services</h2>
          <p className="anim d2" style={S.body}>From one-time audits to long-term advisory, we offer the level of engagement that makes sense for where you are.</p>
        </div>

        {/* Top row: first 3 cards */}
        <div className="consulting-grid-top" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:24,marginBottom:24}}>
          {services.slice(0,3).map((sv,i)=>(
            <div key={i} className={`anim d${i+1}`}
              style={{borderRadius:20,overflow:"hidden",background:"var(--color-light-bg)",transition:"all .3s ease"}}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-4px)";
                e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.background="#fff";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1.06)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.background="var(--color-light-bg)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1)";
              }}>
              <div style={{height:180,overflow:"hidden",position:"relative"}}>
                <img className="card-img" src={sv.img} alt={sv.title} loading="lazy"
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}/>
              </div>
              <div style={{padding:"28px 30px"}}>
                <p style={{...S.overline,fontSize:11,marginBottom:8}}>{sv.overline}</p>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:20,color:"var(--color-dark)",marginBottom:10,lineHeight:1.25}}>{sv.title}</h3>
                <p style={{...S.body,fontSize:15,marginBottom:16}}>{sv.desc}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"8px",marginBottom:sv.closing?16:0}}>
                  {sv.bullets.map((b,j)=>(
                    <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{marginTop:2,flexShrink:0}}>{I.check}</div>
                      <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-dark)"}}>{b}</span>
                    </div>
                  ))}
                </div>
                {sv.closing&&<p style={{fontFamily:"var(--font-body)",fontSize:15,fontStyle:"italic",color:"var(--color-body)",marginTop:4}}>{sv.closing}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row: last 2 cards, centered */}
        <div className="consulting-grid-bottom" style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:24,maxWidth:780,margin:"0 auto"}}>
          {services.slice(3).map((sv,i)=>(
            <div key={i+3} className={`anim d${i+4}`}
              style={{borderRadius:20,overflow:"hidden",background:"var(--color-light-bg)",transition:"all .3s ease"}}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-4px)";
                e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.background="#fff";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1.06)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.background="var(--color-light-bg)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1)";
              }}>
              <div style={{height:180,overflow:"hidden",position:"relative"}}>
                <img className="card-img" src={sv.img} alt={sv.title} loading="lazy"
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}/>
              </div>
              <div style={{padding:"28px 30px"}}>
                <p style={{...S.overline,fontSize:11,marginBottom:8}}>{sv.overline}</p>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:20,color:"var(--color-dark)",marginBottom:10,lineHeight:1.25}}>{sv.title}</h3>
                <p style={{...S.body,fontSize:15,marginBottom:16}}>{sv.desc}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"8px",marginBottom:sv.closing?16:0}}>
                  {sv.bullets.map((b,j)=>(
                    <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{marginTop:2,flexShrink:0}}>{I.check}</div>
                      <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-dark)"}}>{b}</span>
                    </div>
                  ))}
                </div>
                {sv.closing&&<p style={{fontFamily:"var(--font-body)",fontSize:15,fontStyle:"italic",color:"var(--color-body)",marginTop:4}}>{sv.closing}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive fallback styles */}
        <style>{`
          @media(max-width:900px){
            .consulting-grid-top{grid-template-columns:1fr !important;}
            .consulting-grid-bottom{grid-template-columns:1fr !important;max-width:100% !important;}
            .consulting-whofits-grid{grid-template-columns:1fr !important;}
          }
        `}</style>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 3, WHO IT'S FOR  (redesigned with dark bg, icon highlights)
   ═══════════════════════════════════════════════════════════════════ */
function WhoItsFor(){
  useAnim();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    const el = sectionRef.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ setVisible(true); obs.disconnect(); }
    },{ threshold:0.2 });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);

  const cards=[
    {num:"01",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,title:"You want to understand your options before committing.",desc:"You're not ready to hand over your marketing yet, but you want an expert opinion on what to do next and whether you're on the right track."},
    {num:"02",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,title:"You have an in-house team that needs direction.",desc:"Your people are capable, but they need a strategic roadmap and someone experienced to keep things focused and on track."},
    {num:"03",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,title:"You want to know if your current marketing is actually working.",desc:"You're spending money on marketing but you're not sure it's the right money in the right places. You need an honest outside assessment."},
    {num:"04",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,title:"You're preparing for growth and need a plan.",desc:"Things are about to get bigger and you need a strategy that scales with you, built before you're already overwhelmed."},
  ];

  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #162d3e 100%)",position:"relative",overflow:"hidden",padding:"90px 0"}} ref={sectionRef}>
      {/* Decorative elements */}
      <div className="dot-grid" style={{top:40,left:30,opacity:.08}}/>
      <div style={{position:"absolute",bottom:0,right:"15%",width:2,height:"120%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.1), transparent)",transform:"rotate(-8deg)",transformOrigin:"bottom center"}}/>

      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:620,margin:"0 auto 56px",position:"relative",zIndex:1}}>
          <p className="anim" style={{...S.overline,color:"var(--color-accent)"}}>Right Fit</p>
          <h2 className="anim d1" style={{...S.h2,color:"#fff"}}>Is Consulting Right for You?</h2>
          <p className="anim d2" style={{...S.body,color:"rgba(255,255,255,0.7)"}}>Consulting is for businesses that want clarity before, or instead of, execution. If any of these sound like you, it's worth a conversation.</p>
        </div>

        <div className="consulting-whofits-grid" style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:24,maxWidth:1000,margin:"0 auto",position:"relative",zIndex:1}}>
          {cards.map((c,i)=>(
            <div key={i} style={{
              background:"rgba(255,255,255,0.04)",
              backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:20,padding:"36px 32px",
              position:"relative",overflow:"hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition:`opacity 0.5s ease ${i*120}ms, transform 0.55s cubic-bezier(.34,1.2,.64,1) ${i*120}ms, background 0.3s ease, border-color 0.3s ease`,
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background="rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor="rgba(205,155,66,0.3)";
              e.currentTarget.style.transform="translateY(-4px)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background="rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";
              e.currentTarget.style.transform="translateY(0)";
            }}>
              {/* Ghost number */}
              <div style={{position:"absolute",top:20,right:24,fontFamily:"var(--font-heading)",fontWeight:800,fontSize:48,color:"rgba(255,255,255,0.04)",lineHeight:1}}>{c.num}</div>

              {/* Icon + accent bar row */}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{
                  width:48,height:48,borderRadius:14,
                  background:"rgba(205,155,66,0.12)",
                  border:"1px solid rgba(205,155,66,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:22,flexShrink:0,color:"var(--color-accent)",
                }}>{c.icon}</div>
                <div style={{flex:1,height:3,background:"rgba(205,155,66,0.12)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{
                    height:"100%",
                    width: visible ? "100%" : "0%",
                    background:"var(--color-accent)",
                    borderRadius:2,
                    transition:`width 0.7s ease ${i*120+250}ms`,
                  }}/>
                </div>
              </div>

              <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"#fff",marginBottom:12,lineHeight:1.3,position:"relative",zIndex:1}}>{c.title}</h4>
              <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.7}}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <div className="anim d5" style={{textAlign:"center",marginTop:44,position:"relative",zIndex:1}}>
          <Link to="/contact" style={{...S.btnP,padding:"12px 28px",fontSize:16}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
            Let's Find Out — Schedule a Free Call
          </Link>
        </div>
      </div>

      {/* Responsive */}
      <style>{`@media(max-width:700px){.who-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 5, SOCIAL PROOF  (count-up stats, no placeholder content)
   ═══════════════════════════════════════════════════════════════════ */
function SocialProof(){
  useAnim();
  const statsRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(()=>{
    const el = statsRef.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ setStarted(true); obs.disconnect(); }
    },{ threshold:0.3 });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);

  const c30 = useCountUp(30, 1400, started);

  const testimonials=[
    {
      quote:"Appalachian Marketing and Media has been incredible to work with! They've provided amazing support for the Chamber and our new coworking space, making everything easy and quick from start to finish. Their meetings are well-structured, and the team took what I had envisioned and brought it to life perfectly.",
      name:"Bobby S.",business:"Hocking Hills Chamber of Commerce",location:"Logan, OH",
    },
    {
      quote:"Abe and team have been fabulous to work with! I appreciate their diligence and attention to detail. They brought real strategic clarity to how we were approaching our marketing.",
      name:"Sandy M.",business:"SCOESC",location:"New Boston, OH",
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

        {/* Stats, count-up + hover lift */}
        <div ref={statsRef} className="anim d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20,marginBottom:50}}>
          {[
            { display: started ? `${c30}+` : "30+", label:"Strategy Clients Served", note:"businesses that trusted us with their direction" },
            { display: "2hr",                          label:"Deep-Dive Sessions",      note:"every session, no surface-level meetings" },
            { display: "0",                            label:"Strings Attached",        note:"no pressure to hire us for execution" },
          ].map((st,i)=>(
            <div key={i} style={{
              textAlign:"center",padding:"28px 20px",background:"#fff",
              borderRadius:14,border:"1px solid rgba(37,81,106,0.06)",
              transition:"all .3s ease",
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(37,81,106,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>{st.display}</div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>{st.label}</div>
              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>{st.note}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))",gap:20}}>
          {testimonials.map((t,i)=>(
            <div key={i} className={`anim d${i+3}`} style={{background:"#fff",borderRadius:16,padding:"32px 28px",border:"1px solid rgba(37,81,106,0.06)",position:"relative"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:60,color:"var(--color-accent)",opacity:.2,lineHeight:1,position:"absolute",top:16,left:24}}>"</div>
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

/* ═══════════════════════════════════════════════════════════════════
   SECTION 6, FAQ  (gold active styling)
   ═══════════════════════════════════════════════════════════════════ */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"What's included in a marketing audit?",a:"A full review of your website, social media, SEO, and overall marketing presence, plus a written report with specific, actionable recommendations tied to your business and goals. Not a generic checklist."},
    {q:"How is consulting different from your other services?",a:"Consulting is guidance. Our other services are execution. With consulting, we tell you what to do. With our other services, we do it for you. Some clients start with consulting and move into execution once they have a clear direction."},
    {q:"Can you help train my internal team?",a:"Yes. If you have staff handling marketing and they need direction or skill development, we can work with them directly, reviewing their work, providing feedback, and helping them execute more effectively."},
    {q:"How often would we meet?",a:"It depends on the engagement. For ongoing advisory, most clients meet monthly or bi-weekly. For project-based work like audits or strategic plans, we meet as needed. We define cadence upfront."},
    {q:"What if I decide I want you to execute the strategy too?",a:"Easy transition. We already know your business, your goals, and your plan. We shift from advising to doing. No ramp-up period and no need to repeat yourself."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Consulting</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{
              background: open===i ? "#fffdf7" : "#fff",
              borderRadius:12,overflow:"hidden",
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

/* ═══════════════════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════════════════ */
export default function StrategicConsulting() {
  return (
    <Layout activeNav="Services">
      <SEOHead
        title="Marketing Consulting & Strategy | Southern Ohio & Tri-State | AMM"
        description="Marketing audits, strategic planning, and ongoing advisory for Southern Ohio businesses, honest, actionable advice based on your goals and budget."
        canonical="https://www.appmktmedia.com/services/strategic-consulting"
        ogImage="/images/strategic-consulting-page-page-hero-section.jpeg"
      />
      <StructuredData schema={[
        {
          "@context":"https://schema.org","@type":"Service",
          "name":"Strategic Consulting",
          "description":"Marketing audits, strategic planning, and ongoing advisory, honest, actionable advice based on your goals and budget.",
          "provider":{"@type":"LocalBusiness","name":"Appalachian Marketing & Media","url":"https://www.appmktmedia.com"},
          "areaServed":["Southern Ohio","Eastern Kentucky","West Virginia"],"url":"https://www.appmktmedia.com/services/strategic-consulting",
          "serviceType":"Marketing Consulting"
        },
        {
          "@context":"https://schema.org","@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://www.appmktmedia.com/"},
            {"@type":"ListItem","position":2,"name":"Services","item":"https://www.appmktmedia.com/services"},
            {"@type":"ListItem","position":3,"name":"Strategic Consulting","item":"https://www.appmktmedia.com/services/strategic-consulting"}
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What's included in a marketing audit?","acceptedAnswer":{"@type":"Answer","text":"A full review of your website, social media, SEO, and overall marketing presence, plus a written report with specific, actionable recommendations tied to your business and goals. Not a generic checklist."}},{"@type":"Question","name":"How is consulting different from your other services?","acceptedAnswer":{"@type":"Answer","text":"Consulting is guidance. Our other services are execution. With consulting, we tell you what to do. With our other services, we do it for you. Some clients start with consulting and move into execution once they have a clear direction."}},{"@type":"Question","name":"Can you help train my internal team?","acceptedAnswer":{"@type":"Answer","text":"Yes. If you have staff handling marketing and they need direction or skill development, we can work with them directly, reviewing their work, providing feedback, and helping them execute more effectively."}},{"@type":"Question","name":"How often would we meet?","acceptedAnswer":{"@type":"Answer","text":"It depends on the engagement. For ongoing advisory, most clients meet monthly or bi-weekly. For project-based work like audits or strategic plans, we meet as needed. We define cadence upfront."}},{"@type":"Question","name":"What if I decide I want you to execute the strategy too?","acceptedAnswer":{"@type":"Answer","text":"Easy transition. We already know your business, your goals, and your plan. We shift from advising to doing. No ramp-up period and no need to repeat yourself."}}]}]} />

      <HeroBanner />
      <ServicesGrid />
<WhoItsFor />
      <ServicePricing
        overline="What's Included"
        heading="Strategic Consulting Pricing"
        description="Flexible plans that grow with your business. Each includes 2-hour deep-dive sessions, not quick check-ins."
        tiers={[
          { name:"Starter", price:"$500", unit:"/month", tagline:"Foundational strategy sessions to get you on the right track.", features:[
            "One 2-hour strategy session per month",
            "Mini marketing audit to identify quick wins",
            "Social media and content plan you can act on",
            "Action items with clear next steps after each session",
            "Access to our resource templates and tools",
          ], highlight:false },
          { name:"Growth", price:"$1,000", unit:"/month", tagline:"Deeper support with ongoing strategy and campaign development.", features:[
            "Two 2-hour strategy sessions per month",
            "Everything in Starter, plus:",
            "Analytics review, what's working, what's not, and why",
            "Help planning and launching specific campaigns",
            "Ongoing strategy development between sessions",
          ], highlight:true, badge:"Most Popular" },
          { name:"Full Partnership", price:"$1,500", unit:"/month", tagline:"Full strategic partnership with direct access to your team.", features:[
            "Four 2-hour strategy sessions per month (weekly)",
            "Everything in Growth, plus:",
            "Full marketing calendar built and maintained for you",
            "Branding and design feedback on your team's work",
            "Direct collaboration with your marketing, sales, and ops teams",
          ], highlight:false },
        ]}
        footnote="Save 5% when you purchase 6 months up front. Save 10% when you purchase 12 months up front. No contracts. Cancel anytime."
      />
      <SocialProof />
<FAQ />
      <RelatedServices current="strategic-consulting" />
      <CTASection heading="Ready for Expert Direction Without the Commitment of Execution?" body="Whether you need a one-time audit or ongoing strategic guidance, we'll give you honest, actionable advice you can trust. Let's start with a conversation." />
    </Layout>
  );
}

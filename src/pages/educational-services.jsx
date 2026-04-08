import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
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
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  quote:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:26,height:26,opacity:.12}}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  megaphone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  monitor:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  barChart:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  share:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  trendUp:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  search:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  pen:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
  mapPin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  video:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  users:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  target:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
};

const CREDENTIALS=[
  {icon:I.megaphone, name:"Digital Marketing",                  desc:"An overview of digital strategy, channels, and planning.",            color:"#25516A"},
  {icon:I.monitor,  name:"Web Design",                          desc:"Build and manage your own professional website.",                     color:"#1B6FAD"},
  {icon:I.barChart, name:"Data Analytics & Website Insights",   desc:"Understand your traffic and make data-driven decisions.",             color:"#2a5a7a"},
  {icon:I.share,    name:"Social Media for Business",           desc:"Set up, manage, and grow your business social media presence.",       color:"#4a2a6a"},
  {icon:I.trendUp,  name:"Social Media Marketing",              desc:"Content strategy, scheduling, engagement, and growth.",              color:"#6B403A"},
  {icon:I.search,   name:"Search Engine Optimization (SEO)",    desc:"Get found online through organic search.",                           color:"#1a5c4a"},
  {icon:I.pen,      name:"Graphic Design",                      desc:"Create professional visuals for digital and print.",                  color:"#CD9B42"},
];

/* ══════════════════════════════════════════════════════════════════════
   LIVE LESSON MOCKUP
   ══════════════════════════════════════════════════════════════════════ */
function LiveLessonMockup() {
  // Phases: typing → stepReveal → complete → hold → reset (loops)
  const LESSONS = [
    {
      credential: "Social Media for Business",
      module: "Module 2: Setting Up Your Business Presence",
      steps: [
        { task: "Navigate to Facebook.com/pages and click \"Create New Page\".", tip: "Use your exact business name, this helps customers find you in search." },
        { task: "Upload your profile photo (logo) and cover image. Aim for 400×400px for the profile.", tip: "Your cover image is prime real estate, use it to show your service area or a strong photo." },
        { task: "Fill out your About section: hours, phone, address, and a clear description of what you do.", tip: "Write this as if a stranger just found your page. Be specific about what you offer." },
      ],
    },
    {
      credential: "Search Engine Optimization (SEO)",
      module: "Module 1: Keyword Research Basics",
      steps: [
        { task: "Open Google and type your main service + your city (e.g. \"plumber Portsmouth Ohio\").", tip: "Look at the autocomplete suggestions, those are real searches people are making." },
        { task: "Scroll to the bottom of the results page and note the \"People also search for\" terms.", tip: "These are related keywords your competitors may be missing. Write them down." },
        { task: "Open your Google Business Profile and add the top 3 keywords to your business description.", tip: "Natural-sounding sentences work best, don't just list keywords." },
      ],
    },
  ];

  const [lessonIdx, setLessonIdx]   = useState(0);
  const [phase, setPhase]           = useState("typing");
  const [typedModule, setTypedModule] = useState("");
  const [visibleSteps, setVisSteps] = useState(0);
  const [checkedSteps, setChecked]  = useState([]);
  const [badgeVisible, setBadgeV]   = useState(false);

  const lesson = LESSONS[lessonIdx];

  // Typing the module title
  useEffect(() => {
    if (phase !== "typing") return;
    const full = lesson.module;
    if (typedModule.length < full.length) {
      const t = setTimeout(() => setTypedModule(full.slice(0, typedModule.length + 1)), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setVisSteps(1); setPhase("stepReveal"); }, 400);
      return () => clearTimeout(t);
    }
  }, [phase, typedModule, lesson.module]);

  // Reveal steps one by one, then auto-check them
  useEffect(() => {
    if (phase !== "stepReveal") return;
    if (visibleSteps < lesson.steps.length) {
      const t = setTimeout(() => setVisSteps(n => n + 1), 900);
      return () => clearTimeout(t);
    } else {
      // Start checking steps
      const t = setTimeout(() => setPhase("checking"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, visibleSteps, lesson.steps.length]);

  // Check steps with delay between each
  useEffect(() => {
    if (phase !== "checking") return;
    if (checkedSteps.length < lesson.steps.length) {
      const t = setTimeout(() => setChecked(prev => [...prev, prev.length]), 700);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setBadgeV(true); setPhase("hold"); }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, checkedSteps, lesson.steps.length]);

  // Hold, then reset and switch lesson
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => {
      setBadgeV(false);
      setChecked([]);
      setVisSteps(0);
      setTypedModule("");
      setTimeout(() => {
        setLessonIdx(i => (i + 1) % LESSONS.length);
        setPhase("typing");
      }, 400);
    }, 3800);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div style={{
      width:"100%", maxWidth:400,
      background:"#12131a",
      borderRadius:20,
      overflow:"hidden",
      boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
      fontFamily:"system-ui,-apple-system,sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        background:"#1c1e2a", padding:"12px 18px",
        display:"flex", alignItems:"center", gap:10,
        borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width:32,height:32,borderRadius:8,
          background:"linear-gradient(135deg,var(--color-primary),#1B6FAD)",
          display:"flex",alignItems:"center",justifyContent:"center",
          flexShrink:0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" style={{width:16,height:16}}>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:700,color:"#e4e6eb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {lesson.credential}
          </div>
          <div style={{fontSize:9,color:"#5f6368"}}>AMM Training Portal · Live Session</div>
        </div>
        <div style={{
          fontSize:9,fontWeight:700,
          background:"rgba(34,197,94,0.15)",color:"#22c55e",
          padding:"3px 8px",borderRadius:6,flexShrink:0,
          display:"flex",alignItems:"center",gap:4,
        }}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"pulse 1.5s ease infinite"}}/>
          LIVE
        </div>
      </div>

      {/* Progress bar */}
      <div style={{height:3,background:"rgba(255,255,255,0.05)"}}>
        <div style={{
          height:"100%",
          background:"linear-gradient(to right,var(--color-primary),var(--color-accent))",
          width: phase==="hold" ? "100%" : `${(checkedSteps.length / lesson.steps.length) * 100}%`,
          transition:"width 0.5s ease",
        }}/>
      </div>

      {/* Module title */}
      <div style={{padding:"16px 18px 10px"}}>
        <div style={{fontSize:9,fontWeight:700,color:"#5f6368",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>
          Current Module
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"#e4e6eb",lineHeight:1.35,minHeight:36}}>
          {typedModule}
          {phase==="typing" && (
            <span style={{display:"inline-block",width:1.5,height:"0.85em",background:"var(--color-accent)",marginLeft:2,verticalAlign:"text-bottom",animation:"lblink 0.7s step-end infinite"}}/>
          )}
        </div>
      </div>

      {/* Steps */}
      <div style={{padding:"4px 18px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {lesson.steps.map((step, i) => {
          const isVisible = i < visibleSteps;
          const isChecked = checkedSteps.includes(i);
          return (
            <div key={i} style={{
              background: isChecked ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isChecked ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`,
              borderRadius:10, padding:"10px 12px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-10px)",
              transition:`opacity 0.35s ease, transform 0.35s ease, background 0.4s ease, border-color 0.4s ease`,
            }}>
              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                {/* Checkbox */}
                <div style={{
                  width:18,height:18,borderRadius:5,flexShrink:0,marginTop:1,
                  background: isChecked ? "#22c55e" : "rgba(255,255,255,0.08)",
                  border: `1.5px solid ${isChecked ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"all 0.3s cubic-bezier(.34,1.56,.64,1)",
                  transform: isChecked ? "scale(1)" : "scale(0.9)",
                }}>
                  {isChecked && (
                    <svg viewBox="0 0 12 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{width:9,height:9}}>
                      <polyline points="1,5 4,8 11,1"/>
                    </svg>
                  )}
                </div>
                <div style={{flex:1}}>
                  <p style={{
                    fontSize:12, color: isChecked ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.8)",
                    lineHeight:1.45, marginBottom:isVisible?4:0,
                    textDecoration: isChecked ? "line-through" : "none",
                    transition:"color 0.3s ease",
                  }}>
                    {step.task}
                  </p>
                  {isVisible && !isChecked && (
                    <div style={{
                      display:"flex",gap:5,alignItems:"flex-start",
                      opacity: isVisible ? 1 : 0, transition:"opacity 0.4s ease 0.2s",
                    }}>
                      <span style={{fontSize:10,color:"var(--color-accent)",flexShrink:0,marginTop:1}}>💡</span>
                      <span style={{fontSize:10,color:"rgba(205,155,66,0.75)",lineHeight:1.4,fontStyle:"italic"}}>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion badge */}
      <div style={{
        margin:"0 18px 18px",
        padding:"10px 14px",
        background:"rgba(34,197,94,0.1)",
        border:"1px solid rgba(34,197,94,0.3)",
        borderRadius:10,
        display:"flex",alignItems:"center",gap:10,
        opacity: badgeVisible ? 1 : 0,
        transform: badgeVisible ? "scale(1)" : "scale(0.95)",
        transition:"opacity 0.4s ease, transform 0.4s cubic-bezier(.34,1.4,.64,1)",
      }}>
        <span style={{fontSize:18}}>🎓</span>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#22c55e"}}>Module Complete!</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Credential progress saved.</div>
        </div>
      </div>

      <style>{`
        @keyframes lblink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════════════ */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom,transparent,rgba(205,155,66,0.12),transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"90px 20px 50px",position:"relative",zIndex:1,display:"flex",gap:56,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Educational Services</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(30px,5vw,48px)",lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:22,animation:"fadeInUp .8s ease forwards"}}>
            Learn to Do It Yourself. From the People{" "}
            <span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Who Do It Every Day.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.75,maxWidth:560,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Not every business needs to hire a marketing agency. Some just need someone to show them how to do it right. That's exactly what this program is for.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.75,maxWidth:540,marginBottom:24,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            We deliver hands-on training that empowers you to take your own marketing into your hands. Each credential is a focused, practical course on a specific marketing skill, taught by our team, using your actual business as the classroom. No theory, no textbooks, no generic examples.
          </p>
          {/* Funding note - subtle */}
          <div style={{marginBottom:28,animation:"fadeInUp .8s ease .25s forwards",opacity:0}}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:10,
              background:"rgba(205,155,66,0.15)",
              border:"1px solid rgba(205,155,66,0.4)",
              borderRadius:30,padding:"10px 18px",
            }}>
              <div style={{
                width:24,height:24,borderRadius:"50%",
                background:"var(--color-accent)",
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,
              }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{width:11,height:11}}>
                  <polyline points="2,8 6,12 14,4"/>
                </svg>
              </div>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)"}}>
                Eligible for 100% reimbursement through Ohio TechCred
              </span>
            </div>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <a href="#credentials" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>View Credentials</a>
            <a href="#techcred" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:30,padding:"14px 28px",textDecoration:"none",transition:"all .3s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}>Pricing & Reimbursement</a>
          </div>
        </div>
        {/* Live lesson mockup */}
        <div style={{flex:"1 1 280px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .25s forwards",opacity:0}}>
          <LiveLessonMockup />
        </div>
      </div>
<style>{`@keyframes techCredPulse{0%,100%{box-shadow:0 0 0 0 rgba(205,155,66,0.5)}50%{box-shadow:0 0 0 6px rgba(205,155,66,0)}}`}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHO IS IT FOR
   ══════════════════════════════════════════════════════════════════════ */
function WhoIsItFor(){
  useAnim();
  const audiences=[
    {title:"Small businesses",desc:"That want to handle their own marketing but don't know where to start."},
    {title:"Nonprofits",desc:"With limited budgets who need to maximize internal resources."},
    {title:"Local governments & public organizations",desc:"ESCs, school districts, chambers, teams that need marketing capability without agency costs."},
    {title:"Businesses with a designated marketing person",desc:"A staff member who's 'doing the marketing' but hasn't had formal training."},
    {title:"Organizations exploring marketing",desc:"Before committing to an agency. Learn the landscape first."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:"1 1 420px"}}>
            <p className="anim" style={S.overline}>Who This Is For</p>
            <h2 className="anim d1" style={S.h2}>Is This Right for You?</h2>
            <p className="anim d2" style={{...S.body,marginBottom:32}}>
              If you've ever said "I wish I just knew how to do this myself," this program was built for you.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {audiences.map((a,i)=>(
                <div key={i} className={`anim d${Math.min(i+2,6)}`}
                  style={{background:"var(--color-light-bg)",borderRadius:14,padding:"18px 22px",transition:"all .3s ease",cursor:"default",display:"flex",gap:14,alignItems:"flex-start",borderLeft:"3px solid transparent"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderLeftColor="var(--color-accent)";e.currentTarget.style.background="#fff";e.currentTarget.style.boxShadow="0 4px 16px rgba(37,81,106,0.08)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderLeftColor="transparent";e.currentTarget.style.background="var(--color-light-bg)";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"var(--color-accent)",flexShrink:0,marginTop:9}}/>
                  <div>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)"}}>{a.title} </span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)"}}>{a.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* How it works */}
          <div style={{flex:"1 1 380px"}}>
            {/* Classroom training photo */}
            <div className="anim" style={{borderRadius:18,overflow:"hidden",marginBottom:28,boxShadow:"0 8px 32px rgba(37,81,106,0.12)",position:"relative"}}>
              <img
                src="/images/community-IMG_5220.jpeg"
                alt="AMM team delivering live marketing training to a group of business professionals"
                loading="lazy"
                style={{width:"100%",height:220,objectFit:"cover",display:"block",objectPosition:"center 30%"}}
              />
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(37,81,106,0.7) 0%, transparent 100%)",padding:"20px 16px 12px"}}>
                <span style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:12,color:"#fff",letterSpacing:"0.5px"}}>Live training session, Southern Ohio</span>
              </div>
            </div>
            <p className="anim" style={S.overline}>How It Works</p>
            <h2 className="anim d1" style={S.h2}>How It Works</h2>
            <p className="anim d2" style={{...S.body,marginBottom:16}}>
              AMM delivers hands-on training that allows you to do your own marketing without the need for ongoing professional services. Each credential is a focused course on a specific marketing skill, delivered by AMM's team, the same people doing this work for clients every day.
            </p>
            <p className="anim d3" style={{...S.body,marginBottom:28}}>
              Participants walk away with a credential and the ability to apply what they learned immediately.
            </p>
            <p className="anim d4" style={{...S.body,fontStyle:"italic",fontWeight:600,color:"var(--color-dark)",borderLeft:"3px solid var(--color-accent)",paddingLeft:16,marginBottom:32}}>
              This isn't theory. We teach you the same strategies and tools we use for our own clients.
            </p>
            <div className="anim d3" style={{position:"relative"}}>
              {[
                {n:"1",label:"Contact Us",sub:"Tell us what you want to learn."},
                {n:"2",label:"AMM Delivers Training",sub:"Hands-on, practical, using your actual business."},
                {n:"3",label:"Earn Your Credential",sub:"A recognized certification you can put to use immediately."},
              ].map((step,i)=>(
                <div key={i} style={{display:"flex",gap:18,marginBottom:i<2?22:0,position:"relative"}}>
                  {i<2&&<div style={{position:"absolute",left:17,top:36,width:2,height:30,background:"linear-gradient(to bottom, var(--color-accent), rgba(205,155,66,0.2))",zIndex:0}}/>}
                  <div style={{width:36,height:36,borderRadius:"50%",background:i===2?"var(--color-accent)":"var(--color-primary)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:800,fontSize:15,color:"#fff",flexShrink:0,zIndex:1,boxShadow:"0 4px 12px rgba(37,81,106,0.2)"}}>
                    {step.n}
                  </div>
                  <div style={{paddingTop:6}}>
                    <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)",marginBottom:2}}>{step.label}</div>
                    <div style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)"}}>{step.sub}</div>
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

/* ══════════════════════════════════════════════════════════════════════
   CREDENTIALS, per-card color hover glow
   ══════════════════════════════════════════════════════════════════════ */
function Credentials(){
  useAnim();
  return(
    <section id="credentials" style={{...S.pad,background:"#f7f8fa"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Available Credentials</p>
          <h2 className="anim d1" style={S.h2}>Available Credentials</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
          {CREDENTIALS.map((cred,i)=>(
            <div key={i} className={`anim d${Math.min(i%3+1,4)}`}
              style={{
                background:"#fff",borderRadius:18,padding:"30px 26px",
                boxShadow:"0 4px 20px rgba(0,0,0,0.05)",
                border:"1.5px solid rgba(37,81,106,0.07)",
                transition:"all .3s ease",cursor:"default",
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.borderColor=cred.color+"55";
                e.currentTarget.style.background=cred.color+"08";
                e.currentTarget.style.boxShadow=`0 8px 32px ${cred.color}22`;
                e.currentTarget.style.transform="translateY(-4px)";
                const icon=e.currentTarget.querySelector(".cred-icon");
                if(icon) icon.style.color=cred.color;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.borderColor="rgba(37,81,106,0.07)";
                e.currentTarget.style.background="#fff";
                e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform="translateY(0)";
                const icon=e.currentTarget.querySelector(".cred-icon");
                if(icon) icon.style.color="var(--color-primary)";
              }}>
              <div className="cred-icon" style={{color:"var(--color-primary)",marginBottom:16,transition:"color .3s"}}>{cred.icon}</div>
              <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,lineHeight:1.25}}>{cred.name}</h4>
              <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",lineHeight:1.65}}>{cred.desc}</p>
            </div>
          ))}
        </div>
        <p className="anim d5" style={{textAlign:"center",marginTop:32,fontFamily:"var(--font-body)",fontSize:16,color:"var(--color-body)",fontStyle:"italic"}}>
          Each credential is designed to give you a usable skill, not just a certificate for the wall.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WALK AWAY, staggered timeline reveal
   ══════════════════════════════════════════════════════════════════════ */
function WalkAway(){
  useAnim();
  const timelineRef = useRef(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  useEffect(()=>{
    const el = timelineRef.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ setTimelineVisible(true); obs.disconnect(); }
    },{ threshold: 0.3 });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);

  const outcomes=[
    "A recognized marketing credential",
    "Practical, hands-on skills you can use the next day",
    "Templates, tools, and resources to keep using after the training",
    "Confidence to manage that area of your marketing independently",
    "Access to AMM's team for questions after the program",
  ];

  const timelineRows=[
    {label:"Day 1",  val:"Skills you can apply immediately",          color:"var(--color-accent)"},
    {label:"Week 1", val:"Real marketing moving for your business",    color:"#22c55e"},
    {label:"Month 1",val:"Measurable results from what you learned",   color:"#8ab4f8"},
    {label:"Ongoing",val:"AMM team available for questions",           color:"rgba(255,255,255,0.5)"},
  ];

  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:840,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 420px"}}>
          <p className="anim" style={S.overline}>Your Takeaways</p>
          <h2 className="anim d1" style={S.h2}>What You'll Walk Away With</h2>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
            {outcomes.map((o,i)=>(
              <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{color:"var(--color-accent)",marginTop:2,flexShrink:0}}>{I.check}</div>
                <span style={{fontFamily:"var(--font-body)",fontSize:16,color:"var(--color-dark)",lineHeight:1.5}}>{o}</span>
              </div>
            ))}
          </div>
          <p className="anim d6" style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"var(--color-dark)",fontStyle:"italic"}}>
            Our goal is to make you dangerous, in the best way possible.
          </p>
        </div>
        {/* Animated timeline card */}
        <div className="anim d3" style={{flex:"1 1 300px",position:"relative"}} ref={timelineRef}>
          <div className="dot-grid" style={{top:-10,right:-10}}/>
          <div style={{background:"linear-gradient(145deg, var(--color-primary) 0%, #1B6FAD 100%)",borderRadius:22,padding:"34px 30px",boxShadow:"0 16px 50px rgba(37,81,106,0.2)",position:"relative",overflow:"hidden"}}>
            <div className="dot-grid" style={{bottom:-10,left:-10,opacity:.12}}/>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:10,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:20}}>After Training</div>
            {timelineRows.map((row,i)=>(
              <div key={i} style={{
                display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,
                paddingBottom:14,marginBottom:14,
                borderBottom:i<3?"1px solid rgba(255,255,255,0.07)":"none",
                opacity: timelineVisible ? 1 : 0,
                transform: timelineVisible ? "translateX(0)" : "translateX(-16px)",
                transition:`opacity 0.45s ease ${i*140}ms, transform 0.5s cubic-bezier(.34,1.2,.64,1) ${i*140}ms`,
              }}>
                <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:row.color,whiteSpace:"nowrap"}}>{row.label}</span>
                <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.7)",textAlign:"right",lineHeight:1.4}}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TRAINING FORMAT, 3 cards with section image
   ══════════════════════════════════════════════════════════════════════ */
function TrainingFormat(){
  useAnim();
  const formats=[
    {icon:I.mapPin, label:"In-Person",    desc:"At AMM's New Boston office or at your location. Face-to-face, hands-on instruction."},
    {icon:I.video,  label:"Virtual",      desc:"Full training delivered remotely via video. Same quality, flexible for remote teams."},
    {icon:I.users,  label:"Small Groups", desc:"Train one person or your whole team. We flex to fit your schedule and group size."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:580,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Training Format</p>
          <h2 className="anim d1" style={S.h2}>How Training Is Delivered</h2>
          <p className="anim d2" style={S.body}>
            In-person, virtual, or hybrid, depending on your needs. Flexible scheduling that works around your team's availability. Every exercise uses your actual business, your website, your social media, your real marketing challenges.
          </p>
        </div>

        {/* Section image */}
        <div className="anim d2" style={{borderRadius:20,overflow:"hidden",marginBottom:40,maxWidth:900,margin:"0 auto 40px",boxShadow:"0 8px 40px rgba(37,81,106,0.12)"}}>
          <img
            src="/images/community-IMG_5220.jpeg"
            alt="AMM team delivering live marketing training session"
            loading="lazy"
            style={{width:"100%",height:440,objectFit:"cover",objectPosition:"center 30%",display:"block"}}
          />
        </div>

        {/* 3 format cards */}
        <div className="fmt-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:900,margin:"0 auto"}}>
          {formats.map((f,i)=>(
            <div key={i} className={`anim d${i+2}`}
              style={{background:"var(--color-light-bg)",borderRadius:16,padding:"28px 24px",transition:"all .3s ease",borderLeft:"3px solid transparent"}}
              onMouseEnter={e=>{
                e.currentTarget.style.background="var(--color-primary)";
                e.currentTarget.style.borderLeftColor="var(--color-accent)";
                e.currentTarget.style.boxShadow="0 8px 24px rgba(37,81,106,0.2)";
                e.currentTarget.style.transform="translateY(-3px)";
                const iconEl = e.currentTarget.querySelector(".fmt-icon");
                const h4 = e.currentTarget.querySelector(".fmt-title");
                const p  = e.currentTarget.querySelector(".fmt-desc");
                if(iconEl) iconEl.style.color="#fff";
                if(h4) h4.style.color="#fff";
                if(p)  p.style.color="rgba(255,255,255,0.75)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background="var(--color-light-bg)";
                e.currentTarget.style.borderLeftColor="transparent";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.transform="translateY(0)";
                const iconEl = e.currentTarget.querySelector(".fmt-icon");
                const h4 = e.currentTarget.querySelector(".fmt-title");
                const p  = e.currentTarget.querySelector(".fmt-desc");
                if(iconEl) iconEl.style.color="";
                if(h4) h4.style.color="";
                if(p)  p.style.color="";
              }}>
              <div className="fmt-icon" style={{color:"var(--color-primary)",marginBottom:14,transition:"color .3s"}}>{f.icon}</div>
              <h4 className="fmt-title" style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,transition:"color .3s"}}>{f.label}</h4>
              <p className="fmt-desc" style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",lineHeight:1.6,transition:"color .3s"}}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Responsive */}
        <style>{`@media(max-width:768px){.fmt-grid{grid-template-columns:1fr !important;}}`}</style>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHY AMM
   ══════════════════════════════════════════════════════════════════════ */
function WhyAMM(){
  useAnim();
  const reasons=[
    "Your trainers are active practitioners, not just instructors.",
    "We know the Appalachian market and the unique challenges businesses here face.",
    "We teach practical application, not just concepts.",
    "We've trained businesses, nonprofits, ESCs, and local government teams across the region.",
  ];
  return(
    <section style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={{...S.container,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
        <div className="anim" style={{flex:"1 1 340px",position:"relative"}}>
          <div className="dot-grid" style={{top:-10,left:-10}}/>
          <div style={{borderRadius:22,overflow:"hidden",boxShadow:"0 16px 50px rgba(37,81,106,0.2)"}}>
            <img
              src="/images/team-photo.jpeg"
              alt="The AMM team — your marketing trainers"
              loading="lazy"
              style={{width:"100%",height:380,objectFit:"cover",objectPosition:"center 15%",display:"block"}}
            />
          </div>
        </div>
        <div style={{flex:"1 1 440px"}}>
          <p className="anim" style={S.overline}>Our Trainers</p>
          <h2 className="anim d1" style={S.h2}>The Same Team Doing This Work for Real Clients, Every Day</h2>
          <p className="anim d2" style={{...S.body,marginBottom:24}}>
            You're not learning from people who read about marketing. You're learning from the team that does it daily for businesses across Southern Ohio.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
            {reasons.map((r,i)=>(
              <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{color:"var(--color-accent)",marginTop:2,flexShrink:0}}>{I.check}</div>
                <span style={{fontFamily:"var(--font-body)",fontSize:16,color:"var(--color-dark)",lineHeight:1.6}}>{r}</span>
              </div>
            ))}
          </div>
          <p className="anim d5" style={{...S.body,marginBottom:16}}>
            And if you decide later that you want AMM to take over your marketing, we already know your business.
          </p>
          <p className="anim d6" style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",fontStyle:"italic",borderLeft:"3px solid var(--color-accent)",paddingLeft:16}}>
            Other training programs teach you what marketing is. We teach you how to actually do it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TRAINING RESULTS
   ══════════════════════════════════════════════════════════════════════ */
function TrainingResults(){
  useAnim();
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:840}}>
        <div style={{textAlign:"center",maxWidth:580,margin:"0 auto 36px"}}>
          <p className="anim" style={S.overline}>Results From Our Training</p>
          <h2 className="anim d1" style={S.h2}>What Past Participants Have Done</h2>
        </div>
        {/* Certificate ceremony photo */}
        <div className="anim d2" style={{borderRadius:20,overflow:"hidden",marginBottom:36,boxShadow:"0 8px 40px rgba(37,81,106,0.12)",maxWidth:800,margin:"0 auto 36px"}}>
          <img
            src="/images/education-page-hero-section.jpeg"
            alt="Training participants holding their certificates alongside AMM instructors"
            loading="lazy"
            style={{width:"100%",height:440,objectFit:"cover",objectPosition:"center 20%",display:"block"}}
          />
        </div>
        <p className="anim d3" style={{textAlign:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"var(--color-dark)",fontStyle:"italic"}}>
          The best compliment we get is when a training participant tells us they don't need us anymore.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FAQ, gold active styling
   ══════════════════════════════════════════════════════════════════════ */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"Do I need any prior marketing experience?",a:"Nope. Each credential starts from the basics and builds up. That's the whole point. We meet you where you are."},
    {q:"How long does each credential take to complete?",a:"It varies by credential, but most are completed within a few weeks of scheduled sessions. We'll give you a clear timeline before you start."},
    {q:"Can multiple people from my organization participate?",a:"Yes. We can train individuals or small groups. If you have a team, we can structure the training to work for everyone."},
    {q:"Is the training customized to my business?",a:"Yes. We use your actual business, your website, and your real marketing challenges as the basis for the training. There are no generic examples here."},
    {q:"What if I realize I'd rather have AMM handle it for me?",a:"Easy transition. We already know your business from the training. We can pick up right where you left off, no onboarding from scratch."},
    {q:"How do I know if my organization qualifies for TechCred reimbursement?",a:"Reach out and we'll help you figure it out. The qualification process is simpler than most people expect, and we handle the paperwork."},
    {q:"Can I take more than one credential?",a:"Absolutely. Many participants complete multiple credentials. You can build out your whole marketing skill set one credential at a time."},
    {q:"Do you offer ongoing support after the training?",a:"Yes. You'll have access to our team for questions after the program ends. We don't disappear when the training is done."},
  ];
  return(
    <section style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Educational Services</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i%3+1,4)}`} style={{
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

/* ══════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   ══════════════════════════════════════════════════════════════════════ */
export default function EducationalServices() {
  return (
    <Layout activeNav="Services">
      <SEOHead
        title="Marketing Training & Credentials | Southern Ohio | AMM"
        description="Hands-on marketing training for Southern Ohio businesses, nonprofits, and organizations. Learn to manage your own website, social media, SEO, and more. TechCred-eligible for 100% reimbursement."
        canonical="https://www.appmktmedia.com/services/educational-services"
        ogImage="/images/education-page-hero-section.jpeg"
      />
      <StructuredData schema={[
        {
          "@context":"https://schema.org","@type":"Service",
          "name":"Educational Services & Marketing Training",
          "description":"Hands-on marketing training for businesses, nonprofits, and organizations in Southern Ohio. TechCred-eligible.",
          "provider":{"@type":"LocalBusiness","name":"Appalachian Marketing & Media","url":"https://www.appmktmedia.com"},
          "areaServed":"Ohio","url":"https://www.appmktmedia.com/services/educational-services",
          "serviceType":"Marketing Education"
        },
        {
          "@context":"https://schema.org","@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://www.appmktmedia.com/"},
            {"@type":"ListItem","position":2,"name":"Services","item":"https://www.appmktmedia.com/services"},
            {"@type":"ListItem","position":3,"name":"Educational Services","item":"https://www.appmktmedia.com/services/educational-services"}
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need any prior marketing experience?","acceptedAnswer":{"@type":"Answer","text":"Nope. Each credential starts from the basics and builds up. That's the whole point. We meet you where you are."}},{"@type":"Question","name":"How long does each credential take to complete?","acceptedAnswer":{"@type":"Answer","text":"It varies by credential, but most are completed within a few weeks of scheduled sessions. We'll give you a clear timeline before you start."}},{"@type":"Question","name":"Can multiple people from my organization participate?","acceptedAnswer":{"@type":"Answer","text":"Yes. We can train individuals or small groups. If you have a team, we can structure the training to work for everyone."}},{"@type":"Question","name":"Is the training customized to my business?","acceptedAnswer":{"@type":"Answer","text":"Yes. We use your actual business, your website, and your real marketing challenges as the basis for the training. There are no generic examples here."}},{"@type":"Question","name":"What if I realize I'd rather have AMM handle it for me?","acceptedAnswer":{"@type":"Answer","text":"Easy transition. We already know your business from the training. We can pick up right where you left off, no onboarding from scratch."}},{"@type":"Question","name":"How do I know if my organization qualifies for TechCred reimbursement?","acceptedAnswer":{"@type":"Answer","text":"Reach out and we'll help you figure it out. The qualification process is simpler than most people expect, and we handle the paperwork."}}]}]} />
      <HeroBanner />
      <WhoIsItFor />
      <Credentials />
      <WalkAway />
      <div id="techcred">
        <ServicePricing
          heading="Pricing"
          description="Each credential is a focused, practical course delivered by our team. TechCred-eligible for 100% reimbursement."
          tiers={[
            { name:"Single Credential", price:"$2,000", unit:"per credential", tagline:"One focused skill, taught using your actual business.", features:["8-12 hours of hands-on training","Your business as the classroom","Practical exercises and deliverables","TechCred eligible (100% reimbursed)","Certificate of completion"], highlight:false },
            { name:"Two Credentials", price:"$3,600", unit:"bundle", tagline:"Build two complementary skills at a reduced rate.", features:["Everything in single credential (x2)","10% bundle discount","Cross-skill integration","TechCred eligible for each","Priority scheduling"], highlight:true, badge:"Best Value" },
            { name:"Full Program", price:"Custom", unit:"quote", tagline:"Three or more credentials for teams or organizations.", features:["All available credentials","Volume pricing","Custom scheduling","Team training format","TechCred eligible for each","Dedicated program coordinator"], highlight:false },
          ]}
          footnote="TechCred Ohio reimburses 100% of the cost. We handle the paperwork and walk you through every step."
        />
      </div>
      <TrainingFormat />
      <WhyAMM />
      <TrainingResults />
      <FAQ />
      <RelatedServices current="educational-services" />
      <CTASection heading="Ready to Learn How to Market Your Own Business?" body="Our training programs give you real, practical skills you can use immediately. Let's talk about which credential is right for you or your team." />
    </Layout>
  );
}

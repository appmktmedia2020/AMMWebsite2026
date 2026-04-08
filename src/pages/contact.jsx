import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import ServiceMap from "../components/ServiceMap";
import { useAnim } from "../hooks/useScrollAnimation";
// styles defined locally as S below
import { icons } from "../components/Icons";

// ─── Page-specific constants and sections ─────────────────────────────────

const S={
  container:{maxWidth:1160,margin:"0 auto",padding:"0 20px",width:"100%"},
  pad:{padding:"80px 0"},
  overline:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12},
  h2:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(26px,3.5vw,34px)",color:"var(--color-dark)",lineHeight:1.25,marginBottom:16},
  body:{fontFamily:"var(--font-body)",fontWeight:400,fontSize:17,lineHeight:1.7,color:"var(--color-body)"},
  label:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:13,color:"var(--color-dark)",letterSpacing:".3px",marginBottom:7,display:"block"},
  btnP:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,background:"var(--color-accent)",color:"#fff",border:"none",borderRadius:30,padding:"15px 38px",cursor:"pointer",transition:"all .3s ease",letterSpacing:".5px",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
};

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  email:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  mapPin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  send:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  // Step icons
  envelope:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  calendar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chat:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  doc:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  checkCircle:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

/* ─── Hero ────────────────────────────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg,#25516A 0%,#1a3d52 60%,#1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:80,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"30%",width:2,height:"140%",background:"linear-gradient(to bottom,transparent,rgba(205,155,66,0.12),transparent)",transform:"rotate(12deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",gap:56,flexWrap:"wrap",alignItems:"center"}}>
        {/* Left: text */}
        <div style={{flex:"1 1 460px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Contact</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(40px,6vw,68px)",lineHeight:1.05,letterSpacing:"-1px",marginBottom:18,animation:"fadeInUp .8s ease forwards"}}>
            Let's <span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Talk.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.78)",lineHeight:1.75,maxWidth:500,marginBottom:0,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Whether you're ready to get started or just have questions, we'd love to hear from you. No pressure, no hard sell, just a conversation about what you need.
          </p>
        </div>
        {/* Right: team photo */}
        <div style={{flex:"1 1 300px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .25s forwards",opacity:0}}>
          <div style={{width:"100%",maxWidth:460}}>
            <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.35)",border:"1px solid rgba(255,255,255,0.12)"}}>
              <img
                src="/images/team-photo.jpeg"
                alt="The AMM team"
                style={{width:"100%",height:320,objectFit:"cover",objectPosition:"center 15%",display:"block"}}
              />
            </div>
          </div>
        </div>
      </div>
</section>
  );
}

/* ─── Contact Form + Info ─────────────────────────────── */
function ContactSection(){
  useAnim();
  const[form,setForm]=useState({name:"",biz:"",phone:"",email:"",project:"",desc:"",source:""});
  const[submitted,setSubmitted]=useState(false);
  const[submitting,setSubmitting]=useState(false);
  const[submitError,setSubmitError]=useState("");
  const handle=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try{
      const body=new URLSearchParams({
        "form-name":"contact",
        ...form,
      });
      const res=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body.toString()});
      if(res.ok){setSubmitted(true);}
      else{setSubmitError("Something went wrong. Please try again or call us directly.");}
    }catch(err){
      setSubmitError("Network error. Please try again or call us at (740) 672-5069.");
    }finally{
      setSubmitting(false);
    }
  };

  const contactItems=[
    {icon:I.phone,label:"Phone",val:"(740) 672-5069",link:"tel:+17406725069"},
    {icon:I.email,label:"Email",val:"contact@appmktmedia.com",link:"mailto:contact@appmktmedia.com"},
    {icon:I.mapPin,label:"Office",val:"3879 Rhodes Ave, Suite 226\nNew Boston, OH 45662",link:null},
    {icon:I.clock,label:"Hours",val:"Consultations by appointment. We respond to all inquiries within 24 business hours.",link:null},
  ];

  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container}}>
        <div className="contact-grid" style={{display:"flex",gap:56,alignItems:"flex-start",flexWrap:"wrap"}}>

          {/* ── Form ── */}
          <div style={{flex:"1 1 480px"}}>
            {submitted?(
              <div style={{background:"var(--color-light-bg)",borderRadius:22,padding:"60px 40px",textAlign:"center"}}>
                <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,var(--color-accent),#b8842e)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",boxShadow:"0 10px 30px rgba(205,155,66,0.28)"}}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:24,color:"var(--color-dark)",marginBottom:12}}>Message Received!</h3>
                <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"var(--color-body)",lineHeight:1.7,maxWidth:380,margin:"0 auto"}}>Thanks for reaching out. We'll review your message and get back to you within 24 business hours.</p>
              </div>
            ):(
              <div style={{background:"#fff",borderRadius:22,border:"1.5px solid rgba(37,81,106,0.09)",boxShadow:"0 8px 40px rgba(0,0,0,0.06)",padding:"40px 36px"}}>
                <h2 className="anim" style={{...S.h2,marginBottom:28}}>Send Us a Message</h2>
                <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit}>
                  <input type="hidden" name="form-name" value="contact" />
                  <input type="text" name="bot-field" style={{display:"none"}} />
                  {/* Row: Name + Business */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                    <div>
                      <label htmlFor="contact-name" style={S.label}>Your Name <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
                      <input id="contact-name" className="form-input" name="name" value={form.name} onChange={handle} placeholder="Jane Smith" required aria-required="true"/>
                    </div>
                    <div>
                      <label htmlFor="contact-biz" style={S.label}>Business Name</label>
                      <input id="contact-biz" className="form-input" name="biz" value={form.biz} onChange={handle} placeholder="Smith & Co."/>
                    </div>
                  </div>
                  {/* Row: Phone + Email */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                    <div>
                      <label htmlFor="contact-phone" style={S.label}>Phone Number</label>
                      <input id="contact-phone" className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="(740) 555-0000"/>
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={S.label}>Email <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
                      <input id="contact-email" className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="jane@yourbusiness.com" required aria-required="true"/>
                    </div>
                  </div>
                  {/* Type of Project */}
                  <div style={{marginBottom:16}}>
                    <label htmlFor="contact-project" style={S.label}>Type of Project</label>
                    <select id="contact-project" className="form-input" name="project" value={form.project} onChange={handle}>
                      <option value="">Select a project type...</option>
                      {["Marketing Package","Website","SEO","Social Media","Graphic Design","Consulting","Internship Opportunity","Other"].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Description */}
                  <div style={{marginBottom:16}}>
                    <label htmlFor="contact-desc" style={S.label}>Brief Project Description</label>
                    <textarea id="contact-desc" className="form-input" name="desc" value={form.desc} onChange={handle} placeholder="Tell us a little about your project or what you're looking for..." rows={4}/>
                  </div>
                  {/* How did you hear */}
                  <div style={{marginBottom:28}}>
                    <label htmlFor="contact-source" style={S.label}>How Did You Hear About Us?</label>
                    <input id="contact-source" className="form-input" name="source" value={form.source} onChange={handle} placeholder="Google, referral, social media..."/>
                  </div>
                  {/* Submit */}
                  <button type="submit" disabled={submitting} style={{...S.btnP,width:"100%",justifyContent:"center",fontSize:16,padding:"16px 20px",opacity:submitting?0.7:1,cursor:submitting?"wait":"pointer"}}
                    onMouseEnter={e=>!submitting&&(e.currentTarget.style.background="var(--color-accent-dark)")}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
                    {submitting?"Sending..." : <>Get in Touch {I.send}</>}
                  </button>
                  {submitError&&<p role="alert" style={{fontFamily:"var(--font-body)",fontSize:14,color:"#C0392B",textAlign:"center",marginTop:12}}>{submitError}</p>}
                  <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",textAlign:"center",marginTop:14,fontStyle:"italic"}}>No pressure. No hard sell. Just a conversation.</p>
                </form>
              </div>
            )}
          </div>

          {/* ── Contact Info ── */}
          <div style={{flex:"0 1 320px",display:"flex",flexDirection:"column",gap:0}}>
            <div className="anim" style={{borderRadius:16,overflow:"hidden",marginBottom:20,boxShadow:"0 6px 24px rgba(37,81,106,0.12)"}}>
              <img
                src="/images/team-meeting.jpeg"
                alt="AMM team working with a client"
                loading="lazy"
                style={{width:"100%",height:200,objectFit:"cover",objectPosition:"center 30%",display:"block"}}
              />
            </div>
            <p className="anim" style={{...S.overline,marginBottom:20}}>Get in Touch</p>
            <h2 className="anim d1" style={{...S.h2,fontSize:"clamp(22px,3vw,28px)",marginBottom:28}}>Other Ways to Reach Us</h2>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
              {contactItems.map((item,i)=>(
                <div key={i} className={`anim d${i+1} contact-info-item`}
                  style={{display:"flex",gap:16,alignItems:"flex-start",background:"var(--color-light-bg)",borderRadius:14,padding:"18px 20px",transition:"all .3s ease"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"var(--color-primary)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
                    {item.icon}
                  </div>
                  <div style={{paddingTop:2}}>
                    <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:12,letterSpacing:"1.5px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:4}}>{item.label}</div>
                    {item.link?(
                      <a href={item.link} style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-dark)",textDecoration:"none",lineHeight:1.5,transition:"color .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.color="var(--color-primary-light)"}
                        onMouseLeave={e=>e.currentTarget.style.color="var(--color-dark)"}>
                        {item.val}
                      </a>
                    ):(
                      <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-dark)",lineHeight:1.55,whiteSpace:"pre-line"}}>{item.val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Social links */}
            <div className="anim d5">
              <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:12,letterSpacing:"1.5px",color:"var(--color-body)",textTransform:"uppercase",marginBottom:14}}>Follow Us</p>
              <div style={{display:"flex",gap:10}}>
                {[{i:I.facebook,u:"https://www.facebook.com/AppalachianMarketing",label:"Facebook"},{i:I.instagram,u:"https://www.instagram.com/appalachianmarketing",label:"Instagram"},{i:I.linkedin,u:"https://www.linkedin.com/company/appalachian-marketing-and-media/",label:"LinkedIn"},{i:I.youtube,u:"https://www.youtube.com/@appalachianmarketingandmed2575",label:"YouTube"}].map((ic, i) => (
                  <a key={i} href={ic.u} target="_blank" rel="noopener noreferrer" aria-label={ic.label} style={{width:42,height:42,borderRadius:"50%",background:"var(--color-primary)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"all .3s",textDecoration:"none"}}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent)"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--color-primary)"}>
                    {ic.i}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What Happens Next ───────────────────────────────── */
function WhatHappensNext(){
  useAnim();
  const timelineRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);   // 0–1 progress of the drawn line
  const [visibleSteps, setVisibleSteps] = useState(0); // how many step cards have popped in
  const animRef = useRef(null);
  const startedRef = useRef(false);

  const steps=[
    {icon:I.envelope,   title:"We review your inquiry.",           detail:"Within 24 hours of receiving your message.",                                    color:"var(--color-primary)"},
    {icon:I.calendar,   title:"We schedule a free consultation.",   detail:"A quick call to learn about your business and discuss your options.",           color:"var(--color-primary-light)"},
    {icon:I.chat,       title:"We learn about your goals.",         detail:"What you need, what you've tried, and where you want to go.",                   color:"#1a5c4a"},
    {icon:I.doc,        title:"You receive a tailored proposal.",   detail:"Built around your business, not a generic template.",                           color:"var(--color-accent-dark)"},
    {icon:I.checkCircle,title:"No obligation.",                     detail:"Take your time to decide. No pressure from us.",                                color:"var(--color-accent)"},
  ];

  // Trigger when section scrolls into view
  useEffect(()=>{
    const el = timelineRef.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !startedRef.current){
        startedRef.current = true;
        obs.disconnect();
        runAnimation();
      }
    },{ threshold: 0.15 });
    obs.observe(el);
    return ()=>{ obs.disconnect(); if(animRef.current) cancelAnimationFrame(animRef.current); startedRef.current = false; };
  },[]);

  function runAnimation(){
    const totalDuration = 1600; // ms for line to fully draw
    const stepRevealFraction = 1 / steps.length; // each step reveals when line reaches it
    let start = null;

    function tick(ts){
      if(!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / totalDuration, 1);
      // eased progress
      const eased = 1 - Math.pow(1 - p, 2.5);
      setLineHeight(eased);
      // reveal steps as line reaches them
      const stepsToShow = Math.floor(eased / stepRevealFraction) + (eased > 0 ? 1 : 0);
      setVisibleSteps(Math.min(stepsToShow, steps.length));
      if(p < 1){
        animRef.current = requestAnimationFrame(tick);
      } else {
        setLineHeight(1);
        setVisibleSteps(steps.length);
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }

  return(
    <section style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={{...S.container,display:"flex",gap:70,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:"1 1 380px"}}>
          <p className="anim" style={S.overline}>The Process</p>
          <h2 className="anim d1" style={S.h2}>What Happens After You Reach Out</h2>
          <p className="anim d2" style={S.body}>Here's exactly what to expect from the moment you hit submit to the moment we start working together.</p>
        </div>
        <div style={{flex:"1 1 380px",position:"relative"}} ref={timelineRef}>
          {/* Grey track (full height) */}
          <div style={{position:"absolute",left:19,top:20,bottom:20,width:2,background:"rgba(37,81,106,0.1)",zIndex:0}}/>
          {/* Animated gold fill */}
          <div style={{
            position:"absolute",left:19,top:20,width:2,
            height:`calc((100% - 40px) * ${lineHeight})`,
            background:"linear-gradient(to bottom, var(--color-accent), rgba(205,155,66,0.3))",
            zIndex:1,
            transformOrigin:"top",
            transition:"none",
            boxShadow: lineHeight > 0 ? "0 0 8px rgba(205,155,66,0.4)" : "none",
          }}/>
          {steps.map((step,i)=>(
            <div key={i} style={{
              display:"flex",gap:20,alignItems:"flex-start",
              marginBottom:i<steps.length-1?26:0,
              position:"relative",zIndex:2,
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateX(0)" : "translateX(-12px)",
              transition:`opacity 0.4s ease, transform 0.45s cubic-bezier(.34,1.2,.64,1)`,
            }}>
              {/* Circle, springs in when visible */}
              <div style={{
                width:40,height:40,borderRadius:"50%",
                background: visibleSteps > i ? step.color : "rgba(37,81,106,0.15)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",flexShrink:0,
                boxShadow: visibleSteps > i ? `0 4px 14px rgba(37,81,106,0.25)` : "none",
                transform: visibleSteps > i ? "scale(1)" : "scale(0.7)",
                transition:`background 0.3s ease, transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease`,
              }}>
                {step.icon}
              </div>
              {/* Content card */}
              <div style={{
                background:"#fff",borderRadius:14,padding:"16px 20px",flex:1,
                boxShadow:"0 2px 14px rgba(0,0,0,0.05)",
                border:"1px solid rgba(37,81,106,0.06)",
                transition:"box-shadow .3s ease, transform .3s ease",
              }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateX(4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateX(0)";}}>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)",marginBottom:4}}>{step.title}</div>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",lineHeight:1.55}}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Service Area ────────────────────────────────────── */
function ServiceArea(){
  useAnim();
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:640,margin:"0 auto 48px"}}>
          <p className="anim" style={S.overline}>Service Area</p>
          <h2 className="anim d1" style={S.h2}>Businesses We Serve Across the&nbsp;Region</h2>
          <p className="anim d2" style={{...S.body,maxWidth:520,margin:"0 auto"}}>
            Southern Ohio, Eastern Kentucky, and West Virginia. Click any pin to learn more.
          </p>
        </div>
        <div className="anim d2" style={{borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(37,81,106,0.12)",height:460}}>
          <ServiceMap height={460} />
        </div>
        <p className="anim d3" style={{textAlign:"center",fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",fontStyle:"italic",marginTop:24}}>
          Not sure if we're a fit for your location? Reach out anyway, we work with clients beyond the map.
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────── */

// ─── Page Export ─────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <Layout activeNav="Contact">
      <SEOHead
        title="Contact AMM | Free Marketing Consultation | (740) 672-5069"
        description="Schedule a free marketing consultation with AMM. No pressure, no contracts. Call (740) 672-5069 or send a message, we respond within 24 business hours."
        canonical="https://www.appmktmedia.com/contact"
        ogImage="/images/team-photo.jpeg"
      />
      <HeroBanner />
      <ContactSection />
      <WhatHappensNext />
      <ServiceArea />
    </Layout>
  );
}

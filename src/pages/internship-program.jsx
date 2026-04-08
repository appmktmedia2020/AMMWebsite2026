import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import StructuredData from "../components/StructuredData";
import { useAnim } from "../hooks/useScrollAnimation";
// styles defined locally as S below
import { icons } from "../components/Icons";

// ─── Page-specific constants and sections ─────────────────────────────────

const S={
  container:{maxWidth:1160,margin:"0 auto",padding:"0 20px",width:"100%"},
  pad:{padding:"80px 0"},
  overline:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12},
  h2:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,36px)",color:"var(--color-dark)",lineHeight:1.25,marginBottom:16},
  body:{fontFamily:"var(--font-body)",fontWeight:400,fontSize:17,lineHeight:1.7,color:"var(--color-body)"},
  btnP:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,background:"var(--color-accent)",color:"#fff",border:"none",borderRadius:30,padding:"10px 22px",cursor:"pointer",transition:"all .3s ease",letterSpacing:".5px",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
  label:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:13,color:"var(--color-dark)",letterSpacing:".3px",marginBottom:7,display:"block"},
};

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  checkWhite:<svg aria-hidden="true" viewBox="0 0 20 20" fill="#fff" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  upload:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28}}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  quote:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:26,height:26,opacity:.12}}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  send:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  // Skill icons
  social:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  pen:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  magnifier:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  monitor:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  chatBubble:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  settings:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  // Detail icons
  calendar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  mapPin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  users:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  folder:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
};

/* ─── Hero ────────────────────────────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"90px 20px 50px",position:"relative",zIndex:1,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Internship Program</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(30px,5vw,48px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Real Experience. Real Work.{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Right Here in Appalachia.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.75,maxWidth:560,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            We started this program because we believe the next generation of marketers shouldn't have to leave the region to get real experience. Our interns don't fetch coffee, they work on real projects for real clients from day one.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0,fontStyle:"italic"}}>
            If you're a student, a recent graduate, or someone looking to break into marketing, this program was built for you.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <a href="#apply" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Apply Now</a>
            <a href="#details" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,color:"rgba(255,255,255,0.75)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:30,padding:"14px 28px",textDecoration:"none",transition:"all .3s",display:"inline-flex",alignItems:"center",gap:8}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}>Learn More</a>
          </div>
        </div>
        {/* Intern group photo */}
        <div style={{flex:"1 1 300px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .25s forwards",opacity:0}}>
          <img src="/images/internship-page-hero-section.jpeg" alt="AMM internship program cohort" style={{width:"100%",maxWidth:480,borderRadius:20,display:"block",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} />
        </div>
      </div>
</section>
  );
}

/* ─── Why It Exists ──────────────────────────────────── */
function WhyExists(){
  useAnim();
  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.05}}/>
      <div style={{...S.container,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center",maxWidth:960,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{flex:"1 1 460px"}}>
          <p className="anim" style={S.overline}>Why This Program Exists</p>
          <h2 className="anim d1" style={S.h2}>We Built the Opportunity We Wish We'd Had</h2>
          <p className="anim d2" style={{...S.body,marginBottom:18}}>
            Marketing talent in this region often leaves for opportunities in bigger cities. Local students deserve hands-on experience without having to relocate. AMM was built with the help of this community, and this program is one of the ways we give back.
          </p>
          <p className="anim d3" style={{...S.body,fontStyle:"italic",fontWeight:600,color:"var(--color-dark)"}}>
            We grew up here. We went to school here. We want to create the opportunities we wish we'd had.
          </p>
        </div>
        {/* Stat cards */}
        <div className="anim d2" style={{flex:"1 1 280px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {num:"Day 1",label:"Real client work starts"},
            {num:"SSU",label:"University partner"},
            {num:"10–20",label:"Hours/week flexible"},
            {num:"Alumni",label:"Some now on our team"},
          ].map((st,i)=>(
            <div key={i} style={{background:"var(--color-light-bg)",borderRadius:20,padding:"32px 22px",textAlign:"center",transition:"all .3s ease",boxShadow:"0 4px 16px rgba(37,81,106,0.07)",border:"1px solid rgba(37,81,106,0.06)"}}
              className="hover-card-invert"
              onMouseEnter={e=>{e.currentTarget.classList.add("hovered");}}
              onMouseLeave={e=>{e.currentTarget.classList.remove("hovered");}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:34,color:"var(--color-primary)",lineHeight:1,marginBottom:10}}>{st.num}</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",lineHeight:1.4}}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What You'll Do ─────────────────────────────────── */
function WhatYoullDo(){
  useAnim();
  const tasks=[
    "Work on real client projects alongside the AMM team",
    "Create social media content, graphics, and marketing materials",
    "Assist with website builds and updates",
    "Conduct research for SEO and marketing strategy",
    "Participate in client meetings and strategy sessions",
    "Contribute to campaign planning and execution",
  ];
  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1600&q=80')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.05}}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
          {/* Visual mockup of work */}
          <div className="anim" style={{flex:"1 1 340px",position:"relative"}}>
            <div className="dot-grid" style={{top:-10,right:-10}}/>
            <div style={{background:"var(--color-primary)",borderRadius:22,overflow:"hidden",boxShadow:"0 16px 50px rgba(37,81,106,0.22)"}}>
              {/* "Desktop" chrome */}
              <div style={{background:"rgba(0,0,0,0.2)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                {["#ff5f57","#ffbd2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                <div style={{flex:1,height:18,background:"rgba(255,255,255,0.1)",borderRadius:4,marginLeft:8}}/>
              </div>
              <div style={{padding:"24px 22px"}}>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:10,letterSpacing:"2px",color:"rgba(255,255,255,0.45)",textTransform:"uppercase",marginBottom:14}}>Current Project</div>
                <div style={{height:5,background:"rgba(255,255,255,0.15)",borderRadius:3,width:"80%",marginBottom:8}}/>
                <div style={{height:4,background:"rgba(255,255,255,0.09)",borderRadius:3,width:"60%",marginBottom:20}}/>
                {/* Task rows */}
                {[
                  {label:"Social content draft",done:true},
                  {label:"SEO keyword research",done:true},
                  {label:"Client deck revision",done:false,active:true},
                  {label:"Analytics report",done:false},
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:t.done?"var(--color-accent)":t.active?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.06)",border:t.active?"1.5px solid var(--color-accent)":"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {t.done&&<svg aria-hidden="true" viewBox="0 0 10 10" fill="none" style={{width:8,height:8}}><path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{fontFamily:"var(--font-body)",fontSize:13,color:t.done?"rgba(255,255,255,0.5)":t.active?"#fff":"rgba(255,255,255,0.35)",textDecoration:t.done?"line-through":"none"}}>{t.label}</span>
                    {t.active&&<span style={{marginLeft:"auto",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:9,letterSpacing:"1px",background:"rgba(205,155,66,0.2)",color:"var(--color-accent)",borderRadius:10,padding:"2px 8px"}}>IN PROGRESS</span>}
                  </div>
                ))}
                {/* Team avatars */}
                <div style={{marginTop:20,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{display:"flex"}}>
                    {["RS","CB","KR","YOU"].map((init,i)=>(
                      <div key={i} style={{width:28,height:28,borderRadius:"50%",background:i===3?"var(--color-accent)":"rgba(255,255,255,0.15)",border:"2px solid var(--color-primary)",marginLeft:i>0?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:9,color:"#fff"}}>
                        {init}
                      </div>
                    ))}
                  </div>
                  <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"rgba(255,255,255,0.45)"}}>Working with the team</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{flex:"1 1 440px"}}>
            <p className="anim" style={S.overline}>Day-to-Day</p>
            <h2 className="anim d1" style={S.h2}>What You'll Actually Do</h2>
            <p className="anim d2" style={{...S.body,marginBottom:24}}>
              Our interns aren't observers. They're part of the team with real responsibilities and real mentorship. From week one, you're doing actual work for actual clients.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {tasks.map((t,i)=>(
                <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{marginTop:2,flexShrink:0}}>{I.check}</div>
                  <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-dark)",lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
            <p className="anim d6" style={{...S.body,fontSize:15,fontStyle:"italic",borderLeft:"3px solid var(--color-accent)",paddingLeft:16}}>
              You'll leave with a portfolio, real references, and skills you can use immediately, whether you stay in the region or go anywhere in the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────── */
function Skills(){
  useAnim();
  const skills=[
    {icon:I.social,label:"Social Media Management & Content Creation",img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"},
    {icon:I.pen,label:"Graphic Design Tools & Best Practices",img:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80"},
    {icon:I.magnifier,label:"SEO Fundamentals & Digital Strategy",img:"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=700&q=80"},
    {icon:I.monitor,label:"Website Design & Development Basics",img:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80"},
    {icon:I.chatBubble,label:"Client Communication & Project Management",img:"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80"},
    {icon:I.settings,label:"How a Marketing Agency Actually Operates",img:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80"},
  ];
  return(
    <section style={{padding:"70px 0",background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 44px"}}>
          <p className="anim" style={S.overline}>What You'll Learn</p>
          <h2 className="anim d1" style={S.h2}>Skills You'll Walk Away With</h2>
          <p className="anim d2" style={S.body}>Six skill areas, all taught through actual practice on actual projects, not textbooks.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20,maxWidth:940,margin:"0 auto"}}>
          {skills.map((sk,i)=>(
            <div key={i} className={`anim d${Math.min(i%3+1,4)}`}
              style={{
                borderRadius:18,overflow:"hidden",position:"relative",
                height:260,display:"flex",flexDirection:"column",justifyContent:"flex-end",
                boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
                transition:"all .4s cubic-bezier(.4,0,.2,1)",cursor:"default",
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 20px 50px rgba(37,81,106,0.2)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.08)";
                const ov=e.currentTarget.querySelector(".sk-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.95) 0%, rgba(10,20,30,0.7) 50%, rgba(10,20,30,0.15) 100%)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";
                const ov=e.currentTarget.querySelector(".sk-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)";
              }}>
              <img src={sk.img} alt={sk.label} loading="lazy"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform .6s ease"}}/>
              <div className="sk-ov" style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)",
                transition:"background .4s ease",
              }}/>
              <div style={{position:"relative",zIndex:1,padding:"0 24px 22px"}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.3,margin:0}}>{sk.label}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Who Should Apply ───────────────────────────────── */
function WhoApply(){
  useAnim();
  const types=[
    {title:"College students",desc:"Studying marketing, communications, graphic design, business, or any related field. Academic credit may be available."},
    {title:"Recent graduates",desc:"Looking to build real experience before entering the workforce. Your degree is a starting point, we'll help you build on it."},
    {title:"Career changers",desc:"Exploring marketing as a new direction. If you're motivated and coachable, your background doesn't disqualify you."},
    {title:"Self-starters",desc:"Curious, driven, and ready to do the work. If you have initiative and a willingness to learn, that matters more than a perfect resume."},
  ];
  return(
    <section style={{...S.pad,background:"#f7f8fa",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.05}}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:"1 1 380px"}}>
            <p className="anim" style={S.overline}>Who It's For</p>
            <h2 className="anim d1" style={S.h2}>Who Should Apply</h2>
            <p className="anim d2" style={{...S.body,marginBottom:30}}>
              You don't have to have it all figured out. You just have to be willing to show up and learn.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {types.map((t,i)=>(
                <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{background:"#fff",borderRadius:14,padding:"20px 22px",border:"1px solid rgba(37,81,106,0.06)",boxShadow:"0 2px 12px rgba(0,0,0,0.04)",transition:"all .3s ease"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--color-accent)";e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.07)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(37,81,106,0.06)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)";}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"var(--color-accent)",flexShrink:0,marginTop:8}}/>
                    <div>
                      <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)",marginBottom:4}}>{t.title}</h4>
                      <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",lineHeight:1.6}}>{t.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Program details */}
          <div id="details" style={{flex:"1 1 360px"}}>
            <p className="anim" style={S.overline}>Program Details</p>
            <h2 className="anim d1" style={S.h2}>How the Program Works</h2>
            <p className="anim d2" style={{...S.body,marginBottom:24}}>We structure the program so it adds to your education, not competes with it.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {icon:I.calendar,label:"Semester-Based Schedule","desc":"Aligned with academic calendars, fall, spring, and summer cohorts."},
                {icon:I.clock,label:"Flexible Hours","desc":"Typically 10–20 hours per week, built around your class schedule."},
                {icon:I.mapPin,label:"New Boston Office","desc":"In-person at AMM headquarters. Hybrid arrangements considered case-by-case."},
                {icon:I.users,label:"Real Mentorship","desc":"Experienced team members across all departments, design, SEO, social, dev."},
                {icon:I.folder,label:"Portfolio Projects","desc":"You leave with real work samples you can show to any future employer."},
              ].map((d,i)=>(
                <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{display:"flex",gap:16,alignItems:"flex-start",background:"var(--color-light-bg)",borderRadius:14,padding:"16px 18px"}}>
                  <div style={{color:"var(--color-primary-light)",flexShrink:0}}>{d.icon}</div>
                  <div>
                    <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:14,color:"var(--color-dark)",marginBottom:3}}>{d.label}</div>
                    <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",lineHeight:1.5}}>{d.desc}</p>
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

/* ─── SSU Partnership ────────────────────────────────── */
function SSUPartnership(){
  useAnim();
  return(
    <section style={{padding:"70px 0",background:"#fff",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=80')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.05}}/>
      <div style={{...S.container,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center",position:"relative",zIndex:1}}>
        {/* SSU visual card */}
        <div className="anim" style={{flex:"1 1 320px",position:"relative"}}>
          <div style={{borderRadius:22,overflow:"hidden",boxShadow:"0 16px 50px rgba(37,81,106,0.2)"}}>
            {/* Shawnee State University photo */}
            <img src="/images/shawnee-state-building.jpg" alt="Shawnee State University campus, Portsmouth Ohio" style={{width:"100%",height:200,objectFit:"cover",display:"block"}}/>
            <div style={{background:"linear-gradient(135deg, var(--color-primary) 0%, #1B6FAD 100%)",padding:"32px 32px",position:"relative",overflow:"hidden"}}>
            <div className="dot-grid" style={{top:0,right:0,opacity:.12}}/>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2px",color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:14}}>In Partnership With</div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:26,color:"#fff",lineHeight:1.1,marginBottom:6}}>Shawnee State University</div>
            <div style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.6)",marginBottom:24}}>Portsmouth, Ohio · Since day one.</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {["Academic credit coordination","Guest lectures on campus","Kricker Innovation Hub workshops","Ongoing faculty collaboration"].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div>{I.checkWhite}</div>
                  <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.75)"}}>{item}</span>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
        <div style={{flex:"1 1 440px"}}>
          <p className="anim" style={S.overline}>University Partnership</p>
          <h2 className="anim d1" style={S.h2}>Built with Shawnee State</h2>
          <p className="anim d2" style={{...S.body,marginBottom:18}}>
            Shawnee State has been part of our story from the beginning. We maintain an ongoing collaboration with SSU's business and communications programs, and internships may qualify for academic credit when coordinated with your advisor.
          </p>
          <p className="anim d3" style={{...S.body,marginBottom:0}}>
            AMM team members regularly serve as guest speakers and mentors on campus. This partnership is one of the things we're most proud of, and it's built on a genuine shared belief that this region deserves more opportunities, not fewer.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────── */
function InternTestimonials(){
  useAnim();
  const quotes=[
    {q:"I came in not knowing what to expect and left with a portfolio and a full-time job offer.",name:"Former Intern",detail:"Marketing Graduate"},
    {q:"This wasn't busywork. I was working on real client projects from the first week.",name:"Former Intern",detail:"Communications Student"},
    {q:"The mentorship I got here was better than anything I experienced in a classroom.",name:"Former Intern",detail:"Graphic Design Graduate"},
  ];
  return(
    <section style={{...S.pad,background:"var(--color-primary)",position:"relative",overflow:"hidden"}}>
      {/* Background image */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80')",
        backgroundSize:"cover",backgroundPosition:"center top",
        opacity:0.15,
      }}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 44px"}}>
          <p className="anim" style={{...S.overline,color:"var(--color-accent)"}}>From Past Interns</p>
          <h2 className="anim d1" style={{...S.h2,color:"#fff"}}>Hear from People Who've Been through It</h2>
          <p className="anim d2" style={{...S.body,fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,0.6)"}}>Testimonials will be updated with real names and photos as they're collected.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:22,maxWidth:1000,margin:"0 auto"}}>
          {quotes.map((q,i)=>(
            <div key={i} className={`anim d${i+1}`} style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(8px)",borderRadius:20,padding:"32px 28px",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",border:"1px solid rgba(255,255,255,0.12)",transition:"all .3s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background="rgba(255,255,255,0.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(255,255,255,0.07)";}}>
              <div style={{color:"rgba(255,255,255,0.2)",marginBottom:12}}>{I.quote}</div>
              <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.9)",lineHeight:1.7,fontStyle:"italic",marginBottom:22}}>"{q.q}"</p>
              <div style={{display:"flex",alignItems:"center",gap:12,borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:16}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"var(--color-accent)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:14,color:"#fff",flexShrink:0}}>?</div>
                <div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:14,color:"#fff"}}>{q.name}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.55)"}}>{q.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Where They Are Now ─────────────────────────────── */
function WhereNow(){
  useAnim();
  return(
    <section style={{padding:"60px 0",background:"#fff"}}>
      <div style={{...S.container,maxWidth:900,textAlign:"center"}}>
        <p className="anim" style={{...S.overline,justifyContent:"center",display:"flex"}}>Alumni Outcomes</p>
        <h2 className="anim d1" style={S.h2}>Where They Are Now</h2>
        <p className="anim d2" style={{...S.body,maxWidth:580,margin:"0 auto 36px"}}>
          Some of our interns joined the AMM team full-time. Others took what they learned and built careers across the region. Either way, we're proud of every one of them.
        </p>
        <div className="anim d3" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,maxWidth:900,margin:"0 auto 24px"}}>
          {[
            {label:"Hired by AMM",desc:"Several interns joined full-time",img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80"},
            {label:"Entered the Field",desc:"Jobs in marketing & design",img:"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&q=80"},
            {label:"Freelance Careers",desc:"Building their own businesses",img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80"},
          ].map((out,i)=>(
            <div key={i} style={{
              borderRadius:18,overflow:"hidden",position:"relative",
              height:260,display:"flex",flexDirection:"column",justifyContent:"flex-end",
              boxShadow:"0 4px 20px rgba(0,0,0,0.08)",cursor:"default",
              transition:"all .4s cubic-bezier(.4,0,.2,1)",
            }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 20px 50px rgba(37,81,106,0.2)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.08)";
                const ov=e.currentTarget.querySelector(".wn-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.95) 0%, rgba(10,20,30,0.7) 50%, rgba(10,20,30,0.15) 100%)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";
                const ov=e.currentTarget.querySelector(".wn-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)";
              }}>
              <img src={out.img} alt={out.label} loading="lazy"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform .6s ease"}}/>
              <div className="wn-ov" style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)",
                transition:"background .4s ease",
              }}/>
              <div style={{position:"relative",zIndex:1,padding:"0 24px 22px"}}>
                <div style={{width:32,height:3,background:"var(--color-accent)",borderRadius:2,marginBottom:10}}/>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.3,margin:"0 0 4px"}}>{out.label}</h3>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.6)",margin:0}}>{out.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="anim d4" style={{...S.body,fontSize:15,marginTop:8,fontStyle:"italic"}}>Specific outcomes will be added as they're collected from alumni.</p>
      </div>
    </section>
  );
}

/* ─── Application Form ───────────────────────────────── */
function ApplicationForm(){
  useAnim();
  const[form,setForm]=useState({name:"",email:"",phone:"",school:"",interest:"",intro:""});
  const[submitted,setSubmitted]=useState(false);
  const[submitting,setSubmitting]=useState(false);
  const[submitError,setSubmitError]=useState("");
  const resumeRef=useRef(null);
  const portfolioRef=useRef(null);
  const[resumeName,setResumeName]=useState("");
  const[portfolioName,setPortfolioName]=useState("");

  const[portfolioLink,setPortfolioLink]=useState("");
  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit=async e=>{
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try{
      const body=new FormData();
      body.append("form-name","internship");
      Object.entries(form).forEach(([k,v])=>body.append(k,v));
      if(portfolioLink) body.append("portfolioLink",portfolioLink);
      if(resumeRef.current?.files[0]) body.append("resume",resumeRef.current.files[0]);
      if(portfolioRef.current?.files?.length){
        for(const f of portfolioRef.current.files) body.append("portfolio",f);
      }
      const res=await fetch("/",{method:"POST",body});
      if(res.ok){setSubmitted(true);}
      else{setSubmitError("Something went wrong. Please try again or email us directly.");}
    }catch(err){
      setSubmitError("Network error. Please try again or email contact@appmktmedia.com.");
    }finally{
      setSubmitting(false);
    }
  };

  if(submitted) return(
    <section id="apply" style={{...S.pad,background:"var(--color-light-bg)"}}>
      <div style={{...S.container,maxWidth:600,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg, var(--color-accent), #b8842e)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 10px 30px rgba(205,155,66,0.3)"}}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:34,height:34}}><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{...S.h2,textAlign:"center"}}>Application Received!</h2>
        <p style={{...S.body,marginBottom:20}}>Thanks for applying. We'll review your application and be in touch as opportunities open up.</p>
        <p style={{...S.body,fontSize:15,fontStyle:"italic"}}>Applications open seasonally based on academic semesters. If you don't see current openings, we'll keep your information on file.</p>
      </div>
    </section>
  );

  return(
    <section id="apply" style={{...S.pad,background:"var(--color-light-bg)"}}>
      <div style={{...S.container,maxWidth:760}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <p className="anim" style={S.overline}>Ready to Apply</p>
          <h2 className="anim d1" style={S.h2}>Ready to Apply?</h2>
          <p className="anim d2" style={{...S.body,maxWidth:560,margin:"0 auto"}}>
            We're always looking for motivated, creative, and driven individuals who want real-world experience. No perfect resume required, we care more about your initiative, attitude, and willingness to learn.
          </p>
        </div>
        <form name="internship" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" className="anim d3" onSubmit={handleSubmit} style={{background:"#fff",borderRadius:22,padding:"40px 36px",boxShadow:"0 8px 40px rgba(0,0,0,0.07)",border:"1px solid rgba(37,81,106,0.06)"}}>
          <input type="hidden" name="form-name" value="internship" />
          <input type="text" name="bot-field" style={{display:"none"}} />
          {/* Row 1: Name + Email */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <div>
              <label htmlFor="intern-name" style={S.label}>Full Name <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
              <input id="intern-name" className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required aria-required="true"/>
            </div>
            <div>
              <label htmlFor="intern-email" style={S.label}>Email Address <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
              <input id="intern-email" className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@email.com" required aria-required="true"/>
            </div>
          </div>
          {/* Row 2: Phone + School */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <div>
              <label htmlFor="intern-phone" style={S.label}>Phone Number</label>
              <input id="intern-phone" className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="(740) 555-0000"/>
            </div>
            <div>
              <label htmlFor="intern-school" style={S.label}>School (if applicable)</label>
              <input id="intern-school" className="form-input" name="school" value={form.school} onChange={handleChange} placeholder="Shawnee State University"/>
            </div>
          </div>
          {/* Area of Interest */}
          <div style={{marginBottom:18}}>
            <label htmlFor="intern-interest" style={S.label}>Area of Interest <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
            <select id="intern-interest" className="form-input" name="interest" value={form.interest} onChange={handleChange} required aria-required="true">
              <option value="">Select an area...</option>
              {["Marketing Strategy","Social Media","Graphic Design","SEO & Search","Website Design / Development","Video & Content Creation","I'm not sure yet"].map(opt=><option key={opt}>{opt}</option>)}
            </select>
          </div>
          {/* File uploads */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <div>
              <label htmlFor="intern-resume" style={S.label}>Resume (PDF)</label>
              <input id="intern-resume" type="file" accept=".pdf" name="resume" ref={resumeRef} style={{display:"none"}} onChange={e=>setResumeName(e.target.files[0]?.name||"")}/>
              <div className="upload-zone" onClick={()=>resumeRef.current.click()} role="button" tabIndex={0} aria-label="Upload resume PDF" onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();resumeRef.current.click();}}}>
                <div style={{color:"var(--color-primary-light)",marginBottom:6,display:"flex",justifyContent:"center"}}>{I.upload}</div>
                <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)"}}>{resumeName||"Click to upload PDF"}</p>
              </div>
            </div>
            <div>
              <label htmlFor="intern-portfolio" style={S.label}>Portfolio / Work Samples</label>
              <input id="intern-portfolio" type="file" name="portfolio" ref={portfolioRef} style={{display:"none"}} onChange={e=>setPortfolioName(e.target.files[0]?.name||"")} multiple/>
              <div className="upload-zone" onClick={()=>portfolioRef.current.click()} role="button" tabIndex={0} aria-label="Upload portfolio files" onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();portfolioRef.current.click();}}}>
                <div style={{color:"var(--color-primary-light)",marginBottom:6,display:"flex",justifyContent:"center"}}>{I.upload}</div>
                <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)"}}>{portfolioName||"Upload files or paste a link below"}</p>
              </div>
            </div>
          </div>
          {/* Portfolio link */}
          <div style={{marginBottom:18}}>
            <label htmlFor="intern-portfolio-link" style={S.label}>Portfolio Link (optional)</label>
            <input id="intern-portfolio-link" className="form-input" name="portfolioLink" value={portfolioLink} onChange={e=>setPortfolioLink(e.target.value)} placeholder="https://yourportfolio.com or Behance, LinkedIn, etc."/>
          </div>
          {/* Introduction */}
          <div style={{marginBottom:28}}>
            <label htmlFor="intern-intro" style={S.label}>Short Introduction <span aria-label="required" style={{color:"var(--color-accent)"}}>*</span></label>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",marginBottom:8,lineHeight:1.5}}>Tell us who you are, what you're interested in, and why you want to learn with us. No portfolio yet? Use this space to share your goals and what excites you about marketing.</p>
            <textarea id="intern-intro" className="form-input" name="intro" value={form.intro} onChange={handleChange} placeholder="A little about yourself, your goals, and why AMM..." rows={5} required aria-required="true"/>
          </div>
          {/* Submit */}
          {submitError&&<p role="alert" style={{fontFamily:"var(--font-body)",fontSize:14,color:"#ef4444",marginBottom:12}}>{submitError}</p>}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",fontStyle:"italic",flex:"1 1 260px"}}>Applications open seasonally. If openings aren't currently available, we'll reach out when they are.</p>
            <button type="submit" disabled={submitting} style={{...S.btnP,gap:10,opacity:submitting?0.7:1}} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
              {submitting?"Sending...":"Submit Application"} {!submitting&&I.send}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"Is the internship paid?",a:"Compensation details are confirmed on a case-by-case basis. Reach out when you apply and we'll discuss what works for your situation."},
    {q:"Do I need to be a Shawnee State student?",a:"No. We welcome students and applicants from any school or background. SSU is our primary university partner, but it doesn't determine eligibility."},
    {q:"Can I receive academic credit?",a:"In many cases, yes. We'll work with your academic advisor to coordinate credit if your program allows it. Let us know upfront and we'll make it work."},
    {q:"How many hours per week is the commitment?",a:"Flexible, but typically 10–20 hours per week depending on your schedule and the semester. We'll set expectations together before you start."},
    {q:"What if I don't have any experience yet?",a:"That's the whole point. We'll teach you. We're more interested in your attitude and curiosity than your resume. Everyone starts somewhere."},
    {q:"Is there potential for full-time employment after the internship?",a:"It's happened before and it can happen again. Several of our current team members started as interns. If you perform well and there's a fit, we'll have that conversation."},
    {q:"Can I intern remotely?",a:"We prefer in-person at our New Boston office, being around the team is a big part of the learning experience. Hybrid arrangements can be considered depending on the situation."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about the Internship Program</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i%3+1,4)}`} style={{background:"var(--color-light-bg)",borderRadius:12,overflow:"hidden",border:"1px solid rgba(37,81,106,0.06)",transition:"all .3s ease",boxShadow:open===i?"0 6px 24px rgba(0,0,0,0.05)":"none"}}>
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

/* ─── CTA ─────────────────────────────────────────────── */
/* ─── Footer ──────────────────────────────────────────── */

// ─── Page Export ─────────────────────────────────────────────────────────
export default function InternshipProgram() {
  return (
    <Layout activeNav="About">
      <SEOHead
        title="Marketing Internship Program | Appalachian Marketing & Media"
        description="Gain real marketing experience with a growing Southern Ohio agency. AMM interns work on live client campaigns in website design, SEO, social media, and more."
        canonical="https://www.appmktmedia.com/about/internship-program"
        ogImage="/images/internship-page-hero-section.jpeg"
      />
      <StructuredData schema={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.appmktmedia.com/about" },
          { "@type": "ListItem", "position": 3, "name": "Internship Program", "item": "https://www.appmktmedia.com/about/internship-program" }
        ]
      }} />
      <HeroBanner />
      <WhyExists />
      <WhatYoullDo />
      <Skills />
      <WhoApply />
      <SSUPartnership />
      <InternTestimonials />
      <WhereNow />
      <ApplicationForm />
      <FAQ />
      <CTASection heading="Ready to Start Your Marketing Career Right Here in Appalachia?" body="Our internship program gives you real experience on real projects with a team that's invested in your growth. Apply today or reach out with questions." />
    </Layout>
  );
}

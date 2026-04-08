import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import StructuredData from "../components/StructuredData";
import ServiceMap from "../components/ServiceMap";
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
};

const TEAM = [
  {name:"Audrey Schiesser",title:"Founder",initials:"AS",photo:"/images/about-page-staff-audrey.jpg",color:["#6B403A","#C47B74"],bio:"Audrey built AMM from the ground up and continues to shape the agency's direction, culture, and community partnerships."},
  {name:"Ryan Schiesser",title:"CEO & Co-Founder",initials:"RS",photo:"/images/about-page-staff-ryan.jpg",color:["#25516A","#1B6FAD"],bio:"Ryan co-founded AMM with a vision to bring big-city marketing quality to Southern Ohio businesses. He leads strategy and business development."},
  {name:"Abe Barcus",title:"COO",initials:"AB",photo:"/images/about-page-staff-abe.jpg",color:["#1a3d52","#25516A"],bio:"Abe keeps the operation running smoothly, overseeing internal processes and making sure every client gets what they were promised."},
  {name:"Kady Wamsley",title:"Creative Director",initials:"KW",photo:"/images/about-page-staff-kady.jpg",color:["#4a2a6a","#6a3a9a"],bio:"Kady handles day-to-day operations and client relationships, keeping projects on track and communication clear."},
  {name:"Carly Beeler",title:"Graphic Designer",initials:"CB",photo:"/images/about-page-staff-carly.jpg",color:["#2a5a7a","#3a7aa0"],bio:"Carly is the creative force behind AMM's design work, brand identities, print materials, and digital assets that look like they belong to real businesses."},
  {name:"Brooke Robinson",title:"Website Developer & SEO Specialist",initials:"BR",photo:"/images/about-page-staff-brooke.jpg",color:["#1a5c4a","#2a8c6e"],bio:"Brooke builds the websites and makes sure they get found. She handles development, technical SEO, and everything that happens under the hood."},
  {name:"Jared Raynard",title:"Account Representative",initials:"JR",photo:"/images/about-page-staff-jared.jpg",color:["#4a3000","#8a5800"],bio:"Jared is usually the first person you talk to at AMM. He connects with local businesses, understands their goals, and figures out how we can help."},
  {name:"Kaitie Rolfe",title:"Marketing Strategist",initials:"KR",photo:"/images/about-page-staff-kaitlyn.jpg",color:["#3a3a3a","#5a5a5a"],bio:"Kaitie manages social media content and strategy for AMM clients, creating posts that actually reflect the businesses they represent."},
  {name:"Eli Fitch",title:"Videographer",initials:"EF",photo:"/images/about-page-staff-eli.jpg",color:["#2a4080","#3a5ab0"],bio:"Eli writes copy, creates content, and tells the stories that help AMM clients connect with their audiences."},
];

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  // Value icons
  handshake:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:44,height:44}}><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>,
  barChart:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:44,height:44}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  chat:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:44,height:44}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  mapPin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:44,height:44}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  // Community icons
  graduation:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  dollar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  lightbulb:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>,
  star:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  mic:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:30,height:30}}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
};

/* ─── Hero ────────────────────────────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"90px 20px 60px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:60,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>About AMM</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(32px,5vw,50px)",lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:22,animation:"fadeInUp .8s ease forwards"}}>
            We Started Here Because{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>We Saw a Need.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.75,maxWidth:560,marginBottom:16,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Southern Ohio didn't have a marketing company that truly understood this market. Businesses were either stuck with overpriced national agencies that couldn't find Portsmouth on a map, or trying to piece things together on their own.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:17,color:"rgba(255,255,255,0.65)",lineHeight:1.75,maxWidth:540,marginBottom:32,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            Ryan and Audrey Schiesser started Appalachian Marketing & Media to change that. We're not a big-city agency. We live here, work here, and care about seeing this region thrive.
          </p>
          <div style={{animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Consultation</Link>
          </div>
        </div>
        {/* Hero image */}
        <div style={{flex:"1 1 300px",animation:"fadeInUp .9s ease .25s forwards",opacity:0,borderRadius:20,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          <img src="/images/about-hero.jpg" alt="Kady and Abe — Appalachian Marketing & Media" style={{width:"100%",display:"block"}} />
        </div>
      </div>
</section>
  );
}

/* ─── Our Story ──────────────────────────────────────── */
function OurStory(){
  useAnim();
  const milestones=[
    {year:"2020",label:"Founded in Southern Ohio with a handful of local clients and a clear mission.",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {year:"2021",label:"Grew into a full team of designers, developers, strategists, and content creators.",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>},
    {year:"Today",label:"A full-service agency with 75+ websites built, still rooted in Southern Ohio and still picking up the phone.",icon:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,display:"flex",gap:70,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 460px"}}>
          <p className="anim" style={S.overline}>Our Story</p>
          <h2 className="anim d1" style={S.h2}>Built for This Region, by People from This Region</h2>
          <p className="anim d2" style={{...S.body,marginBottom:18}}>
            What began as a small operation grew into a full team of strategists, designers, content creators, and developers, all dedicated to helping businesses in this region compete and grow.
          </p>
          <p className="anim d3" style={{...S.body,marginBottom:24}}>
            We're not here because the market was untapped or the numbers were good. We're here because we believe Southern Ohio businesses deserve real marketing support from people who actually know this community.
          </p>
          <p className="anim d4" style={{...S.body,fontStyle:"italic"}}>
            Every client we take on is a business in our community. We treat them that way.
          </p>
        </div>
        {/* Timeline */}
        <div className="anim d3" style={{flex:"1 1 340px",position:"relative"}}>
          <div className="dot-grid" style={{top:-10,right:-10}}/>
          <div style={{display:"flex",flexDirection:"column",gap:0,position:"relative"}}>
            {/* Vertical line */}
            <div style={{position:"absolute",left:22,top:22,bottom:22,width:2,background:"linear-gradient(to bottom, var(--color-accent), var(--color-primary-light))",zIndex:0}}/>
            {milestones.map((m,i)=>(
              <div key={i} style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:28,position:"relative",zIndex:1}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:i===milestones.length-1?"var(--color-accent)":"var(--color-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 12px rgba(37,81,106,0.25)"}}>
                  {m.icon}
                </div>
                <div style={{paddingTop:10}}>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:14,color:"var(--color-dark)",marginBottom:4}}>{m.year}</div>
                  <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",lineHeight:1.6}}>{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Team ────────────────────────────────────────────── */
function Team(){
  useAnim();
  return(
    <section style={{...S.pad,background:"var(--color-light-bg)"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>The Team</p>
          <h2 className="anim d1" style={S.h2}>The People Behind the Work</h2>
          <p className="anim d2" style={S.body}>Real people, local team. Each one of us is invested in your success because your success is also our community's success.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:22}}>
          {TEAM.map((member,i)=>(
            <div key={i} className={`anim d${Math.min(i%4+1,5)} team-card`}
              style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",transition:"all .35s ease",cursor:"default",position:"relative"}}>
              {/* Team member headshot placeholder */}
              <div style={{height:280,position:"relative",overflow:"hidden"}}>
                <img loading="lazy" src={member.photo || `https://placehold.co/480x360/${member.color[0].replace('#','')}/${member.color[1].replace('#','')}?text=${encodeURIComponent(member.initials)}%0AHeadshot`} alt={`${member.name} headshot`} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block",backgroundColor:"#E8F1FA"}} />
                {/* Hover overlay */}
                <div className="team-overlay" style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,opacity:0,transition:"opacity .3s ease",zIndex:2}}>
                  <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"#fff",lineHeight:1.6,textAlign:"center"}}>{member.bio}</p>
                </div>
              </div>
              <div style={{padding:"18px 20px"}}>
                <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-dark)",marginBottom:4}}>{member.name}</h4>
                <p style={{fontFamily:"var(--font-meta)",fontSize:13,color:"var(--color-accent)",letterSpacing:".5px"}}>{member.title}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
    </section>
  );
}

/* ─── Values ─────────────────────────────────────────── */
function Values(){
  useAnim();
  const vals=[
    {icon:I.handshake,title:"Relationships First",desc:"We're not here to collect clients. We're here to build partnerships. When you work with us, you get a team that genuinely cares about your success."},
    {icon:I.barChart,title:"Results That Matter",desc:"Fancy reports mean nothing if your phone isn't ringing. We focus on outcomes you can see, more leads, more customers, more growth."},
    {icon:I.chat,title:"Honest Communication",desc:"No jargon, no runaround. We explain what we're doing, why we're doing it, and whether it's working. If something isn't right, we'll tell you."},
    {icon:I.mapPin,title:"Community Investment",desc:"We hire locally, partner with Shawnee State, and invest in the next generation through our internship program. This is our home too."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Core Values</p>
          <h2 className="anim d1" style={S.h2}>What We Stand For</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22,maxWidth:1000,margin:"0 auto"}}>
          {vals.map((v,i)=>(
            <div key={i} className={`anim d${i+1} value-card`}
              style={{background:"var(--color-light-bg)",borderRadius:20,padding:"34px 28px",transition:"all .3s ease",boxShadow:"none"}}>
              <div style={{color:"var(--color-primary-light)",marginBottom:16}}>{v.icon}</div>
              <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"var(--color-dark)",marginBottom:10,lineHeight:1.2}}>{v.title}</h4>
              <p style={{...S.body,fontSize:15,lineHeight:1.7}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why Different ──────────────────────────────────── */
function WhyDifferent(){
  useAnim();
  const items=[
    {num:"01",title:"No contracts.",desc:"We earn your business every month. If we're not delivering, you're free to walk away. No fine print, no cancellation fees."},
    {num:"02",title:"Regular meetings and check-ins.",desc:"Not just when invoices are due. We stay in touch because that's how partnerships work."},
    {num:"03",title:"City-quality work without the city attitude.",desc:"You won't see us in suits with a million-dollar presentation. But our standards for quality and results are just as high as any big-city agency."},
    {num:"04",title:"We actually communicate.",desc:"Our clients consistently say the same thing, working with us is different because we actually pick up the phone, respond to messages, and keep them in the loop."},
  ];
  return(
    <section style={{padding:"80px 0",background:"#f7f8fa",position:"relative",overflow:"hidden"}}>
      {/* Background image */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80')",
        backgroundSize:"cover",backgroundPosition:"center",
        opacity:0.05,
      }}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>What Sets Us Apart</p>
          <h2 className="anim d1" style={S.h2}>Why Businesses Choose Us over Everyone Else</h2>
        </div>
        <div className="why-diff-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,maxWidth:1100,margin:"0 auto 32px"}}>
          {items.map((it,i)=>(
            <div key={i} className={`anim d${i+1} diff-item`}
              style={{background:"rgba(255,255,255,0.6)",borderRadius:16,padding:"26px 22px",transition:"all .3s ease",border:"1px solid rgba(37,81,106,0.06)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:14,right:18,fontFamily:"var(--font-heading)",fontWeight:800,fontSize:44,color:"rgba(37,81,106,0.05)",lineHeight:1}}>{it.num}</div>
              <div style={{width:36,height:4,background:"var(--color-accent)",borderRadius:2,marginBottom:18}}/>
              <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,lineHeight:1.3}}>{it.title}</h4>
              <p style={{...S.body,fontSize:15}}>{it.desc}</p>
            </div>
          ))}
        </div>
        <p className="anim d5" style={{textAlign:"center",...S.body,fontSize:16,fontStyle:"italic",fontWeight:600,color:"var(--color-dark)"}}>
          Other agencies lock you in and disappear. We show up every month, ready to work.
        </p>
      </div>
    </section>
  );
}

/* ─── Community ──────────────────────────────────────── */
function Community(){
  useAnim();
  const initiatives=[
    {icon:I.graduation,title:"Internship Program",sub:"Shawnee State University",desc:"Real experience for local students who shouldn't have to leave the region to build a career in marketing."},
    {icon:I.dollar,title:"Scholarship Fund",sub:"Local Students",desc:"Investing in the next generation because this community invested in us."},
    {icon:I.lightbulb,title:"Workshops & Seminars",sub:"Kricker Innovation Hub",desc:"Sharing what we know with local businesses and entrepreneurs who are building something."},
    {icon:I.star,title:"Local Event Sponsorships",sub:"White Gravel Mines & More",desc:"Sponsoring the events and initiatives that matter to the people who actually live here."},
    {icon:I.mic,title:"Speaking Engagements",sub:"Colleges & Business Groups",desc:"Guest lectures at local colleges and presentations for business groups across the region."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        {/* Section header — always centered on mobile */}
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 40px"}}>
          <p className="anim" style={S.overline}>Community First</p>
          <h2 className="anim d1" style={S.h2}>Invested in More than Just Marketing</h2>
          <p className="anim d2" style={{...S.body,marginBottom:8}}>
            This is our home. We didn't start a business here just to take from the community — we started it to be part of it.
          </p>
          <p className="anim d3" style={{...S.body,fontStyle:"italic"}}>
            When local businesses grow, local communities grow. That's the idea we're betting on.
          </p>
        </div>

        {/* Initiative cards — responsive grid */}
        <div className="community-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:48}}>
          {initiatives.map((init,i)=>(
            <div key={i} className={`anim d${Math.min(i+2,6)} community-card community-hover-card`}
              style={{background:"var(--color-light-bg)",borderRadius:16,padding:"24px 20px",transition:"all .3s ease"}}
              onMouseEnter={e=>e.currentTarget.classList.add("hovered")}
              onMouseLeave={e=>e.currentTarget.classList.remove("hovered")}>
              <div className="community-card-icon" style={{color:"var(--color-primary-light)",marginBottom:10,display:"flex",justifyContent:"center"}}>{init.icon}</div>
              <div className="community-card-body" style={{textAlign:"center"}}>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)",marginBottom:2,lineHeight:1.3}}>{init.title}</div>
                <div style={{color:"var(--color-accent)",fontWeight:600,fontSize:12,fontFamily:"var(--font-heading)",marginBottom:6}}>{init.sub}</div>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",lineHeight:1.55}}>{init.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo collage */}
        <div className="anim d3 community-photos" style={{position:"relative"}}>
          <div className="dot-grid" style={{top:-15,right:-15}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,position:"relative"}}>
            <div style={{borderRadius:12,overflow:"hidden",aspectRatio:"4/3"}}>
              <img loading="lazy" src="/images/community-IMG_5225.jpeg" alt="AMM at community event" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}} />
            </div>
            <div style={{borderRadius:12,overflow:"hidden",aspectRatio:"4/3"}}>
              <img loading="lazy" src="/images/community-IMG_5226.jpeg" alt="AMM at conference" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}} />
            </div>
            <div style={{borderRadius:12,overflow:"hidden",aspectRatio:"4/3"}}>
              <img loading="lazy" src="/images/community-IMG_5220.jpeg" alt="AMM workshop presentation" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block"}} />
            </div>
            <div style={{borderRadius:12,overflow:"hidden",aspectRatio:"4/3"}}>
              <img loading="lazy" src="/images/community-IMG_5228.jpeg" alt="AMM speaking engagement" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block"}} />
            </div>
            <div style={{gridColumn:"1 / 3",borderRadius:12,overflow:"hidden",aspectRatio:"16/7"}}>
              <img loading="lazy" src="/images/community-IMG_5221.jpeg" alt="AMM videography on location" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block"}} />
            </div>
            <div style={{gridColumn:"3 / 5",borderRadius:12,overflow:"hidden",aspectRatio:"16/7"}}>
              <img loading="lazy" src="/images/community-IMG_5222.jpeg" alt="AMM team filming" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Service Area / Map ─────────────────────────────── */
function ServiceArea(){
  useAnim();
  // SVG-based stylized map of the service corridor
  const cities=[
    {name:"Chillicothe",x:210,y:70,primary:false},
    {name:"Portsmouth",x:200,y:170,primary:true,label:"HQ"},
    {name:"New Boston",x:215,y:188,primary:false,hq:true},
    {name:"Ironton",x:175,y:250,primary:false},
    {name:"Ashland, KY",x:135,y:290,primary:false},
    {name:"Huntington, WV",x:280,y:300,primary:false},
    {name:"Logan",x:300,y:160,primary:false},
    {name:"Charleston, WV",x:380,y:280,primary:false},
  ];
  return(
    <section style={{padding:"80px 0",background:"var(--color-light-bg)"}}>
      <div style={S.container}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
          {/* Interactive map */}
          <div className="anim" style={{flex:"1 1 380px",minHeight:400,borderRadius:24,overflow:"hidden",boxShadow:"0 10px 40px rgba(37,81,106,0.1)"}}>
            <ServiceMap height={400} />
          </div>
                    {/* Text */}
          <div style={{flex:"1 1 420px"}}>
            <p className="anim" style={S.overline}>Service Area</p>
            <h2 className="anim d1" style={S.h2}>Where We Work</h2>
            <p className="anim d2" style={{...S.body,marginBottom:20}}>
              We're headquartered in New Boston, Ohio, right in the heart of the tri-state region. Our primary focus runs from Chillicothe, Ohio to Charleston, West Virginia, and we're expanding our presence across the region every year.
            </p>
            <div className="anim d3" style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {[
                {label:"Home Base",val:"Portsmouth & Scioto County"},
                {label:"Growing Presence",val:"Ironton · Ashland (KY) · Huntington (WV) · Logan/Hocking Hills"},
                {label:"Full Service Corridor",val:"Chillicothe, OH → Charleston, WV"},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:i===0?"var(--color-accent)":"var(--color-primary-light)",flexShrink:0,marginTop:8}}/>
                  <div>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:14,color:"var(--color-dark)"}}>{row.label}: </span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)"}}>{row.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="anim d4" style={{...S.body,fontSize:15,fontStyle:"italic"}}>
              We work with clients across the region and beyond. If you found us and like what you see, geography won't get in the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */
/* ─── Footer ──────────────────────────────────────────── */

// ─── Page Export ─────────────────────────────────────────────────────────
export default function AboutUs() {
  return (
    <Layout activeNav="About">
      <SEOHead
        title="About AMM | Southern Ohio's Full-Service Marketing Team"
        description="Meet Ryan, Audrey, and the AMM team, the people behind Southern Ohio's fastest-growing full-service marketing agency. No contracts, real results."
        canonical="https://www.appmktmedia.com/about"
        ogImage="/images/about-page-hero-section.jpeg"
      />
      <StructuredData schema={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.appmktmedia.com/about" }
        ]
      }} />
      <HeroBanner />
      <OurStory />
<Team />
<Values />
<WhyDifferent />
<Community />
<ServiceArea />
      <CTASection />
    </Layout>
  );
}

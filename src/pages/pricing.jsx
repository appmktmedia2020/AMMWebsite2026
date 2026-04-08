import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
import { useAnim } from "../hooks/useScrollAnimation";
// styles defined locally as S below
import { icons } from "../components/Icons";
import StructuredData from "../components/StructuredData";

// ─── Page-specific constants and sections ─────────────────────────────────

const S={
  container:{maxWidth:1160,margin:"0 auto",padding:"0 20px",width:"100%"},
  pad:{padding:"80px 0"},
  overline:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12},
  h2:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,36px)",color:"var(--color-dark)",lineHeight:1.25,marginBottom:16},
  body:{fontFamily:"var(--font-body)",fontWeight:400,fontSize:17,lineHeight:1.7,color:"var(--color-body)"},
  btnP:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,background:"var(--color-accent)",color:"#fff",border:"none",borderRadius:30,padding:"10px 22px",cursor:"pointer",transition:"all .3s ease",letterSpacing:".5px",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
};

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  // Guarantee icons
  calendar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chat:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  user:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  dollar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  clipboard:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  // TechCred
  graduation:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

const PACKAGES=[
  {
    name:"Starter",price:"$997",unit:"/month",badge:null,
    tagline:"A strong foundation to get professional marketing in place.",
    color:"var(--color-primary)",bg:"#fff",
    features:[
      "2 custom graphic assets/mo","8 social posts/month","Basic SEO maintenance","Monthly strategy session","Dedicated account manager","Monthly performance report"],
  },
  {
    name:"Basic",price:"$1,497",unit:"/month",badge:null,
    tagline:"More content, more strategy, and added SEO support.",
    color:"var(--color-primary-light)",bg:"#fff",
    features:[
      "4 custom graphic assets/mo","12 social posts/month","Active SEO optimization","Bi-weekly strategy sessions","Dedicated account manager","Bi-weekly performance report"],
  },
  {
    name:"Growth",price:"$2,497",unit:"/month",badge:"Best Value",
    tagline:"The sweet spot. Where most of our clients land.",
    color:"var(--color-primary)",bg:"var(--color-primary)",dark:true,
    features:[
      "8 custom graphic assets/mo","20 social posts/month","Full SEO campaign","1 paid ad campaign managed","Weekly strategy sessions","Dedicated account manager","Weekly reporting + analytics"],
  },
  {
    name:"Enterprise",price:"$3,497",unit:"/month",badge:null,
    tagline:"Maximum output, maximum attention, maximum results.",
    color:"var(--color-accent)",bg:"#fff",
    features:[
      "Unlimited graphic assets","Daily social content","Aggressive SEO + backlinks","2–3 paid ad campaigns managed","On-demand strategy access","Senior account manager","Custom reporting dashboard"],
  },
];

const SERVICES=[
  {label:"Website Design & Development",price:"$2,000 – $6,500",note:"Per project",href:"/services/website-design"},
  {label:"Social Media Management",price:"$500 – $2,000",note:"Per month",href:"/services/social-media-management"},
  {label:"SEO Packages",price:"$399 – $1,999",note:"Per month",href:"/services/seo"},
  {label:"Graphic Design Assets",price:"From $150",note:"Per asset",href:"/services/graphic-design"},
  {label:"Paid Advertising (Social & Search)",price:"$299 setup",note:"+ ad spend",href:"/services/social-media-advertising"},
  {label:"Strategic Consulting",price:"$500 – $1,500",note:"Per engagement",href:"/services/strategic-consulting"},
];

const CREDENTIALS=[
  "Digital Marketing","Web Design","Data Analytics (Website Insights)",
  "Social Media for Business","Social Media Marketing",
  "Search Engine Optimization (SEO)","Graphic Design",
];

/* ─── Hero ────────────────────────────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/images/team-meeting.jpeg')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.1}}/>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"90px 20px 60px",position:"relative",zIndex:1,textAlign:"center",maxWidth:780,margin:"0 auto"}}>
        <p style={{...S.overline,animation:"fadeIn .6s ease forwards",justifyContent:"center",display:"flex"}}>Pricing</p>
        <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(34px,5.5vw,54px)",lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:22,animation:"fadeInUp .8s ease forwards"}}>
          Transparent Pricing. No Surprises.{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>No Contracts.</span>
        </h1>
        <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.78)",lineHeight:1.75,maxWidth:620,margin:"0 auto 36px",animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
          Three paths to help your business grow: a full marketing partner, a project-based solution, or hands-on training through TechCred. Pick what fits, or let us help you figure it out.
        </p>
        {/* Quick nav pills */}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animation:"fadeInUp .8s ease .25s forwards",opacity:0}}>
          {[["#packages","Marketing Packages"],["#services","Single Services"],["#training","Training Services"]].map(([href,label],i)=>(
            <a key={i} href={href} style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:14,color:"rgba(255,255,255,0.75)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:30,padding:"9px 22px",textDecoration:"none",transition:"all .25s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.2)";e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.75)";}}>
              {label}
            </a>
          ))}
        </div>
      </div>
</section>
  );
}

/* ─── Marketing Packages ─────────────────────────────── */
function MarketingPackages(){
  useAnim();

  return(
    <section id="packages" style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:640,margin:"0 auto 14px"}}>
          <p className="anim" style={S.overline}>Marketing Packages</p>
          <h2 className="anim d1" style={S.h2}>We Become Your Marketing Department</h2>
          <p className="anim d2" style={S.body}>Best for businesses that want monthly help with their overall marketing. A full team of strategists, designers, and content creators working on your business every single month.</p>
        </div>
        {/* Month-to-month badge */}
        <div className="anim d3" style={{display:"flex",justifyContent:"center",marginBottom:44}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(205,155,66,0.08)",border:"1px solid rgba(205,155,66,0.25)",borderRadius:30,padding:"8px 20px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"var(--color-accent)"}}/>
            <span style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:13,color:"var(--color-accent)"}}>Month-to-month · No contracts · Cancel anytime</span>
          </div>
        </div>
        {/* Package cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,alignItems:"stretch"}}>
          {PACKAGES.map((pkg,i)=>{
            const isFeatured=pkg.dark;
            return(
              <div key={i} className={`anim d${i+1}`}
                style={{
                  background:isFeatured?"linear-gradient(160deg, #1a3d52 0%, #25516A 50%, #1B6FAD 100%)":"#fff",
                  borderRadius:18,
                  overflow:"hidden",
                  border:isFeatured?"none":"1px solid rgba(37,81,106,0.08)",
                  position:"relative",
                  display:"flex",flexDirection:"column",
                  transition:"all .35s ease",
                  transform:isFeatured?"translateY(-6px)":"translateY(0)",
                  boxShadow:isFeatured
                    ?"0 16px 50px rgba(37,81,106,0.3), 0 0 0 1px rgba(205,155,66,0.35)"
                    :"0 2px 12px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform=isFeatured?"translateY(-10px)":"translateY(-4px)";e.currentTarget.style.boxShadow=isFeatured?"0 24px 60px rgba(37,81,106,0.4), 0 0 0 2px var(--color-accent)":"0 12px 36px rgba(37,81,106,0.12)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform=isFeatured?"translateY(-6px)":"translateY(0)";e.currentTarget.style.boxShadow=isFeatured?"0 16px 50px rgba(37,81,106,0.3), 0 0 0 1px rgba(205,155,66,0.35)":"0 2px 12px rgba(0,0,0,0.04)";}}>
                {/* Badge */}
                {pkg.badge&&(
                  <div style={{background:"var(--color-accent)",color:"#fff",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",textAlign:"center",padding:"7px 0"}}>
                    {pkg.badge}
                  </div>
                )}
                {/* Header */}
                <div style={{padding:pkg.badge?"20px 28px 0":"28px 28px 0"}}>
                  <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"1px",textTransform:"uppercase",color:isFeatured?"var(--color-accent)":"var(--color-accent)",marginBottom:6}}>{pkg.name}</p>
                  <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8}}>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:isFeatured?"#fff":"var(--color-dark)",lineHeight:1,letterSpacing:"-1px"}}>{pkg.price}</span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:15,color:isFeatured?"rgba(255,255,255,0.45)":"var(--color-body)"}}>{pkg.unit}</span>
                  </div>
                  <p style={{fontFamily:"var(--font-body)",fontSize:14,color:isFeatured?"rgba(255,255,255,0.6)":"var(--color-body)",lineHeight:1.5,marginBottom:20}}>{pkg.tagline}</p>
                </div>
                {/* Divider */}
                <div style={{height:1,margin:"0 28px",background:isFeatured?"rgba(255,255,255,0.1)":"rgba(37,81,106,0.07)"}} />
                {/* Features */}
                <div style={{padding:"20px 28px 28px",flex:1,display:"flex",flexDirection:"column"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
                    {pkg.features.map((f,j)=>(
                      <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <span style={{color:"var(--color-accent)",marginTop:2,flexShrink:0}}>{I.check}</span>
                        <span style={{fontFamily:"var(--font-body)",fontSize:14.5,color:isFeatured?"rgba(255,255,255,0.85)":"var(--color-dark)",lineHeight:1.45}}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/contact" style={{...S.btnP,width:"100%",justifyContent:"center",marginTop:24,background:isFeatured?"var(--color-accent)":"var(--color-primary)",fontSize:14,padding:"13px 20px",borderRadius:10}}
                    onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    Get Started
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {/* Note */}
        <div className="anim d5" style={{textAlign:"center",marginTop:32}}>
          <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",fontStyle:"italic",marginBottom:8}}>Not sure which tier fits? Schedule a consultation and we'll help you figure it out.</p>
          <Link to="/marketing-packages" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:14,color:"var(--color-primary-light)",textDecoration:"none"}}>View full Marketing Packages page →</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Single Services ────────────────────────────────── */
function SingleServices(){
  useAnim();
  const svcImgs=[
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=700&q=80",
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
  ];
  return(
    <section id="services" style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 44px"}}>
          <p className="anim" style={S.overline}>Single-Service Offerings</p>
          <h2 className="anim d1" style={S.h2}>Easy Solutions for Your Biggest Challenges</h2>
          <p className="anim d2" style={S.body}>Best for businesses that need help in one specific area. No long-term commitment, project-based or monthly.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20,maxWidth:1060,margin:"0 auto"}}>
          {SERVICES.map((svc,i)=>(
            <Link key={i} to={svc.href||"/contact"}
              className={`anim d${Math.min(i%3+1,4)}`}
              style={{
                borderRadius:18,overflow:"hidden",position:"relative",
                height:280,display:"flex",flexDirection:"column",justifyContent:"flex-end",
                textDecoration:"none",
                boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
                transition:"all .4s cubic-bezier(.4,0,.2,1)",
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 20px 50px rgba(37,81,106,0.2)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.08)";
                const ov=e.currentTarget.querySelector(".svc-overlay");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.95) 0%, rgba(10,20,30,0.7) 50%, rgba(10,20,30,0.15) 100%)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";
                const ov=e.currentTarget.querySelector(".svc-overlay");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)";
              }}>
              {/* Full-bleed image */}
              <img src={svcImgs[i]} alt={svc.label} loading="lazy"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform .6s ease"}}/>
              {/* Gradient overlay */}
              <div className="svc-overlay" style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)",
                transition:"background .4s ease",
              }}/>
              {/* Content */}
              <div style={{position:"relative",zIndex:1,padding:"0 24px 22px"}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.3,margin:"0 0 8px"}}>{svc.label}</h3>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:18,color:"var(--color-accent)",lineHeight:1,whiteSpace:"nowrap"}}>{svc.price}</span>
                  <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"rgba(255,255,255,0.45)",whiteSpace:"nowrap"}}>{svc.note}</span>
                  <span style={{marginLeft:"auto",flexShrink:0}}>
                    <span style={{
                      fontFamily:"var(--font-heading)",fontWeight:600,fontSize:12,
                      color:"#fff",background:"rgba(255,255,255,0.12)",
                      border:"1px solid rgba(255,255,255,0.2)",
                      borderRadius:24,padding:"5px 14px",
                      display:"flex",alignItems:"center",gap:3,
                      transition:"all .3s ease",whiteSpace:"nowrap",
                    }}>
                      Details <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:12,height:12}}><path d="M9 18l6-6-6-6"/></svg>
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="anim d4" style={{textAlign:"center",marginTop:32,fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",fontStyle:"italic"}}>
          Every project starts with a free consultation so we can give you an accurate quote.
        </p>
      </div>
    </section>
  );
}

/* ─── TechCred / Educational ─────────────────────────── */
function TechCred(){
  useAnim();
  return(
    <section id="training" style={{...S.pad,background:"var(--color-light-bg)"}}>
      <div style={S.container}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
          {/* Left: main content */}
          <div style={{flex:"1 1 460px"}}>
            <p className="anim" style={S.overline}>Educational Services</p>
            <h2 className="anim d1" style={S.h2}>Learn How to Do Your Own Marketing</h2>
            <p className="anim d2" style={{...S.body,marginBottom:18}}>
              Best for small businesses, nonprofits, and local governments who want to learn to do it themselves. Each credential is a focused, practical course taught by the same people who do this work for clients every day.
            </p>
            {/* Price callout */}
            <div className="anim d3" style={{background:"var(--color-primary)",borderRadius:16,padding:"22px 26px",display:"flex",alignItems:"center",gap:20,marginBottom:24,boxShadow:"0 8px 28px rgba(37,81,106,0.18)"}}>
              <div style={{color:"var(--color-accent)",flexShrink:0}}>{I.graduation}</div>
              <div>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:28,color:"#fff",lineHeight:1}}>$2,000 <span style={{fontSize:16,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>per credential</span></div>
                <div style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.75)",marginTop:4}}>100% reimbursable through TechCred Ohio for eligible organizations</div>
              </div>
            </div>
            <p className="anim d4" style={{...S.body,fontSize:15,fontStyle:"italic",marginBottom:22}}>
              Most of our participants pay nothing out of pocket. We'll help you figure out if your organization qualifies.
            </p>
            <div className="anim d5" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Contact Us to Learn More</Link>
              <Link to="/services/educational-services" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:14,color:"var(--color-primary)",textDecoration:"none",display:"flex",alignItems:"center",padding:"14px 0"}}>View Educational Services page →</Link>
            </div>
          </div>
          {/* Right: credential list */}
          <div className="anim d3" style={{flex:"1 1 320px"}}>
            <div style={{background:"#fff",borderRadius:20,padding:"28px 26px",boxShadow:"0 6px 28px rgba(0,0,0,0.06)",border:"1px solid rgba(37,81,106,0.06)"}}>
              <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:18}}>Available Credentials</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {CREDENTIALS.map((cred,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:"var(--color-light-bg)",borderRadius:10,transition:"all .2s ease"}}
                    className="hover-card-invert"
                    onMouseEnter={e=>e.currentTarget.classList.add("hovered")}
                    onMouseLeave={e=>e.currentTarget.classList.remove("hovered")}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"var(--color-accent)",flexShrink:0}}/>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,color:"var(--color-dark)"}}>{cred}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid rgba(37,81,106,0.06)",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#10b981",flexShrink:0}}/>
                <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)"}}>TechCred Ohio eligible, we handle the paperwork</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What Every Client Gets ─────────────────────────── */
function Guarantees(){
  useAnim();
  const items=[
    {icon:I.calendar,title:"No contracts.",desc:"Month-to-month billing on all recurring services. No lock-ins, no cancellation fees."},
    {icon:I.chat,title:"Free initial consultation.",desc:"Every engagement starts with a conversation. No strings attached, no hard sell."},
    {icon:I.user,title:"Dedicated account management.",desc:"A real person who knows your business, your goals, and what you've already tried."},
    {icon:I.dollar,title:"Transparent pricing.",desc:"No surprise charges, ever. You'll know exactly what you're paying and what you're getting."},
    {icon:I.clipboard,title:"Regular check-ins and clear reporting.",desc:"You'll always know what's happening, what's working, what's not, and what's next."},
  ];
  return(
    <section style={{...S.pad,background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #162d3e 100%)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.08}}/>
      <div style={{position:"absolute",bottom:0,left:"20%",width:2,height:"120%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.08), transparent)",transform:"rotate(8deg)",transformOrigin:"bottom center"}}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={{...S.overline,color:"var(--color-accent)"}}>What You Always Get</p>
          <h2 className="anim d1" style={{...S.h2,color:"#fff"}}>What Every Client Gets. No Matter What</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,maxWidth:1000,margin:"0 auto 36px"}}>
          {items.map((it,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`}
              style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",borderRadius:16,padding:"26px 22px",transition:"all .3s ease",display:"flex",gap:16,alignItems:"flex-start",border:"1px solid rgba(255,255,255,0.08)"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.12)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="rgba(205,155,66,0.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
              <div style={{color:"var(--color-accent)",flexShrink:0,marginTop:2}}>{it.icon}</div>
              <div>
                <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"#fff",marginBottom:6,lineHeight:1.3}}>{it.title}</h4>
                <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.6}}>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="anim d6" style={{textAlign:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"#fff",fontStyle:"italic"}}>
          We're the easiest marketing team to fire, and we say that with confidence.
        </p>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"Can I switch tiers or adjust my plan?",a:"Absolutely. Your needs will change as your business grows. We can move you up, down, or adjust the scope anytime, no penalties, no friction."},
    {q:"Is there a setup fee?",a:"For most services, no. Paid advertising campaigns have a one-time setup fee for new builds. Website projects are quoted as a complete project price. We'll be clear about any costs upfront before you commit to anything."},
    {q:"What's included in the free consultation?",a:"A conversation about your business, your goals, and your options. No strings attached, no hard sell. Just an honest discussion about what makes sense for you, whether that leads to working together or not."},
    {q:"What if I need services from more than one category?",a:"That's usually a sign a marketing package is the right fit. But if you want to combine individual services, we can build a custom plan. Just bring it up during your consultation."},
    {q:"Are payment plans available for website projects?",a:"We can discuss flexible payment options for larger projects. Just ask during your consultation and we'll work something out that makes sense for both sides."},
    {q:"What's the difference between a package and a single service?",a:"Packages bundle everything together, strategy, content, design, SEO, with a dedicated team working on your account monthly. Single services are focused on one specific area, either as a one-time project or an ongoing monthly retainer."},
    {q:"How does TechCred reimbursement work?",a:"Your organization applies for TechCred funding through the state of Ohio. We deliver the training and issue the credential. You submit for reimbursement. The state reimburses 100% of the cost. We walk you through every step, it's simpler than it sounds."},
  ];
  return(
    <section style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Pricing</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i%3+1,4)}`} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid rgba(37,81,106,0.06)",transition:"all .3s ease",boxShadow:open===i?"0 6px 24px rgba(0,0,0,0.05)":"none"}}>
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
export default function Pricing() {
  return (
    <Layout activeNav="Pricing">
      <SEOHead
        title="Marketing Services Pricing | Transparent, No-Contract | AMM"
        description="Transparent, no-contract pricing for websites, SEO, social media management, and graphic design. No hidden fees. No surprises. See exactly what you get."
        canonical="https://www.appmktmedia.com/pricing"
        ogImage="/images/team-meeting.jpeg"
      />
      <StructuredData schema={{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Can I switch tiers or adjust my plan?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. Your needs will change as your business grows. We can move you up, down, or adjust the scope anytime \u2014 no penalties, no friction."}}, {"@type": "Question", "name": "Is there a setup fee?", "acceptedAnswer": {"@type": "Answer", "text": "For most services, no. Paid advertising campaigns have a one-time setup fee for new builds. Website projects are quoted as a complete project price. We'll be clear about any costs upfront."}}, {"@type": "Question", "name": "What's included in the free consultation?", "acceptedAnswer": {"@type": "Answer", "text": "A conversation about your business, your goals, and your options. No strings attached, no hard sell. Just an honest discussion about what makes sense for you."}}, {"@type": "Question", "name": "What if I need services from more than one category?", "acceptedAnswer": {"@type": "Answer", "text": "That's usually a sign a marketing package is the right fit. But if you want to combine individual services, we can build a custom plan."}}, {"@type": "Question", "name": "How does TechCred reimbursement work?", "acceptedAnswer": {"@type": "Answer", "text": "Your organization applies for TechCred funding through the state of Ohio. We deliver the training and issue the credential. You submit for reimbursement. The state reimburses 100% of the cost."}}]}} />
      <HeroBanner />
      <MarketingPackages />
<SingleServices />
<TechCred />
<Guarantees />
<FAQ />
      <CTASection heading="Need a Custom Solution? Not Sure What's Right for You?" body="Every business is different. If you don't see exactly what you need, reach out and we'll build a plan that fits your goals, your budget, and your timeline." />
    </Layout>
  );
}

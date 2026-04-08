import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  brand:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  mobile:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2.5"/></svg>,
  edit:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  speed:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  refresh:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  wrench:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  phoneCall:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  sitemap:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="8" y="14" width="8" height="7" rx="1"/><line x1="6.5" y1="10" x2="6.5" y2="14"/><line x1="17.5" y1="10" x2="17.5" y2="14"/><line x1="6.5" y1="14" x2="12" y2="14"/><line x1="17.5" y1="14" x2="12" y2="14"/></svg>,
  paint:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/><path d="M12 11v6"/><path d="M8 17h8a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a2 2 0 012-2z"/></svg>,
  code:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  rocket:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11.5L12 15z"/></svg>,
  headset:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/></svg>,
};

function PageBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"30%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(12deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 480px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Website Design & Development</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(34px,5vw,52px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Websites That Actually{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Sell For You.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:520,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Your website is your first impression, make it count. We build fast, modern websites that look great, build trust, and turn visitors into leads.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            Every site is custom designed, no templates. You own your website when it's done. No proprietary systems and no lock-in.
          </p>
          <div style={{animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Free Consultation</Link>
          </div>
        </div>
        <div style={{flex:"1 1 380px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .2s forwards",opacity:0}}>
          <HeroRotator />
        </div>
      </div>
</section>
  );
}

function HeroRotator() {
  const sites = [
    { name: "Jesse Scott Law", img: "/images/portfolio/jesse-scott-law.svg" },
    { name: "Jade Hill Company", img: "/images/portfolio/jade-hill.svg" },
    { name: "SCOESC", img: "/images/portfolio/scoesc.svg" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive(p => (p + 1) % sites.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 480, position: "relative" }}>
      <div style={{
        borderRadius: 16, overflow: "hidden", position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#1a3d52",
        aspectRatio: "4/3",
      }}>
        {sites.map((site, i) => (
          <img
            key={i}
            src={site.img}
            alt={`${site.name} website`}
            style={{
              position: i === 0 ? "relative" : "absolute",
              top: 0, left: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top",
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          />
        ))}
      </div>
      {/* Site name label */}
      <div style={{
        textAlign: "center", marginTop: 12,
        fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13,
        color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px",
      }}>
        {sites[active].name}
      </div>
      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        {sites.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Show ${sites[i].name}`} style={{
            width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer",
            background: active === i ? "var(--color-accent)" : "rgba(255,255,255,0.25)",
            transition: "all 0.3s", transform: active === i ? "scale(1.3)" : "scale(1)",
            padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLING PORTFOLIO BANNER, infinite CSS marquee with browser-frame mockups
   Each mockup links to the live site. Duplicated array for seamless loop.
   TODO: Replace placeholder images with real screenshots (recommended 600×400px)
   TODO: Replace URLs with actual client website URLs
   ═══════════════════════════════════════════════════════════════════════════ */
function PortfolioBanner(){
  const [hoveredSite, setHoveredSite] = useState(null);
  const sites=[
    {name:"Harris Outdoors",url:"https://www.harrisoutdoorsllc.com/",img:"/images/portfolio/harris-outdoors.svg"},
    {name:"Redline Excavation & Landscape",url:"https://redlineexcavationlandscape.com/",img:"/images/portfolio/redline.svg"},
    {name:"Gallia County Common Pleas Court",url:"https://www.galliacountycommonpleascourt.gov/",img:"/images/portfolio/gallia-court.svg"},
    {name:"South Central Ohio ESC",url:"https://www.scoesc.org/",img:"/images/portfolio/scoesc.svg"},
    {name:"Jade Hill Company",url:"https://www.jadehillco.com/",img:"/images/portfolio/jade-hill.svg"},
    {name:"Divine Safety",url:"https://www.divsafety.com/",img:"/images/portfolio/divine-safety.svg"},
    {name:"Area Agency on Aging 7",url:"https://www.aaa7.org/",img:"/images/portfolio/aaa7.svg"},
    {name:"Jesse E. Scott, Attorney at Law",url:"https://www.southernohiolaw.com/",img:"/images/portfolio/jesse-scott-law.svg"},
    {name:"Homestead Accounting Group",url:"https://homesteadaccountinggroup.com/",img:"/images/portfolio/homestead-accounting.svg"},
    {name:"SuperQuik",url:"https://www.superquik.net/",img:"/images/portfolio/superquik.svg"},
    {name:"Compass Community Health",url:"https://www.compasscommunityhealth.org/",img:"/images/portfolio/compass.svg"},
  ];
  const doubled=[...sites,...sites];
  const cardW=280,gap=20;
  const totalW=sites.length*(cardW+gap);

  return(
    <section style={{padding:"50px 0 60px",background:"var(--color-light-bg)",overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes portfolioScroll{
          0%{transform:translateX(0)}
          100%{transform:translateX(-${totalW}px)}
        }
        .portfolio-track{
          display:flex;
          gap:${gap}px;
          animation:portfolioScroll ${sites.length*4}s linear infinite;
          width:max-content;
        }
        .portfolio-track:hover{
          animation-play-state:paused;
        }
        .portfolio-card{
          flex-shrink:0;
          width:${cardW}px;
          border-radius:14px;
          overflow:hidden;
          background:#fff;
          box-shadow:0 4px 20px rgba(37,81,106,0.08);
          transition:all .35s cubic-bezier(.34,1.2,.64,1);
          text-decoration:none;
          display:block;
          border:1px solid rgba(37,81,106,0.07);
          position:relative;
        }
        .portfolio-card:hover{
          transform:translateY(-10px) scale(1.04);
          box-shadow:0 20px 50px rgba(37,81,106,0.22);
          border-color:var(--color-accent);
          z-index:10;
        }
        .portfolio-card .portfolio-overlay{
          position:absolute;
          inset:0;
          background:linear-gradient(to top, rgba(10,28,44,0.92) 0%, rgba(10,28,44,0.1) 55%, transparent 100%);
          opacity:0;
          transition:opacity .3s ease;
          display:flex;
          align-items:flex-end;
          padding:18px 16px;
        }
        .portfolio-card:hover .portfolio-overlay{
          opacity:1;
        }
        .portfolio-card .portfolio-cta{
          background:var(--color-accent);
          color:#fff;
          font-family:var(--font-heading);
          font-weight:700;
          font-size:12px;
          letter-spacing:.5px;
          padding:7px 16px;
          border-radius:20px;
          display:inline-block;
          transform:translateY(8px);
          opacity:0;
          transition:all .3s ease .05s;
        }
        .portfolio-card:hover .portfolio-cta{
          transform:translateY(0);
          opacity:1;
        }
        .portfolio-label{
          transition:color .3s ease;
        }
        .portfolio-card:hover .portfolio-label{
          color:var(--color-accent);
        }
      `}</style>
      <div style={{...S.container,marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={S.overline}>Our Work</p>
            <h2 style={{...S.h2,fontSize:"clamp(22px,3vw,28px)",marginBottom:0}}>Websites We've Built</h2>
          </div>
          <p style={{...S.body,fontSize:14,color:"var(--color-body)",maxWidth:340}}>
            Every site is custom. Hover to preview, click to visit the live site.
          </p>
        </div>
      </div>
      <div style={{position:"relative"}}>
        {/* Fade edges */}
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:80,background:"linear-gradient(to right, var(--color-light-bg), transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:80,background:"linear-gradient(to left, var(--color-light-bg), transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div className="portfolio-track">
          {doubled.map((site,i)=>(
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="portfolio-card" aria-label={`Visit ${site.name}`}>
              <img loading="lazy" src={site.img} alt={`${site.name} screenshot`} style={{width:"100%",height:220,objectFit:"cover",objectPosition:"top",display:"block"}} />
              {/* Hover overlay with CTA */}
              <div className="portfolio-overlay">
                <div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"#fff",marginBottom:8,lineHeight:1.2}}>{site.name}</div>
                  <span className="portfolio-cta">View Live Site →</span>
                </div>
              </div>
              {/* Label */}
              <div style={{padding:"10px 14px",background:"#fff"}}>
                <span className="portfolio-label" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:13,color:"var(--color-dark)"}}>{site.name}</span>
                <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"var(--color-body)",display:"block",marginTop:2}}>Custom website →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeDo(){
  useAnim();
  const items=[
    {
      icon:I.brand,
      title:"New websites, designed from scratch for your business.",
      desc:"We learn about your business, your customers, and your goals before we ever start designing. Every site is custom-designed and matched to your brand, mobile-friendly from the start, with clear calls to action so visitors know exactly what to do next.",
      img:"https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&q=80",
    },
    {
      icon:I.refresh,
      title:"Redesigns that bring your current site up to speed.",
      desc:"Maybe your site isn't terrible, it's just tired. We take what's working, fix what isn't, and give it a modern look that matches where your business is today. Updated branding, better user experience, optimized for mobile and search engines.",
      img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80",
    },
    {
      icon:I.wrench,
      title:"Ongoing maintenance so you never have to worry about it.",
      desc:"Sites need regular updates, security patches, and content refreshes. We handle all of it monthly. If something breaks, we fix it. If you need content updated, we handle it. If there's a security issue, we're already on it.",
      img:"https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=700&q=80",
    },
    {
      icon:I.edit,
      title:"Easy for you to manage day-to-day.",
      desc:"You'll be able to make basic updates without calling us every time. And when you do need help, we're a phone call away.",
      img:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80",
    },
    {
      icon:I.speed,
      title:"Fast and built to get found.",
      desc:"A beautiful website doesn't help if it's slow or invisible. Every site we build is optimized for speed and search engines, so people can actually find you.",
      img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
    },
  ];
  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{bottom:20,left:30,opacity:.18}}/>
      <div style={S.container}>
        <div style={{maxWidth:680,marginBottom:50}}>
          <p className="anim" style={S.overline}>What We Do</p>
          <h2 className="anim d1" style={S.h2}>Whether You Need a New Site, a Redesign, or Ongoing Support</h2>
          <p className="anim d2" style={S.body}>We've built 75+ websites for businesses across the region. Here's what that looks like:</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
          {items.map((item,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{
              borderRadius:16,overflow:"hidden",background:"#fff",
              boxShadow:"0 4px 24px rgba(37,81,106,0.09)",
              transition:"all .35s ease",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(37,81,106,0.16)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(37,81,106,0.09)";}}>
              {/* Image */}
              <div style={{height:200,overflow:"hidden",position:"relative"}}>
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                />
              </div>
              {/* Text */}
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

function ProcessTimeline(){
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [lineHeight, setLineHeight] = useState(0);
  const sectionRef = useRef(null);

  const steps=[
    {icon:I.phoneCall,title:"Discovery Call",desc:"We learn about your business, your goals, and what you need from your website."},
    {icon:I.sitemap,title:"Sitemap & Content Planning",desc:"We map out the structure and figure out what goes where. Every page has a purpose."},
    {icon:I.paint,title:"Design Mockups",desc:"We create design concepts for your review. You see what it will look like before we build anything."},
    {icon:I.code,title:"Development & Build",desc:"Once design is approved, we build it out. Everything gets tested across devices and browsers."},
    {icon:I.rocket,title:"Launch",desc:"Your site goes live. We handle all the technical details so the transition is smooth."},
    {icon:I.headset,title:"Ongoing Support",desc:"After launch, we're still here. Updates, changes, or questions? Your team is a phone call away."},
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        steps.forEach((_, i) => {
          setTimeout(() => setVisibleSteps(prev => [...prev, i]), i * 200);
        });
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

  return(
    <section ref={sectionRef} style={{...S.pad,background:"var(--color-light-bg)"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Our Process</p>
          <h2 className="anim d1" style={S.h2}>How We Build Your Website</h2>
        </div>
        <div style={{maxWidth:720,margin:"0 auto",position:"relative"}}>
          {/* Static track */}
          <div style={{position:"absolute",left:24,top:24,bottom:24,width:2,background:"rgba(37,81,106,0.1)",borderRadius:2}}/>
          {/* Animated fill */}
          <div style={{
            position:"absolute",left:24,top:24,width:2,borderRadius:2,
            background:"linear-gradient(to bottom, var(--color-accent), var(--color-primary-light), var(--color-primary))",
            height:`calc(${lineHeight}% - 24px)`,
            transition:"height 0.05s linear",
          }}/>
          {steps.map((st,i)=>(
            <div key={i} style={{
              display:"flex",gap:24,marginBottom:i<steps.length-1?32:0,position:"relative",
              opacity: visibleSteps.includes(i) ? 1 : 0,
              transform: visibleSteps.includes(i) ? "translateX(0)" : "translateX(-16px)",
              transition:"opacity .4s ease, transform .4s ease",
            }}>
              <div style={{
                width:50,height:50,borderRadius:"50%",flexShrink:0,
                background:i===0?"var(--color-accent)":i===steps.length-1?"var(--color-primary)":"#fff",
                border:i===0||i===steps.length-1?"none":"2px solid var(--color-primary-light)",
                display:"flex",alignItems:"center",justifyContent:"center",
                zIndex:1,
                color:i===0||i===steps.length-1?"#fff":"var(--color-primary-light)",
                boxShadow: visibleSteps.includes(i) ? "0 4px 14px rgba(0,0,0,0.12)" : "none",
                transform: visibleSteps.includes(i) ? "scale(1)" : "scale(0.7)",
                transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
              }}>{st.icon}</div>
              <div style={{paddingTop:6,flex:1}}>
                <h4 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"var(--color-dark)",marginBottom:6}}>{st.title}</h4>
                <p style={{...S.body,fontSize:15}}>{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="anim d5" style={{textAlign:"center", marginTop:40}}>
          <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule Your Free Consultation</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Count-up stat ────────────────────────────────────────────────────── */
function CountStat({ target, suffix = "", started }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return <>{count}{suffix}</>;
}

/* ─── Before/After Drag Slider ────────────────────────────────────────── */
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50); // percentage
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Auto-animate hint on mount: slide to 25%, then back to 50%
  useEffect(() => {
    const t1 = setTimeout(() => setPos(25), 800);
    const t2 = setTimeout(() => setPos(50), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const getPos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    return Math.min(Math.max(raw, 2), 98);
  };

  const onMouseDown = (e) => { e.preventDefault(); setDragging(true); setHasInteracted(true); };
  const onMouseMove = (e) => { if (dragging) setPos(getPos(e.clientX)); };
  const onMouseUp   = () => setDragging(false);
  const onTouchStart = (e) => { setDragging(true); setHasInteracted(true); };
  const onTouchMove  = (e) => { if (dragging) setPos(getPos(e.touches[0].clientX)); };
  const onTouchEnd   = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, pos]);

  return (
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <p style={{ ...S.overline, marginBottom: 6 }}>Before & After</p>
      <h3 style={{ fontFamily:"var(--font-heading)", fontWeight:700, fontSize:"clamp(20px,3vw,26px)", color:"var(--color-dark)", marginBottom: 8 }}>
        Drag to see the transformation.
      </h3>
      <p style={{ fontFamily:"var(--font-body)", fontSize:14, color:"var(--color-body)", marginBottom:28 }}>
        Real redesign, same client, same content, completely rebuilt.
      </p>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          position:"relative", overflow:"hidden", borderRadius:16,
          boxShadow:"0 12px 48px rgba(37,81,106,0.18)",
          cursor: dragging ? "grabbing" : "ew-resize",
          userSelect:"none", touchAction:"none",
          maxWidth: 860, margin:"0 auto",
          border:"2px solid rgba(37,81,106,0.1)",
        }}
      >
        {/* AFTER, full width base layer */}
        <img
          src="/images/website-page-after-new-mockup.jpg"
          alt="Website after redesign"
          style={{ width:"100%", display:"block", pointerEvents:"none" }}
          draggable={false}
        />

        {/* BEFORE, clipped to left side */}
        <div style={{
          position:"absolute", inset:0,
          clipPath:`inset(0 ${100-pos}% 0 0)`,
          transition: dragging ? "none" : "clip-path 0.6s ease",
        }}>
          <img
            src="/images/website-page-before-old-mockup.jpeg"
            alt="Website before redesign"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", display:"block", pointerEvents:"none" }}
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div style={{
          position:"absolute", top:0, bottom:0,
          left:`${pos}%`, transform:"translateX(-50%)",
          width:3, background:"#fff",
          boxShadow:"0 0 12px rgba(0,0,0,0.4)",
          pointerEvents:"none",
        }}/>

        {/* Handle knob */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            position:"absolute", top:"50%",
            left:`${pos}%`,
            transform:"translate(-50%,-50%)",
            width:44, height:44, borderRadius:"50%",
            background:"#fff",
            boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor: dragging ? "grabbing" : "ew-resize",
            zIndex:10,
            border:"2px solid rgba(37,81,106,0.15)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.2" style={{width:20,height:20}}>
            <polyline points="15 18 9 12 15 6"/>
            <polyline points="9 18 15 12 9 6" transform="translate(6,0)"/>
          </svg>
        </div>

        {/* BEFORE label */}
        <div style={{
          position:"absolute", top:14, left:14,
          background:"rgba(15,42,58,0.88)", backdropFilter:"blur(6px)",
          color:"#fff", fontFamily:"var(--font-heading)", fontWeight:700,
          fontSize:14, letterSpacing:"1.5px", textTransform:"uppercase",
          padding:"8px 18px", borderRadius:20,
          boxShadow:"0 4px 12px rgba(0,0,0,0.3)",
          opacity: pos > 15 ? 1 : 0, transition:"opacity .2s ease",
        }}>Before</div>

        {/* AFTER label */}
        <div style={{
          position:"absolute", top:14, right:14,
          background:"var(--color-accent)", backdropFilter:"blur(6px)",
          color:"#fff", fontFamily:"var(--font-heading)", fontWeight:700,
          fontSize:14, letterSpacing:"1.5px", textTransform:"uppercase",
          padding:"8px 18px", borderRadius:20,
          boxShadow:"0 4px 12px rgba(205,155,66,0.4)",
          opacity: pos < 85 ? 1 : 0, transition:"opacity .2s ease",
        }}>After</div>

        {/* Hint nudge, fades once interacted */}
        {!hasInteracted && (
          <div style={{
            position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
            pointerEvents:"none",
          }}>
            <div style={{
              background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)",
              color:"#fff", fontFamily:"var(--font-heading)", fontWeight:600, fontSize:14,
              padding:"10px 20px", borderRadius:30, display:"flex", alignItems:"center", gap:8,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{width:18,height:18}}>
                <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              Drag to compare
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialProof(){
  useAnim();
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const testimonials=[{quote:"My experience with Appalachian Marketing and Media has been great. The website turned out better than the more expensive company I previously used and it was minimal effort on my part. What makes Appalachian stand out is their superior combination of artistic talent, content creation, and technological know how. I'll definitely use them for everything going forward.",name:"Jared B.",business:"Burnside Brankamp Law",location:"Portsmouth, Ohio"},{quote:"Appalachian Marketing did a complete website design for me. They were awesome to work with & so professional! It looks great & is exactly what I wanted. I could tell that everyone was passionate about what they do! They stayed in contact with me & had my site running quickly. Their knowledge & agility blew my mind & I look forward to growing my business with them!",name:"Phil L.",business:"PH Earthworks and Contracting",location:"Lucasville, Ohio"}];
  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.15}}/>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}><p className="anim" style={S.overline}>Results</p><h2 className="anim d1" style={S.h2}>Don't Just Take Our Word for It</h2></div>

        {/* Count-up stats */}
        <div ref={statsRef} className="anim d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20,marginBottom:56}}>
          <div style={{textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,border:"1px solid rgba(37,81,106,0.06)"}}>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>
              <CountStat target={75} suffix="+" started={statsStarted}/>
            </div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>Websites Built</div>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>custom designs, not templates</p>
          </div>
          <div style={{textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,border:"1px solid rgba(37,81,106,0.06)"}}>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>
              4–8
            </div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>Weeks to Launch</div>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>from kickoff to live site</p>
          </div>
          <div style={{textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,border:"1px solid rgba(37,81,106,0.06)"}}>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>
              <CountStat target={100} suffix="%" started={statsStarted}/>
            </div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>Client Ownership</div>
            <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>no lock-in, your site is yours</p>
          </div>
        </div>

        {/* Drag-reveal before/after slider */}
        <div className="anim d3">
          <BeforeAfterSlider />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))",gap:20}}>
          {testimonials.map((t,i)=>(<div key={i} className={`anim d${i+4}`} style={{background:"#fff",borderRadius:16,padding:"32px 28px",border:"1px solid rgba(37,81,106,0.06)",position:"relative"}}><div style={{fontFamily:"Georgia, serif",fontSize:60,color:"var(--color-accent)",opacity:.2,lineHeight:1,position:"absolute",top:16,left:24}}>"</div><p style={{...S.body,fontSize:15.5,fontStyle:"italic",marginBottom:20,position:"relative",zIndex:1,paddingTop:16}}>"{t.quote}"</p><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:44,height:44,borderRadius:"50%",background:"var(--color-light-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-primary)",border:"2px solid rgba(37,81,106,0.08)"}}>{t.name.replace(/[[\]]/g,"").charAt(0)}</div><div><div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)"}}>{t.name}</div><div style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)"}}>{t.business} · {t.location}</div></div></div></div>))}
        </div>
      </div>
    </section>
  );
}

function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"How long does a website take to build?",a:"Most projects take 4–8 weeks from kickoff to launch, depending on size and how quickly we get content and feedback. We'll give you a timeline at the start."},
    {q:"Do I own my website when it's done?",a:"Yes. 100%. We don't use proprietary platforms that lock you in. Your site, your files, your property."},
    {q:"Can I update the site myself?",a:"It depends on how the site is built. Our flagship service is typically custom-coded to your exact specifications. We also build on platforms that allow basic self-service updates, and we'll walk you through how."},
    {q:"What if I need changes after launch?",a:"We're still here. Whether it's a quick text change or a bigger update, just reach out. On a maintenance plan, most small changes are included. If not, we'll quote it."},
    {q:"Do I need a new website, or can you fix my current one?",a:"It depends on the state of your current site. Sometimes a redesign is all it takes. Other times, starting fresh is the better investment. We'll look at what you have and give you an honest recommendation."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}><p className="anim" style={S.overline}>FAQ</p><h2 className="anim d1" style={S.h2}>Common Questions about Our Website Services</h2></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{
              background: open===i ? "#fffdf7" : "#fff",
              borderRadius:12, overflow:"hidden",
              border:"1px solid rgba(37,81,106,0.08)",
              borderLeft: open===i ? "4px solid var(--color-accent)" : "4px solid transparent",
              boxShadow: open===i ? "0 6px 28px rgba(205,155,66,0.10)" : "none",
              transition:"all .3s ease",
            }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-heading)",fontWeight:600,fontSize:16,color:"var(--color-dark)",textAlign:"left",lineHeight:1.4}}>{f.q}<span style={{color:"var(--color-accent)",transform:open===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s ease",flexShrink:0,marginLeft:16}}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}><polyline points="6 9 12 15 18 9"/></svg></span></button>
              <div style={{maxHeight:open===i?300:0,overflow:"hidden",transition:"max-height .4s ease"}}><div style={{padding:"0 24px 20px"}}><p style={{...S.body,fontSize:15}}>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Old (10): Hero → NewWebsite → Redesigns → Maintenance → ProcessTimeline → Different → Pricing×2 → FAQ → CTA
   New (8):  Hero → WhatWeDo → Process → Pricing×2 → SocialProof → FAQ → CTA */
export default function WebsiteDesignPage() {
  return (
    <Layout activeNav="Services">
      <SEOHead title="Custom Website Design | Southern Ohio & Tri-State | AMM" description="Custom, mobile-friendly websites built to turn visitors into customers. No templates, no lock-in. Southern Ohio's trusted web design team." canonical="https://www.appmktmedia.com/services/website-design" ogImage="/images/website-page-hero-section.jpeg"/>
      <StructuredData schema={[
        {
          "@context": "https://schema.org", "@type": "Service",
          "name": "Website Design & Development",
          "description": "Custom, mobile-friendly websites built to turn visitors into customers. No templates, no lock-in.",
          "provider": { "@type": "LocalBusiness", "name": "Appalachian Marketing & Media", "url": "https://www.appmktmedia.com" },
          "areaServed": ["Southern Ohio", "Eastern Kentucky", "West Virginia"], "url": "https://www.appmktmedia.com/services/website-design",
          "serviceType": "Web Design", "offers": { "@type": "Offer", "priceSpecification": { "@type": "PriceSpecification", "price": "2000", "priceCurrency": "USD", "description": "Starting price for Starter website package" } }
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.appmktmedia.com/services" },
            { "@type": "ListItem", "position": 3, "name": "Website Design", "item": "https://www.appmktmedia.com/services/website-design" }
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How long does a website take to build?","acceptedAnswer":{"@type":"Answer","text":"Most projects take 4–8 weeks from kickoff to launch, depending on size and how quickly we get content and feedback. We'll give you a timeline at the start."}},{"@type":"Question","name":"Do I own my website when it's done?","acceptedAnswer":{"@type":"Answer","text":"Yes. 100%. We don't use proprietary platforms that lock you in. Your site, your files, your property."}},{"@type":"Question","name":"Can I update the site myself?","acceptedAnswer":{"@type":"Answer","text":"It depends on how the site is built. Our flagship service is typically custom-coded to your exact specifications. We also build on platforms that allow basic self-service updates, and we'll walk you through how."}},{"@type":"Question","name":"What if I need changes after launch?","acceptedAnswer":{"@type":"Answer","text":"We're still here. Whether it's a quick text change or a bigger update, just reach out. On a maintenance plan, most small changes are included. If not, we'll quote it."}},{"@type":"Question","name":"Do I need a new website, or can you fix my current one?","acceptedAnswer":{"@type":"Answer","text":"It depends on the state of your current site. Sometimes a redesign is all it takes. Other times, starting fresh is the better investment. We'll look at what you have and give you an honest recommendation."}}]}]} />
      <PageBanner />
      <PortfolioBanner />
<WhatWeDo />
<ProcessTimeline />
      <ServicePricing overline="Build Pricing" heading="One-Time Build Pricing" description="Every website is custom-designed for your business. No templates, no cookie-cutter layouts." tiers={[
        {name:"Starter",price:"$2,000",unit:"one-time",tagline:"Perfect for smaller businesses getting online.",features:["Up to 6 pages, enough for most small businesses","Custom design matched to your brand","Content written or refined for each page","Mobile-friendly on every device","Basic search engine setup so people can find you"],highlight:false},
        {name:"Standard",price:"$3,000",unit:"one-time",tagline:"The most popular choice for growing businesses.",features:["Up to 10 pages with room to grow","Custom design matched to your brand","Content written or refined for each page","Mobile-friendly on every device","Basic search engine setup so people can find you","30 days of post-launch support included"],highlight:true,badge:"Most Popular"},
        {name:"Professional",price:"$6,500",unit:"one-time",tagline:"For businesses that need a larger, more robust site.",features:["11–20 pages for larger businesses","Custom design matched to your brand","Content written or refined for each page","Mobile-friendly on every device","Basic search engine setup so people can find you","30 days of post-launch support included"],highlight:false},
        {name:"Custom",price:"Consultation",unit:"",tagline:"For complex projects with custom features or unlimited scope.",features:["Unlimited pages","Custom design and advanced features","Content written or refined for each page","Mobile-friendly on every device","Dedicated project manager throughout","Scoped and quoted based on your needs"],highlight:false},
      ]} footnote="Need a custom solution? Give us a call and we'll put together a quote tailored to your project."/>
      <ServicePricing overline="Maintenance Pricing" heading="Annual Maintenance Plans" description="Keep your website updated, secure, and running smoothly, without thinking about it." tiers={[
        {name:"Basic",price:"$599",unit:"/year",tagline:"For sites that need occasional updates and security monitoring.",features:["Basic content updates as needed","Security monitoring and patches","Performance checks to keep things fast","48–72 hour turnaround on requests"],highlight:true,badge:"Best Value"},
        {name:"Standard",price:"$999",unit:"/year",tagline:"For businesses that update content regularly.",features:["More frequent content updates included","Security monitoring and patches","Performance optimization for speed","24–48 hour turnaround on requests"],highlight:false},
        {name:"Priority",price:"$1,299",unit:"/year",tagline:"For high-traffic sites that need fast response.",features:["Generous content updates, change things as often as you need","Priority security monitoring and patches","Full performance optimization","Less than 24 hour turnaround on requests"],highlight:false},
      ]} footnote="All plans include a dedicated support contact. No phone trees, no ticket systems."/>
      <SocialProof />
<FAQ />
      <RelatedServices current="website-design" />
      <CTASection heading="Ready for a Website That Works as Hard as You Do?" body="Whether you need a brand new site, a redesign, or ongoing support, we'll build something that looks great and actually brings in business. Let's talk about what you need." />
    </Layout>
  );
}

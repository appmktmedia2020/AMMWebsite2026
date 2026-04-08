import { useEffect, useRef } from "react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import CTASection from "../components/CTASection";
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

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  externalLink:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  quote:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:28,height:28,opacity:.15}}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  star:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  // Industry icons
  heart:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  dollar:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  hardHat:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2z"/><path d="M10 10V5a2 2 0 114 0v5"/><path d="M4 15V9a8 8 0 0116 0v6"/></svg>,
  briefcase:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>,
  shoppingBag:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  globe:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  users:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

/* ─── Hero ────────────────────────────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:80,right:80,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"30%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.1), transparent)",transform:"rotate(12deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"90px 20px 60px",position:"relative",zIndex:1,textAlign:"center"}}>
        <p style={{...S.overline,animation:"fadeIn .6s ease forwards",justifyContent:"center",display:"flex"}}>Portfolio & Results</p>
        <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(36px,6vw,58px)",lineHeight:1.1,letterSpacing:"-0.5px",marginBottom:22,animation:"fadeInUp .8s ease forwards"}}>
          Real Results for{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Real Businesses.</span>
        </h1>
        <p style={{fontFamily:"var(--font-body)",fontSize:19,color:"rgba(255,255,255,0.75)",lineHeight:1.7,maxWidth:620,margin:"0 auto 40px",animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
          We don't just make things look good, we make them work. Here's a look at what we've built, the results we've delivered, and what our clients have to say about working with us.
        </p>
        {/* Stat row */}
        <div className="hero-stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,maxWidth:800,margin:"0 auto",animation:"fadeInUp .8s ease .25s forwards",opacity:0}}>
          {[["75+","Websites Built"],["250+","Clients Served"],["30+","Ad Campaigns Managed"],["40+","Google Profiles Managed"]].map(([num,lbl],i)=>(
            <div key={i} style={{padding:"20px 16px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,40px)",color:"var(--color-accent)",lineHeight:1}}>{num}</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:8,letterSpacing:".3px"}}>{lbl}</div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:600px){.hero-stats-grid{grid-template-columns:repeat(2,1fr) !important;gap:8px !important;}}`}</style>
      </div>
</section>
  );
}

/* ─── Website Portfolio ──────────────────────────────── */
function Portfolio(){
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
          background:transparent;
          box-shadow:none;
          transition:all .3s ease;
          text-decoration:none;
          display:block;
        }
        .portfolio-card:hover{
          transform:translateY(-6px);
        }
        .portfolio-card:hover .portfolio-label{
          color:var(--color-accent);
        }
        @media (prefers-reduced-motion: reduce) {
          .portfolio-track {
            animation: none !important;
          }
        }
      `}</style>
      <div style={{...S.container,marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <p style={S.overline}>Website Portfolio</p>
            <h2 style={{...S.h2,fontSize:"clamp(22px,3vw,28px)",marginBottom:0}}>Websites We've Built</h2>
          </div>
          <p style={{...S.body,fontSize:14,color:"var(--color-body)",maxWidth:340}}>
            Every site is custom. Hover to pause, click to visit the live site.
          </p>
        </div>
      </div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:80,background:"linear-gradient(to right, var(--color-light-bg), transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:80,background:"linear-gradient(to left, var(--color-light-bg), transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div className="portfolio-track">
          {doubled.map((site,i)=>(
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="portfolio-card" aria-label={`Visit ${site.name}`}>
              <img loading="lazy" src={site.img} alt={`${site.name} screenshot`} style={{width:"100%",height:220,objectFit:"cover",objectPosition:"top",display:"block"}} />
              <div style={{padding:"10px 14px",background:"transparent"}}>
                <span className="portfolio-label" style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:13,color:"var(--color-dark)",transition:"color .3s ease"}}>{site.name}</span>
                <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"var(--color-body)",display:"block",marginTop:2}}>View live site →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Results ─────────────────────────────────────────── */
function Results(){
  useAnim();
  const cases=[
    {stat:"2x",label:"Organic Traffic",tag:"SEO",color:"var(--color-primary)",lightColor:"var(--color-light-bg)",desc:"A client came to us after paying $8,000 a month to a national agency with nothing to show for it. Within a year, their website was getting twice the organic traffic, at a fraction of the cost."},
    {stat:"$3.70",label:"Return Per $1 Invested",tag:"Paid Advertising",color:"var(--color-accent)",lightColor:"rgba(205,155,66,0.08)",desc:"We ran a targeted Facebook ad campaign for a local business that delivered $3.70 in return for every $1 invested. Measurable results, and that doesn't include the indirect brand awareness that came with it."},
    {stat:"75+",label:"Websites Built",tag:"Web Design",color:"#1B6FAD",lightColor:"rgba(27,111,173,0.07)",desc:"After launching a redesigned website for a client, they saw a significant increase in contact form submissions and phone calls. A better site meant more people taking action."},
  ];
  return(
    <section style={{padding:"80px 0",background:"#f7f8fa"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Case Studies</p>
          <h2 className="anim d1" style={S.h2}>Results That Speak for Themselves</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,maxWidth:1020,margin:"0 auto"}}>
          {cases.map((c,i)=>(
            <div key={i} className={`anim d${i+1}`} style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",transition:"all .3s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.06)";}}>
              {/* Stat header */}
              <div style={{background:c.lightColor,padding:"32px 28px 24px",borderBottom:"1px solid rgba(37,81,106,0.06)"}}>
                <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2px",color:c.color,textTransform:"uppercase",marginBottom:8}}>{c.tag}</p>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(48px,7vw,64px)",color:c.color,lineHeight:1}}>{c.stat}</div>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:16,color:"var(--color-dark)",marginTop:6}}>{c.label}</div>
              </div>
              <div style={{padding:"22px 28px"}}>
                <p style={{...S.body,fontSize:15,lineHeight:1.7}}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="anim d4" style={{textAlign:"center",marginTop:36,...S.body,fontSize:15,fontStyle:"italic"}}>
          These aren't just numbers. They're real results for real businesses in our community.
        </p>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────── */
function Testimonials(){
  useAnim();
  const featured={quote:"Abe and the Appalachian Marketing team have been a huge help with our online presence. They are everything we could ask for in a marketing team, and they make you feel like you are their only client. On top of that, the success we have already seen from their help is better than what we were even expecting. I would highly recommend.",name:"Jacob C.",biz:"Prime Reserve Planning · Columbus, OH"};
  const reviews=[
    {quote:"My experience with Appalachian Marketing and Media has been great. The website turned out better than the more expensive company I previously used and it was minimal effort on my part. What makes Appalachian stand out is their superior combination of artistic talent, content creation, and technological know how. I'll definitely use them for everything going forward.",name:"Jared B.",biz:"Burnside Brankamp Law · Portsmouth, OH"},
    {quote:"Appalachian Marketing did a complete website design for me. They were awesome to work with & so professional! It looks great & is exactly what I wanted. I could tell that everyone was passionate about what they do! They stayed in contact with me & had my site running quickly. Their knowledge & agility blew my mind & I look forward to growing my business with them!",name:"Phil L.",biz:"PH Earthworks and Contracting · Lucasville, OH"},
    {quote:"An amazing company! Very detailed and organized. They literally helped me same day. In just a week we had amazing success and attention to our website and increased sales. All thanks to Appalachian Marketing. They truly go above and beyond.",name:"Andy Z.",biz:"A&A Porta Potty's · Argillite, KY"},
    {quote:"Appalachian Marketing and Media has been incredible to work with! They've provided amazing support for the Chamber and our new coworking space, making everything easy and quick from start to finish. Their meetings are well-structured, and the team took what I had envisioned and brought it to life perfectly.",name:"Bobby S.",biz:"Hocking Hills Chamber of Commerce · Logan, OH"},
    {quote:"Exceptional service from our advertising team! Their creativity and dedication have transformed our campaigns, resulting in increased engagement and brand visibility. Outstanding job and amazing people.",name:"Brandy L.",biz:"Advanced Building Restorations · South Point, OH"},
    {quote:"Great team to do work with. Love the results that they've done for our company.",name:"Sabrina S.",biz:"Compass Community Health · Portsmouth, OH"},
    {quote:"Abe and team have been fabulous to work with! I appreciate their diligence and attention to detail.",name:"Sandy M.",biz:"SCOESC · New Boston, OH"},
  ];
  return(
    <section style={{...S.pad,background:"linear-gradient(180deg, #fff 0%, #f8fafb 100%)"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 24px"}}>
          <p className="anim" style={S.overline}>Client Reviews</p>
          <h2 className="anim d1" style={S.h2}>What Our Clients Say</h2>
        </div>
        {/* Star rating */}
        <div className="anim d2" style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginBottom:56}}>
          <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:"#F59E0B"}}>{I.star}</span>)}</div>
          <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-dark)"}}>5.0</span>
          <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)"}}>on Google Reviews</span>
        </div>

        {/* Featured quote — large, centered */}
        <div className="anim d3" style={{
          maxWidth:820,margin:"0 auto 60px",textAlign:"center",position:"relative",
          padding:"48px 40px",
          background:"#fff",borderRadius:24,
          boxShadow:"0 8px 40px rgba(37,81,106,0.08)",
          border:"1px solid rgba(37,81,106,0.06)",
        }}>
          <div style={{width:48,height:4,background:"var(--color-accent)",borderRadius:2,margin:"0 auto 28px"}} />
          <p style={{
            fontFamily:"var(--font-body)",fontSize:"clamp(18px,2.2vw,22px)",color:"var(--color-dark)",
            lineHeight:1.8,fontStyle:"italic",fontWeight:400,marginBottom:28,
          }}>
            "{featured.quote}"
          </p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"var(--color-accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff"}}>{featured.name[0]}</span>
            </div>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)"}}>{featured.name}</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",marginTop:1}}>{featured.biz}</div>
            </div>
          </div>
        </div>

        {/* Remaining reviews — two-column, gold left accent */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:20,maxWidth:960,margin:"0 auto"}}>
          {reviews.map((r,i)=>(
            <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{
              display:"flex",gap:0,transition:"all .3s ease",
              borderRadius:14,overflow:"hidden",
              background:"#fff",
              boxShadow:"0 2px 12px rgba(37,81,106,0.05)",
              border:"1px solid rgba(37,81,106,0.06)",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,81,106,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(37,81,106,0.05)";}}>
              {/* Gold accent bar */}
              <div style={{width:4,flexShrink:0,background:"var(--color-accent)"}} />
              <div style={{padding:"24px 24px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-dark)",lineHeight:1.75,fontStyle:"italic",marginBottom:18}}>
                  "{r.quote}"
                </p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"var(--color-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"#fff"}}>{r.name[0]}</span>
                  </div>
                  <div>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-dark)"}}>{r.name}</span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"var(--color-body)",marginLeft:8}}>{r.biz}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Client Logos ───────────────────────────────────── */
function ClientLogos(){
  useAnim();
  const logos=[
    {name:"Foundations for the Trades", url:"/images/logos/foundations-trades.png", link:"https://fftohio.org/"},
    {name:"Future Plans", url:"/images/logos/future-plans.png", link:"https://futureplans.org/"},
    {name:"General Heating & Air Conditioning", url:"/images/logos/ghac.png", link:"https://ghacinc.com/"},
    {name:"Glockner", url:"/images/logos/glockner.png", link:"https://glocknerinsurance.com/"},
    {name:"Ohio Pest Control", url:"/images/logos/ohio-pest-control.png", link:"https://www.ohiopest.com/"},
    {name:"Scioto County", url:"/images/logos/scioto-county.png", link:"https://www.sciotocountyoh.com/"},
    {name:"Compass Community Health", url:"/images/logos/compass-health.png", link:"https://www.compasscommunityhealth.org/"},
    {name:"T-Mobile", url:"/images/logos/t-mobile.png", link:"https://www.t-mobile.com/"},
    {name:"Shawnee State University", url:"/images/logos/shawnee-state.png", link:"https://www.shawnee.edu/"},
  ];

  const logoCard=(c,i,prefix)=>(
    <a key={`${prefix}-${i}`} href={c.link} target="_blank" rel="noopener noreferrer"
      style={{
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        width:280,height:130,borderRadius:16,textDecoration:"none",
        background:"rgba(255,255,255,0.88)",
        border:"1px solid rgba(255,255,255,0.15)",
        boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
        transition:"all .4s cubic-bezier(.4,0,.2,1)",
        position:"relative",overflow:"hidden",
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.background="rgba(255,255,255,0.95)";
        e.currentTarget.style.borderColor="rgba(205,155,66,0.4)";
        e.currentTarget.style.boxShadow="0 0 30px rgba(205,155,66,0.15), 0 8px 32px rgba(0,0,0,0.2)";
        e.currentTarget.style.transform="scale(1.04)";
        const img=e.currentTarget.querySelector("img");
        if(img){img.style.filter="grayscale(0%)";img.style.opacity="1";}
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.background="rgba(255,255,255,0.88)";
        e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";
        e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform="scale(1)";
        const img=e.currentTarget.querySelector("img");
        if(img){img.style.filter="grayscale(100%)";img.style.opacity="0.6";}
      }}>
      <img loading="lazy" src={c.url} alt={`${c.name} logo`}
        style={{maxHeight:100,maxWidth:250,width:"auto",height:"auto",opacity:0.6,filter:"grayscale(100%)",transition:"all .4s ease"}} />
    </a>
  );

  const fadeEdge={
    position:"relative",overflow:"hidden",
    maskImage:"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
    WebkitMaskImage:"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  };

  return(
    <section style={{
      padding:"90px 0",position:"relative",overflow:"hidden",
      background:"linear-gradient(160deg, #0a1c2c 0%, #0f2a3a 35%, #152f44 65%, #0d2436 100%)",
    }}>
      {/* Decorative elements */}
      <div style={{position:"absolute",top:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle, rgba(205,155,66,0.06) 0%, transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:"-15%",right:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle, rgba(27,111,173,0.08) 0%, transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(to right, transparent, rgba(205,155,66,0.3), transparent)"}} />
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(to right, transparent, rgba(205,155,66,0.3), transparent)"}} />

      {/* Heading */}
      <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px",padding:"0 20px",position:"relative",zIndex:1}}>
        <p className="anim" style={{...S.overline,color:"var(--color-accent)"}}>Our Clients</p>
        <h2 className="anim d1" style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,38px)",color:"#fff",lineHeight:1.25,marginBottom:16}}>
          Businesses That Trust Us{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>with Their Marketing</span>
        </h2>
        <p className="anim d2" style={{fontFamily:"var(--font-body)",fontSize:17,lineHeight:1.7,color:"rgba(255,255,255,0.55)"}}>
          From credit unions to construction companies, we've helped businesses of all kinds grow.
        </p>
      </div>

      {/* Single scrolling row */}
      <div className="anim d3" style={{...fadeEdge,marginBottom:50}}>
        <div style={{display:"flex",gap:28,width:"fit-content",animation:"clientScroll 45s linear infinite"}}>
          {[...logos,...logos,...logos].map((c,i)=>logoCard(c,i,"r1"))}
        </div>
      </div>

      {/* Bottom stat accent */}
      <div className="anim d4" style={{textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:20,padding:"16px 40px",borderRadius:60,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
          <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:36,color:"var(--color-accent)",lineHeight:1}}>250+</span>
          <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.55)",textAlign:"left",lineHeight:1.4}}>clients served across<br/>Southern Ohio &amp; the Tri-State</span>
        </div>
      </div>

      <style>{`
        @keyframes clientScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
}

/* ─── Industries ─────────────────────────────────────── */
function Industries(){
  useAnim();
  const industries=[
    {name:"Healthcare & Medical",       img:"https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&q=80"},
    {name:"Financial Services",         img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80"},
    {name:"Construction & Trades",      img:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80"},
    {name:"Professional Services",      img:"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80"},
    {name:"Local Retail",               img:"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&q=80"},
    {name:"Restaurants & Hospitality",  img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"},
    {name:"Education",                  img:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80"},
    {name:"Government",                 img:"https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?w=700&q=80"},
    {name:"Nonprofits & Associations",  img:"https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&q=80"},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 44px"}}>
          <p className="anim" style={S.overline}>Who We Serve</p>
          <h2 className="anim d1" style={S.h2}>Industries We Work With</h2>
          <p className="anim d2" style={S.body}>We work with businesses of all types. What matters isn't your industry, it's that you're ready to invest in growth.</p>
        </div>
        <div className="anim d3" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:24,maxWidth:1100,margin:"0 auto 32px"}}>
          {industries.map((ind,i)=>(
            <div key={i} style={{borderRadius:16,overflow:"hidden",position:"relative",height:220,cursor:"default",boxShadow:"0 4px 20px rgba(37,81,106,0.1)",transition:"all .35s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 14px 40px rgba(37,81,106,0.2)";const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(37,81,106,0.1)";const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";}}>
              {/* Photo */}
              <img src={ind.img} alt={ind.name} loading="lazy"
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}
              />
              {/* Gradient overlay + label */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(15,42,58,0.82) 0%, rgba(15,42,58,0.1) 60%, transparent 100%)",display:"flex",alignItems:"flex-end",padding:"20px 22px"}}>
                <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.3,textShadow:"0 1px 4px rgba(0,0,0,0.4)"}}>{ind.name}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="anim d4" style={{textAlign:"center",...S.body,fontSize:15,fontStyle:"italic"}}>
          If you're building something and need marketing help, we'd love to hear about it.
        </p>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */
/* ─── Footer ──────────────────────────────────────────── */

// ─── Page Export ─────────────────────────────────────────────────────────
export default function OurWork() {
  return (
    <Layout activeNav="Our Work">
      <SEOHead
        title="Our Work | 75+ Websites & Marketing Projects | AMM"
        description="Browse 75+ websites, social media campaigns, and marketing projects built by AMM for Southern Ohio businesses. Real results for real local businesses."
        canonical="https://www.appmktmedia.com/our-work"
        ogImage="/images/team-photo.jpeg"
      />
      <HeroBanner />
      <Portfolio />
      <Results />
      <Testimonials />
      <ClientLogos />
      <Industries />
      <CTASection />
    </Layout>
  );
}

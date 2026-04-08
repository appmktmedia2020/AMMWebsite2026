import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ServiceMapComponent from "../components/ServiceMap";
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
};

const I={
  chevDown:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="6 9 12 15 18 9"/></svg>,
  menu:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:28,height:28}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  mapPin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  facebook:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  instagram:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  linkedin:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  youtube:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>,
  // Service icons
  globe:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  search:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  instagram26:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:26,height:26}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  megaphone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  palette:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.55.45-1 1-1h.5c2.76 0 5-2.24 5-5C20.5 6.76 16.69 2 12 2z"/></svg>,
  clipboard:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
};

/* ─── Interactive Map Component ──────────────────────── */
// ServiceMap is now a shared component imported above
const ServiceMap = ServiceMapComponent;

/* ─── Hero with interactive map ──────────────────────── */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 65%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:80,right:40,width:180,height:180}}/>
      <div style={{...S.container,padding:"80px 20px 40px",position:"relative",zIndex:1,display:"flex",gap:50,flexWrap:"wrap",alignItems:"center"}}>
        {/* Text */}
        <div style={{flex:"1 1 380px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Service Area</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(30px,5vw,48px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Marketing for Businesses Across the{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Tri-State Region.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:17,color:"rgba(255,255,255,0.78)",lineHeight:1.75,maxWidth:500,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            We're headquartered in Southern Ohio, but we serve businesses across the tri-state region. If you're building something in this part of the country, we want to help you grow it.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:480,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            Businesses along this corridor share similar challenges, limited access to quality marketing, competition from national chains, and a need for partners who actually understand the local customer.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP} onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"} onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>Schedule a Free Consultation</Link>
          </div>
        </div>
        {/* Interactive Map */}
        <div className="service-map-container" style={{flex:"1 1 440px",height:460,animation:"fadeInUp .9s ease .2s forwards",opacity:0,minWidth:300}}>
          <ServiceMap />
        </div>
      </div>
</section>
  );
}

/* ─── Home Base ──────────────────────────────────────── */
function HomeBase(){
  useAnim();
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1 1 460px"}}>
          <p className="anim" style={S.overline}>Headquarters</p>
          <h2 className="anim d1" style={S.h2}>Our Home Base</h2>
          <p className="anim d2" style={{...S.body,marginBottom:20}}>
            We're headquartered in New Boston, Ohio, deep roots in Scioto County and the Portsmouth community. We started here because we saw a need. Businesses in this region deserve the same quality marketing that companies in Columbus or Lexington get.
          </p>
          <p className="anim d3" style={{...S.body,fontStyle:"italic",marginBottom:28}}>
            And they shouldn't have to hire an agency that can't find Portsmouth on a map to get it.
          </p>
          {/* Address card */}
          <div className="anim d4" style={{display:"inline-flex",alignItems:"flex-start",gap:14,background:"var(--color-light-bg)",borderRadius:14,padding:"18px 22px",border:"1px solid rgba(37,81,106,0.08)"}}>
            <div style={{color:"var(--color-accent)",marginTop:2}}>{I.mapPin}</div>
            <div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)",marginBottom:4}}>AMM Office</div>
              <div style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)",lineHeight:1.6}}>3879 Rhodes Ave, Suite 226<br/>New Boston, OH 45662</div>
            </div>
          </div>
        </div>
        {/* Location visual, office photo + info */}
        <div className="anim d3" style={{flex:"1 1 340px",position:"relative"}}>
          <div className="dot-grid" style={{top:-10,right:-10}}/>
          <div style={{borderRadius:22,position:"relative",overflow:"hidden",boxShadow:"0 16px 50px rgba(37,81,106,0.2)"}}>
            <img src="/images/service-areas-page-hero-section.jpeg" alt="AMM office in New Boston, Ohio" style={{width:"100%",display:"block"}} />
            <div style={{background:"linear-gradient(135deg, var(--color-primary) 0%, #1a3d52 100%)",padding:"28px 32px"}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:20}}>Southern Ohio · Heart of the Tri-State</div>
            {[
              {label:"County",val:"Scioto County, Ohio"},
              {label:"City",val:"New Boston / Portsmouth"},
              {label:"Phone",val:"(740) 672-5069"},
              {label:"Email",val:"contact@appmktmedia.com"},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                <div style={{width:60,fontFamily:"var(--font-heading)",fontWeight:600,fontSize:12,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".5px",flexShrink:0,paddingTop:2}}>{row.label}</div>
                <div style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>{row.val}</div>
              </div>
            ))}
            <div style={{marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
              <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.5)",fontStyle:"italic"}}>Come visit, or just call. Either works.</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Region Cards ───────────────────────────────────── */
function RegionCard({r,i}){
  const[hovered,setHovered]=useState(false);
  return(
    <div
      className={`anim d${i+1}`}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{borderRadius:24,overflow:"hidden",position:"relative",height:520,cursor:"default",
        boxShadow:hovered?"0 28px 70px rgba(15,42,58,0.35)":"0 8px 30px rgba(15,42,58,0.15)",
        transform:hovered?"translateY(-8px)":"translateY(0)",
        transition:"all .45s cubic-bezier(0.25,0.46,0.45,0.94)"}}>
      {/* Photo */}
      <img src={r.img} alt={r.headline} loading="lazy"
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
          transform:hovered?"scale(1.07)":"scale(1)",
          transition:"transform .7s cubic-bezier(0.25,0.46,0.45,0.94)"}}/>
      {/* Gradient overlay, stronger at bottom */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(10,28,40,0.97) 0%, rgba(10,28,40,0.55) 45%, rgba(10,28,40,0.1) 100%)",transition:"background .4s ease"}}/>
      {/* Accent color bar at top */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:r.accentBar}}/>
      {/* Content */}
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"32px 30px"}}>
        {/* State label */}
        <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2.5px",color:r.labelColor,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:20,height:2,background:r.labelColor,borderRadius:2}}/>
          {r.state}
        </div>
        <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,3vw,32px)",color:"#fff",lineHeight:1.1,marginBottom:14}}>{r.headline}</h3>
        {/* Cities */}
        <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.55)",marginBottom:16,letterSpacing:".3px"}}>{r.cities.join(" · ")}</p>
        <p style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.82)",lineHeight:1.65,marginBottom:20}}>{r.desc}</p>
        {/* County chips */}
        <div style={{display:"flex",flexWrap:"wrap",gap:7,
          maxHeight:hovered?200:0,overflow:"hidden",
          opacity:hovered?1:0,
          transition:"max-height .4s ease, opacity .35s ease"}}>
          <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:10,letterSpacing:"1.5px",color:"rgba(255,255,255,0.4)",textTransform:"uppercase",width:"100%",marginBottom:4}}>Counties Served</div>
          {r.counties.map((c,j)=>(
            <span key={j} style={{fontFamily:"var(--font-body)",fontSize:12,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.8)",borderRadius:20,padding:"4px 12px",border:"1px solid rgba(255,255,255,0.15)"}}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Regions(){
  useAnim();
  const regions=[
    {
      state:"Ohio",
      accentBar:"var(--color-accent)",
      labelColor:"var(--color-accent)",
      img:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80",
      headline:"Southern Ohio",
      counties:["Scioto County","Pike County","Ross County","Jackson County","Lawrence County","Hocking County"],
      desc:"Southern Ohio is home. We know these communities because we live and work here every day. Whether you're in Scioto County or up in Ross County, you're working with a team that understands your market.",
      cities:["Portsmouth","Chillicothe","Jackson","Ironton","Waverly","Logan"],
    },
    {
      state:"Kentucky",
      accentBar:"#c9843a",
      labelColor:"#e8a96a",
      img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      headline:"Eastern Kentucky",
      counties:["Boyd County","Greenup County","Rowan County","Floyd County","Pike County"],
      desc:"Eastern Kentucky businesses face unique challenges and opportunities. We understand this market because we're part of this region, not outsiders guessing from a distance.",
      cities:["Ashland","Huntington","Morehead","Pikeville","Prestonsburg"],
    },
    {
      state:"West Virginia",
      accentBar:"#1B6FAD",
      labelColor:"#7ab8e0",
      img:"https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=900&q=80",
      headline:"West Virginia",
      counties:["Cabell County","Kanawha County","Wayne County","Mason County"],
      desc:"From Huntington to Charleston and everywhere in between, we're helping West Virginia businesses compete and grow.",
      cities:["Charleston","Huntington","Wayne","Point Pleasant","St. Albans"],
    },
  ];
  return(
    <section style={{...S.pad,background:"#f7f8fa"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Where We Serve</p>
          <h2 className="anim d1" style={S.h2}>Three States. One Team</h2>
          <p className="anim d2" style={S.body}>Our service area spans Ohio, Kentucky, and West Virginia. Every region comes with its own market dynamics, and we know all of them.</p>
          <p className="anim d3" style={{...S.body,fontSize:14,color:"var(--color-body)",marginTop:8,opacity:.7,fontStyle:"italic"}}>Hover each region to explore counties served.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
          {regions.map((r,i)=><RegionCard key={i} r={r} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ─── Corridor Section ───────────────────────────────── */
function Corridor(){
  useAnim();
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,display:"flex",gap:60,flexWrap:"wrap",alignItems:"center"}}>
        {/* Corridor image */}
        <div className="anim" style={{flex:"1 1 320px",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 30px rgba(37,81,106,0.08)"}}>
          <img src="/images/service-areas-page-corridor-section.jpeg" alt="AMM service corridor, Chillicothe to Charleston" style={{width:"100%",display:"block"}} />
        </div>
        <div style={{flex:"1 1 460px"}}>
          <p className="anim" style={S.overline}>The Chillicothe to Charleston Corridor</p>
          <h2 className="anim d1" style={S.h2}>The Chillicothe to Charleston Corridor</h2>
          <p className="anim d2" style={{...S.body,marginBottom:18}}>
            This corridor is the heart of our service area, spanning three states and representing one of the most underserved markets in the country for professional marketing.
          </p>
          <p className="anim d3" style={{...S.body,marginBottom:18}}>
            Businesses along this stretch face the same challenges: they need quality marketing, but the options have always been limited to overpriced national agencies or doing it yourself.
          </p>
          <p className="anim d4" style={{...S.body,fontWeight:600,color:"var(--color-dark)",marginBottom:0}}>
            That's exactly why we're here. There's enough work and enough potential in this corridor to build something real, and we're committed to being the team that helps businesses here grow.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Every Service Every Location ──────────────────── */
function ServicesEverywhere(){
  useAnim();
  const services=[
    {icon:I.globe,label:"Website Design & Development",href:"/services/website-design",img:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80"},
    {icon:I.search,label:"SEO & Local Search",href:"/services/seo",img:"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=700&q=80"},
    {icon:I.instagram26,label:"Social Media Management",href:"/services/social-media-management",img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"},
    {icon:I.megaphone,label:"Social Media Advertising",href:"/services/social-media-advertising",img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80"},
    {icon:I.palette,label:"Graphic Design",href:"/services/graphic-design",img:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80"},
    {icon:I.clipboard,label:"Strategic Consulting",href:"/services/strategic-consulting",img:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80"},
  ];
  return(
    <section style={{padding:"80px 0",background:"var(--color-light-bg)"}}>
      <div style={S.container}>
        <div style={{textAlign:"center",maxWidth:560,margin:"0 auto 48px"}}>
          <p className="anim" style={S.overline}>Full Service</p>
          <h2 className="anim d1" style={S.h2}>Every Service. Every Location</h2>
          <p className="anim d2" style={S.body}>Your location doesn't limit your options. Every service we offer is available to businesses throughout our service area.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20,maxWidth:1000,margin:"0 auto"}}>
          {services.map((sv,i)=>(
            <Link key={i} to={sv.href} className={`anim d${Math.min(i%3+1,4)}`}
              style={{
                borderRadius:18,overflow:"hidden",position:"relative",
                height:260,display:"flex",flexDirection:"column",justifyContent:"flex-end",
                textDecoration:"none",
                boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
                transition:"all .4s cubic-bezier(.4,0,.2,1)",
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 20px 50px rgba(37,81,106,0.2)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1.08)";
                const ov=e.currentTarget.querySelector(".svc-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.95) 0%, rgba(10,20,30,0.7) 50%, rgba(10,20,30,0.15) 100%)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)";
                const img=e.currentTarget.querySelector("img");if(img)img.style.transform="scale(1)";
                const ov=e.currentTarget.querySelector(".svc-ov");if(ov)ov.style.background="linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)";
              }}>
              <img src={sv.img} alt={sv.label} loading="lazy"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform .6s ease"}}/>
              <div className="svc-ov" style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top, rgba(10,20,30,0.92) 0%, rgba(10,20,30,0.5) 45%, transparent 100%)",
                transition:"background .4s ease",
              }}/>
              <div style={{position:"relative",zIndex:1,padding:"0 24px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.3,margin:0}}>{sv.label}</h3>
                <span style={{
                  fontFamily:"var(--font-heading)",fontWeight:600,fontSize:12,
                  color:"#fff",background:"rgba(255,255,255,0.12)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:24,padding:"5px 14px",
                  display:"flex",alignItems:"center",gap:3,flexShrink:0,whiteSpace:"nowrap",
                  transition:"all .3s ease",
                }}>
                  Learn more <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:12,height:12}}><path d="M9 18l6-6-6-6"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="anim d4" style={{textAlign:"center",marginTop:32,...S.body,fontSize:15,fontStyle:"italic"}}>
          Full-service packages and standalone services both available, wherever you're located.
        </p>
      </div>
    </section>
  );
}

/* ─── Why Local Matters ──────────────────────────────── */
function WhyLocal(){
  useAnim();
  const points=[
    {title:"We shop at the same stores.",desc:"We don't need to research what resonates with people in this region, we already know because we're part of it."},
    {title:"We attend local events.",desc:"White Gravel Mines, chamber events, Shawnee State functions, we're not just talking about community involvement, we're actually there."},
    {title:"We hire locally.",desc:"Our team is from here. Every dollar that comes into AMM stays in the region."},
    {title:"We partner with local institutions.",desc:"Shawnee State University, Kricker Innovation Hub, local business organizations. Deep ties, not just sponsorship logos."},
  ];
  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/images/community-IMG_5225.jpeg')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.04}}/>
      <div style={{...S.container,position:"relative",zIndex:1}}>
        <div style={{display:"flex",gap:60,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{flex:"1 1 460px"}}>
            <p className="anim" style={S.overline}>Why It Matters</p>
            <h2 className="anim d1" style={S.h2}>Why Local Matters</h2>
            <p className="anim d2" style={{...S.body,marginBottom:18}}>
              A marketing agency in Columbus or Nashville doesn't know your customers the way we do. We shop at the same stores, eat at the same restaurants, and understand what resonates with people in this region.
            </p>
            <p className="anim d3" style={{...S.body,marginBottom:32}}>
              We're not just a voice on the phone from across the country. We're a short drive away, and when your community grows, ours does too.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {points.map((pt,i)=>(
                <div key={i} className={`anim d${Math.min(i+2,6)}`} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"var(--color-accent)",flexShrink:0,marginTop:8}}/>
                  <div>
                    <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"var(--color-dark)"}}>{pt.title} </span>
                    <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--color-body)"}}>{pt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Community photo card with stats overlay */}
          <div className="anim d3" style={{flex:"1 1 320px",position:"relative"}}>
            <div className="dot-grid" style={{top:-10,right:-10}}/>
            <div style={{borderRadius:22,overflow:"hidden",boxShadow:"0 16px 50px rgba(37,81,106,0.2)",position:"relative"}}>
              <img
                src="/images/community-IMG_5222.jpeg"
                alt="AMM team in the community"
                style={{width:"100%",height:260,objectFit:"cover",display:"block"}}
              />
              <div style={{background:"linear-gradient(145deg, var(--color-primary) 0%, #1B6FAD 100%)",padding:"28px 30px",position:"relative",overflow:"hidden"}}>
                <div className="dot-grid" style={{bottom:-10,left:-10,opacity:.12}}/>
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:20}}>Community First</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:16}}>
                  <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:28,color:"var(--color-accent)"}}> 5+</span>
                  <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.7)"}}>Years Serving the Region</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Work From Anywhere ─────────────────────────────── */
function WorkAnywhere(){
  useAnim();
  return(
    <section style={{padding:"90px 0",background:"var(--color-primary)",position:"relative",overflow:"hidden"}}>
      {/* Background image */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/images/service-areas-page-corridor-section.jpeg')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.12}}/>
      {/* Diagonal gold accent */}
      <div style={{position:"absolute",top:0,left:"40%",width:2,height:"200%",background:"linear-gradient(to bottom,transparent,rgba(205,155,66,0.15),transparent)",transform:"rotate(18deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,maxWidth:780,textAlign:"center",position:"relative",zIndex:1}}>
        <p className="anim" style={{...S.overline,color:"var(--color-accent)",display:"flex",justifyContent:"center"}}>Beyond the Region</p>
        <h2 className="anim d1" style={{...S.h2,color:"#fff",fontSize:"clamp(28px,4vw,40px)"}}>Not in Our Backyard? That's Fine Too</h2>
        <p className="anim d2" style={{...S.body,maxWidth:580,margin:"0 auto 16px",color:"rgba(255,255,255,0.75)"}}>
          Our focus is the tri-state region, but we work with clients outside the area as well. Virtual consultations, remote collaboration, and all of our services can be delivered from anywhere.
        </p>
        <p className="anim d3" style={{...S.body,fontSize:16,fontWeight:600,color:"var(--color-accent)",fontStyle:"italic"}}>
          If you found us and like what you see, geography won't get in the way.
        </p>
        <div className="anim d4" style={{marginTop:32}}>
          <Link to="/contact" style={S.btnP}
            onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
            Schedule a Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"Do you only work with businesses in your immediate area?",a:"No. Our focus is the tri-state region, but we've worked with clients across Ohio and beyond. If you're interested, reach out, we're happy to talk about what we can do for your business regardless of location."},
    {q:"Can we meet in person?",a:"Absolutely. If you're in the region, we're happy to meet face to face. We also do virtual consultations for clients who prefer it or are farther away. Either works just as well."},
    {q:"Do you understand my specific local market?",a:"If you're in our service area, yes, we live and work here. If you're outside the region, we'll take the time to learn your market before we start anything. We don't make assumptions."},
    {q:"Do you charge more for clients outside your primary area?",a:"No. Our pricing is the same regardless of location. Distance doesn't affect what you pay."},
    {q:"How do virtual consultations work?",a:"Just like an in-person meeting, but on a video call. We use them with clients regularly and they work great. We'll send you a link, we'll talk through your goals, and we'll go from there."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Our Service Area</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{background:"var(--color-light-bg)",borderRadius:12,overflow:"hidden",border:"1px solid rgba(37,81,106,0.06)",transition:"all .3s ease",boxShadow:open===i?"0 6px 24px rgba(0,0,0,0.05)":"none"}}>
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
export default function AreasWeService() {
  return (
    <Layout activeNav="About">
      <SEOHead
        title="Areas We Service | Appalachian Marketing & Media"
        description="AMM is headquartered in New Boston, Ohio and serves businesses across Southern Ohio, Eastern Kentucky, and West Virginia. Full-service marketing in your backyard."
        canonical="https://www.appmktmedia.com/about/areas-we-service"
        ogImage="/images/service-areas-page-corridor-section.jpeg"
      />
      <StructuredData schema={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.appmktmedia.com/about" },
          { "@type": "ListItem", "position": 3, "name": "Areas We Service", "item": "https://www.appmktmedia.com/about/areas-we-service" }
        ]
      }} />
      <HeroBanner />
      <HomeBase />
<Regions />
<Corridor />
<ServicesEverywhere />
<WhyLocal />
<WorkAnywhere />
<FAQ />
      <CTASection />
    </Layout>
  );
}

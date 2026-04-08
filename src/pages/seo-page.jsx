import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useAnim } from "../hooks/useScrollAnimation";
import { useCountUp } from "../hooks/useCountUp";
import ServicePricing from "../components/ServicePricing";
import StructuredData from "../components/StructuredData";
import RelatedServices from "../components/RelatedServices";

// ─── Page-specific constants ─────────────────────────────────────────────

const S={
  container:{maxWidth:1160,margin:"0 auto",padding:"0 20px",width:"100%"},
  pad:{padding:"80px 0"},
  overline:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12},
  h2:{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,36px)",color:"var(--color-dark)",lineHeight:1.25,marginBottom:16},
  body:{fontFamily:"var(--font-body)",fontWeight:400,fontSize:17,lineHeight:1.7,color:"var(--color-body)"},
  btnP:{fontFamily:"var(--font-heading)",fontWeight:600,fontSize:15,background:"var(--color-accent)",color:"#fff",border:"none",borderRadius:30,padding:"10px 22px",cursor:"pointer",transition:"all .3s ease",letterSpacing:".5px",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
};

function Ic({d,size=36,sw=1.8}){return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{width:size,height:size}}>{d}</svg>;}

const icons={
  mapPin:<Ic d={<><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="3"/></>}/>,
  wrench:<Ic d={<><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>}/>,
  edit:<Ic d={<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>}/>,
  star:<Ic d={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>}/>,
  refresh:<Ic d={<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>}/>,
  check:<svg aria-hidden="true" viewBox="0 0 20 20" fill="var(--color-accent)" style={{width:18,height:18,flexShrink:0}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  phone:<Ic size={18} d={<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>}/>,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1, HERO  (kept, with tightened copy + approach line folded in)
   ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Animated Search Mockup ──────────────────────────────────────────── */
function SearchMockup() {
  const queries = ["plumber near me", "dentist in Portsmouth OH", "HVAC contractor Ashland KY", "roofing company near me"];
  const allResults = [
    [{pos:"1",name:"Your Business",url:"yourbusiness.com",accent:true},{pos:"2",name:"Competitor A",url:"competitora.com",accent:false},{pos:"3",name:"Competitor B",url:"competitorb.com",accent:false}],
    [{pos:"1",name:"Your Business",url:"yourbusiness.com",accent:true},{pos:"2",name:"Smile Dental",url:"smiledentaloh.com",accent:false},{pos:"3",name:"Family Dentistry",url:"familydentistry.com",accent:false}],
    [{pos:"1",name:"Your Business",url:"yourbusiness.com",accent:true},{pos:"2",name:"Cool Air HVAC",url:"coolair.com",accent:false},{pos:"3",name:"AllTemp Services",url:"alltempky.com",accent:false}],
    [{pos:"1",name:"Your Business",url:"yourbusiness.com",accent:true},{pos:"2",name:"Peak Roofing Co",url:"peakroofing.com",accent:false},{pos:"3",name:"Top Line Roofing",url:"toplineroofing.com",accent:false}],
  ];

  const [queryIdx, setQueryIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(0);       // chars typed so far
  const [shownCount, setShownCount] = useState(0);   // results revealed
  const [phase, setPhase] = useState("typing");      // typing | revealing | hold | erasing | done
  const [pulse, setPulse] = useState(false);

  const isLast = queryIdx === queries.length - 1;
  const query = queries[queryIdx];
  const results = allResults[queryIdx];
  const typedQuery = query.slice(0, typedLen);

  useEffect(() => {
    let t;
    if (phase === "typing") {
      if (typedLen < query.length) {
        t = setTimeout(() => setTypedLen(n => n + 1), 60);
      } else {
        t = setTimeout(() => setPhase("revealing"), 400);
      }
    } else if (phase === "revealing") {
      if (shownCount < results.length) {
        t = setTimeout(() => {
          setShownCount(n => n + 1);
          if (shownCount === 0) setPulse(true);
        }, 220);
      } else if (isLast) {
        setPhase("done");       // last query, stay forever
      } else {
        t = setTimeout(() => setPhase("hold"), 2200);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), 400);
    } else if (phase === "erasing") {
      if (typedLen > 0) {
        t = setTimeout(() => setTypedLen(n => n - 1), 25);
      } else {
        // reset results only after text is fully gone
        setShownCount(0);
        setPulse(false);
        setQueryIdx(i => i + 1);
        setPhase("typing");
      }
    }
    // "done" — no-op
    return () => clearTimeout(t);
  }, [phase, typedLen, shownCount]);

  return (
    <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.07)",borderRadius:18,border:"1px solid rgba(255,255,255,0.1)",padding:28}}>
      {/* Search bar */}
      <div style={{background:"rgba(255,255,255,0.1)",borderRadius:24,padding:"10px 18px",display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <div style={{color:"rgba(255,255,255,0.4)"}}><Ic size={18} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/></div>
        <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.75)",flex:1,minHeight:20}}>
          {typedQuery}
          <span style={{
            display:"inline-block",width:2,height:"1em",background:"rgba(255,255,255,0.6)",
            marginLeft:1,verticalAlign:"text-bottom",
            animation: phase === "done" ? "none" : "cursorBlink 0.8s step-end infinite",
            opacity: phase === "done" ? 0 : 1,
          }}/>
        </span>
      </div>

      {/* Results */}
      <div style={{minHeight:180}}>
        {results.map((r,i) => (
          <div key={`${queryIdx}-${i}`} style={{
            padding:"14px 16px", borderRadius:10, marginBottom:8,
            background: r.accent ? "rgba(205,155,66,0.12)" : "rgba(255,255,255,0.03)",
            border: r.accent
              ? pulse ? "1px solid rgba(205,155,66,0.6)" : "1px solid rgba(205,155,66,0.25)"
              : "1px solid rgba(255,255,255,0.05)",
            boxShadow: r.accent && pulse ? "0 0 16px rgba(205,155,66,0.15)" : "none",
            opacity: i < shownCount ? 1 : 0,
            transform: i < shownCount ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease, border-color 0.5s ease, box-shadow 0.5s ease",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontFamily:"var(--font-heading)",fontSize:11,color:r.accent?"var(--color-accent)":"rgba(255,255,255,0.3)",fontWeight:600}}>#{r.pos}</span>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:14,color:r.accent?"#fff":"rgba(255,255,255,0.5)"}}>{r.name}</span>
              {r.accent && pulse && (
                <span style={{marginLeft:"auto",background:"rgba(205,155,66,0.2)",color:"var(--color-accent)",fontSize:10,fontFamily:"var(--font-heading)",fontWeight:700,padding:"2px 8px",borderRadius:10,letterSpacing:"0.5px"}}>
                  #1
                </span>
              )}
            </div>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,color:r.accent?"rgba(205,155,66,0.8)":"rgba(255,255,255,0.25)"}}>{r.url}</span>
          </div>
        ))}
      </div>

      <div style={{textAlign:"center",marginTop:12,fontFamily:"var(--font-heading)",fontWeight:600,fontSize:12,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase"}}>
        That's where we want you ↑
      </div>

      <style>{`@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

/* ─── Background SERP — removed ─────────────────────────────────────── */
function _BackgroundSERP_deleted() {
  const scenarios = [
    {
      query: "plumber near me",
      mapResults: [
        { name: "Your Business", addr: "123 Main St, Portsmouth, OH", rating: "4.9", reviews: "148", hours: "Open · Closes 6 PM" },
        { name: "City Plumbing Co.", addr: "88 Oak Ave, Portsmouth, OH", rating: "4.3", reviews: "62", hours: "Open 24 hours" },
        { name: "Quick Fix Plumbers", addr: "402 River Rd, Wheelersburg, OH", rating: "4.1", reviews: "39", hours: "Closed · Opens 8 AM" },
      ],
      organic: [
        { name: "Your Business", domain: "yourbusiness.com", title: "Your Business | Licensed Plumber in Portsmouth, OH", desc: "Family-owned plumbing company serving Scioto County since 2009. Emergency service available. 5-star rated on Google. Call for a free estimate." },
        { name: "City Plumbing Co.", domain: "cityplumbingoh.com", title: "City Plumbing Co., Portsmouth & Southern Ohio", desc: "Residential and commercial plumbing. Water heaters, drain cleaning, pipe repair. Serving Southern Ohio for 15+ years." },
        { name: "HomeAdvisor Pros", domain: "homeadvisor.com", title: "Best Plumbers Near Portsmouth OH, Compare Quotes", desc: "Get matched with top-rated local plumbers. Read reviews, compare prices, and hire the best pro for your job." },
        { name: "Angi", domain: "angi.com", title: "Plumbers in Portsmouth, Ohio | Angi", desc: "Browse 12 plumbers in Portsmouth with real reviews from homeowners. Find the right plumber for any job." },
      ],
    },
    {
      query: "dentist in Portsmouth OH",
      mapResults: [
        { name: "Your Business", addr: "55 Gallia St, Portsmouth, OH", rating: "4.8", reviews: "211", hours: "Open · Closes 5 PM" },
        { name: "Smile Family Dental", addr: "900 Offnere St, Portsmouth, OH", rating: "4.5", reviews: "87", hours: "Open · Closes 5 PM" },
        { name: "Southern Ohio Dental", addr: "1420 27th St, Portsmouth, OH", rating: "4.2", reviews: "54", hours: "Closed · Opens Mon" },
      ],
      organic: [
        { name: "Your Business", domain: "yourbusiness.com", title: "Your Business | Dentist Portsmouth OH, Family & Cosmetic", desc: "Accepting new patients. General, cosmetic, and emergency dental care in Portsmouth, OH. Most insurance accepted. Book online today." },
        { name: "Smile Family Dental", domain: "smilefamilydental.com", title: "Smile Family Dental, Portsmouth, Ohio Dentist", desc: "Comprehensive dental care for the whole family. Cleanings, fillings, crowns, and more. Call to schedule your appointment." },
        { name: "Healthgrades", domain: "healthgrades.com", title: "Best Dentists in Portsmouth, OH | Healthgrades", desc: "Find and compare dentists in Portsmouth, OH. Read verified patient reviews and make an appointment online." },
        { name: "Zocdoc", domain: "zocdoc.com", title: "Dentists in Portsmouth, Ohio | Book Online, Zocdoc", desc: "See available times and book an appointment instantly. Available dentists in Portsmouth, OH accepting new patients." },
      ],
    },
    {
      query: "HVAC contractor Ashland KY",
      mapResults: [
        { name: "Your Business", addr: "220 Central Ave, Ashland, KY", rating: "4.9", reviews: "93", hours: "Open 24 hours" },
        { name: "Cool Air Solutions", domain: "coolair.com", addr: "14 Park Dr, Huntington, WV", rating: "4.4", reviews: "71", hours: "Open · Closes 5 PM" },
        { name: "Tri-State Heating & Air", addr: "500 Winchester Ave, Ashland, KY", rating: "4.0", reviews: "45", hours: "Open · Closes 6 PM" },
      ],
      organic: [
        { name: "Your Business", domain: "yourbusiness.com", title: "Your Business | HVAC Contractor in Ashland, KY", desc: "Licensed HVAC installation, repair & maintenance. Furnaces, AC units, heat pumps. Serving Ashland and the Tri-State area. Free estimates." },
        { name: "Cool Air Solutions", domain: "coolair.com", title: "Cool Air Solutions, Heating & Cooling Ashland KY", desc: "Professional heating and air conditioning services. Same-day service available. Residential & commercial. Call (606) 555-0100." },
        { name: "Angi", domain: "angi.com", title: "Best HVAC Contractors in Ashland, KY | Angi", desc: "Compare top-rated HVAC contractors in Ashland. Get free quotes, read reviews, and hire the right pro for your project." },
        { name: "Thumbtack", domain: "thumbtack.com", title: "Top 10 HVAC Companies in Ashland, KY 2024, Thumbtack", desc: "Find HVAC pros near you. Browse profiles, read reviews, and get quotes from local heating and cooling experts." },
      ],
    },
    {
      query: "roofing company near me",
      mapResults: [
        { name: "Your Business", addr: "78 Summit Dr, Ironton, OH", rating: "4.8", reviews: "176", hours: "Open · Closes 5 PM" },
        { name: "Peak Roofing Co.", addr: "305 Center St, Ironton, OH", rating: "4.3", reviews: "58", hours: "Open · Closes 4 PM" },
        { name: "Storm Shield Roofing", addr: "1100 S 3rd St, Ironton, OH", rating: "4.1", reviews: "33", hours: "Open · Closes 5 PM" },
      ],
      organic: [
        { name: "Your Business", domain: "yourbusiness.com", title: "Your Business | Roofing Contractor, Southern Ohio & KY", desc: "Expert roofing installation, repair, and replacement. Storm damage specialists. Insurance claims assistance. Free inspections. Call today." },
        { name: "Peak Roofing Co.", domain: "peakroofingco.com", title: "Peak Roofing Co. | Ironton & Lawrence County Ohio", desc: "Quality residential and commercial roofing since 1998. Shingles, metal roofing, gutters. Free estimates. Licensed & insured." },
        { name: "HomeAdvisor", domain: "homeadvisor.com", title: "Best Roofers Near Me, Local Roofing Companies | HomeAdvisor", desc: "Connect with pre-screened local roofers. Read reviews, compare costs, and find the best roofing contractor for your home." },
        { name: "Yelp", domain: "yelp.com", title: "Best Roofing in Lawrence County, OH, Yelp", desc: "Find top-rated roofing contractors in Lawrence County. Real reviews from real customers. Get quotes from local pros." },
      ],
    },
  ];

  const [idx, setIdx] = useState(0);
  const [typedQuery, setTypedQuery] = useState("");
  const [phase, setPhase] = useState("typing");
  const [visibleMap, setVisibleMap] = useState([]);
  const [visibleOrganic, setVisibleOrganic] = useState([]);

  const scenario = scenarios[idx];

  useEffect(() => {
    const query = scenario.query;
    let timeout;
    if (phase === "typing") {
      if (typedQuery.length < query.length) {
        timeout = setTimeout(() => setTypedQuery(query.slice(0, typedQuery.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setPhase("showMap"), 350);
      }
    } else if (phase === "showMap") {
      if (visibleMap.length < scenario.mapResults.length) {
        timeout = setTimeout(() => setVisibleMap(p => [...p, p.length]), 160);
      } else {
        timeout = setTimeout(() => setPhase("showOrganic"), 100);
      }
    } else if (phase === "showOrganic") {
      if (visibleOrganic.length < scenario.organic.length) {
        timeout = setTimeout(() => setVisibleOrganic(p => [...p, p.length]), 140);
      } else {
        timeout = setTimeout(() => setPhase("hold"), 3200);
      }
    } else if (phase === "hold") {
      setPhase("clearing");
    } else if (phase === "clearing") {
      setVisibleOrganic([]);
      setVisibleMap([]);
      if (typedQuery.length > 0) {
        timeout = setTimeout(() => setTypedQuery(q => q.slice(0, -1)), 22);
      } else {
        setIdx(i => (i + 1) % scenarios.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, typedQuery, visibleMap, visibleOrganic, idx]);

  const isYours = (name) => name === "Your Business";

  return (
    <div style={{
      position:"absolute", inset:0,
      overflow:"hidden", pointerEvents:"none",
      opacity:0.12,
    }}>
      {/* Full Google-like page, scaled to fill */}
      <div style={{
        position:"absolute",
        top:"50%", left:"50%",
        transform:"translate(-50%, -50%) scale(1.9)",
        transformOrigin:"center top",
        width:900,
        background:"#202124",
        fontFamily:"arial, sans-serif",
        color:"#e8eaed",
        minHeight:700,
        borderRadius:4,
        overflow:"hidden",
      }}>
        {/* Google top bar */}
        <div style={{
          background:"#202124",
          borderBottom:"1px solid #3c4043",
          padding:"14px 24px",
          display:"flex", alignItems:"center", gap:16,
        }}>
          {/* Google logo text */}
          <div style={{display:"flex",alignItems:"center",gap:1,marginRight:8,flexShrink:0}}>
            {["#4285f4","#ea4335","#fbbc05","#4285f4","#34a853","#ea4335"].map((c,i)=>
              <span key={i} style={{color:c,fontFamily:"arial",fontWeight:700,fontSize:22,lineHeight:1}}>
                {"Google"[i]}
              </span>
            )}
          </div>

          {/* Search bar */}
          <div style={{
            flex:1, maxWidth:620,
            background:"#303134",
            border:"1px solid #5f6368",
            borderRadius:24,
            padding:"8px 18px",
            display:"flex", alignItems:"center", gap:10,
          }}>
            <span style={{fontSize:13,color:"#e8eaed",flex:1,letterSpacing:"0.01em",minHeight:19,lineHeight:"19px"}}>
              {typedQuery}
              <span style={{
                display:"inline-block",width:1.5,height:16,
                background:"#8ab4f8",marginLeft:1,verticalAlign:"middle",
                animation:"cursorBlink 0.8s step-end infinite",
              }}/>
            </span>
            <svg viewBox="0 0 24 24" style={{width:18,height:18,flexShrink:0}} fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa0a6" strokeWidth="2"/>
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Nav tabs */}
          <div style={{display:"flex",gap:4,marginLeft:8}}>
            {["All","Maps","Images","News","More"].map((t,i)=>(
              <span key={i} style={{
                padding:"4px 10px", borderRadius:20, fontSize:11,
                color: i===0 ? "#8ab4f8" : "#9aa0a6",
                borderBottom: i===0 ? "2px solid #8ab4f8" : "2px solid transparent",
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div style={{padding:"6px 160px 4px",fontSize:11,color:"#9aa0a6"}}>
          About {(Math.floor(Math.random()*8000000)+1200000).toLocaleString()} results (0.{Math.floor(Math.random()*60)+20} seconds)
        </div>

        <div style={{display:"flex",padding:"0 0 0 160px",gap:24}}>
          {/* Main results column */}
          <div style={{flex:1,maxWidth:600,paddingBottom:40}}>

            {/* Local Map Pack */}
            <div style={{
              border:"1px solid #3c4043", borderRadius:8,
              marginBottom:20, overflow:"hidden",
              background:"#292a2d",
            }}>
              <div style={{padding:"10px 16px 6px",fontSize:11,color:"#9aa0a6",borderBottom:"1px solid #3c4043"}}>
                Local results
                <span style={{color:"#8ab4f8",marginLeft:8,cursor:"pointer"}}>More places</span>
              </div>
              {/* Fake map strip */}
              <div style={{height:80,background:"#35363a",position:"relative",overflow:"hidden",borderBottom:"1px solid #3c4043"}}>
                {/* Fake map grid lines */}
                {[...Array(6)].map((_,i)=>(
                  <div key={i} style={{position:"absolute",left:`${i*17}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.04)"}}/>
                ))}
                {[...Array(4)].map((_,i)=>(
                  <div key={i} style={{position:"absolute",top:`${i*26}%`,left:0,right:0,height:1,background:"rgba(255,255,255,0.04)"}}/>
                ))}
                {/* Fake roads */}
                <div style={{position:"absolute",top:"40%",left:0,right:0,height:2,background:"rgba(255,255,255,0.07)",transform:"rotate(-3deg)"}}/>
                <div style={{position:"absolute",top:"65%",left:0,right:0,height:1,background:"rgba(255,255,255,0.05)",transform:"rotate(1deg)"}}/>
                <div style={{position:"absolute",top:0,bottom:0,left:"35%",width:1.5,background:"rgba(255,255,255,0.06)"}}/>
                {/* Map pins */}
                <div style={{position:"absolute",top:"28%",left:"32%",width:18,height:18,borderRadius:"50% 50% 50% 0",background:"#ea4335",transform:"rotate(-45deg)",border:"1px solid rgba(0,0,0,0.3)"}}/>
                <div style={{position:"absolute",top:"45%",left:"52%",width:14,height:14,borderRadius:"50% 50% 50% 0",background:"#5f6368",transform:"rotate(-45deg)"}}/>
                <div style={{position:"absolute",top:"60%",left:"68%",width:14,height:14,borderRadius:"50% 50% 50% 0",background:"#5f6368",transform:"rotate(-45deg)"}}/>
              </div>

              {scenario.mapResults.map((r,i)=>(
                <div key={`${idx}-map-${i}`} style={{
                  padding:"10px 16px",
                  borderBottom: i < scenario.mapResults.length-1 ? "1px solid #3c4043" : "none",
                  background: isYours(r.name) ? "rgba(138,180,248,0.05)" : "transparent",
                  opacity: visibleMap.includes(i) ? 1 : 0,
                  transform: visibleMap.includes(i) ? "translateY(0)" : "translateY(6px)",
                  transition:"opacity 0.3s ease, transform 0.3s ease",
                }}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{
                      width:32,height:32,borderRadius:4,flexShrink:0,
                      background: isYours(r.name) ? "#1a73e8" : "#3c4043",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:13,fontWeight:700,color:"#fff",
                      marginTop:2,
                    }}>
                      {i+1}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color: isYours(r.name) ? "#8ab4f8" : "#e8eaed",fontWeight:isYours(r.name)?700:400,lineHeight:1.3}}>
                        {r.name}
                        {isYours(r.name) && (
                          <span style={{marginLeft:6,background:"#1a73e8",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10,verticalAlign:"middle"}}>
                            Sponsored
                          </span>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                        <span style={{color:"#fbbc04",fontSize:11}}>{"★".repeat(Math.floor(parseFloat(r.rating)))}</span>
                        <span style={{color:"#9aa0a6",fontSize:11}}>{r.rating} ({r.reviews})</span>
                      </div>
                      <div style={{fontSize:11,color:"#9aa0a6",marginTop:1}}>{r.addr}</div>
                      <div style={{fontSize:11,color: r.hours?.startsWith("Open") ? "#81c995" : "#9aa0a6",marginTop:1}}>{r.hours}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Organic results */}
            {scenario.organic.map((r,i)=>(
              <div key={`${idx}-org-${i}`} style={{
                marginBottom:24,
                opacity: visibleOrganic.includes(i) ? 1 : 0,
                transform: visibleOrganic.includes(i) ? "translateY(0)" : "translateY(8px)",
                transition:`opacity 0.3s ease, transform 0.3s ease`,
              }}>
                {/* Favicon + domain */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <div style={{
                    width:16,height:16,borderRadius:2,
                    background: isYours(r.name) ? "#1a73e8" : "#5f6368",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:9,fontWeight:700,color:"#fff",flexShrink:0,
                  }}>
                    {r.name[0]}
                  </div>
                  <span style={{fontSize:12,color:"#bdc1c6"}}>{r.domain}</span>
                  <span style={{fontSize:11,color:"#5f6368",marginLeft:-2}}>›</span>
                </div>
                {/* Title */}
                <div style={{
                  fontSize:17,
                  color: isYours(r.name) ? "#8ab4f8" : "#8ab4f8",
                  fontWeight: isYours(r.name) ? 600 : 400,
                  lineHeight:1.3,marginBottom:4,
                  opacity: isYours(r.name) ? 1 : 0.65,
                }}>
                  {r.title}
                </div>
                {/* Description */}
                <div style={{fontSize:13,color:"#bdc1c6",lineHeight:1.55,opacity:isYours(r.name)?0.9:0.5}}>
                  {r.desc}
                </div>
                {isYours(r.name) && (
                  <div style={{display:"flex",gap:12,marginTop:6}}>
                    {["Call Now","Get Directions","Book Online"].map((l,li)=>(
                      <span key={li} style={{fontSize:12,color:"#8ab4f8",borderBottom:"1px solid rgba(138,180,248,0.3)"}}>{l}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Knowledge panel stub */}
          <div style={{width:280,flexShrink:0,paddingTop:0}}>
            {visibleOrganic.length > 1 && (
              <div style={{
                border:"1px solid #3c4043",borderRadius:8,
                background:"#292a2d",padding:16,
                opacity: visibleOrganic.length > 2 ? 1 : 0,
                transition:"opacity 0.4s ease",
              }}>
                <div style={{
                  height:120,background:"#35363a",borderRadius:6,marginBottom:12,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  overflow:"hidden",position:"relative",
                }}>
                  <div style={{fontSize:28,fontWeight:700,color:"rgba(138,180,248,0.3)"}}>YB</div>
                </div>
                <div style={{fontSize:16,fontWeight:600,color:"#e8eaed",marginBottom:2}}>Your Business</div>
                <div style={{fontSize:12,color:"#9aa0a6",marginBottom:8}}>{scenario.query.replace(" near me","").replace(/\b\w/g,c=>c.toUpperCase())} Company</div>
                <div style={{display:"flex",gap:2,marginBottom:6}}>
                  <span style={{color:"#fbbc04",fontSize:14}}>★★★★★</span>
                  <span style={{fontSize:12,color:"#9aa0a6",marginLeft:4}}>4.9 · 148 Google reviews</span>
                </div>
                <div style={{fontSize:12,color:"#bdc1c6",lineHeight:1.5,marginBottom:8}}>
                  Local business · Portsmouth, OH<br/>Open · Closes 6 PM
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["Website","Directions","Save"].map((btn,bi)=>(
                    <span key={bi} style={{
                      padding:"5px 12px",borderRadius:20,border:"1px solid #5f6368",
                      fontSize:11,color:"#8ab4f8",background:"transparent",
                    }}>{btn}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      {/* Background photo */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/images/team-meeting.jpeg')",backgroundSize:"cover",backgroundPosition:"center 30%",opacity:0.08}}/>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div className="dot-grid" style={{bottom:40,left:20,width:80,height:80,opacity:.2}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>

      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Search Engine Optimization</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(34px,5vw,52px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Get Found When People Search for{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>What You Offer.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:520,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Customers are searching for businesses like yours right now. If they can't find you, they're finding your competitor. We help you show up, and stay there.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            We don't use shortcuts or shady tactics. Everything we do is built to last, and we'll always be honest about what to expect and how long it takes.
          </p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP}
              onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
              Schedule a Free Consultation
            </Link>
          </div>
        </div>

        {/* Animated search result mockup */}
        <div style={{flex:"1 1 360px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .2s forwards",opacity:0}}>
          <SearchMockup />
        </div>
      </div>
</section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2, WHAT WE DO  (4 old sections → 1 consolidated, outcome-based)
   Replaces: Local SEO, On-Page SEO, Technical SEO, Content Strategy,
             AND Ongoing Management, all merged into 5 plain-English items.
   ═══════════════════════════════════════════════════════════════════════════ */
function WhatWeDo(){
  useAnim();

  const items = [
    {icon:icons.mapPin,title:"We make sure locals can find you.",desc:"When someone in your area searches for what you do, we make sure your business is one of the first they see, on Google, on Maps, everywhere that matters. We set up and optimize your online profiles, make sure your business info is correct across the internet, and target the specific cities and areas you serve.",img:"https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80"},
    {icon:icons.wrench,title:"We fix what's holding your website back.",desc:"There are dozens of behind-the-scenes factors that affect whether Google shows your site to people. We find what's broken and fix it, things like page speed, mobile experience, how your site is organized, and whether search engines can actually read your pages. You'll never see this work, but you'll see the results.",img:"https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=700&q=80"},
    {icon:icons.edit,title:"We write content that brings people to you.",desc:"We create blog posts, service pages, and location-specific content so your website shows up when people ask questions you can answer. This also helps you appear in AI-powered search tools like ChatGPT, Perplexity, and Google's AI overviews.",img:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&q=80"},
    {icon:icons.star,title:"We help you get more (and better) reviews.",desc:"Reviews are one of the biggest factors in local search rankings, and they're the first thing most people look at before calling a business. We help you build a simple system for getting them consistently, without being pushy or awkward about it.",img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"},
    {icon:icons.refresh,title:"We keep working on it every month.",desc:"SEO isn't a one-time project. Search engines change their rules, competitors make moves, and new opportunities come up. We track your rankings, watch your competitors, and adjust your strategy month after month. You'll get a clear report each month showing what's working and what we're doing next.",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"},
  ];

  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{bottom:20,left:30,opacity:.18}}/>
      <div style={S.container}>
        <div style={{maxWidth:680,marginBottom:50}}>
          <p className="anim" style={S.overline}>What We Do</p>
          <h2 className="anim d1" style={S.h2}>What SEO Looks Like When We Handle It</h2>
          <p className="anim d2" style={S.body}>
            You don't need to understand the technical details, that's our job. Here's what you'll actually experience as a client:
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
          {items.map((item,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`}
              style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 4px 24px rgba(37,81,106,0.09)",transition:"all .35s ease"}}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 14px 44px rgba(37,81,106,0.18)";
                const img = e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1.06)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 24px rgba(37,81,106,0.09)";
                const img = e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1)";
              }}>
              <div style={{height:200,overflow:"hidden",position:"relative"}}>
                <img
                  className="card-img"
                  src={item.img} alt={item.title} loading="lazy"
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .45s ease"}}
                />
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

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3, PRICING  (rewritten with plain-English features)
   Uses the shared ServicePricing component with new tier names and
   human-readable feature descriptions.
   ═══════════════════════════════════════════════════════════════════════════ */
/* (Rendered inline in the page export below via <ServicePricing /> props) */

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4, SOCIAL PROOF  (between Pricing and FAQ)
   A mix of: stats bar, mini case study, and client testimonial.
   
   ⚠️  FILL-IN FRAMEWORK, Every piece of content below is marked with
   TODO comments. Replace each one with real client data before launch.
   The section is designed to work with 1, 2, or 3 testimonials and
   1 or 2 case studies. Just remove the extras if you don't have enough.
   ═══════════════════════════════════════════════════════════════════════════ */
function SocialProof(){
  useAnim();
  const [statsStarted, setStatsStarted] = useState(false);
  const [metricsStarted, setMetricsStarted] = useState(false);
  const statsRef = useRef(null);
  const metricsRef = useRef(null);

  useEffect(() => {
    const observe = (ref, setter) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } }, { threshold: 0.3 });
      obs.observe(ref.current);
      return () => obs.disconnect();
    };
    const c1 = observe(statsRef, setStatsStarted);
    const c2 = observe(metricsRef, setMetricsStarted);
    return () => { c1?.(); c2?.(); };
  }, []);

  const stat75 = useCountUp(75, 1200, statsStarted);
  const metric45 = useCountUp(45, 1100, metricsStarted);
  const metric130 = useCountUp(130, 1300, metricsStarted);

  /* ── Stats bar ── */
  const stats = [
    { display: statsStarted ? `${stat75}+` : "75+", label: "Websites Built",        note: "since 2021", animate: true },
    { display: "2×",                                  label: "Avg. Traffic Increase", note: "across SEO clients after 12 months" },
    { display: "Top 3",                               label: "Local Search Rankings", note: "for primary keywords" },
  ];

  /* ── Mini case study ── */
  const caseStudy = {
    clientName: "Behavioral Health Provider",
    businessType: "Behavioral Health Services",
    location: "Southern Ohio",
    quote: "Results speak for themselves, we're now the first name people find when they need help in our area.",
    results: [
      { display: metricsStarted ? `${metric45}%` : "45%",   label: "increase in organic traffic" },
      { display: "#1",                                        label: "Google Map Pack ranking" },
      { display: metricsStarted ? `${metric130}%` : "130%", label: "increase in calls/form fills" },
    ],
    timeframe: "within 12 months",
    plan: "SEO Growth Plan",
  };

  /* ── Testimonials ── */
  const testimonials = [
    {
      quote: "Abe and the Appalachian Marketing team have been a huge help with our online presence. They are everything we could ask for in a marketing team, and they make you feel like you are their only client. On top of that, the success we have already seen from their help is better than what we were even expecting. I would highly recommend.",
      name: "Jacob C.",
      business: "Prime Reserve Planning",
      location: "Columbus, OH",
    },
    {
      quote: "An amazing company! Very detailed and organized. They literally helped me same day. In just a week we had amazing success and attention to our website and increased sales. All thanks to Appalachian Marketing. They truly go above and beyond.",
      name: "Andy Z.",
      business: "A&A Porta Potty's",
      location: "Argillite, KY",
    },
  ];

  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.15}}/>
      <div style={S.container}>

        {/* ── Section header ── */}
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 50px"}}>
          <p className="anim" style={S.overline}>Results</p>
          <h2 className="anim d1" style={S.h2}>Don't Just Take Our Word for It</h2>
        </div>

        {/* ── Stats bar, count-up on 75+ ── */}
        <div ref={statsRef} className="anim d2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",gap:20,marginBottom:50}}>
          {stats.map((st,i)=>(
            <div key={i} style={{textAlign:"center",padding:"28px 20px",background:"#fff",borderRadius:14,border:"1px solid rgba(37,81,106,0.06)"}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:42,color:"var(--color-primary)",lineHeight:1}}>{st.display}</div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:6,marginBottom:6}}>{st.label}</div>
              <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--color-body)",lineHeight:1.5}}>{st.note}</p>
            </div>
          ))}
        </div>

        {/* ── Mini case study, animated metrics ── */}
        <div className="anim d3" style={{
          background:"linear-gradient(135deg, var(--color-primary), #1a3d52)",
          borderRadius:20,padding:"40px 36px",marginBottom:40,position:"relative",overflow:"hidden",
        }}>
          <div className="dot-grid" style={{bottom:-10,right:-10,opacity:.1}}/>
          <div style={{display:"flex",gap:40,flexWrap:"wrap",alignItems:"center",position:"relative",zIndex:1}}>
            {/* Left: Story */}
            <div style={{flex:"1 1 380px"}}>
              <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:12}}>Client Spotlight</p>
              <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(20px,3vw,26px)",color:"#fff",lineHeight:1.3,marginBottom:8}}>
                {caseStudy.clientName}
              </h3>
              <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:16}}>
                {caseStudy.businessType} · {caseStudy.location} · {caseStudy.plan}
              </p>
              <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.85)",lineHeight:1.7,fontStyle:"italic",marginBottom:8}}>
                "{caseStudy.quote}"
              </p>
              <p style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.5)"}}>
                Results achieved {caseStudy.timeframe}
              </p>
            </div>
            {/* Right: Animated metrics */}
            <div ref={metricsRef} style={{flex:"1 1 260px",display:"flex",flexDirection:"column",gap:16}}>
              {caseStudy.results.map((r,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"18px 22px",border:"1px solid rgba(255,255,255,0.08)",transition:"border-color .3s ease",
                  ...(metricsStarted ? {borderColor:"rgba(205,155,66,0.2)"} : {})}}>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:32,color:"var(--color-accent)",lineHeight:1,transition:"all .1s"}}>{r.display}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:4}}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Testimonial quotes ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))",gap:20}}>
          {testimonials.map((t,i)=>(
            <div key={i} className={`anim d${i+4}`} style={{
              background:"#fff",borderRadius:16,padding:"32px 28px",
              border:"1px solid rgba(37,81,106,0.06)",position:"relative",
            }}>
              <div style={{fontFamily:"Georgia, serif",fontSize:60,color:"var(--color-accent)",opacity:.2,lineHeight:1,position:"absolute",top:16,left:24}}>"</div>
              <p style={{...S.body,fontSize:15.5,fontStyle:"italic",marginBottom:20,position:"relative",zIndex:1,paddingTop:16}}>
                "{t.quote}"
              </p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{
                  width:44,height:44,borderRadius:"50%",
                  background:"var(--color-light-bg)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-primary)",
                  border:"2px solid rgba(37,81,106,0.08)",
                }}>
                  {t.name.replace(/[[\]]/g,"").charAt(0)}
                </div>
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

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5, FAQ  (kept as-is, honest, clear, well-written)
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);

  const faqs=[
    {
      q:"How long does SEO take to work?",
      a:"It depends on where you're starting, how competitive your market is, and what work needs done. Generally, expect meaningful progress in 3–6 months. We'll set honest expectations up front.",
    },
    {
      q:"What's the difference between local and regular SEO?",
      a:"Local SEO focuses on showing up in searches within a specific area, Google Maps, \"near me\" searches. Organic SEO targets broader terms across search engines. Most of our clients benefit from both, and all of our plans include elements of each.",
    },
    {
      q:"Can you guarantee first-page rankings?",
      a:"No, and be cautious of anyone who does. Google considers hundreds of factors. What we guarantee is that we'll do the work right, track results honestly, and adjust strategy as we go.",
    },
    {
      q:"How do you report on SEO progress?",
      a:"Monthly reports covering your rankings, website traffic, and the metrics that actually matter, in plain English. No confusing dashboards or jargon-filled PDFs. We walk through everything with you on a call.",
    },
    {
      q:"Do I need a new website before starting SEO?",
      a:"Not necessarily. If your current site is reasonably modern and mobile-friendly, we can work with it. If it's outdated or built on a platform that limits what we can do, we'll let you know, and we can help with that too.",
    },
  ];

  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about SEO</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`}
              style={{
                background: open===i ? "#fffdf7" : "#fff",
                borderRadius:12, overflow:"hidden",
                border:"1px solid rgba(37,81,106,0.08)",
                borderLeft: open===i ? "4px solid var(--color-accent)" : "4px solid transparent",
                boxShadow: open===i ? "0 6px 28px rgba(205,155,66,0.10)" : "none",
                transition:"all .3s ease",
              }}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{
                  width:"100%",padding:"20px 24px",display:"flex",justifyContent:"space-between",
                  alignItems:"center",background:"none",border:"none",cursor:"pointer",
                  fontFamily:"var(--font-heading)",fontWeight:600,fontSize:16,
                  color:"var(--color-dark)",textAlign:"left",lineHeight:1.4,
                }}>
                {f.q}
                <span style={{color:"var(--color-accent)",transform:open===i?"rotate(180deg)":"rotate(0)",transition:"transform .3s ease",flexShrink:0,marginLeft:16}}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              <div style={{maxHeight:open===i?400:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                <div style={{padding:"0 24px 20px"}}>
                  <p style={{...S.body,fontSize:15}}>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5, CTA  (kept, with tightened copy)
   ═══════════════════════════════════════════════════════════════════════════ */
function CTA(){
  useAnim();
  return(
    <>
<section style={{background:"linear-gradient(135deg, var(--color-primary) 0%, #1a3d52 100%)",padding:"60px 0 80px",position:"relative",overflow:"hidden"}}>
        <div className="dot-grid" style={{top:20,right:40,opacity:.15}}/>
        <div style={{...S.container,textAlign:"center",maxWidth:700}}>
          <h2 className="anim" style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:"clamp(28px,4vw,38px)",color:"#fff",lineHeight:1.25,marginBottom:18}}>Ready to Get Found Online?</h2>
          <p className="anim d1" style={{fontFamily:"var(--font-body)",fontSize:17,color:"rgba(255,255,255,0.75)",lineHeight:1.7,maxWidth:560,margin:"0 auto 32px"}}>
            Schedule a free consultation and we'll show you exactly where you stand in search results and what it would take to start showing up.
          </p>
          <div className="anim d2" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",alignItems:"center"}}>
            <Link to="/contact" style={S.btnP}
              onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
              Schedule a Consultation
            </Link>
            <span style={{fontFamily:"var(--font-body)",fontSize:15,color:"rgba(255,255,255,0.6)",display:"inline-flex",alignItems:"center",gap:8}}>
              <span style={{color:"var(--color-accent)"}}>{icons.phone}</span> Or call{" "}
              <a href="tel:+17406725069" style={{color:"var(--color-accent)",textDecoration:"none"}}>(740) 672-5069</a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   
   Old structure (11 sections):
     Hero → Local SEO → On-Page SEO → Technical SEO → Content Strategy →
     Ongoing Mgmt → Approach → Results → Pricing → FAQ → CTA
   
   New structure (6 sections):
     Hero → What We Do → Pricing → Social Proof → FAQ → CTA
   
   Removed:
     • 4 separate SEO sub-type sections → consolidated into "What We Do"
     • Ongoing Management → folded into "What We Do" item #5
     • Our Approach / Philosophy → best line folded into Hero
     • Results → removed (was marked as placeholder data; add back ONLY
       when real, named client metrics are available)
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SEOPage() {
  return (
    <Layout activeNav="Services">
      <SEOHead
        title="SEO Services in Southern Ohio, Kentucky & West Virginia | AMM"
        description="Get found when people search for what you offer. Local SEO, website optimization, content, and monthly reporting for Southern Ohio businesses, in plain English."
        canonical="https://www.appmktmedia.com/services/seo"
        ogImage="/images/team-photo.jpeg"
      />
      <StructuredData schema={[
        {
          "@context": "https://schema.org", "@type": "Service",
          "name": "Search Engine Optimization (SEO)",
          "description": "Local SEO, website optimization, content, and monthly reporting for Southern Ohio businesses.",
          "provider": { "@type": "LocalBusiness", "name": "Appalachian Marketing & Media", "url": "https://www.appmktmedia.com" },
          "areaServed": ["Southern Ohio", "Eastern Kentucky", "West Virginia"], "url": "https://www.appmktmedia.com/services/seo",
          "serviceType": "SEO"
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.appmktmedia.com/services" },
            { "@type": "ListItem", "position": 3, "name": "SEO", "item": "https://www.appmktmedia.com/services/seo" }
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How long does SEO take to work?","acceptedAnswer":{"@type":"Answer","text":"It depends on where you're starting, how competitive your market is, and what work needs done. Generally, expect meaningful progress in 3–6 months. We'll set honest expectations up front."}},{"@type":"Question","name":"What's the difference between local and regular SEO?","acceptedAnswer":{"@type":"Answer","text":"Local SEO focuses on showing up in searches within a specific area, Google Maps, \"near me\" searches. Organic SEO targets broader terms across search engines. Most of our clients benefit from both, and all of our plans include elements of each."}},{"@type":"Question","name":"Can you guarantee first-page rankings?","acceptedAnswer":{"@type":"Answer","text":"No, and be cautious of anyone who does. Google considers hundreds of factors. What we guarantee is that we'll do the work right, track results honestly, and adjust strategy as we go."}},{"@type":"Question","name":"How do you report on SEO progress?","acceptedAnswer":{"@type":"Answer","text":"Monthly reports covering your rankings, website traffic, and the metrics that actually matter, in plain English. No confusing dashboards or jargon-filled PDFs. We walk through everything with you on a call."}},{"@type":"Question","name":"Do I need a new website before starting SEO?","acceptedAnswer":{"@type":"Answer","text":"Not necessarily. If your current site is reasonably modern and mobile-friendly, we can work with it. If it's outdated or built on a platform that limits what we can do, we'll let you know, and we can help with that too."}}]}]} />

      {/* 1. Hero */}
      <Hero />

      {/* 2. What We Do (consolidated) */}
      <WhatWeDo />
{/* 3. Pricing, rewritten with plain-English features */}
      <ServicePricing
        heading="SEO Pricing"
        description="Choose the plan that matches where you are right now. Every plan includes monthly reporting in plain English and a dedicated point of contact."
        tiers={[
          {
            name: "Local Visibility",
            price: "$399",
            unit: "/month",
            tagline: "Ideal if you serve a specific area and want to show up when locals search for you.",
            features: [
              "We set up and optimize your Google Business Profile",
              "Weekly updates to your Google profile to keep it active",
              "We help you get more customer reviews consistently",
              "We make sure your business info is correct everywhere online",
              "Monthly report showing how you're ranking locally",
            ],
            highlight: false,
          },
          {
            name: "Foundation",
            price: "$699",
            unit: "/month",
            tagline: "A solid starting point for businesses getting serious about showing up in search results.",
            features: [
              "We research the exact words your customers type into Google",
              "Up to 20 pages on your site optimized for search engines",
              "One blog post per month on a topic your customers are searching for",
              "We target 2 cities or areas you serve so you show up in each",
              "Google Business Profile set up and monitored",
              "Monthly plain-English report with a strategy call",
            ],
            highlight: false,
          },
          {
            name: "Growth",
            price: "$1,299",
            unit: "/month",
            tagline: "Our most popular plan. More content, more areas, and active review building.",
            features: [
              "Everything in Foundation, plus:",
              "Up to 30 pages optimized across your site",
              "Two blog posts per month driving traffic to your site",
              "We target 4 cities or areas for broader local visibility",
              "Active review-building strategy to strengthen your reputation",
              "Monthly strategy call to review results and plan next steps",
            ],
            highlight: true,
            badge: "Most Popular",
          },
          {
            name: "Aggressive",
            price: "$1,999",
            unit: "/month",
            tagline: "Maximum output for competitive markets where you need to outpace rivals.",
            features: [
              "Everything in Growth, plus:",
              "30+ pages optimized for maximum search coverage",
              "Four blog posts per month, serious content momentum",
              "We target 8 cities or areas for broad regional visibility",
              "We list your business in industry directories to build authority",
              "Designed for markets where competition is fierce",
            ],
            highlight: false,
          },
        ]}
        footnote="Save 5% when you purchase 6 months up front. Save 10% when you purchase 12 months up front. No contracts. Cancel anytime."
      />

      {/* 4. Social Proof, stats, case study, testimonials */}
      <SocialProof />
{/* 5. FAQ */}
      <FAQ />

      {/* 6. CTA */}
      <RelatedServices current="seo" />
      <CTA />
    </Layout>
  );
}

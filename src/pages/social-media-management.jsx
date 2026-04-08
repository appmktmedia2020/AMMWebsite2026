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

// ─── Page-specific constants ─────────────────────────────────────────────

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
  phone:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  // Platform icons (larger)
  fbLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:32,height:32}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  igLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:32,height:32}}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  liLarge:<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" style={{width:32,height:32}}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  // Service icons
  image:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  mic:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  barChart:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  refresh:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  users:<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:36,height:36}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

/* ─── Animated Social Feed Mockup ───────────────────────────────────── */
function SocialFeedMockup() {
  const posts = [
    {
      type: "photo",
      img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80",
      caption: "Big news, we just expanded our service area to include Gallia County! 📍 Same team, same quality, now serving even more of Southern Ohio. Give us a call to get on the schedule.",
      time: "Just now",
      likes: 47,
      comments: ["Love this!", "Congrats! 🎉", "Calling you tomorrow!"],
      shares: 12,
    },
    {
      type: "promo",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80",
      caption: "Spring is here and so is our seasonal special ☀️ Book any service this month and get 10% off. Limited spots available, don't wait!",
      time: "2 hours ago",
      likes: 83,
      comments: ["Need this!", "Booking now 👍", "Shared with my neighbor"],
      shares: 29,
    },
    {
      type: "tip",
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80",
      caption: "Pro tip from our team: the best time to address small problems is before they become big ones. Regular maintenance saves you money and headaches down the road. 💡",
      time: "Yesterday",
      likes: 61,
      comments: ["So true!", "Great advice", "This is why we call you guys ❤️"],
      shares: 18,
    },
  ];

  const [postIdx, setPostIdx] = useState(0);
  const [phase, setPhase] = useState("entering"); // entering | liking | commenting | done
  const [likeCount, setLikeCount] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [visibleComments, setVisibleComments] = useState([]);
  const [postVisible, setPostVisible] = useState(false);

  const post = posts[postIdx];
  const isLast = postIdx === posts.length - 1;

  useEffect(() => {
    let t;
    if (phase === "entering") {
      t = setTimeout(() => setPostVisible(true), 100);
      t = setTimeout(() => setPhase("liking"), 900);
    } else if (phase === "liking") {
      if (likeCount < post.likes) {
        t = setTimeout(() => {
          setLikeCount(n => n + Math.ceil((post.likes - n) * 0.25 + 1));
          if (!likeAnim) setLikeAnim(true);
        }, 40);
      } else {
        setLikeCount(post.likes);
        t = setTimeout(() => setPhase("commenting"), 400);
      }
    } else if (phase === "commenting") {
      if (visibleComments.length < post.comments.length) {
        t = setTimeout(() => setVisibleComments(p => [...p, p.length]), 600);
      } else if (!isLast) {
        t = setTimeout(() => {
          setPostVisible(false);
          t = setTimeout(() => {
            setPostIdx(i => i + 1);
            setPhase("entering");
            setLikeCount(0);
            setLikeAnim(false);
            setVisibleComments([]);
            setPostVisible(false);
          }, 400);
        }, 2400);
      } else {
        setPhase("done");
      }
    }
    return () => clearTimeout(t);
  }, [phase, likeCount, visibleComments, postIdx]);

  // Reset postVisible when postIdx changes
  useEffect(() => { setPostVisible(false); }, [postIdx]);

  return (
    <div style={{
      width: "100%", maxWidth: 340,
      background: "#1c1e21",
      borderRadius: 24,
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Facebook-style top bar */}
      <div style={{
        background: "#242526",
        padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* fb logo */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#1877F2",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>f</div>
          <span style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:700}}>Your Business</span>
        </div>
        <div style={{display:"flex",gap:12}}>
          {["🔔","👤"].map((e,i)=>(
            <span key={i} style={{fontSize:16,opacity:0.5}}>{e}</span>
          ))}
        </div>
      </div>

      {/* Feed area */}
      <div style={{
        padding: "12px 0",
        maxHeight: 520,
        overflowY: "hidden",
      }}>
        {/* Post card */}
        <div style={{
          opacity: postVisible ? 1 : 0,
          transform: postVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          {/* Post header */}
          <div style={{padding:"0 14px 10px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{
              width:38,height:38,borderRadius:"50%",
              background:"linear-gradient(135deg,var(--color-accent),var(--color-primary))",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:700,color:"#fff",flexShrink:0,
            }}>YB</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e4e6eb"}}>Your Business</div>
              <div style={{fontSize:11,color:"#b0b3b8"}}>{post.time} · 🌐</div>
            </div>
            <div style={{marginLeft:"auto",fontSize:18,color:"#b0b3b8",opacity:0.6}}>···</div>
          </div>

          {/* Caption */}
          <div style={{padding:"0 14px 10px",fontSize:13,color:"#e4e6eb",lineHeight:1.5}}>
            {post.caption}
          </div>

          {/* Image */}
          <div style={{width:"100%",aspectRatio:"16/9",overflow:"hidden",position:"relative"}}>
            <img
              src={post.img}
              alt="Post image"
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
            />
          </div>

          {/* Reaction bar */}
          <div style={{
            padding:"8px 14px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{
                fontSize:16,
                display:"inline-block",
                transform: likeAnim ? "scale(1.4)" : "scale(1)",
                transition:"transform 0.2s cubic-bezier(.34,1.56,.64,1)",
              }}>❤️</span>
              <span style={{fontSize:12,color:"#b0b3b8",minWidth:24,transition:"all 0.1s"}}>{likeCount}</span>
            </div>
            <div style={{fontSize:11,color:"#b0b3b8"}}>
              {post.comments.length} comments · {post.shares} shares
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display:"flex", padding:"2px 8px",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
          }}>
            {[
              {icon:"👍", label:"Like", active: likeAnim},
              {icon:"💬", label:"Comment"},
              {icon:"↗️", label:"Share"},
            ].map((btn,i)=>(
              <div key={i} style={{
                flex:1,padding:"8px 4px",
                display:"flex",alignItems:"center",justifyContent:"center",gap:5,
                borderRadius:6,
                color: btn.active ? "#1877F2" : "#b0b3b8",
                fontSize:12,fontWeight: btn.active ? 700 : 400,
                cursor:"default",
              }}>
                <span style={{fontSize:14}}>{btn.icon}</span>
                {btn.label}
              </div>
            ))}
          </div>

          {/* Comments */}
          <div style={{padding:"8px 14px",display:"flex",flexDirection:"column",gap:6}}>
            {post.comments.map((c,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"flex-start",gap:8,
                opacity: visibleComments.includes(i) ? 1 : 0,
                transform: visibleComments.includes(i) ? "translateX(0)" : "translateX(-8px)",
                transition:"opacity 0.3s ease, transform 0.3s ease",
              }}>
                <div style={{
                  width:26,height:26,borderRadius:"50%",flexShrink:0,
                  background:`hsl(${i*80+200},60%,50%)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:10,fontWeight:700,color:"#fff",
                }}>
                  {["S","M","J"][i]}
                </div>
                <div style={{
                  background:"#3a3b3c",
                  borderRadius:16,padding:"6px 12px",
                  fontSize:12,color:"#e4e6eb",lineHeight:1.4,
                  maxWidth:"80%",
                }}>
                  <span style={{fontWeight:700,display:"block",fontSize:11,color:"#b0b3b8",marginBottom:1}}>
                    {["Sarah M.","Mike T.","Jennifer L."][i]}
                  </span>
                  {c}
                </div>
              </div>
            ))}
          </div>

          {/* Post counter dots */}
          <div style={{display:"flex",justifyContent:"center",gap:5,padding:"8px 0 12px"}}>
            {posts.map((_,i)=>(
              <div key={i} style={{
                width: i===postIdx ? 16 : 6,
                height:6,borderRadius:3,
                background: i===postIdx ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                transition:"all .3s ease",
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1, HERO
   ═══════════════════════════════════════════════════════════════════════════ */
function HeroBanner(){
  return(
    <section style={{background:"linear-gradient(135deg, #25516A 0%, #1a3d52 60%, #1B6FAD 100%)",paddingTop:75,position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:90,right:60,width:160,height:160}}/>
      <div style={{position:"absolute",top:0,right:"28%",width:2,height:"140%",background:"linear-gradient(to bottom, transparent, rgba(205,155,66,0.12), transparent)",transform:"rotate(14deg)",transformOrigin:"top center"}}/>
      <div style={{...S.container,padding:"80px 20px 50px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 500px"}}>
          <p style={{...S.overline,animation:"fadeIn .6s ease forwards"}}>Social Media Management</p>
          <h1 style={{fontFamily:"var(--font-heading)",fontWeight:800,color:"#fff",fontSize:"clamp(34px,5vw,52px)",lineHeight:1.12,letterSpacing:"-0.5px",marginBottom:20,animation:"fadeInUp .8s ease forwards"}}>
            Social Media That Actually{" "}<span style={{fontStyle:"italic",color:"var(--color-accent)"}}>Represents Your Business.</span>
          </h1>
          <p style={{fontFamily:"var(--font-body)",fontSize:18,color:"rgba(255,255,255,0.8)",lineHeight:1.7,maxWidth:520,marginBottom:14,animation:"fadeInUp .8s ease .15s forwards",opacity:0}}>
            Consistency builds trust. Trust builds business. We create branded, strategic social media content that keeps you visible and professional, without you having to think about what to post next.
          </p>
          <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.6)",lineHeight:1.7,maxWidth:500,marginBottom:30,animation:"fadeInUp .8s ease .2s forwards",opacity:0}}>
            We take time to learn your voice before we post anything. Every post has a purpose, we'd rather put out three great posts a week than seven mediocre ones.
          </p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",animation:"fadeInUp .8s ease .3s forwards",opacity:0}}>
            <Link to="/contact" style={S.btnP}
              onMouseEnter={e=>e.currentTarget.style.background="var(--color-accent-dark)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--color-accent)"}>
              Schedule a Free Consultation
            </Link>
          </div>
        </div>

        {/* Animated social feed mockup */}
        <div style={{flex:"1 1 320px",display:"flex",justifyContent:"center",animation:"fadeInUp .9s ease .2s forwards",opacity:0}}>
          <SocialFeedMockup />
        </div>
      </div>
</section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2, WHAT WE DO
   Merges old: Content Creation + Platform Management + Reporting & Strategy
   into one outcome-based section, same pattern as the SEO page.
   ═══════════════════════════════════════════════════════════════════════════ */
function WhatWeDo(){
  useAnim();

  const items = [
    {icon:I.image,title:"We create original content for your business.",desc:"Custom graphics, captions written in your voice, and a smart mix of educational, promotional, and community content. No recycled templates and no stock graphics that could belong to anyone. When people see your social media, it looks and feels like you.",img:"https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"},
    {icon:I.users,title:"We manage the platforms where your customers actually are.",desc:"For most local businesses that means Facebook. If your brand is visual, we add Instagram. If you work with other businesses, LinkedIn. We don't try to be everywhere at once, we focus where it matters and do it well.",img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80"},
    {icon:I.mic,title:"We write in your voice, not ours.",desc:"We spend time understanding your tone, your audience, and what matters to your customers. Posts sound like they're coming from you, because your customers should never feel like they're talking to a marketing agency.",img:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=700&q=80"},
    {icon:I.barChart,title:"We track what's working and adjust.",desc:"Quarterly performance reviews, engagement tracking, and content analysis, all in plain English. We look at which posts performed, which didn't, and adjust the strategy based on real data, not guesswork.",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"},
    {icon:I.refresh,title:"We stay in touch and keep improving.",desc:"Regular check-ins about direction, content ideas, and anything you want to adjust. Social media isn't set-it-and-forget-it, we keep refining based on what we learn about your audience.",img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80"},
  ];

  return(
    <section style={{...S.pad,background:"#fff",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{bottom:20,left:30,opacity:.18}}/>
      <div style={S.container}>
        <div style={{maxWidth:680,marginBottom:50}}>
          <p className="anim" style={S.overline}>What We Do</p>
          <h2 className="anim d1" style={S.h2}>What Social Media Management Looks Like When We Handle It</h2>
          <p className="anim d2" style={S.body}>
            You run your business. We run your social media. Here's what that actually means:
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
          {items.map((item,i)=>(
            <div key={i} className={`anim d${Math.min(i+1,5)}`} style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 4px 24px rgba(37,81,106,0.09)",transition:"all .35s ease"}}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px)";
                e.currentTarget.style.boxShadow="0 12px 40px rgba(37,81,106,0.16)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1.06)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 4px 24px rgba(37,81,106,0.09)";
                const img=e.currentTarget.querySelector(".card-img");
                if(img) img.style.transform="scale(1)";
              }}>
              <div style={{height:200,overflow:"hidden",position:"relative"}}>
                <img className="card-img" src={item.img} alt={item.title} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .4s ease"}}/>
              </div>
              <div style={{padding:"22px 24px"}}>
                <h3 style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,color:"var(--color-dark)",marginBottom:8,lineHeight:1.3}}>{item.title}</h3>
                <p style={{...S.body,fontSize:15,lineHeight:1.65}}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Platforms we manage, compact inline with hover glow */}
        <div className="anim d5" style={{marginTop:40,padding:"28px 32px",background:"var(--color-light-bg)",borderRadius:16,display:"flex",gap:32,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
          {[
            {icon:I.fbLarge,name:"Facebook",color:"#1877F2"},
            {icon:I.igLarge,name:"Instagram",color:"#E4405F"},
            {icon:I.liLarge,name:"LinkedIn",color:"#0A66C2"},
          ].map((p,i)=>(
            <div key={i}
              style={{display:"flex",alignItems:"center",gap:10,color:p.color,padding:"10px 18px",borderRadius:12,transition:"all .25s ease",cursor:"default"}}
              onMouseEnter={e=>{
                e.currentTarget.style.background=`${p.color}14`;
                e.currentTarget.style.boxShadow=`0 0 0 1px ${p.color}44, 0 4px 16px ${p.color}22`;
                e.currentTarget.style.transform="translateY(-2px)";
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background="transparent";
                e.currentTarget.style.boxShadow="none";
                e.currentTarget.style.transform="translateY(0)";
              }}>
              {p.icon}
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16,color:"var(--color-dark)"}}>{p.name}</span>
            </div>
          ))}
          <span style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--color-body)",fontStyle:"italic"}}>
            We recommend the platforms that make sense for your business.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3, WHAT WE DON'T DO  (kept, this is one of the strongest
   sections on the entire site. Builds trust through honesty.)
   ═══════════════════════════════════════════════════════════════════════════ */
function WeDont(){
  useAnim();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items=[
    { text: "We don't promise viral content or overnight followers. Social media growth takes time and consistency.", icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
    { text: "We don't use fake engagement or bot followers. Every like, every follow, every comment should be from a real person.", icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
    { text: "We don't post generic content. If a post could belong to any business in any city, it's not good enough.", icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
    { text: "We don't ignore your input. This is your business. If you have ideas, preferences, or feedback, we want to hear it.", icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  ];
  return(
    <section style={{padding:"60px 0",background:"var(--color-light-bg)"}} ref={sectionRef}>
      <div style={{...S.container,maxWidth:800}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <p className="anim" style={S.overline}>Full Transparency</p>
          <h2 className="anim d1" style={S.h2}>What We Don't Do</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {items.map((it,i)=>(
            <div key={i} style={{
              display:"flex",gap:16,alignItems:"flex-start",
              background:"#fff",borderRadius:14,padding:"20px 24px",
              border:"1px solid rgba(37,81,106,0.06)",
              borderLeft: "4px solid var(--color-primary)",
              boxShadow:"0 2px 12px rgba(37,81,106,0.05)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transition: `opacity 0.5s ease ${i*120}ms, transform 0.5s cubic-bezier(.34,1.2,.64,1) ${i*120}ms`,
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderLeftColor="var(--color-accent)";
              e.currentTarget.style.boxShadow="0 6px 24px rgba(37,81,106,0.1)";
              e.currentTarget.style.transform="translateX(4px)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderLeftColor="var(--color-primary)";
              e.currentTarget.style.boxShadow="0 2px 12px rgba(37,81,106,0.05)";
              e.currentTarget.style.transform="translateX(0)";
            }}>
              <div style={{
                width:36,height:36,borderRadius:10,flexShrink:0,
                background:"rgba(37,81,106,0.06)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"var(--color-primary)",
              }}>{it.icon}</div>
              <p style={{...S.body,fontSize:15,marginTop:6}}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4, PRICING  (rewritten with plain-English features)
   ═══════════════════════════════════════════════════════════════════════════ */
/* (Rendered inline in the page export below via <ServicePricing /> props) */

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5, SOCIAL PROOF  (between Pricing and FAQ)
   Mix of: stats bar, mini case study, and client testimonials.
   
   ⚠️  FILL-IN FRAMEWORK, Every piece of content below is marked with
   TODO comments. Replace each one with real client data before launch.
   ═══════════════════════════════════════════════════════════════════════════ */
function SocialProof(){
  useAnim();
  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cViews    = useCountUp(2289717, 2000, statsStarted);
  const cInteract = useCountUp(14251,   1600, statsStarted);
  const cFollows  = useCountUp(9150,    1400, statsStarted);
  const cVisits   = useCountUp(401252,  1800, statsStarted);

  /* ── Testimonials — real quotes from clients across the site ── */
  const testimonials = [
    {
      quote: "Having them manage our social media has been a huge relief for our small in-house team and a breath of fresh air! I'm excited to continue working with AMM and expand into other areas of the Chamber's business. It was important for us to partner with a small business, and we love that community is such a big part of who they are. Highly recommend!",
      name: "Jared B.",
      business: "Burnside Brankamp Law",
      location: "Portsmouth, Ohio",
    },
    {
      quote: "Appalachian Marketing and Media has been incredible to work with! They've provided amazing support for the Chamber and our new coworking space, making everything easy and quick from start to finish. Their meetings are well-structured, and the team took what I had envisioned and brought it to life perfectly. They've created beautiful physical marketing materials, fresh new logos, and engaging social media content that truly represents us.",
      name: "Bobby",
      business: "Hocking Hills Chamber of Commerce",
      location: "Logan, Ohio",
    },
    {
      quote: "Exceptional service from our advertising team! Their creativity and dedication have transformed our campaigns, resulting in increased engagement and brand visibility. Each member brings unique skills and insights, contributing to our success. Highly recommend their expertise to anyone looking for impactful advertising solutions!",
      name: "Brandy & Charlie",
      business: "Advanced Building Restorations",
      location: "Southeast Ohio",
    },
  ];

  return(
    <section style={{...S.pad,background:"var(--color-light-bg)",position:"relative",overflow:"hidden"}}>
      <div className="dot-grid" style={{top:30,right:40,opacity:.15}}/>
      <div style={S.container}>

        {/* ── Section header ── */}
        <div style={{textAlign:"center",maxWidth:640,margin:"0 auto 40px"}}>
          <p className="anim" style={S.overline}>Client Results</p>
          <h2 className="anim d1" style={S.h2}>Real Results From a Single Client Account</h2>
          <p className="anim d2" style={S.body}>These numbers are from one client's social media account that we manage — not combined, not estimated. This is what consistent, professional social media management looks like.</p>
        </div>

        {/* ── Single unified results block ── */}
        <div ref={statsRef} className="anim d2" style={{
          background:"linear-gradient(135deg, var(--color-primary), #1a3d52)",
          borderRadius:20,padding:"44px 40px",marginBottom:40,position:"relative",overflow:"hidden",
        }}>
          <div className="dot-grid" style={{bottom:-10,right:-10,opacity:.1}}/>
          <div style={{position:"relative",zIndex:1}}>

            {/* Top: 4 stat cards */}
            <div className="smm-stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16,marginBottom:32}}>
              {[
                { display: statsStarted ? cViews.toLocaleString() : "2,289,717",    label: "Content Views" },
                { display: statsStarted ? cInteract.toLocaleString() : "14,251",     label: "Interactions" },
                { display: statsStarted ? cFollows.toLocaleString() : "9,150",       label: "Followers Built" },
                { display: statsStarted ? cVisits.toLocaleString() : "401,252",      label: "Profile Visits" },
              ].map((st,i)=>(
                <div key={i} style={{
                  textAlign:"center",padding:"22px 16px",
                  background:"rgba(255,255,255,0.06)",borderRadius:14,
                  border:"1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,3vw,36px)",color:"#fff",lineHeight:1}}>{st.display}</div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:11,color:"var(--color-accent)",letterSpacing:"1px",textTransform:"uppercase",marginTop:8}}>{st.label}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{height:1,background:"rgba(255,255,255,0.1)",marginBottom:28}}/>

            {/* Bottom: YoY growth context + 4 percentage cards */}
            <div style={{display:"flex",gap:36,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:"1 1 340px"}}>
                <p style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,letterSpacing:"2px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:10}}>Year-Over-Year Growth</p>
                <p style={{fontFamily:"var(--font-body)",fontSize:16,color:"rgba(255,255,255,0.85)",lineHeight:1.7,marginBottom:6}}>
                  Comparing last year's full-year totals to just this quarter — the growth is already outpacing the previous 12 months.
                </p>
                <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.45)"}}>
                  2024–2025 full year vs. 2025–2026 current quarter
                </p>
              </div>
              <div style={{flex:"1 1 260px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  { metric: "90%", label: "more views" },
                  { metric: "63%", label: "more interactions" },
                  { metric: "56%", label: "more visits" },
                  { metric: "2×",  label: "follower growth" },
                ].map((r,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 18px",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:28,color:"var(--color-accent)",lineHeight:1}}>{r.metric}</div>
                    <div style={{fontFamily:"var(--font-body)",fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <style>{`@media(max-width:768px){.smm-stats-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>

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
                  {t.name.charAt(0)}
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
   SECTION 6, FAQ  (kept, clear and honest answers)
   ═══════════════════════════════════════════════════════════════════════════ */
function FAQ(){
  useAnim();
  const[open,setOpen]=useState(null);
  const faqs=[
    {q:"How many posts per week do you create?",a:"It depends on the plan, our standard is three posts per week, which is enough to stay consistent and visible. Higher-tier plans go up to seven. We'll figure out the right cadence during the consultation."},
    {q:"Can I approve posts before they go live?",a:"Absolutely. If you want to review and approve content before it's posted, we'll build that into the workflow. Some clients prefer to be hands-on, others trust us to run with it. Either way works."},
    {q:"Do you handle negative comments?",a:"No. It is nearly impossible to represent you as well as you would. We prefer to leave your customer management to the professionals, you."},
    {q:"Which platforms should my business be on?",a:"It depends on your audience and industry. For most local businesses, Facebook is a must. Instagram is great for visual brands. LinkedIn makes sense for B2B companies. We'll recommend what actually makes sense during our consultation."},
    {q:"Do you manage paid advertising too?",a:"We do, but that's a separate service. Social media management covers organic content, the regular posts your audience sees in their feed. Paid advertising is a different strategy with its own budget. Check out our Social Media Advertising page for more."},
    {q:"What if I don't have any good photos to share?",a:"That's fine. We create original graphics for every post. If you have photos from events or your day-to-day business, great, send them over and we'll turn them into polished content. If not, we'll work with what we have and it'll still look professional."},
  ];
  return(
    <section style={{...S.pad,background:"#fff"}}>
      <div style={{...S.container,maxWidth:780}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <p className="anim" style={S.overline}>FAQ</p>
          <h2 className="anim d1" style={S.h2}>Common Questions about Social Media Management</h2>
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

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
   
   Structure (7 sections):
     Hero → What We Do → What We Don't Do → Pricing → Social Proof → FAQ → CTA
   
   Social Proof section populated with:
     • Real stats from Q1 2025-2026 social media analytics
     • Year-over-year growth comparisons (vs 2024-2025)
     • Client testimonials from Jared B., Bobby, and Brandy & Charlie
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SocialMediaManagement() {
  return (
    <Layout activeNav="Services">
      <SEOHead
        title="Social Media Management for Ohio, KY & WV Businesses | AMM"
        description="Professional social media management for Southern Ohio businesses, original content, consistent posting, and real strategy. No templates, no bots, no guesswork."
        canonical="https://www.appmktmedia.com/services/social-media-management"
        ogImage="/images/social-media-page-hero-section.jpeg"
      />
      <StructuredData schema={[
        {
          "@context": "https://schema.org", "@type": "Service",
          "name": "Social Media Management",
          "description": "Professional social media management, original content, consistent posting, and real strategy. No templates, no bots.",
          "provider": { "@type": "LocalBusiness", "name": "Appalachian Marketing & Media", "url": "https://www.appmktmedia.com" },
          "areaServed": ["Southern Ohio", "Eastern Kentucky", "West Virginia"], "url": "https://www.appmktmedia.com/services/social-media-management",
          "serviceType": "Social Media Marketing"
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.appmktmedia.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.appmktmedia.com/services" },
            { "@type": "ListItem", "position": 3, "name": "Social Media Management", "item": "https://www.appmktmedia.com/services/social-media-management" }
          ]
        }
      ,{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many posts per week do you create?","acceptedAnswer":{"@type":"Answer","text":"It depends on the plan, our standard is three posts per week, which is enough to stay consistent and visible. Higher-tier plans go up to seven. We'll figure out the right cadence during the consultation."}},{"@type":"Question","name":"Can I approve posts before they go live?","acceptedAnswer":{"@type":"Answer","text":"Absolutely. If you want to review and approve content before it's posted, we'll build that into the workflow. Some clients prefer to be hands-on, others trust us to run with it. Either way works."}},{"@type":"Question","name":"Do you handle negative comments?","acceptedAnswer":{"@type":"Answer","text":"No. It is nearly impossible to represent you as well as you would. We prefer to leave your customer management to the professionals, you."}},{"@type":"Question","name":"Which platforms should my business be on?","acceptedAnswer":{"@type":"Answer","text":"It depends on your audience and industry. For most local businesses, Facebook is a must. Instagram is great for visual brands. LinkedIn makes sense for B2B companies. We'll recommend what actually makes sense during our consultation."}},{"@type":"Question","name":"Do you manage paid advertising too?","acceptedAnswer":{"@type":"Answer","text":"We do, but that's a separate service. Social media management covers organic content, the regular posts your audience sees in their feed. Paid advertising is a different strategy with its own budget. Check out our Social Media Advertising page for more."}},{"@type":"Question","name":"What if I don't have any good photos to share?","acceptedAnswer":{"@type":"Answer","text":"That's fine. We create original graphics for every post. If you have photos from events or your day-to-day business, great, send them over and we'll turn them into polished content. If not, we'll work with what we have and it'll still look professional."}}]}]} />

      {/* 1. Hero */}
      <HeroBanner />

      {/* 2. What We Do (consolidated) */}
      <WhatWeDo />
{/* 3. What We Don't Do (kept, builds trust) */}
      <WeDont />

      {/* 4. Pricing, rewritten with plain-English features */}
      <ServicePricing
        heading="Social Media Pricing"
        description="Choose the plan that fits how much content and coverage you need. Every plan includes original content, a personalized strategy, and regular check-ins."
        tiers={[
          {
            name: "Starter",
            price: "$500",
            unit: "/month",
            tagline: "For businesses that need a consistent presence on one platform.",
            features: [
              "3 original posts per week, designed for your brand",
              "1 social media account managed (your choice of platform)",
              "Personalized content strategy tailored to your business",
              "Captions written in your voice, not marketing-speak",
              "Regular check-ins to keep content on track",
            ],
            highlight: false,
          },
          {
            name: "Standard",
            price: "$1,000",
            unit: "/month",
            tagline: "Multi-platform management with more content and extras included.",
            features: [
              "5 original posts per week across your platforms",
              "2 social media accounts managed",
              "Personalized content strategy tailored to your business",
              "1 custom graphic design asset included each month",
              "1 sales funnel page designed to convert followers into leads",
              "Quarterly report showing what's working and what we're adjusting",
            ],
            highlight: true,
            badge: "Most Popular",
          },
          {
            name: "Full Service",
            price: "$1,500",
            unit: "/month",
            tagline: "Maximum content and coverage across all your platforms.",
            features: [
              "7 original posts per week, daily content, every day",
              "3 social media accounts managed",
              "Personalized content strategy tailored to your business",
              "2 custom graphic design assets included each month",
              "2 sales funnel pages designed to convert followers into leads",
              "Quarterly report showing what's working and what we're adjusting",
            ],
            highlight: false,
          },
        ]}
        footnote="Save 5% when you purchase 6 months up front. Save 10% when you purchase 12 months up front. No contracts. Cancel anytime."
      />

      {/* 5. Social Proof */}
      <SocialProof />
{/* 6. FAQ */}
      <FAQ />

      {/* 7. CTA */}
      <RelatedServices current="social-media-management" />
      <CTASection heading="Ready to Show Up on Social Media the Right Way?" body="Let's talk about what consistent, professional social media management could look like for your business. No pressure, just a conversation." />
    </Layout>
  );
}

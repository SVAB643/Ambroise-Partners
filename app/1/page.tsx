'use client';

import React, { useEffect, useRef, useState, type FormEvent } from 'react';

/* ─── Mini graph canvas for deal cards ─── */
function GraphCanvas({ type }: { type: 'bar' | 'line' | 'scatter' | 'donut' | 'area' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0, W = 0, H = 0, t = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    const B = 'rgba(15,47,255,';
    const px = 28, py = 20;

    const draw = () => {
      ctx.clearRect(0,0,W,H); t += 0.016;
      const iW = W-px*2, iH = H-py*2;

      if (type === 'area' || type === 'line') {
        const N=50, pts=Array.from({length:N},(_,i)=>{
          const f=i/(N-1);
          return 0.1+f*0.72+Math.sin(f*Math.PI*2.5+t)*0.07*(1-f*.5);
        });
        [.25,.5,.75,1].forEach(g=>{
          ctx.beginPath(); ctx.moveTo(px,py+iH*(1-g)); ctx.lineTo(px+iW,py+iH*(1-g));
          ctx.strokeStyle='rgba(15,47,255,0.05)'; ctx.lineWidth=1; ctx.stroke();
        });
        ctx.beginPath(); ctx.moveTo(px,py+iH);
        pts.forEach((v,i)=>ctx.lineTo(px+i/(N-1)*iW, py+iH*(1-v)));
        ctx.lineTo(px+iW,py+iH); ctx.closePath();
        const grd=ctx.createLinearGradient(0,py,0,py+iH);
        grd.addColorStop(0,B+'0.12)'); grd.addColorStop(1,B+'0.01)');
        ctx.fillStyle=grd; ctx.fill();
        ctx.beginPath();
        pts.forEach((v,i)=>{const x=px+i/(N-1)*iW,y=py+iH*(1-v); i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
        ctx.strokeStyle=B+'0.78)'; ctx.lineWidth=1.8; ctx.lineJoin='round'; ctx.stroke();
        ctx.beginPath(); ctx.arc(px+iW, py+iH*(1-pts[N-1]), 3.5, 0, Math.PI*2);
        ctx.fillStyle=B+'0.9)'; ctx.fill();
      }

      if (type === 'bar') {
        const N=6;
        const vals=[0.55,0.38,0.72,0.45,0.85,0.62];
        const bw=iW/N*0.52, gap=iW/N;
        vals.forEach((v,i)=>{
          const bh=iH*v, x=px+i*gap+gap*.24, y=py+iH-bh;
          const g=ctx.createLinearGradient(0,y,0,y+bh);
          g.addColorStop(0,B+'0.72)'); g.addColorStop(1,B+'0.15)');
          ctx.fillStyle=g; ctx.beginPath();
          ctx.roundRect(x,y,bw,bh,[3,3,0,0]); ctx.fill();
        });
      }

      if (type === 'scatter') {
        const pts=[[.14,.68],[.26,.42],[.40,.58],[.52,.24],[.60,.52],[.68,.35],[.78,.62],[.88,.20],[.92,.46],[.22,.28],[.44,.78],[.62,.16],[.76,.70]];
        pts.forEach(([fx,fy],i)=>{
          const x=px+fx*iW, y=py+fy*iH;
          ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2);
          ctx.fillStyle=B+(0.38+0.18*Math.sin(t*0.8+i))+')'; ctx.fill();
        });
        for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
          const dx=(pts[i][0]-pts[j][0])*iW, dy=(pts[i][1]-pts[j][1])*iH, d=Math.sqrt(dx*dx+dy*dy);
          if(d<iW*.20){ ctx.beginPath(); ctx.moveTo(px+pts[i][0]*iW,py+pts[i][1]*iH); ctx.lineTo(px+pts[j][0]*iW,py+pts[j][1]*iH); ctx.strokeStyle=B+(0.06*(1-d/(iW*.20)))+')'; ctx.lineWidth=1; ctx.stroke(); }
        }
      }

      if (type === 'donut') {
        const cx=W/2, cy=H/2, R=Math.min(iW,iH)*.38, ri=R*.58;
        const segs=[{v:.42,a:.85},{v:.28,a:.44},{v:.18,a:.20},{v:.12,a:.09}];
        let s=-Math.PI/2;
        segs.forEach(({v,a})=>{ const e=s+v*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,s,e); ctx.fillStyle=B+a+')'; ctx.fill(); s=e; });
        ctx.beginPath(); ctx.arc(cx,cy,ri,0,Math.PI*2); ctx.fillStyle='#f5f6ff'; ctx.fill();
        ctx.fillStyle=B+'0.88)'; ctx.font=`600 ${Math.round(R*.38)}px Inter,sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('42%',cx,cy);
      }

      raf=requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize',resize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  },[type]);
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}} />;
}

/* ─── Animated canvas for each approach pillar ─── */
function ApproachCanvas({ type }: { type: 'brain' | 'network' | 'curve' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    if (type === 'brain') {
      const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
      const N = 55;
      const init = () => {
        nodes.length = 0;
        for (let i = 0; i < N; i++)
          nodes.push({ x: Math.random()*W, y: Math.random()*H,
            vx:(Math.random()-.5)*.6, vy:(Math.random()-.5)*.6, r:Math.random()*2+1.2 });
      };
      const draw = () => {
        ctx.clearRect(0,0,W,H);
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy;
          if (n.x<0||n.x>W) n.vx*=-1;
          if (n.y<0||n.y>H) n.vy*=-1;
        });
        for (let i=0;i<N;i++) for (let j=i+1;j<N;j++) {
          const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if (d<110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x,nodes[i].y);
            ctx.lineTo(nodes[j].x,nodes[j].y);
            ctx.strokeStyle=`rgba(15,47,255,${0.18*(1-d/110)})`;
            ctx.lineWidth=0.8;
            ctx.stroke();
          }
        }
        nodes.forEach(n => {
          ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
          ctx.fillStyle='rgba(15,47,255,0.55)'; ctx.fill();
        });
        raf = requestAnimationFrame(draw);
      };
      resize(); init(); draw();
      window.addEventListener('resize', () => { resize(); init(); });
      return () => cancelAnimationFrame(raf);
    }

    if (type === 'network') {
      const hubs = [
        { x:.5, y:.5, r:6 },
        { x:.18, y:.28, r:3.5 }, { x:.82, y:.28, r:3.5 },
        { x:.18, y:.72, r:3.5 }, { x:.82, y:.72, r:3.5 },
        { x:.5,  y:.12, r:2.8 }, { x:.5,  y:.88, r:2.8 },
        { x:.12, y:.5,  r:2.8 }, { x:.88, y:.5,  r:2.8 },
      ];
      let t = 0;
      const draw = () => {
        ctx.clearRect(0,0,W,H);
        t += 0.018;
        const cx = hubs[0].x*W, cy = hubs[0].y*H;
        const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,W*.28);
        grad.addColorStop(0,'rgba(15,47,255,0.12)');
        grad.addColorStop(1,'rgba(15,47,255,0)');
        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy,W*.28,0,Math.PI*2); ctx.fill();
        hubs.slice(1).forEach((h,i) => {
          const hx=h.x*W, hy=h.y*H;
          ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(hx,hy);
          ctx.strokeStyle=`rgba(15,47,255,${0.18+0.08*Math.sin(t+i)})`; ctx.lineWidth=1; ctx.stroke();
          const p = (Math.sin(t*0.8+i*1.1)+1)/2;
          const px2 = cx+(hx-cx)*p, py2 = cy+(hy-cy)*p;
          ctx.beginPath(); ctx.arc(px2,py2,2,0,Math.PI*2);
          ctx.fillStyle='rgba(15,47,255,0.7)'; ctx.fill();
          ctx.beginPath(); ctx.arc(hx,hy,h.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(15,47,255,${0.45+0.15*Math.sin(t+i)})`; ctx.fill();
        });
        ctx.beginPath(); ctx.arc(cx,cy,hubs[0].r*(1+.12*Math.sin(t)),0,Math.PI*2);
        ctx.fillStyle='rgba(15,47,255,0.8)'; ctx.fill();
        raf = requestAnimationFrame(draw);
      };
      resize(); draw();
      window.addEventListener('resize', resize);
      return () => cancelAnimationFrame(raf);
    }

    if (type === 'curve') {
      let t = 0;
      const draw = () => {
        ctx.clearRect(0,0,W,H);
        t += 0.022;
        const pts = 80;
        const pad = { x: W*.1, y: H*.12 };
        const iW = W-pad.x*2, iH = H-pad.y*2;
        for (let i=0;i<=4;i++) {
          const y = pad.y + iH*(1-i/4);
          ctx.beginPath(); ctx.moveTo(pad.x,y); ctx.lineTo(pad.x+iW,y);
          ctx.strokeStyle='rgba(15,47,255,0.07)'; ctx.lineWidth=1; ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(pad.x, pad.y+iH);
        for (let i=0;i<=pts;i++) {
          const fx = i/pts;
          const fy = Math.pow(fx,1.6) + Math.sin(fx*Math.PI*2+t)*0.06*(1-fx*.5);
          const x = pad.x + fx*iW;
          const y = pad.y + iH*(1-Math.min(fy,1));
          i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.lineTo(pad.x+iW, pad.y+iH);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0,pad.y,0,pad.y+iH);
        fill.addColorStop(0,'rgba(15,47,255,0.14)');
        fill.addColorStop(1,'rgba(15,47,255,0.01)');
        ctx.fillStyle=fill; ctx.fill();
        ctx.beginPath();
        for (let i=0;i<=pts;i++) {
          const fx = i/pts;
          const fy = Math.pow(fx,1.6) + Math.sin(fx*Math.PI*2+t)*0.06*(1-fx*.5);
          const x = pad.x + fx*iW;
          const y = pad.y + iH*(1-Math.min(fy,1));
          i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.strokeStyle='rgba(15,47,255,0.75)'; ctx.lineWidth=2.2;
        ctx.lineJoin='round'; ctx.stroke();
        const lastFy = Math.pow(1,1.6)+Math.sin(Math.PI*2+t)*0.06*.5;
        const dotY = pad.y+iH*(1-Math.min(lastFy,1));
        ctx.beginPath(); ctx.arc(pad.x+iW, dotY, 4.5, 0, Math.PI*2);
        ctx.fillStyle='rgba(15,47,255,0.9)'; ctx.fill();
        raf = requestAnimationFrame(draw);
      };
      resize(); draw();
      window.addEventListener('resize', resize);
      return () => cancelAnimationFrame(raf);
    }
  }, [type]);

  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}


/* ─── Deals Carousel Section ─── */
const DEALS = [
  { id:1, category:'M&A', title:'Cross-border oncology acquisition', badges:[{dot:'green',label:'Closed · €180M'},{dot:'blue',label:'EU → US'}], graph:'area' },
  { id:2, category:'Fundraising', title:'Series B — rare disease biotech', badges:[{dot:'green',label:'Closed · €45M'},{dot:'blue',label:'Lead investor secured'}], graph:'bar', featured:true },
  { id:3, category:'Licensing', title:'Platform licensing to Big Pharma', badges:[{dot:'orange',label:'Upfront + milestones'},{dot:'blue',label:'Global rights'}], graph:'scatter' },
  { id:4, category:'M&A', title:'Medtech buy-side mandate', badges:[{dot:'green',label:'Closed · €95M'},{dot:'blue',label:'Strategic fit'}], graph:'line' },
  { id:5, category:'Strategic Advisory', title:'Portfolio repositioning', badges:[{dot:'blue',label:'3 assets'},{dot:'green',label:'Value unlocked'}], graph:'donut' },
  { id:6, category:'Fundraising', title:'Series A — diagnostics platform', badges:[{dot:'green',label:'Closed · €22M'},{dot:'blue',label:'Pan-European'}], graph:'area' },
];

const TABS = ['All','M&A','Fundraising','Licensing','Strategic Advisory'];

function DealsCarousel() {
  const [activeTab, setActiveTab] = React.useState('All');
  const [activeIdx, setActiveIdx] = React.useState(1);

  const filtered = activeTab === 'All' ? DEALS : DEALS.filter(d => d.category === activeTab);
  const total = filtered.length;

  React.useEffect(() => { setActiveIdx(Math.min(1, filtered.length-1)); }, [activeTab]);

  const prev = () => setActiveIdx(i => Math.max(0, i-1));
  const next = () => setActiveIdx(i => Math.min(total-1, i+1));

  type CardLayout = { w:string; h:string; ty:number; scale:number; opacity:number; z:number; };
  const layout: Record<number, CardLayout> = {
    [-2]: { w:'220px', h:'140px', ty:80,  scale:.82, opacity:.38, z:1 },
    [-1]: { w:'300px', h:'200px', ty:44,  scale:.91, opacity:.72, z:3 },
    [0]:  { w:'420px', h:'280px', ty:0,   scale:1,   opacity:1,   z:5 },
    [1]:  { w:'300px', h:'200px', ty:44,  scale:.91, opacity:.72, z:3 },
    [2]:  { w:'220px', h:'140px', ty:80,  scale:.82, opacity:.38, z:1 },
  };

  return (
    <section className="deals-section">
      <div className="deals-inner">
        <div className="deals-header reveal">
          <span className="eyebrow">Track record</span>
          <h2 className="section-title">Selected transactions</h2>
          <p className="section-lede">A sample of deals executed across our focus areas.</p>
        </div>

        <div className="deals-controls reveal">
          <button className="deals-nav" onClick={prev} disabled={activeIdx===0}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="deals-tab-sep"/>
          {TABS.map((tab,i) => (
            <React.Fragment key={tab}>
              <button className={`deals-tab${activeTab===tab?' active':''}`} onClick={()=>setActiveTab(tab)}>{tab}</button>
              {i < TABS.length-1 && <span style={{color:'var(--line)',fontSize:'.8rem',userSelect:'none'}}>·</span>}
            </React.Fragment>
          ))}
          <div className="deals-tab-sep"/>
          <button className="deals-nav" onClick={next} disabled={activeIdx>=total-1}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div className="deals-fan-outer">
        <div className="deals-fan-track">
          {filtered.map((deal, idx) => {
            const pos = idx - activeIdx;
            if (Math.abs(pos) > 2) return null;
            const s = layout[pos];
            const isActive = pos === 0;
            return (
              <div
                key={deal.id}
                className={`deal-card ${isActive ? 'active-card' : 'side-card'}`}
                style={{
                  width: s.w,
                  transform: `translateY(${s.ty}px) scale(${s.scale})`,
                  opacity: s.opacity,
                  zIndex: s.z,
                }}
                onClick={() => setActiveIdx(idx)}
              >
                <div className="deal-graph" style={{height: s.h}}>
                  <GraphCanvas type={deal.graph as any} />
                </div>
                <div className="deal-info">
                  <div className="deal-category">{deal.category}</div>
                  <div className="deal-title">{deal.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="deals-active-meta">
          {filtered[activeIdx]?.badges.map((b,i) => (
            <div key={i} className="deal-badge">
              <span className={`deal-dot ${b.dot}`}/>{b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main component ─── */
export default function AmbroisePartnersModern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const navRef    = useRef<HTMLDivElement>(null);

  /* ── Reveal ── */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('visible')); return; }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    nodes.forEach(n => { if (n.getBoundingClientRect().top < window.innerHeight*.92) n.classList.add('visible'); else io.observe(n); });
    const t = setTimeout(() => nodes.forEach(n => n.classList.add('visible')), 900);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  /* ── Transparent nav while hero is in view ── */
  useEffect(() => {
    const navOuter = navRef.current;
    const hero = heroRef.current;
    if (!navOuter || !hero) return;

    const onScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      navOuter.classList.toggle('nav-scrolled', heroBottom <= 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── DNA particle system — original ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d')!;
    const PARTICLE_COUNT = 40000;
    const STICKY_PX      = 1500;
    let W = 0, H = 0, scrollProgress = 0, raf = 0;

    let fadeEl: HTMLElement | null = null;

    const wrapper = document.createElement('div');
    wrapper.id = 'hero-wrapper';
    wrapper.style.cssText = `position:relative;height:calc(100vh + ${STICKY_PX}px);`;
    hero.parentNode!.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);
    hero.style.position = 'sticky';
    hero.style.top = '0';

    fadeEl = document.createElement('div');
    fadeEl.id = 'hero-fade';
    hero.appendChild(fadeEl);

    interface IParticle { update(p:number,t:number):void; draw(p:number):void; }
    let particles: IParticle[] = [];

    function buildParticles() {
      particles = [];

      const SX0 = W*0.15, SY0 = H*1.02;
      const SX1 = W*0.85, SY1 = -H*0.02;
      const dvx = SX1-SX0, dvy = SY1-SY0, spineLen = Math.sqrt(dvx*dvx+dvy*dvy);
      const tx = dvx/spineLen, ty = dvy/spineLen;
      const px = -ty, py = tx;

      const TURNS = 3.5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const frac = Math.random();
        const perspective = 0.35 + frac * 0.65;
        const AMP = W * 0.09 * perspective;

        const sx = SX0 + tx * spineLen * frac;
        const sy = SY0 + ty * spineLen * frac;

        const isA = Math.random() < 0.5;
        const strandPhase = isA ? 0 : Math.PI;
        const angle = frac * TURNS * Math.PI * 2 + strandPhase;

        const coreX = sx + px * Math.cos(angle) * AMP;
        const coreY = sy + py * Math.cos(angle) * AMP;

        const isRung = Math.random() < 0.10;
        let targetX = coreX, targetY = coreY;
        if (isRung) {
          const otherAngle = frac * TURNS * Math.PI * 2 + (isA ? Math.PI : 0);
          const otherX = sx + px * Math.cos(otherAngle) * AMP;
          const otherY = sy + py * Math.cos(otherAngle) * AMP;
          const t2 = Math.random();
          targetX = coreX + (otherX - coreX) * t2;
          targetY = coreY + (otherY - coreY) * t2;
        }

        const u1 = Math.max(Math.random(), 1e-5);
        const mag = Math.sqrt(-2.0 * Math.log(u1));
        const scatterAngle = Math.random() * Math.PI * 2;
        const sigma = Math.pow(Math.random(), 0.65) * W * 0.018 * perspective;
        const dnaX = targetX + Math.cos(scatterAngle) * mag * sigma;
        const dnaY = targetY + Math.sin(scatterAngle) * mag * sigma;

        const dist = Math.sqrt((dnaX - targetX)**2 + (dnaY - targetY)**2);
        const normDist = Math.min(dist / (W * 0.018), 1);
        const coreness = 1 - normDist;

        const isBright = Math.random() < 0.07;
        const sizeScale = 0.5 + perspective * 0.5;
        const size = isBright
          ? (Math.random() * 0.9 + 0.4) * sizeScale
          : (Math.random() * 0.35 + 0.05) * sizeScale;

        const alpha = isBright
          ? Math.random() * 0.5 + 0.38
          : Math.max(0.01, coreness * coreness * (Math.random() * 0.65 + 0.12) + Math.random() * 0.025);

        const disperseX = Math.random() * W;
        const disperseY = Math.random() * H;

        const spd = Math.random() * 0.10 + 0.025;
        const ph = Math.random() * Math.PI * 2;
        let x = dnaX, y = dnaY;

        particles.push({
          update(prog, t) {
            const eased = prog < .5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2, 2)/2;
            const baseX = dnaX + (disperseX - dnaX) * eased;
            const baseY = dnaY + (disperseY - dnaY) * eased;
            x = baseX + Math.sin(t * spd + ph) * (1.5 + eased * 2.0);
            y = baseY + Math.cos(t * spd * 0.88 + ph) * (1.2 + eased * 1.8);
          },
          draw(prog) {
            const eased = prog < .5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2, 2)/2;
            const dispAlpha = alpha * (1 - eased * 0.3);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${dispAlpha})`;
            ctx.fill();
          },
        });
      }
    }
    function resize() { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; buildParticles(); }

    function animate() {
      ctx.clearRect(0,0,W,H);
      const t=Date.now()*.001;
      for (const p of particles) { p.update(scrollProgress,t); p.draw(scrollProgress); }
      if (fadeEl) {
        const fadeOpacity = Math.min(Math.max((scrollProgress - 0.15) / 0.60, 0), 1);
        fadeEl.style.opacity = String(fadeOpacity);
      }
      raf=requestAnimationFrame(animate);
    }

    const onScroll=()=>{ scrollProgress=Math.min(Math.max(window.scrollY/STICKY_PX,0),1); };
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',resize);
    resize(); animate();

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',resize);
      if(fadeEl && fadeEl.parentNode) fadeEl.parentNode.removeChild(fadeEl);
      if(wrapper.parentNode){wrapper.parentNode.insertBefore(hero,wrapper);wrapper.parentNode.removeChild(wrapper);}
      hero.style.position=''; hero.style.top='';
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you! We will get back to you shortly.');
    e.currentTarget.reset();
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        :root {
          --white:  #ffffff;
          --ink:    #1a1a1a;
          --blue:   #0f2fff;
          --muted:  #6b6b78;
          --line:   #e8e8f0;
          --dark:   #080e26;
          --sans:   'Inter',-apple-system,sans-serif;
          --serif:  'Lora',Georgia,serif;
          --ease:   cubic-bezier(0.22,0.61,0.36,1);
        }

        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--white);color:var(--ink);overflow-x:hidden;line-height:1.65;-webkit-font-smoothing:antialiased;}
        a{color:inherit;text-decoration:none;}

        /* ── NAV ── */
        .nav-outer{position:fixed;top:0;left:0;right:0;z-index:300;pointer-events:none;}
        nav{
          pointer-events:all;width:100%;padding:0 4vw;height:64px;
          display:flex;align-items:center;justify-content:space-between;
          background:transparent;border-bottom:1px solid transparent;
          transition:background .35s var(--ease), border-color .35s var(--ease), box-shadow .35s var(--ease);
        }
        .logo-wrap{display:flex;align-items:center;gap:.7rem;}
        .logo-ap{font-family:var(--serif);font-style:italic;font-weight:500;font-size:1.55rem;letter-spacing:-.01em;color:#fff;transition:color .35s;}
        .logo-sep{width:1px;height:16px;background:rgba(255,255,255,0.25);transition:background .35s;}
        .logo-name{font-size:.95rem;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:#fff;transition:color .35s;}
        .nav-links{display:flex;gap:0;align-items:center;}
        .nav-links a{font-size:.84rem;font-weight:400;color:rgba(255,255,255,0.78);padding:.5rem 1rem;transition:color .18s;}
        .nav-links a:hover{color:#fff;}
        .nav-cta{
          margin-left:.5rem;background:#fff!important;color:var(--ink)!important;
          padding:.55rem 1.45rem!important;border-radius:999px;
          font-size:.82rem!important;font-weight:500!important;
          transition:background .22s!important,color .22s!important,box-shadow .22s!important;
        }
        .nav-cta:hover{background:var(--blue)!important;color:#fff!important;}
        .nav-scrolled nav{background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line);box-shadow:0 1px 12px rgba(0,0,0,0.06);}
        .nav-scrolled .logo-ap{color:var(--ink);}
        .nav-scrolled .logo-sep{background:var(--line);}
        .nav-scrolled .logo-name{color:var(--muted);}
        .nav-scrolled .nav-links a{color:var(--muted);}
        .nav-scrolled .nav-links a:hover{color:var(--ink);}
        .nav-scrolled .nav-cta{background:var(--ink)!important;color:#fff!important;}
        .nav-scrolled .nav-cta:hover{background:var(--blue)!important;}

        /* ── HERO ── */
        .hero{
          position:relative;min-height:100vh;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:0 5vw;color:#fff;
          /* Richer deep-navy background with subtle radial warmth for life-science feel */
          background:radial-gradient(ellipse 80% 60% at 50% 40%, #05122e 0%, #020a1e 50%, #010510 100%);
        }
        #hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
        #hero-fade{
          position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(to top,
            #ffffff 0%,
            #d0e0ff 8%,
            #6699ff 18%,
            #1a3fff 26%,
            #0a1880 42%,
            #040c30 58%,
            transparent 78%
          );
          opacity:0;
          transition:opacity 0.05s linear;
        }
        .hero-inner{
          position:relative;z-index:2;
          max-width:1100px;
          padding-top:5rem;
          padding-bottom:2.5rem;
          text-align:center;
        }
        .hero-h1{
          font-family:var(--serif);font-weight:500;
          font-size:clamp(3.2rem,5.5vw,5.2rem);
          line-height:1.04;letter-spacing:-.015em;margin-bottom:1.4rem;
          max-width:1200px;margin-left:auto;margin-right:auto;
          opacity:0;animation:fadeUp .9s .3s var(--ease) forwards;
        }
        .hero-h1 strong{
          display:block;font-family:var(--serif);font-weight:500;font-style:italic;
          font-size:clamp(3.2rem,5.5vw,5.2rem);line-height:1.08;letter-spacing:-.02em;
        }
        .hero-tags{
          display:flex;gap:.4rem;flex-wrap:wrap;justify-content:center;
          margin:1.4rem 0 1.2rem;
          opacity:0;animation:fadeUp .9s .45s var(--ease) forwards;
        }
        .hero-tags span{
          position:relative;font-size:.8rem;font-weight:400;letter-spacing:.04em;
          color:rgba(255,255,255,.78);padding:0 .2rem;
        }
        .hero-tags span:not(:last-child)::after{
          content:'';display:inline-block;width:1px;height:14px;
          background:rgba(255,255,255,.32);margin:0 .65rem;
          position:relative;top:2px;
        }
        .hero-sub{font-size:1rem;color:rgba(255,255,255,.58);max-width:42ch;margin:0 0 1.8rem;font-weight:300;line-height:1.72;opacity:0;animation:fadeUp .9s .6s var(--ease) forwards;}
        .hero-ctas{display:flex;gap:.8rem;flex-wrap:wrap;justify-content:center;opacity:0;animation:fadeUp .9s .75s var(--ease) forwards;}
        .btn-primary{background:#fff;color:var(--ink);padding:.85rem 2rem;border-radius:100px;font-size:.85rem;font-weight:500;letter-spacing:.01em;transition:transform .22s var(--ease),box-shadow .22s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.25);}
        .btn-secondary{background:transparent;color:rgba(255,255,255,.88);padding:.85rem 2rem;border-radius:100px;font-size:.85rem;font-weight:400;letter-spacing:.01em;border:1px solid rgba(255,255,255,.28);transition:border-color .2s,background .2s;}
        .btn-secondary:hover{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.07);}
        .hero-footnote{margin-top:1.2rem;font-size:.78rem;color:rgba(255,255,255,.38);font-weight:300;opacity:0;animation:fadeUp .9s .9s var(--ease) forwards;}

        /* ── SECTIONS ── */
        .section{max-width:1280px;margin:0 auto;padding:8rem 5vw;color:var(--ink);}
        .section-bg{background:var(--white);}
        .eyebrow{display:block;font-size:.72rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem;}
        .section-title{font-family:var(--serif);font-weight:400;font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:1rem;}
        .section-lede{color:var(--muted);font-size:1.05rem;max-width:56ch;font-weight:300;line-height:1.78;}
        .section-head{margin-bottom:4.5rem;}

        /* ── SERVICES ── */
        .services-grid{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);}
        .svc-card{padding:3.5rem 3rem;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transition:background .25s;}
        .svc-card:hover{background:#f8f8fc;}
        .svc-num{font-family:var(--serif);font-style:italic;font-size:.9rem;color:var(--blue);margin-bottom:1.4rem;}
        .svc-title{font-family:var(--serif);font-weight:400;font-size:1.5rem;letter-spacing:-.01em;margin-bottom:.9rem;line-height:1.2;}
        .svc-desc{color:var(--muted);font-size:.95rem;line-height:1.72;font-weight:300;}

        /* ── APPROACH ── */
        .approach-panels{display:flex;flex-direction:column;gap:1px;background:var(--line);}
        .approach-panel{display:grid;grid-template-columns:1fr 1fr;background:var(--white);min-height:280px;}
        .approach-text{padding:4rem 3.5rem;display:flex;flex-direction:column;justify-content:center;}
        .approach-num{font-family:var(--serif);font-style:italic;font-size:.9rem;color:var(--blue);margin-bottom:1.2rem;display:block;}
        .approach-title{font-family:var(--serif);font-weight:400;font-size:1.65rem;letter-spacing:-.01em;margin-bottom:1rem;line-height:1.15;}
        .approach-desc{color:var(--muted);font-size:.95rem;line-height:1.75;font-weight:300;}
        .approach-canvas-wrap{background:#f5f6ff;min-height:260px;display:flex;align-items:center;justify-content:center;padding:2rem;}

        /* ── VALUES ── */
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);}
        .value-card{background:var(--white);padding:3.5rem 2.8rem;transition:background .25s;}
        .value-card:hover{background:#f8f8fc;}
        .value-tag{display:inline-block;font-size:.7rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);border:1px solid var(--blue);padding:.28rem .8rem;border-radius:100px;margin-bottom:1.4rem;}
        .value-title{font-family:var(--serif);font-weight:400;font-size:1.6rem;letter-spacing:-.01em;margin-bottom:.9rem;line-height:1.2;}
        .value-desc{color:var(--muted);font-size:.95rem;line-height:1.72;font-weight:300;}

        /* ── METHOD ── */
        .method-list{margin-top:4.5rem;border-top:1px solid var(--line);}
        .method-step{display:grid;grid-template-columns:80px 1fr 24px;align-items:center;gap:2.5rem;padding:2rem .5rem;border-bottom:1px solid var(--line);border-radius:4px;cursor:default;transition:padding .3s var(--ease),background .25s;}
        .method-step:hover{padding:2.4rem 1.2rem;background:#f8f8fc;}
        .step-num{font-family:var(--serif);font-style:italic;font-size:1.1rem;color:var(--blue);}
        .step-body h4{font-family:var(--serif);font-weight:400;font-size:1.4rem;letter-spacing:-.01em;margin-bottom:.3rem;}
        .step-body p{color:var(--muted);font-size:.95rem;line-height:1.65;font-weight:300;}
        .step-arrow{width:20px;height:20px;color:#ccc;flex-shrink:0;transition:color .22s,transform .22s;}
        .method-step:hover .step-arrow{color:var(--blue);transform:translateX(4px);}

        /* ── ABOUT ── */
        .about-split{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-lede{color:var(--muted);font-size:1.05rem;line-height:1.8;margin-top:1.2rem;font-weight:300;}
        .about-links{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap;}
        .btn-dark{background:var(--ink);color:#fff;padding:.9rem 2rem;border-radius:100px;font-size:.75rem;font-weight:500;letter-spacing:.04em;transition:background .22s,transform .2s,box-shadow .22s;}
        .btn-dark:hover{background:var(--blue);transform:translateY(-2px);box-shadow:0 10px 26px rgba(15,47,255,.2);}
        .btn-outline{border:1.5px solid var(--line);color:var(--ink);padding:.9rem 2rem;border-radius:100px;font-size:.75rem;font-weight:500;letter-spacing:.04em;transition:border-color .22s,color .22s;}
        .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
        .about-dark{background:var(--dark);border-radius:4px;padding:3.5rem 3rem;color:#fff;position:relative;overflow:hidden;}
        .about-dark::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(15,47,255,.22) 0%,transparent 70%);border-radius:50%;}
        .about-dark-label{font-family:var(--serif);font-weight:400;font-size:1.3rem;letter-spacing:-.01em;margin-bottom:1.5rem;position:relative;}

        /* ── CONTACT ── */
        .contact-wrap{max-width:660px;margin:0 auto;padding:8rem 5vw;text-align:center;}
        .contact-form{margin-top:3.5rem;text-align:left;display:flex;flex-direction:column;gap:1.2rem;}
        .fl{display:block;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.45rem;}
        .fi,.ft{width:100%;background:var(--white);border:1.5px solid #dddde8;border-radius:8px;padding:.9rem 1.15rem;font-family:var(--sans);font-size:.95rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus,.ft:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(15,47,255,.1);}
        .ft{min-height:130px;resize:vertical;}
        .fc{display:flex;gap:.7rem;align-items:flex-start;font-size:.75rem;color:var(--muted);cursor:pointer;line-height:1.55;font-weight:300;}
        .fc input{margin-top:3px;flex-shrink:0;accent-color:var(--blue);}
        .submit-btn{align-self:center;background:var(--ink);color:#fff;border:none;padding:1rem 3rem;border-radius:100px;font-family:var(--sans);font-size:.75rem;font-weight:500;letter-spacing:.06em;cursor:pointer;transition:background .22s,transform .2s,box-shadow .22s;}
        .submit-btn:hover{background:var(--blue);transform:translateY(-2px);box-shadow:0 10px 28px rgba(15,47,255,.2);}

        /* ── FOOTER ── */
        footer{background:linear-gradient(0deg,#010510 0%,#020818 10%,#051428 28%,#092a56 50%,#0f4f98 68%,#3485d8 82%,#a8ccf5 92%,#e0eeff 97%,#ffffff 100%);color:#fff;padding:16rem 5vw 4rem;}
        .footer-inner{max-width:1280px;margin:0 auto;}
        .footer-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:3rem;border-bottom:1px solid rgba(255,255,255,.1);flex-wrap:wrap;gap:2.5rem;}
        .footer-logo{font-family:var(--serif);font-style:italic;font-size:1.6rem;color:#fff;}
        .footer-tagline{margin-top:.4rem;color:rgba(255,255,255,.38);font-size:.67rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;}
        .footer-links{display:flex;gap:3.5rem;flex-wrap:wrap;}
        .footer-col-title{font-size:.67rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:1.1rem;}
        .footer-col a{display:block;font-size:.9rem;color:rgba(255,255,255,.52);margin-bottom:.65rem;transition:color .18s;}
        .footer-col a:hover{color:#fff;}
        .footer-bottom{margin-top:2.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
        .footer-copy{font-size:.67rem;color:rgba(255,255,255,.3);}

        /* ── DEALS CAROUSEL ── */
        .deals-section{background:#f7f7fa;padding:7rem 0 6rem;}
        .deals-inner{max-width:900px;margin:0 auto;padding:0 5vw;}
        .deals-header{text-align:center;margin-bottom:2.5rem;}
        .deals-header .section-title{margin-bottom:.5rem;}
        .deals-header .section-lede{margin:0 auto;text-align:center;}
        .deals-controls{display:flex;align-items:center;justify-content:center;gap:.5rem;margin-bottom:3.5rem;flex-wrap:wrap;}
        .deals-tab{font-size:.82rem;font-weight:400;color:var(--muted);padding:.38rem 1rem;cursor:pointer;background:transparent;border:none;font-family:var(--sans);transition:color .18s;white-space:nowrap;}
        .deals-tab:hover{color:var(--ink);}
        .deals-tab.active{font-weight:700;color:var(--ink);}
        .deals-tab-sep{width:1px;height:16px;background:var(--line);flex-shrink:0;}
        .deals-nav{width:40px;height:40px;border-radius:50%;background:var(--ink);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;}
        .deals-nav:hover{background:var(--blue);}
        .deals-nav:disabled{opacity:.28;cursor:default;}
        .deals-nav svg{width:16px;height:16px;}
        .deals-fan-outer{overflow:visible;position:relative;display:flex;flex-direction:column;align-items:center;}
        .deals-fan-track{display:flex;align-items:flex-end;justify-content:center;gap:16px;width:100vw;position:relative;}
        .deal-card{flex-shrink:0;background:#fff;border-radius:12px;overflow:hidden;border:1px solid var(--line);cursor:pointer;transition:width .52s cubic-bezier(0.22,0.61,0.36,1),transform .52s cubic-bezier(0.22,0.61,0.36,1),box-shadow .52s cubic-bezier(0.22,0.61,0.36,1),opacity .45s ease;}
        .deal-card.active-card{box-shadow:0 16px 48px rgba(0,0,0,0.13);}
        .deal-card.side-card{box-shadow:0 2px 12px rgba(0,0,0,0.06);}
        .deal-graph{background:#f5f6ff;overflow:hidden;border-bottom:1px solid var(--line);transition:height .52s cubic-bezier(0.22,0.61,0.36,1);}
        .deal-graph canvas{width:100%;height:100%;display:block;}
        .deal-info{padding:1.3rem 1.4rem 1.6rem;}
        .deal-category{font-size:.67rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:.45rem;}
        .deal-title{font-family:var(--serif);font-weight:400;font-size:1.05rem;letter-spacing:-.01em;line-height:1.25;}
        .deal-meta{display:flex;gap:.9rem;margin-top:.75rem;flex-wrap:wrap;}
        .deal-badge{display:flex;align-items:center;gap:.32rem;font-size:.72rem;color:var(--muted);font-weight:300;}
        .deal-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
        .deal-dot.green{background:#22c55e;}
        .deal-dot.orange{background:#f97316;}
        .deal-dot.blue{background:var(--blue);}
        .deals-active-meta{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.4rem;min-height:1.8rem;}
        .deals-active-meta .deal-badge{font-size:.78rem;}

        /* ── REVEAL ── */
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-d1{transition-delay:.1s;}
        .reveal-d2{transition-delay:.2s;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .nav-links a:not(.nav-cta){display:none;}
          .approach-panel{grid-template-columns:1fr;}
          .approach-canvas-wrap{min-height:220px;}
          .services-grid,.values-grid{grid-template-columns:1fr;}
          .about-split{grid-template-columns:1fr;gap:3rem;}
          .method-step{grid-template-columns:60px 1fr;}
          .step-arrow{display:none;}
        }
        @media(max-width:600px){
          .section{padding:4rem 5vw;}
          .hero-h1{font-size:clamp(2.6rem,10vw,3.5rem);}
          .footer-top{flex-direction:column;}
          .footer-links{gap:2rem;}
          footer{padding:10rem 5vw 3rem;}
        }
      `}</style>

      {/* NAV */}
      <div className="nav-outer" ref={navRef}>
        <nav>
          <div className="logo-wrap">
            <span className="logo-ap">AP</span>
            <span className="logo-sep" />
            <span className="logo-name">Ambroise Partners</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#approach">Expertise</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
            <a href="#contact" className="nav-cta">Contact us</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <header className="hero" ref={heroRef}>
        <canvas id="hero-canvas" ref={canvasRef} />
        <div className="hero-inner">
          <h1 className="hero-h1">
            <span className="hero-line hero-line-1">Healthcare focused </span>
            <span className="hero-line hero-line-2">advisory</span>
            <span className="hero-line hero-line-3"><em> serving innovation</em></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">Get in touch</a>
            <a href="#services" className="btn-secondary">Our services</a>
          </div>
          <div className="hero-tags">
            <span>M&amp;A</span><span>Fundraising</span><span>Licensing</span><span>Growth</span>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section className="section section-bg" id="services">
        <div className="section-head reveal">
          <h2 className="section-title">Our Services</h2>
          <p className="section-lede">We provide end-to-end support across all types of healthcare transactions, from early strategic positioning and preparation to execution and closing.</p>
        </div>
        <div className="services-grid">
          {[
            ['01','M&A','Buy-side, sell-side and strategic acquisitions across the global healthcare ecosystem.'],
            ['02','Fundraising','Growth financing from early-stage to later rounds, partnering with leading healthcare-focused investors.'],
            ['03','Licensing & Strategic Partnerships','Structuring value-creating licensing and collaboration agreements with global strategic players.'],
            ['04','Strategic Advisory & External Growth','Independent advice on strategic options, portfolio positioning and long-term growth trajectories.'],
            ['05','Capital Raising Solutions for all Market Cycles',
             'We partner with companies across the healthcare landscape to design and implement optimal capital structures that allow them to execute against their strategic objectives. We bring significant domain expertise across a broad spectrum of financing alternatives, including Initial Public Offerings, Publicly & Confidentially Marketed Follow-on Offerings, At-the-Market transactions, Private Placements of Equity, Convertible Debt, Term Loan Debt Facilities.'],
          ].map(([num,title,desc],i)=>(
            <div className={`svc-card reveal${i%2===1?' reveal-d1':''}`} key={num}>
              <div className="svc-num">{num}</div>
              <div className="svc-title">{title}</div>
              <p className="svc-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH */}
      <section className="section section-bg" id="approach" style={{paddingBottom:'6rem'}}>
        <div className="section-head reveal">
          <h2 className="section-title">Our Approach</h2>
        </div>
        <div className="approach-panels">
          <div className="approach-panel reveal">
            <div className="approach-text">
              <span className="approach-num">01</span>
              <div className="approach-title">Scientific expertise</div>
              <p className="approach-desc">Deep understanding of healthcare science and ecosystems, backed by strong medical and scientific academic backgrounds within the team.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="brain" /></div>
          </div>
          <div className="approach-panel reveal reveal-d1">
            <div className="approach-text">
              <span className="approach-num">02</span>
              <div className="approach-title">Deep Network</div>
              <p className="approach-desc">A global network of leading healthcare investors and strategic partners, developed through years of active involvement in the healthcare sector worldwide.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="network" /></div>
          </div>
          <div className="approach-panel reveal reveal-d2">
            <div className="approach-text">
              <span className="approach-num">03</span>
              <div className="approach-title">Execution excellence</div>
              <p className="approach-desc">The rigor and standards of top-tier investment banks, built on more than 10 years of experience in top-tier institutions, combined with hands-on execution, agility and close client support.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="curve" /></div>
          </div>
        </div>
      </section>

      <DealsCarousel />

      {/* VALUES */}
      <section className="section section-bg" id="values">
        <div className="section-head reveal">
          <span className="eyebrow">Values</span>
          <h2 className="section-title">Excellence &amp; alignment</h2>
          <p className="section-lede">Principles that guide every engagement.</p>
        </div>
        <div className="values-grid">
          {[
            ['Rigor',       'Institutional-grade materials, sourced data, clear narrative: every deliverable is investor-ready.'],
            ['Transparency','Roadmaps, milestones, clear reporting: you always know where we stand.'],
            ['Alignment',   'Compensation model tied to deal success and value creation.'],
          ].map(([tag,desc],i)=>(
            <div className={`value-card reveal${i===1?' reveal-d1':i===2?' reveal-d2':''}`} key={tag}>
              <span className="value-tag">{tag}</span>
              <div className="value-title">{tag}</div>
              <p className="value-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* METHOD */}
      <section className="section section-bg" id="method">
        <div className="section-head reveal">
          <span className="eyebrow">Methodology</span>
          <h2 className="section-title">Proven process</h2>
        </div>
        <div className="method-list">
          {[
            ['01','Strategic Audit',  'Assessment of positioning, pipeline and transaction objectives.'],
            ['02','Structuring',      'Investment narrative, data room, modeling and investor materials.'],
            ['03','Targeted Outreach','Sourcing and confidential approach to the most relevant counterparties.'],
            ['04','Process Steering', 'Process coordination, Q&A, due diligence and advisor management.'],
            ['05','Closing',          'Negotiation of final terms and securing the signature.'],
          ].map(([num,title,copy])=>(
            <div className="method-step reveal" key={num}>
              <div className="step-num">{num}</div>
              <div className="step-body"><h4>{title}</h4><p>{copy}</p></div>
              <svg className="step-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section section-bg" id="about">
        <div className="about-split">
          <div className="reveal">
            <span className="eyebrow">Leadership</span>
            <h2 className="section-title">A biotech-dedicated team</h2>
            <p className="about-lede">15+ years in sector investment banking (EU &amp; US), IPOs, licensing deals and multi‑billion M&amp;A.</p>
            <p className="about-lede" style={{marginTop:'.8rem'}}>Make top-tier biotech M&amp;A advisory accessible to innovative companies, whatever their stage.</p>
            <div className="about-links">
              <a href="mailto:contact@ambroise-partners.com" className="btn-dark">Email us</a>
              <a href="#" className="btn-outline" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <div className="about-dark reveal reveal-d1">
            <div className="about-dark-label">Key figures</div>
            <p style={{color:'rgba(255,255,255,.72)',fontSize:'.95rem',lineHeight:'1.75'}}>
              €2bn+ advised · &gt;90% closing · 40+ cross-border biotech deals · 100% life sciences focus.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <div style={{background:'var(--white)',borderTop:'1px solid var(--line)'}} id="contact">
        <div className="contact-wrap">
          <div className="reveal">
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">Let's discuss your project</h2>
            <p className="section-lede" style={{margin:'1rem auto 0',textAlign:'center'}}>
              Let's explore together the best options for your next step.
            </p>
          </div>
          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <div><label className="fl">Name</label><input className="fi" type="text" required placeholder="Your full name"/></div>
            <div><label className="fl">Email</label><input className="fi" type="email" required placeholder="you@company.com"/></div>
            <div><label className="fl">Message</label><textarea className="ft" required placeholder="Describe your project…"/></div>
            <label className="fc"><input type="checkbox" required/><span>I agree that my information will be processed to answer my request.</span></label>
            <button type="submit" className="submit-btn">Send message</button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo">AP</div>
              <div className="footer-tagline">Ambroise Partners — Biotech &amp; medtech advisory · EU / US</div>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Services</div>
                <a href="#services">M&amp;A</a>
                <a href="#services">Fundraising</a>
                <a href="#services">Licensing</a>
                <a href="#services">Strategic Advisory</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Company</div>
                <a href="#approach">Expertise</a>
                <a href="#method">Method</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Connect</div>
                <a href="mailto:contact@ambroise-partners.com">contact@ambroise-partners.com</a>
                <a href="#">LinkedIn</a>
                <a href="#">Legal notice</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Ambroise Partners. All rights reserved.</div>
            <div className="footer-copy">Paris · New York</div>
          </div>
        </div>
      </footer>
    </>
  );
}

'use client';

import React, { useEffect, useRef, useState, type FormEvent } from 'react';

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


/* ─── Expertise Section ─── */
const DOMAINS = [
  { id:1, name:'Biotechnology',   tagline:'From discovery to clinical-stage transactions',      desc:'We advise biotech companies at every stage — from seed financing to late-stage M&A. Our team combines deep scientific expertise with financial rigor to optimally position assets in an increasingly competitive market.',   tags:['Oncology','Gene Therapy','Immunology','Rare Diseases'],          color:'#e8e4f0', accentColor:'#3d1a6b' },
  { id:2, name:'Pharmaceuticals', tagline:'Portfolio strategy and value-creating transactions',  desc:'From licensing deals to full acquisitions, we help pharma companies navigate complex strategic decisions — portfolio optimization, asset divestitures, in-licensing, and cross-border M&A with major industry players.', tags:['Licensing','Portfolio Optimization','Cross-border M&A','Spin-offs'], color:'#e4e8f0', accentColor:'#1a3a6b' },
  { id:3, name:'Medical Devices',  tagline:'Connecting innovators with strategic buyers',         desc:'The medtech sector demands both technical precision and commercial insight. We advise device companies on fundraising, strategic partnerships, and M&A — from early-stage innovators to established platforms.',           tags:['Surgical Robotics','Implantables','Wearables','Capital Equipment'],  color:'#e4f0e8', accentColor:'#1a5a3d' },
  { id:4, name:'Diagnostics',      tagline:'Structuring deals in a fast-moving landscape',        desc:'Diagnostics sits at the intersection of technology and medicine. We support IVD companies, molecular diagnostics platforms, and point-of-care innovators in capital raises, partnerships, and exit transactions.',        tags:['IVD','Molecular Diagnostics','Point-of-Care','Liquid Biopsy'],       color:'#f0e8e4', accentColor:'#6b3a1a' },
  { id:5, name:'Digital Health',   tagline:'Where technology meets healthcare finance',           desc:'Digital health requires a unique blend of tech-sector fluency and healthcare domain knowledge. We advise SaaS, AI-driven platforms, and healthtech companies on growth financing, strategic alliances, and M&A.',        tags:['AI / ML','SaaS Platforms','Remote Monitoring','Health Data'],         color:'#e4e8ff', accentColor:'#0f2fff' },
];

function ExpertiseSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const N = DOMAINS.length;
  const CARD_W = 340;
  const GAP    = 24;
  const UNIT   = CARD_W + GAP;

  const goTo = (i: number) => setActiveIdx(Math.max(0, Math.min(N - 1, i)));

  return (
    <section style={{ background: '#f8f7f4', padding: '8rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '5rem', paddingLeft: '4vw' }}>

        {/* ── LEFT: title + nav panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} className="reveal">
          <div>
            <span className="eyebrow">Areas of expertise</span>
            <h2 className="section-title" style={{ margin: '0.4rem 0 1.6rem' }}>Our Domains</h2>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.88rem', lineHeight: 1.82, color: '#6b6b78', fontWeight: 300, maxWidth: 300, margin: 0 }}>
              We operate at the forefront of five major healthcare verticals, bringing sector-specific expertise to every transaction.
            </p>
          </div>

          <div style={{ marginTop: '3rem' }}>
            {/* Vertical domain list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '2.5rem' }}>
              {DOMAINS.map((dom, i) => (
                <button
                  key={dom.id}
                  onClick={() => goTo(i)}
                  style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', fontWeight: activeIdx === i ? 600 : 400, color: activeIdx === i ? '#1a1a1a' : '#a0a0a8', padding: '0.45rem 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'color .25s' }}
                >
                  <span style={{ width: 20, height: 1.5, borderRadius: 2, background: activeIdx === i ? dom.accentColor : '#d8d8e0', display: 'inline-block', flexShrink: 0, transition: 'background .25s' }} />
                  {dom.name}
                </button>
              ))}
            </div>

            {/* Arrows + counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => goTo(activeIdx - 1)} disabled={activeIdx === 0}
                style={{ width: 40, height: 40, borderRadius: '50%', background: activeIdx === 0 ? '#e8e8e8' : '#1a1a1a', color: activeIdx === 0 ? '#b0b0b8' : '#fff', border: 'none', cursor: activeIdx === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s, color .2s', flexShrink: 0 }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                onClick={() => goTo(activeIdx + 1)} disabled={activeIdx === N - 1}
                style={{ width: 40, height: 40, borderRadius: '50%', background: activeIdx === N - 1 ? '#e8e8e8' : '#1a1a1a', color: activeIdx === N - 1 ? '#b0b0b8' : '#fff', border: 'none', cursor: activeIdx === N - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s, color .2s', flexShrink: 0 }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.72rem', color: '#a0a0a8', fontWeight: 300, marginLeft: '0.5rem' }}>
                {String(activeIdx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: card track ── */}
        <div style={{ overflow: 'hidden', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <div style={{
            display: 'flex',
            gap: GAP,
            transform: `translateX(-${activeIdx * UNIT}px)`,
            transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            {DOMAINS.map((dom, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={dom.id}
                  onClick={() => goTo(i)}
                  style={{
                    flexShrink: 0,
                    width: CARD_W,
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: '#fff',
                    border: `1.5px solid ${isActive ? dom.accentColor + '28' : '#e8e8f0'}`,
                    boxShadow: isActive ? '0 20px 64px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)' : '0 2px 10px rgba(0,0,0,0.04)',
                    opacity: isActive ? 1 : 0.55,
                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                    transition: 'opacity .45s ease, transform .45s ease, box-shadow .45s ease, border-color .45s ease',
                    cursor: isActive ? 'default' : 'pointer',
                  } as React.CSSProperties}
                >
                  {/* Photo placeholder */}
                  <div style={{ height: 220, background: `linear-gradient(145deg, ${dom.color} 0%, ${dom.color}90 100%)`, display: 'flex', alignItems: 'flex-end', padding: '1.1rem 1.4rem' }}>
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: dom.accentColor, opacity: 0.45 }}>Photo à venir</span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem 1.7rem 1.9rem' }}>
                    <span style={{ display: 'block', fontFamily: 'Lora,Georgia,serif', fontStyle: 'italic', fontSize: '0.75rem', color: dom.accentColor, marginBottom: '0.4rem', opacity: 0.75 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontFamily: 'Lora,Georgia,serif', fontWeight: 400, fontSize: '1.25rem', lineHeight: 1.18, letterSpacing: '-0.015em', color: '#1a1a1a', margin: '0 0 0.35rem' }}>
                      {dom.name}
                    </h3>
                    <p style={{ fontFamily: 'Lora,Georgia,serif', fontStyle: 'italic', fontSize: '0.84rem', color: dom.accentColor, margin: '0 0 0.85rem', lineHeight: 1.45, opacity: 0.85 }}>
                      {dom.tagline}
                    </p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', lineHeight: 1.76, color: '#6b6b78', fontWeight: 300, margin: '0 0 1rem' }}>
                      {dom.desc}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {dom.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: dom.accentColor, border: `1px solid ${dom.accentColor}30`, borderRadius: 100, padding: '0.18rem 0.55rem', fontFamily: 'Inter,sans-serif' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── Services Section ─── */
const SERVICES = [
  { title: 'M&A', desc: 'Buy-side, sell-side and strategic acquisitions across the global healthcare ecosystem.' },
  { title: 'Fundraising', desc: 'Growth financing from early-stage to later rounds, partnering with leading healthcare-focused investors.' },
  { title: 'Licensing & Strategic Partnerships', desc: 'Structuring value-creating licensing and collaboration agreements with global strategic players.' },
  { title: 'Strategic Advisory & External Growth', desc: 'Independent advice on strategic options, portfolio positioning and long-term growth trajectories.' },
  { title: 'Capital Raising Solutions for all Market Cycles', desc: 'We partner with companies across the healthcare landscape to design and implement optimal capital structures. We bring significant domain expertise across a broad spectrum of financing alternatives, including IPOs, Follow-on Offerings, At-the-Market transactions, Private Placements of Equity, Convertible Debt, and Term Loan Debt Facilities.' },
];

const svcS: Record<string, React.CSSProperties> = {
  section: { background: '#fff', padding: '8rem 4vw' },
  inner: { maxWidth: 1440, margin: '0 auto' },
  header: { marginBottom: '4.5rem' },
  eyebrow: { display: 'block', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6b6b78', marginBottom: '0.8rem', fontFamily: 'Inter, sans-serif' },
  title: { fontFamily: 'Lora, Georgia, serif', fontWeight: 400, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#1a1a1a' },
  svcNum: { fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontSize: '0.9rem', color: '#0f2fff', marginBottom: '1rem', display: 'block' },
  svcTitle: { fontFamily: 'Lora, Georgia, serif', fontWeight: 400, fontSize: '1.25rem', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#1a1a1a' },
  svcDesc: { fontFamily: 'Inter, sans-serif', fontSize: '0.93rem', lineHeight: 1.75, color: '#6b6b78', fontWeight: 300 },
};

function ServicesSection() {
  return (
    <section id="services" style={svcS.section}>
      <div style={svcS.inner}>
        <div style={svcS.header} className="reveal">
          <span style={svcS.eyebrow}>What we do</span>
          <h2 style={svcS.title}>Our Services</h2>
        </div>
        {/* Desktop: 3-row table layout */}
        <div className="svc-grid svc-grid-desktop reveal">
          <div className="svc-row svc-top-row">
            {SERVICES.map((svc, i) => (
              <div key={i} className="svc-cell">
                <span style={svcS.svcNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 style={svcS.svcTitle}>{svc.title}</h3>
              </div>
            ))}
          </div>
          <div className="svc-row svc-divider-row">
            {SERVICES.map((_, i) => (
              <div key={i} className="svc-divider-cell">
                {i < SERVICES.length - 1 && <span className="svc-plus">+</span>}
              </div>
            ))}
          </div>
          <div className="svc-row svc-bottom-row">
            {SERVICES.map((svc, i) => (
              <div key={i} className={`svc-cell${i === SERVICES.length - 1 ? ' svc-scroll-cell' : ''}`}>
                <p style={svcS.svcDesc}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile: stacked cards */}
        <div className="svc-grid-mobile reveal">
          {SERVICES.map((svc, i) => (
            <div key={i} className="svc-mobile-card">
              <span style={svcS.svcNum}>{String(i + 1).padStart(2, '0')}</span>
              <h3 style={svcS.svcTitle}>{svc.title}</h3>
              <p style={{ ...svcS.svcDesc, marginTop: '0.8rem' }}>{svc.desc}</p>
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
    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function animate() {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W * dpr, H * dpr);
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

    /* Safari may report wrong offsetWidth/Height on first paint.
       Run resize() after layout is guaranteed stable. */
    const ensureReady = () => {
      resize();
      if (W === 0 || H === 0) {
        requestAnimationFrame(ensureReady);
      } else {
        animate();
      }
    };
    if (document.readyState === 'complete') {
      ensureReady();
    } else {
      window.addEventListener('load', ensureReady, { once: true });
    }

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
          margin-left:.5rem;
          background:#fff!important;color:var(--ink)!important;
          padding:.65rem 1.7rem!important;border-radius:9999px;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:.85rem!important;font-weight:600!important;
          border:1px solid rgba(255,255,255,0.55);
          transition:background .22s!important,color .22s!important,box-shadow .22s!important,border-color .18s var(--ease),border-radius .18s var(--ease);
        }
        .nav-cta:hover{background:var(--blue)!important;color:#fff!important;border-color:transparent;border-radius:9999px;}
        .nav-scrolled nav{background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line);box-shadow:0 1px 12px rgba(0,0,0,0.06);}
        .nav-scrolled .logo-ap{color:var(--ink);}
        .nav-scrolled .logo-sep{background:var(--line);}
        .nav-scrolled .logo-name{color:var(--muted);}
        .nav-scrolled .nav-links a{color:var(--muted);}
        .nav-scrolled .nav-links a:hover{color:var(--ink);}
        .nav-scrolled .nav-cta{background:var(--ink)!important;color:#fff!important;border-radius:9999px;border-color:var(--ink);}
        .nav-scrolled .nav-cta:hover{background:var(--blue)!important;border-color:var(--blue);}

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
        .section{max-width:1440px;margin:0 auto;padding:8rem 4vw;color:var(--ink);}
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

        /* ── SERVICES GRID ── */
        .svc-grid{border:1px solid #e8e8f0;border-radius:2px;}
        .svc-row{display:grid;grid-template-columns:repeat(5,1fr);}
        .svc-divider-row{border-top:1px solid #e8e8f0;border-bottom:1px solid #e8e8f0;}
        .svc-cell{padding:2.4rem 2.2rem;border-right:1px solid #e8e8f0;}
        .svc-cell:last-child{border-right:none;}
        .svc-divider-cell{padding:0.6rem 2.2rem;border-right:1px solid #e8e8f0;display:flex;align-items:center;justify-content:flex-end;position:relative;}
        .svc-divider-cell:last-child{border-right:none;}
        .svc-plus{position:absolute;right:-10px;top:50%;transform:translateY(-50%);font-size:1rem;color:#b0b0be;font-family:Inter,sans-serif;font-weight:300;z-index:1;background:#fff;padding:0 2px;}
        .svc-scroll-cell{position:relative;max-height:9.5rem;overflow:hidden;}
        .svc-scroll-cell::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2.8rem;background:linear-gradient(to bottom,transparent,#fff);pointer-events:none;transition:opacity .22s;}
        .svc-scroll-cell:hover{overflow-y:auto;}
        .svc-scroll-cell:hover::after{opacity:0;}
        .svc-grid-mobile{display:none;}
        .svc-mobile-card{padding:2rem 0;border-bottom:1px solid #e8e8f0;}
        .svc-mobile-card:first-child{border-top:1px solid #e8e8f0;}

        /* ── FOOTER ── */
        footer{background:linear-gradient(0deg,#010510 0%,#040c30 20%,#0a1880 42%,#1a3fff 58%,#6699ff 72%,#d0e0ff 86%,#ffffff 96%);color:#fff;padding:13rem 4vw 4rem;}
        .footer-inner{max-width:1440px;margin:0 auto;}

        /* CTA strip */
        .footer-cta{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;padding-bottom:4rem;border-bottom:1px solid rgba(255,255,255,.1);flex-wrap:wrap;}
        .footer-cta-headline{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,3.8vw,3.6rem);line-height:1.08;letter-spacing:-.02em;}
        .footer-cta-headline em{font-style:italic;opacity:.75;}
        .footer-cta-btn{display:inline-flex;align-items:center;gap:.55rem;background:#fff;color:var(--ink);padding:.9rem 2.2rem;border-radius:100px;font-size:.84rem;font-weight:500;letter-spacing:.01em;white-space:nowrap;flex-shrink:0;transition:background .2s,transform .2s var(--ease);}
        .footer-cta-btn:hover{background:#dce8ff;transform:translateY(-2px);}
        .footer-cta-btn svg{transition:transform .2s;}
        .footer-cta-btn:hover svg{transform:translateX(3px);}

        /* Main grid */
        .footer-top{display:grid;grid-template-columns:1fr auto;gap:5rem;padding:4rem 0 3.5rem;border-bottom:1px solid rgba(255,255,255,.08);align-items:start;}
        .footer-brand{}
        .footer-logo{font-family:var(--serif);font-style:italic;font-size:2.1rem;color:#fff;letter-spacing:-.01em;}
        .footer-brand-name{font-size:.65rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.35);margin:.3rem 0 1.4rem;}
        .footer-brand-desc{font-size:.87rem;line-height:1.78;color:rgba(255,255,255,.38);font-weight:300;max-width:28ch;margin-bottom:1.8rem;}
        .footer-contact{display:flex;flex-direction:column;gap:.38rem;}
        .footer-contact a,.footer-contact span{font-size:.8rem;color:rgba(255,255,255,.42);font-weight:300;transition:color .18s;}
        .footer-contact a:hover{color:#fff;}

        .footer-links{display:flex;gap:4rem;flex-wrap:wrap;}
        .footer-col-title{font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:1.3rem;}
        .footer-col a{display:block;font-size:.87rem;color:rgba(255,255,255,.5);margin-bottom:.72rem;transition:color .18s;font-weight:300;}
        .footer-col a:hover{color:#fff;}

        /* Bottom bar */
        .footer-bottom{padding-top:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
        .footer-copy{font-size:.65rem;color:rgba(255,255,255,.25);letter-spacing:.04em;}
        .footer-right{display:flex;align-items:center;gap:1.8rem;}
        .footer-cities{font-size:.65rem;color:rgba(255,255,255,.25);letter-spacing:.06em;text-transform:uppercase;}
        .footer-social{display:flex;gap:.6rem;}
        .footer-social a{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.45);transition:border-color .18s,color .18s,background .18s;}
        .footer-social a:hover{border-color:rgba(255,255,255,.5);color:#fff;background:rgba(255,255,255,.08);}

        /* ── EXPERTISE CAROUSEL ── */
        .expertise-domain-tab{font-size:.82rem;font-weight:400;color:var(--muted);padding:.38rem 1rem;cursor:pointer;background:transparent;border:none;font-family:var(--sans);transition:color .18s;white-space:nowrap;}
        .expertise-domain-tab:hover{color:var(--ink);}
        .expertise-domain-tab.active{font-weight:700;color:var(--ink);}

        /* ── REVEAL ── */
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-d1{transition-delay:.1s;}
        .reveal-d2{transition-delay:.2s;}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .nav-links a:not(.nav-cta){display:none;}
          .approach-panel{grid-template-columns:1fr;}
          .approach-canvas-wrap{min-height:220px;}
          .values-grid{grid-template-columns:1fr;}
          .about-split{grid-template-columns:1fr;gap:3rem;}
          .method-step{grid-template-columns:60px 1fr;}
          .step-arrow{display:none;}
          .svc-grid-desktop{display:none;}
          .svc-grid-mobile{display:block;}
        }
        @media(max-width:600px){
          .section{padding:4rem 4vw;}
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
      <ServicesSection />

      {/* APPROACH */}
      <section className="section section-bg" id="approach">
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

      <ExpertiseSection />

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

      {/* CONTACT */}
      <div style={{background:'var(--white)',borderTop:'1px solid var(--line)'}} id="contact">
        <div className="contact-wrap">
          <div className="reveal">
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">Let&apos;s discuss your project</h2>
            <p className="section-lede" style={{margin:'1rem auto 0',textAlign:'center'}}>
              Let&apos;s explore together the best options for your next step.
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

          {/* ── CTA strip ── */}
          <div className="footer-cta">
            <p className="footer-cta-headline">
              Ready to discuss<br /><em>your next transaction?</em>
            </p>
            <a href="#contact" className="footer-cta-btn">
              Get in touch
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* ── Main grid: brand + links ── */}
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">AP</div>
              <div className="footer-brand-name">Ambroise Partners</div>
              <p className="footer-brand-desc">
                Healthcare-focused investment banking,<br />serving innovation across EU &amp; US.
              </p>
              <div className="footer-contact">
                <a href="mailto:contact@ambroise-partners.com">contact@ambroise-partners.com</a>
                <span>Paris · New York</span>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-col">
                <div className="footer-col-title">Services</div>
                <a href="#services">M&amp;A</a>
                <a href="#services">Fundraising</a>
                <a href="#services">Licensing</a>
                <a href="#services">Strategic Advisory</a>
                <a href="#services">Capital Raising</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Company</div>
                <a href="#approach">Our Domains</a>
                <a href="#approach">Expertise</a>
                <a href="#method">Method</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <a href="#">Legal notice</a>
                <a href="#">Privacy policy</a>
                <a href="#">Cookie policy</a>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Ambroise Partners. All rights reserved.</div>
            <div className="footer-right">
              <span className="footer-cities">Paris · New York</span>
              <div className="footer-social">
                <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

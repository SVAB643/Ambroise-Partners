'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/* ─── Animated canvas for each approach pillar ─── */
function ApproachCanvas({ type }: { type: 'brain' | 'network' | 'curve' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let W = 0, H = 0;
    let started = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ── brain ── */
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const N = 55;
    const initBrain = () => {
      nodes.length = 0;
      for (let i = 0; i < N; i++)
        nodes.push({ x: Math.random()*W, y: Math.random()*H,
          vx:(Math.random()-.5)*.6, vy:(Math.random()-.5)*.6, r:Math.random()*2+1.2 });
    };
    const drawBrain = () => {
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
          ctx.strokeStyle=`rgba(42,92,184,${0.18*(1-d/110)})`;
          ctx.lineWidth=0.8;
          ctx.stroke();
        }
      }
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle='rgba(42,92,184,0.55)'; ctx.fill();
      });
      raf = requestAnimationFrame(drawBrain);
    };

    /* ── network ── */
    const hubs = [
      { x:.5, y:.5, r:6 },
      { x:.18, y:.28, r:3.5 }, { x:.82, y:.28, r:3.5 },
      { x:.18, y:.72, r:3.5 }, { x:.82, y:.72, r:3.5 },
      { x:.5,  y:.12, r:2.8 }, { x:.5,  y:.88, r:2.8 },
      { x:.12, y:.5,  r:2.8 }, { x:.88, y:.5,  r:2.8 },
    ];
    let nt = 0;
    const drawNetwork = () => {
      ctx.clearRect(0,0,W,H);
      nt += 0.018;
      const cx = hubs[0].x*W, cy = hubs[0].y*H;
      const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,W*.28);
      grad.addColorStop(0,'rgba(42,92,184,0.12)');
      grad.addColorStop(1,'rgba(42,92,184,0)');
      ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy,W*.28,0,Math.PI*2); ctx.fill();
      hubs.slice(1).forEach((h,i) => {
        const hx=h.x*W, hy=h.y*H;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(hx,hy);
        ctx.strokeStyle=`rgba(42,92,184,${0.18+0.08*Math.sin(nt+i)})`; ctx.lineWidth=1; ctx.stroke();
        const p = (Math.sin(nt*0.8+i*1.1)+1)/2;
        const px2 = cx+(hx-cx)*p, py2 = cy+(hy-cy)*p;
        ctx.beginPath(); ctx.arc(px2,py2,2,0,Math.PI*2);
        ctx.fillStyle='rgba(42,92,184,0.7)'; ctx.fill();
        ctx.beginPath(); ctx.arc(hx,hy,h.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(42,92,184,${0.45+0.15*Math.sin(nt+i)})`; ctx.fill();
      });
      ctx.beginPath(); ctx.arc(cx,cy,hubs[0].r*(1+.12*Math.sin(nt)),0,Math.PI*2);
      ctx.fillStyle='rgba(42,92,184,0.8)'; ctx.fill();
      raf = requestAnimationFrame(drawNetwork);
    };

    /* ── curve ── */
    let ct = 0;
    const drawCurve = () => {
      ctx.clearRect(0,0,W,H);
      ct += 0.015;
      const pts = 80;
      const pad = { x: W*.1, y: H*.15 };
      const iW = W-pad.x*2, iH = H-pad.y*2;
      for (let i=0;i<=4;i++) {
        const y = pad.y + iH*(1-i/4);
        ctx.beginPath(); ctx.moveTo(pad.x,y); ctx.lineTo(pad.x+iW,y);
        ctx.strokeStyle='rgba(42,92,184,0.07)'; ctx.lineWidth=1; ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(pad.x, pad.y+iH);
      for (let i=0;i<=pts;i++) {
        const fx = i/pts;
        const fy = Math.pow(fx,1.6) + Math.sin(fx*Math.PI*2+ct)*0.15*(1-fx*.5);
        const x = pad.x + fx*iW;
        const y = pad.y + iH*(1-Math.min(fy,1));
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.lineTo(pad.x+iW, pad.y+iH);
      ctx.closePath();
      const fill = ctx.createLinearGradient(0,pad.y,0,pad.y+iH);
      fill.addColorStop(0,'rgba(42,92,184,0.14)');
      fill.addColorStop(1,'rgba(42,92,184,0.01)');
      ctx.fillStyle=fill; ctx.fill();
      ctx.beginPath();
      for (let i=0;i<=pts;i++) {
        const fx = i/pts;
        const fy = Math.pow(fx,1.6) + Math.sin(fx*Math.PI*2+ct)*0.15*(1-fx*.5);
        const x = pad.x + fx*iW;
        const y = pad.y + iH*(1-Math.min(fy,1));
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(42,92,184,0.75)'; ctx.lineWidth=2.2;
      ctx.lineJoin='round'; ctx.stroke();
      const lastFy = Math.pow(1,1.6)+Math.sin(Math.PI*2+ct)*0.15*.5;
      const dotY = pad.y+iH*(1-Math.min(lastFy,1));
      ctx.beginPath(); ctx.arc(pad.x+iW, dotY, 4.5, 0, Math.PI*2);
      ctx.fillStyle='rgba(42,92,184,0.9)'; ctx.fill();
      raf = requestAnimationFrame(drawCurve);
    };

    /* ── Start: wait for valid dimensions (Safari fix) ── */
    const start = () => {
      if (started) return;
      resize();
      if (W === 0 || H === 0) { requestAnimationFrame(start); return; }
      started = true;
      if (type === 'brain') { initBrain(); drawBrain(); }
      else if (type === 'network') { drawNetwork(); }
      else { drawCurve(); }
    };

    const onResize = () => {
      resize();
      if (type === 'brain') initBrain();
    };
    window.addEventListener('resize', onResize);

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [type]);

  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}


/* ─── Expertise Section ─── */
const DOMAINS = [
  { id:1, name:'Biotechnology',   image:'/images/biotech.jpg',    color:'#e8e4f0' },
  { id:2, name:'Pharmaceuticals', image:'/images/pharma.jpg',     color:'#e4e8f0' },
  { id:3, name:'Medical Devices', image:'/images/meddevice.jpg',  color:'#e4f0e8' },
  { id:4, name:'Digital Health',  image:'/images/digital.jpg',    color:'#e4e8ff' },
  { id:5, name:'Healthcare Services',   image:'/images/healthcare.jpg',  color:'#f0e4ea' },
  { id:6, name:'Consumer Health', image:'/images/wellness.jpg', color:'#f0ece4' },
];

function ExpertiseSection() {
  return (
    <section id="domains" style={{ background: '#ffffff', padding: '5.5rem 2.5vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '4.5rem' }} className="reveal">
          <span className="eyebrow">Areas of expertise</span>
          <h2 className="section-title">Our Spheres of Competence</h2>
          <p className="section-lede" style={{ maxWidth: '100%', fontSize: '1.3rem', lineHeight: 1.5 }}>Our advisory spans the full spectrum of healthcare innovation.</p>
        </div>
        <div className="domains-grid reveal">
          {DOMAINS.map((dom) => (
            <div key={dom.id} className="domain-card">
              <div className="domain-img" style={{ backgroundImage: `url(${dom.image})`, backgroundColor: dom.color }} />
              <div className="domain-overlay" />
              <div className="domain-label">
                <h3 className="domain-name">{dom.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
const SERVICES = [
  { main: 'M&A', sub: '', desc: 'Sell-side, buy-side and strategic transaction advisory across the global healthcare ecosystem.' },
  { main: 'Fundraising', sub: '', desc: 'Targeted growth capital advisory from Pre-Seed to Series B financing, partnering with leading healthcare investors.' },
  { main: 'Strategic Partnerships', sub: '', desc: 'Value-creating licensing and partnership advisory alongside global and regional healthcare leaders.' },
  { main: 'Advisory Services', sub: '', desc: 'Independent strategic counsel on portfolio positioning, growth path and long-term value creation.' },
  { main: 'Capital Raising', sub: '', desc: 'Capital markets and structured financial advice, including IPOs, follow-ons, private placements and convertible debt.' },
];


function ServicesSection() {
  const ITEM_H = 72;
  const CYCLE = 2800;
  const TRANS = 600;
  const total = SERVICES.length;

  const [position, setPosition] = useState(total);
  const [noTransition, setNoTransition] = useState(false);
  const [descVisible, setDescVisible] = useState(true);

  const activeDataIndex = position % total;
  const items = useMemo(() => [...SERVICES, ...SERVICES, ...SERVICES], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDescVisible(false);
      setPosition(prev => prev + 1);
      setTimeout(() => setDescVisible(true), TRANS / 2 + 80);
    }, CYCLE);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (position >= total * 2) {
      const timeout = setTimeout(() => {
        setNoTransition(true);
        setPosition(prev => prev - total);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setNoTransition(false);
          });
        });
      }, TRANS + 50);
      return () => clearTimeout(timeout);
    }
  }, [position, total]);

  const getItemStyle = (globalIndex: number) => {
    const dist = Math.abs(globalIndex - position);
    const isActive = globalIndex === position;
    return {
      opacity: isActive ? 1 : Math.max(0.08, 0.3 - dist * 0.07),
      transform: `scale(${isActive ? 1 : 0.92})`,
      fontWeight: isActive ? 600 : 400,
      color: isActive ? 'var(--ink)' : 'var(--muted)',
      fontStyle: isActive ? 'normal' as const : 'italic' as const,
      transition: noTransition ? 'none' : `all ${TRANS}ms cubic-bezier(0.4,0,0.2,1)`,
    };
  };

  const svc = SERVICES[activeDataIndex];

  return (
    <section id="services" style={{ background: '#ffffff', padding: '3rem 2.5vw 5.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem' }} className="reveal">
          <span className="eyebrow">What we do</span>
          <h2 className="section-title">Our Services</h2>
        </div>

        <div className="svc-roll-layout reveal">
          {/* Left text */}
          <div className="svc-roll-left">
            <p className="svc-roll-text">We partner with healthcare companies at every stage of their journey, delivering tailored strategic, transactional and capital advisory.</p>
          </div>

          {/* Center rolling list */}
          <div className="svc-roll-center">
            <div
              className="svc-roll-track"
              style={{
                transform: `translateY(${-position * ITEM_H}px)`,
                transition: noTransition ? 'none' : `transform ${TRANS}ms cubic-bezier(0.4,0,0.2,1)`,
              }}
            >
              {items.map((s, i) => (
                <div
                  key={`${s.main}-${i}`}
                  className="svc-roll-item"
                  style={getItemStyle(i)}
                >
                  {s.main}
                </div>
              ))}
            </div>
          </div>

          {/* Right description */}
          <div className="svc-roll-right" style={{ opacity: descVisible ? 1 : 0, transform: descVisible ? 'translateY(0)' : 'translateY(6px)' }}>
            <p className="svc-roll-desc">{svc.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Domains Carousel (alternative version) ─── */
const DOMAINS_ALT = [
  { name:'Biotechnology',              image:'/images/biotech.jpg' },
  { name:'Pharmaceuticals',            image:'/images/pharma.jpg' },
  { name:'Medical Devices',            image:'/images/meddevice.jpg' },
  { name:'Diagnostics',                image:'/images/diagnostics.jpg' },
  { name:'Digital Health',             image:'/images/digital.jpg' },
  { name:'Healthcare Services',        image:'/images/diagnostics2.jpg' },
  { name:'Consumer Health & Wellness', image:'/images/pharma.jpg' },
];

/* Carousel arc geometry — parameterised for responsive sizing */
const carouselScaleF = (r: number) => 1 / (1 + r * 0.28);

function buildCumulativeX(baseW: number, gap: number, centerW: number) {
  const cumX: number[] = [0];
  /* First step: center card half-width → gap → first neighbour half-width */
  cumX.push(centerW / 2 + gap + (baseW * carouselScaleF(1)) / 2);
  for (let i = 1; i < 7; i++) {
    cumX.push(cumX[i] + (baseW * carouselScaleF(i)) / 2 + gap + (baseW * carouselScaleF(i + 1)) / 2);
  }
  return cumX;
}

function getSlotStyle(rel: number, baseW: number, baseH: number, cumX: number[], yFactor: number, centerW: number, centerH: number) {
  const absRel = Math.abs(rel);
  if (absRel > 7) return null;
  const x = (rel >= 0 ? 1 : -1) * cumX[absRel];
  const y = absRel * absRel * yFactor;
  const rot = rel * 2.5;
  const scale = carouselScaleF(absRel);
  const w = absRel === 0 ? centerW : Math.round(baseW * scale);
  const h = absRel === 0 ? centerH : Math.round(baseH * scale);
  const opacity = Math.max(0.12, 1 - absRel * 0.16);
  const z = 20 - absRel;
  const sa = Math.max(0.02, 0.12 - absRel * 0.02);
  const shadow = `0 ${Math.max(2, 12 - absRel * 2)}px ${Math.max(6, 40 - absRel * 6)}px rgba(0,0,0,${sa.toFixed(3)})`;
  return { x, y, w, h, rot, opacity, z, shadow };
}

function ExpertiseSectionAlt() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const total = DOMAINS_ALT.length;

  /* Responsive card dimensions — center card is square & wider */
  const [dims, setDims] = useState({ w: 250, h: 350, gap: 20, yF: 8, cW: 400, cH: 400 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw <= 480)      setDims({ w: 140, h: 196, gap: 10, yF: 4, cW: 220, cH: 220 });
      else if (vw <= 600) setDims({ w: 170, h: 238, gap: 14, yF: 5, cW: 270, cH: 270 });
      else if (vw <= 960) setDims({ w: 210, h: 294, gap: 16, yF: 6, cW: 340, cH: 340 });
      else                setDims({ w: 250, h: 350, gap: 20, yF: 8, cW: 400, cH: 400 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cumX = useMemo(() => buildCumulativeX(dims.w, dims.gap, dims.cW), [dims.w, dims.gap, dims.cW]);

  const navigate = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= total || newIndex === activeIndex) return;
    setLabelVisible(false);
    setActiveIndex(newIndex);
    setTimeout(() => setLabelVisible(true), 280);
  }, [activeIndex, total]);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!tabsRef.current) return;
    const tabEl = tabsRef.current.children[activeIndex] as HTMLElement;
    if (tabEl) {
      const container = tabsRef.current;
      const scrollLeft = tabEl.offsetLeft - container.offsetWidth / 2 + tabEl.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setIndicatorStyle({ left: tabEl.offsetLeft, width: tabEl.offsetWidth });
    }
  }, [activeIndex]);

  /* Render ALL cards — far ones naturally fade & shrink into the margins */
  const visibleCards: { catIndex: number; rel: number }[] = [];
  for (let i = 0; i < total; i++) {
    visibleCards.push({ catIndex: i, rel: i - activeIndex });
  }

  return (
    <section className="domains-alt-section" id="domains-alt">
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }} className="reveal">
          <span className="eyebrow">Areas of expertise</span>
          <h2 className="section-title">Our Spheres of Competence</h2>
          <p className="section-lede" style={{ maxWidth: '100%', fontSize: '1.3rem', lineHeight: 1.5, margin: '0 auto' }}>Our advisory spans the full spectrum of healthcare innovation.</p>
        </div>

        {/* Tabs with nav arrows */}
        <div className="dalt-nav reveal">
          <button className="dalt-arrow" onClick={() => navigate(activeIndex - 1)} disabled={activeIndex === 0}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
          </button>
          <div className="dalt-tabs" ref={tabsRef}>
            {DOMAINS_ALT.map((dom, i) => (
              <button key={dom.name} className={`dalt-tab${i === activeIndex ? ' active' : ''}`} onClick={() => navigate(i)}>
                {dom.name}
              </button>
            ))}
            <div className="dalt-indicator" style={{ left: indicatorStyle.left, width: indicatorStyle.width }} />
          </div>
          <button className="dalt-arrow" onClick={() => navigate(activeIndex + 1)} disabled={activeIndex === total - 1}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </button>
        </div>

        {/* Carousel */}
        <div className="dalt-carousel">
          {visibleCards.map(({ catIndex, rel }) => {
            const slot = getSlotStyle(rel, dims.w, dims.h, cumX, dims.yF, dims.cW, dims.cH);
            if (!slot) return null;
            const absRel = Math.abs(rel);
            const isCenter = rel === 0;
            const dom = DOMAINS_ALT[catIndex];
            return (
              <div
                key={catIndex}
                className="dalt-card"
                onClick={() => !isCenter && navigate(catIndex)}
                style={{
                  width: slot.w,
                  height: slot.h,
                  transform: `translateX(${slot.x - slot.w / 2}px) translateY(${slot.y - slot.h / 2}px) rotate(${slot.rot}deg)`,
                  zIndex: slot.z,
                  opacity: slot.opacity,
                  boxShadow: slot.shadow,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                <img src={dom.image} alt={dom.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div className="dalt-card-overlay" />
                {absRel <= 2 && (
                  <div className="dalt-card-label" style={{ opacity: isCenter ? 1 : 0.5 }}>
                    <h3 className="dalt-card-name">{dom.name}</h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active domain name below carousel */}
        <div className="dalt-active-label" style={{ opacity: labelVisible ? 1 : 0, transform: labelVisible ? 'translateY(0)' : 'translateY(8px)' }}>
          <span>{DOMAINS_ALT[activeIndex].name}</span>
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

    const check = () => {
      const vh = window.innerHeight;
      nodes.forEach(n => {
        if (n.classList.contains('visible')) return;
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) n.classList.add('visible');
      });
    };

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    check();
    nodes.forEach(n => { if (!n.classList.contains('visible')) io.observe(n); });

    window.addEventListener('scroll', check, { passive: true });
    const t = setTimeout(() => nodes.forEach(n => n.classList.add('visible')), 1800);
    return () => { io.disconnect(); clearTimeout(t); window.removeEventListener('scroll', check); };
  }, []);

  /* ── Transparent nav while hero is in view ── */
  useEffect(() => {
    const navOuter = navRef.current;
    const hero = heroRef.current;
    if (!navOuter || !hero) return;

    const onScroll = () => {
      navOuter.classList.toggle('nav-scrolled', window.scrollY > hero.offsetHeight + 1200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── DNA particle system ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d')!;
    const isMobile = window.innerWidth <= 600;
    const PARTICLE_COUNT = isMobile ? 18000 : 40000;
    const STICKY_PX = isMobile ? 800 : 1500;
    let W = 0, H = 0, scrollProgress = 0, raf = 0;

    let fadeEl: HTMLElement | null = null;

    /* Hero height — update on resize so the animation always fills the viewport */
    let lastW = window.innerWidth;
    const updateHeroH = () => {
      const h = window.innerHeight;
      hero.style.height = `${h}px`;
      hero.style.minHeight = `${h}px`;
      wrapper.style.height = `${h + STICKY_PX}px`;
    };

    const wrapper = document.createElement('div');
    wrapper.id = 'hero-wrapper';
    wrapper.style.cssText = `position:relative;height:${window.innerHeight + STICKY_PX}px;`;
    hero.parentNode!.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);
    hero.style.position = 'sticky';
    hero.style.top = '0';
    updateHeroH();

    fadeEl = document.createElement('div');
    fadeEl.id = 'hero-fade';
    hero.appendChild(fadeEl);

    /* Typed arrays for SoA particle data — avoids per-particle objects & GC */
    let pDnaX: Float32Array, pDnaY: Float32Array;
    let pDispX: Float32Array, pDispY: Float32Array;
    let pSpd: Float32Array, pPh: Float32Array;
    let pSize: Float32Array, pAlpha: Float32Array;
    let pX: Float32Array, pY: Float32Array;
    /* Alpha buckets for batched drawing (10 buckets) */
    const ALPHA_BUCKETS = 10;

    function buildParticles() {
      const N = PARTICLE_COUNT;
      pDnaX = new Float32Array(N); pDnaY = new Float32Array(N);
      pDispX = new Float32Array(N); pDispY = new Float32Array(N);
      pSpd = new Float32Array(N); pPh = new Float32Array(N);
      pSize = new Float32Array(N); pAlpha = new Float32Array(N);
      pX = new Float32Array(N); pY = new Float32Array(N);

      const ref = Math.max(W, H * 0.5);
      const SX0 = W*0.15, SY0 = H*1.02;
      const SX1 = W*0.85, SY1 = -H*0.02;
      const dvx = SX1-SX0, dvy = SY1-SY0, spineLen = Math.sqrt(dvx*dvx+dvy*dvy);
      const tx = dvx/spineLen, ty = dvy/spineLen;
      const px = -ty, py = tx;
      const TURNS = 3.5;
      const TWO_PI = Math.PI * 2;

      for (let i = 0; i < N; i++) {
        const frac = Math.random();
        const perspective = 0.35 + frac * 0.65;
        const AMP = ref * 0.09 * perspective;
        const sx = SX0 + tx * spineLen * frac;
        const sy = SY0 + ty * spineLen * frac;
        const isA = Math.random() < 0.5;
        const angle = frac * TURNS * TWO_PI + (isA ? 0 : Math.PI);
        const cosA = Math.cos(angle);
        const coreX = sx + px * cosA * AMP;
        const coreY = sy + py * cosA * AMP;

        let targetX = coreX, targetY = coreY;
        if (Math.random() < 0.10) {
          const otherCos = Math.cos(frac * TURNS * TWO_PI + (isA ? Math.PI : 0));
          const otherX = sx + px * otherCos * AMP;
          const otherY = sy + py * otherCos * AMP;
          const t2 = Math.random();
          targetX = coreX + (otherX - coreX) * t2;
          targetY = coreY + (otherY - coreY) * t2;
        }

        const u1 = Math.max(Math.random(), 1e-5);
        const mag = Math.sqrt(-2.0 * Math.log(u1));
        const scA = Math.random() * TWO_PI;
        const sigma = Math.pow(Math.random(), 0.65) * ref * 0.018 * perspective;
        const dnaX = targetX + Math.cos(scA) * mag * sigma;
        const dnaY = targetY + Math.sin(scA) * mag * sigma;

        const dist = Math.sqrt((dnaX - targetX)**2 + (dnaY - targetY)**2);
        const coreness = 1 - Math.min(dist / (ref * 0.018), 1);
        const isBright = Math.random() < 0.07;
        const sizeScale = 0.5 + perspective * 0.5;

        pDnaX[i] = dnaX; pDnaY[i] = dnaY;
        pDispX[i] = Math.random() * W; pDispY[i] = Math.random() * H;
        pSpd[i] = Math.random() * 0.10 + 0.025;
        pPh[i] = Math.random() * TWO_PI;
        pSize[i] = isBright
          ? (Math.random() * 0.9 + 0.4) * sizeScale
          : (Math.random() * 0.35 + 0.05) * sizeScale;
        pAlpha[i] = isBright
          ? Math.random() * 0.5 + 0.38
          : Math.max(0.01, coreness * coreness * (Math.random() * 0.65 + 0.12) + Math.random() * 0.025);
        pX[i] = dnaX; pY[i] = dnaY;
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
      const t = Date.now() * .001;
      const prog = scrollProgress;
      const eased = prog < .5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2, 2)/2;
      const N = PARTICLE_COUNT;
      const TWO_PI = Math.PI * 2;

      /* Update all positions (tight numeric loop) */
      const wobbleScale = 1.5 + eased * 2.0;
      const wobbleScaleY = 1.2 + eased * 1.8;
      for (let i = 0; i < N; i++) {
        const baseX = pDnaX[i] + (pDispX[i] - pDnaX[i]) * eased;
        const baseY = pDnaY[i] + (pDispY[i] - pDnaY[i]) * eased;
        const phase = t * pSpd[i] + pPh[i];
        pX[i] = baseX + Math.sin(phase) * wobbleScale;
        pY[i] = baseY + Math.cos(phase * 0.88) * wobbleScaleY;
      }

      /* Draw batched by alpha bucket — drastically reduces fillStyle switches */
      const alphaFade = 1 - eased * 0.3;
      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        const lo = b / ALPHA_BUCKETS, hi = (b + 1) / ALPHA_BUCKETS;
        const bucketAlpha = ((lo + hi) / 2) * alphaFade;
        ctx.fillStyle = `rgba(255,255,255,${bucketAlpha.toFixed(3)})`;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          if (pAlpha[i] >= lo && pAlpha[i] < hi) {
            ctx.moveTo(pX[i] + pSize[i], pY[i]);
            ctx.arc(pX[i], pY[i], pSize[i], 0, TWO_PI);
          }
        }
        ctx.fill();
      }
      if (fadeEl) {
        const fadeOpacity = Math.min(Math.max((scrollProgress - 0.15) / 0.60, 0), 1);
        fadeEl.style.opacity = String(fadeOpacity);
      }
      raf=requestAnimationFrame(animate);
    }

    const onScroll=()=>{ scrollProgress=Math.min(Math.max(window.scrollY/STICKY_PX,0),1); };
    window.addEventListener('scroll',onScroll,{passive:true});

    const onResize = () => {
      const curW = window.innerWidth;
      /* On mobile, skip height-only changes (address-bar toggle) */
      if (curW !== lastW || curW > 600) { updateHeroH(); lastW = curW; }
      resize();
    };
    window.addEventListener('resize', onResize);

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
      window.removeEventListener('resize',onResize);
      if(fadeEl && fadeEl.parentNode) fadeEl.parentNode.removeChild(fadeEl);
      if(wrapper.parentNode){wrapper.parentNode.insertBefore(hero,wrapper);wrapper.parentNode.removeChild(wrapper);}
      hero.style.position=''; hero.style.top='';
      hero.style.height=''; hero.style.minHeight='';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          --blue:   #2a5cb8;
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
        .logo-name{font-size:1.05rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#fff;transition:color .35s;}
        .nav-links{display:flex;gap:1.2rem;align-items:center;}
        .nav-links a{font-size:.88rem;font-weight:500;color:#fff;padding:.5rem 1rem;transition:color .18s;letter-spacing:.02em;}
        .nav-links a:hover{color:#fff;}
        .nav-cta{
          margin-left:.5rem;
          background:#fff!important;color:var(--ink)!important;
          padding:.65rem 1.7rem!important;border-radius:9999px;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:.85rem!important;font-weight:600!important;
          border:1.5px solid #fff;
          transition:background .22s!important,color .22s!important,box-shadow .22s!important,border-color .18s var(--ease),border-radius .18s var(--ease);
        }
        .nav-cta:hover{background:#fff!important;color:var(--ink)!important;border-color:#fff;border-radius:9999px;}
        .nav-scrolled nav{background:#fff;border-bottom:1px solid var(--line);box-shadow:0 1px 12px rgba(0,0,0,0.06);}
        .nav-scrolled .logo-ap{color:var(--ink);}
        .nav-scrolled .logo-sep{background:var(--line);}
        .nav-scrolled .logo-name{color:var(--muted);}
        .nav-scrolled .nav-links a{color:var(--muted);}
        .nav-scrolled .nav-links a:hover{color:var(--ink);}
        .nav-scrolled .nav-cta{background:var(--ink)!important;color:#fff!important;border-radius:9999px;border-color:var(--ink);}
        .nav-scrolled .nav-cta:hover{background:var(--blue)!important;border-color:var(--blue);}

        /* ── HERO ── */
        .hero{
          position:relative;min-height:100vh;min-height:100dvh;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:0 4vw;color:#fff;
          /* Richer deep-navy background with subtle radial warmth for life-science feel */
          background:radial-gradient(ellipse 80% 60% at 50% 40%, #05122e 0%, #020a1e 50%, #010510 100%);
        }
        #hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
        #hero-fade{
          position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(to top,
            #ffffff 0%,
            #fcfdff 1%,
            #f8faff 2%,
            #f0f4ff 4%,
            #e0eaff 6%,
            #d0e0ff 8%,
            #b8d2f5 11%,
            #a0c2f0 14%,
            #7aacec 18%,
            #5a90d8 22%,
            #3e74c8 25%,
            #2a5cb8 28%,
            #1e48a0 32%,
            #143690 36%,
            #0a1880 42%,
            #071260 48%,
            #050e42 53%,
            #030a24 58%,
            rgba(3,10,36,0.85) 62%,
            rgba(3,10,36,0.7) 65%,
            rgba(3,10,36,0.55) 68%,
            rgba(3,10,36,0.4) 71%,
            rgba(3,10,36,0.28) 74%,
            rgba(3,10,36,0.16) 77%,
            rgba(3,10,36,0.08) 80%,
            rgba(3,10,36,0.03) 84%,
            transparent 88%
          );
          opacity:0;
          transition:opacity 0.05s linear;
        }
        .hero-inner{
          position:relative;z-index:2;
          max-width:1500px;
          padding-top:5rem;
          padding-bottom:2.5rem;
          text-align:center;
        }
        .hero-h1{
          font-family:var(--serif);font-weight:500;
          font-size:clamp(2.8rem,4.8vw,4.6rem);
          line-height:1.06;letter-spacing:-.015em;margin-bottom:1.4rem;
          max-width:100%;margin-left:auto;margin-right:auto;
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
          position:relative;font-size:.95rem;font-weight:500;letter-spacing:.06em;
          color:#fff;padding:0 .2rem;
        }
        .hero-tags span:not(:last-child)::after{
          content:'';display:inline-block;width:1px;height:14px;
          background:rgba(255,255,255,.5);margin:0 .65rem;
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
        .section{max-width:1440px;margin:0 auto;padding:5.5rem 2.5vw;color:var(--ink);}
        .section-bg{background:var(--white);}
        .eyebrow{display:block;font-size:.72rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem;}
        .section-title{font-family:var(--serif);font-weight:400;font-size:clamp(2.2rem,4vw,3.6rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:1rem;}
        .section-lede{color:var(--muted);font-size:.78rem;max-width:26ch;font-weight:300;line-height:1.72;}
        .section-head{margin-bottom:4.5rem;}

        /* ── APPROACH ── */
        .approach-panels{display:flex;flex-direction:column;gap:1px;background:var(--line);}
        .approach-panel{display:grid;grid-template-columns:1fr 1fr;background:#f0f4fa;}
        .approach-text{padding:1.5rem 2rem 1.5rem 0;display:flex;flex-direction:column;justify-content:center;border-right:1px solid var(--line);}
        .approach-num{font-family:var(--serif);font-style:italic;font-size:1.1rem;color:var(--blue);margin-bottom:1rem;display:block;}
        .approach-title{font-family:var(--serif);font-weight:500;font-size:clamp(1.5rem,2vw,1.6rem);letter-spacing:-.01em;margin-bottom:.4rem;line-height:1.1;}
        .approach-desc{color:var(--muted);font-size:1.05rem;line-height:1.65;font-weight:300;}
        .approach-canvas-wrap{background:#f0f4fa;height:260px;display:flex;align-items:center;justify-content:center;padding:1rem;overflow:hidden;}

        /* ── VALUES ── */
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);}
        .value-card{background:#f0f4fa;padding:3.5rem 2.8rem;transition:background .25s;}
        .value-card:hover{background:#f8f8fc;}
        .value-tag{display:inline-block;font-size:.7rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);border:1px solid var(--blue);padding:.28rem .8rem;border-radius:100px;margin-bottom:1.4rem;}
        .value-title{font-family:var(--serif);font-weight:400;font-size:1.6rem;letter-spacing:-.01em;margin-bottom:.9rem;line-height:1.2;}
        .value-desc{color:var(--muted);font-size:.95rem;line-height:1.72;font-weight:300;}

        /* ── METHOD ── */
        .method-list{margin-top:4.5rem;border-top:1px solid var(--line);}
        .method-step{display:grid;grid-template-columns:80px 1fr;align-items:center;gap:2.5rem;padding:2rem 0;border-bottom:1px solid var(--line);}
        .step-num{font-family:var(--serif);font-style:italic;font-size:1.1rem;color:var(--blue);}
        .step-body h4{font-family:var(--serif);font-weight:500;font-size:1.6rem;letter-spacing:-.01em;margin-bottom:.4rem;}
        .step-body p{color:var(--muted);font-size:1.05rem;line-height:1.65;font-weight:300;}

        /* ── ABOUT ── */
        .about-split{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;}
        .about-lede{color:var(--muted);font-size:1.05rem;line-height:1.8;margin-top:1.2rem;font-weight:300;}
        .about-links{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap;}
        .btn-dark{background:var(--ink);color:#fff;padding:.9rem 2rem;border-radius:100px;font-size:.75rem;font-weight:500;letter-spacing:.04em;transition:background .22s,transform .2s,box-shadow .22s;}
        .btn-dark:hover{background:var(--blue);transform:translateY(-2px);box-shadow:0 10px 26px rgba(42,92,184,.2);}
        .btn-outline{border:1.5px solid var(--line);color:var(--ink);padding:.9rem 2rem;border-radius:100px;font-size:.75rem;font-weight:500;letter-spacing:.04em;transition:border-color .22s,color .22s;}
        .btn-outline:hover{border-color:var(--blue);color:var(--blue);}
        .about-dark{background:var(--dark);border-radius:4px;padding:3.5rem 3rem;color:#fff;position:relative;overflow:hidden;}
        .about-dark::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(42,92,184,.22) 0%,transparent 70%);border-radius:50%;}
        .about-dark-label{font-family:var(--serif);font-weight:400;font-size:1.3rem;letter-spacing:-.01em;margin-bottom:1.5rem;position:relative;}

        /* ── CONTACT ── */
        .contact-wrap{max-width:860px;margin:0 auto;padding:5.5rem 2.5vw;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .contact-form{margin-top:3.5rem;text-align:left;display:flex;flex-direction:column;gap:1.2rem;width:100%;max-width:600px;}
        .fl{display:block;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.45rem;}
        .fi,.ft{width:100%;background:var(--white);border:1.5px solid #dddde8;border-radius:8px;padding:.9rem 1.15rem;font-family:var(--sans);font-size:.95rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus,.ft:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(42,92,184,.1);}
        .ft{min-height:130px;resize:vertical;}
        .fc{display:flex;gap:.7rem;align-items:flex-start;font-size:.75rem;color:var(--muted);cursor:pointer;line-height:1.55;font-weight:300;}
        .fc input{margin-top:3px;flex-shrink:0;accent-color:var(--blue);}
        .submit-btn{align-self:center;background:var(--ink);color:#fff;border:1.5px solid var(--ink);padding:1rem 3rem;border-radius:9999px;font-family:var(--sans);font-size:.85rem;font-weight:600;letter-spacing:.02em;cursor:pointer;transition:background .22s,transform .2s,box-shadow .22s,color .22s,border-color .22s;}
        .submit-btn:hover{background:var(--blue);border-color:var(--blue);transform:translateY(-2px);box-shadow:0 10px 28px rgba(42,92,184,.2);}

        /* ── SERVICES ROLLING LIST ── */
        .svc-roll-layout{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:3rem;align-items:center;}
        .svc-roll-left{}
        .svc-roll-text{font-family:var(--sans);font-size:1.05rem;line-height:1.7;color:var(--muted);font-weight:300;max-width:340px;}
        .svc-roll-center{position:relative;height:360px;overflow:hidden;
          mask-image:linear-gradient(to bottom,transparent 0%,black 18%,black 82%,transparent 100%);
          -webkit-mask-image:linear-gradient(to bottom,transparent 0%,black 18%,black 82%,transparent 100%);}
        .svc-roll-track{display:flex;flex-direction:column;align-items:center;padding-top:144px;}
        .svc-roll-item{height:72px;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:clamp(1.6rem,2.8vw,2.6rem);letter-spacing:-.02em;cursor:pointer;white-space:nowrap;transform-origin:center;user-select:none;}
        .svc-roll-right{display:flex;align-items:center;transition:opacity .4s ease,transform .4s ease;}
        .svc-roll-desc{font-family:var(--sans);font-size:1rem;line-height:1.7;color:var(--muted);font-weight:300;margin:0;max-width:360px;}

        /* ── SECTOR TICKER ── */
        .sector-ticker{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:1.1rem 0;white-space:nowrap;}
        .sector-ticker-track{display:flex;width:max-content;animation:tickerScroll 120s linear infinite;}
        .sector-ticker-set{display:flex;gap:0;flex-shrink:0;}
        .sector-ticker-item{font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:0 2.2rem;opacity:.55;display:flex;align-items:center;gap:.55rem;}
        .sector-ticker-item::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--blue);flex-shrink:0;}
        @keyframes tickerScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

        /* ── FOOTER ── */
        footer{background:#030a24;color:#fff;padding:3rem 2.5vw 2rem;}
        .footer-inner{max-width:1440px;margin:0 auto;}

        .footer-top{display:grid;grid-template-columns:1fr auto;gap:4rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,.08);align-items:start;}
        .footer-logo-wrap{display:flex;align-items:center;gap:.7rem;margin-bottom:.8rem;}
        .footer-logo{font-family:var(--serif);font-style:italic;font-weight:500;font-size:1.4rem;color:#fff;letter-spacing:-.01em;}
        .footer-logo-sep{width:1px;height:14px;background:rgba(255,255,255,.25);}
        .footer-brand-name{font-size:1.05rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#fff;}
        .footer-brand-desc{font-size:.82rem;line-height:1.7;color:rgba(255,255,255,.35);font-weight:300;max-width:28ch;margin-bottom:1rem;}
        .footer-contact{display:flex;flex-direction:column;gap:.3rem;}
        .footer-contact a,.footer-contact span{font-size:.78rem;color:rgba(255,255,255,.4);font-weight:300;transition:color .18s;}
        .footer-contact a:hover{color:#fff;}

        .footer-links{display:flex;gap:3.5rem;flex-wrap:wrap;}
        .footer-col-title{font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:.9rem;}
        .footer-col a{display:block;font-size:.82rem;color:rgba(255,255,255,.45);margin-bottom:.55rem;transition:color .18s;font-weight:300;}
        .footer-col a:hover{color:#fff;}

        .footer-bottom{padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;}
        .footer-copy{font-size:.65rem;color:rgba(255,255,255,.22);letter-spacing:.04em;}

        /* ── DOMAINS GRID ── */
        .domains-grid{display:flex;gap:10px;}
        .domain-card{position:relative;border-radius:14px;overflow:hidden;flex:1;aspect-ratio:1/1;cursor:pointer;transition:flex .5s cubic-bezier(0.22,0.61,0.36,1);}
        .domains-grid:hover .domain-card{flex:0.85;}
        .domains-grid:hover .domain-card:hover{flex:2;}
        .domain-img{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .55s cubic-bezier(0.16,1,0.3,1);}
        .domain-card:hover .domain-img{transform:none;}
        .domain-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.05) 50%,transparent 100%);transition:background .35s ease;}
        .domain-card:hover .domain-overlay{background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.1) 60%,transparent 100%);}
        .domain-label{position:absolute;bottom:0;left:0;right:0;padding:1.2rem 1rem;}
        .domain-num{display:none;}
        .domain-name{font-family:var(--serif);font-weight:500;font-size:1rem;line-height:1.2;letter-spacing:-0.01em;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);}

        /* ── DOMAINS CAROUSEL (v2) ── */
        .domains-alt-section{background:#fff;padding:5.5rem 2.5vw;overflow:hidden;}
        .dalt-nav{display:flex;align-items:center;gap:8px;margin-top:2.5rem;max-width:900px;margin-left:auto;margin-right:auto;}
        .dalt-arrow{width:42px;height:42px;border-radius:50%;border:1.5px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s,color .2s;}
        .dalt-arrow:hover:not(:disabled){border-color:var(--blue);color:var(--blue);}
        .dalt-arrow:disabled{opacity:.25;cursor:default;}
        .dalt-tabs{display:flex;gap:0;overflow-x:auto;flex:1;scrollbar-width:none;-ms-overflow-style:none;position:relative;padding-bottom:3px;}
        .dalt-tabs::-webkit-scrollbar{display:none;}
        .dalt-tab{white-space:nowrap;padding:10px 16px;font-size:.84rem;border:none;background:none;font-family:var(--sans);cursor:pointer;color:var(--muted);font-weight:400;transition:color .25s ease;letter-spacing:.01em;}
        .dalt-tab:hover{color:var(--ink);}
        .dalt-tab.active{color:var(--ink);font-weight:500;}
        .dalt-indicator{position:absolute;bottom:0;height:2px;background:var(--ink);border-radius:1px;transition:left .4s cubic-bezier(0.33,1,0.68,1),width .4s cubic-bezier(0.33,1,0.68,1);pointer-events:none;}
        .dalt-carousel{width:100%;margin-top:2.5rem;position:relative;height:460px;}
        .dalt-card{position:absolute;left:50%;top:50%;border-radius:14px;overflow:hidden;transition:transform .7s cubic-bezier(0.33,1,0.68,1),opacity .5s ease,width .7s cubic-bezier(0.33,1,0.68,1),height .7s cubic-bezier(0.33,1,0.68,1),box-shadow .5s ease;will-change:transform,opacity,width,height;}
        .dalt-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.05) 45%,transparent 100%);}
        .dalt-card-label{position:absolute;bottom:0;left:0;right:0;padding:1.5rem 1.3rem;transition:opacity .3s ease;}
        .dalt-card-name{font-family:var(--serif);font-weight:500;font-size:1.1rem;line-height:1.2;color:#fff;margin:0;text-shadow:0 1px 10px rgba(0,0,0,0.4);}
        .dalt-active-label{text-align:center;margin-top:.5rem;transition:opacity .35s ease,transform .35s ease;}
        .dalt-active-label span{font-family:var(--serif);font-weight:500;font-size:1.6rem;letter-spacing:-.01em;color:var(--ink);}

        /* ── REVEAL ── */
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-d1{transition-delay:.1s;}
        .reveal-d2{transition-delay:.18s;}
        .reveal-d3{transition-delay:.26s;}
        .reveal-d4{transition-delay:.34s;}
        .reveal-d5{transition-delay:.42s;}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .nav-links a:not(.nav-cta){display:none;}
          .nav-cta{padding:.55rem 1.3rem!important;font-size:.78rem!important;white-space:nowrap;}
          .approach-panel{grid-template-columns:1fr;}
          .approach-canvas-wrap{min-height:220px;height:220px;}
          .values-grid{grid-template-columns:1fr;}
          .about-split{grid-template-columns:1fr;gap:3rem;}
          .method-step{grid-template-columns:60px 1fr;}
          .step-arrow{display:none;}
          .svc-roll-layout{grid-template-columns:1fr 1.2fr 1fr;gap:2rem;}
          .svc-roll-text{font-size:.95rem;}
          .svc-roll-item{font-size:clamp(1.4rem,2.4vw,2.2rem);}
          .svc-roll-desc{font-size:.92rem;}
          .domains-grid{flex-wrap:wrap;gap:10px;}
          .domain-card{flex:1;aspect-ratio:1/1;height:auto;}
          .dalt-carousel{height:400px;}
          .domains-alt-section{padding:5rem 2.5vw;}
        }
        @media(max-width:600px){
          /* Disable min-height on mobile */
          #services,#domains,#approach,#method{min-height:auto!important;}

          /* Nav */
          nav{padding:0 3.5vw;height:56px;}
          .logo-ap{font-size:1.3rem;}
          .logo-name{font-size:.75rem;letter-spacing:.08em;}
          .logo-sep{height:13px;}
          .nav-cta{padding:.48rem 1.1rem!important;font-size:.72rem!important;}

          /* Hero */
          .hero{padding:0!important;}
          .hero-h1{font-size:clamp(2.2rem,9vw,3.2rem);}
          .hero-inner{padding-top:3.5rem;padding-bottom:1.5rem;}
          .hero-ctas{gap:.6rem;}
          .btn-primary,.btn-secondary{padding:.72rem 1.5rem;font-size:.8rem;}
          .hero-tags span{font-size:.7rem;}

          /* Sections */
          .section{padding:4.5rem 2.5vw;}
          .section-title{font-size:clamp(1.8rem,7vw,2.4rem);}
          .section-head{margin-bottom:3rem;}
          .eyebrow{font-size:.65rem;margin-bottom:.7rem;}

          /* Services */
          .svc-roll-layout{grid-template-columns:1fr!important;gap:1.5rem;text-align:center;}
          .svc-roll-left{display:none;}
          .svc-roll-right{justify-content:center;}
          .svc-roll-center{height:280px;}
          .svc-roll-track{padding-top:104px;}
          .svc-roll-item{font-size:clamp(1.2rem,5vw,1.8rem);}
          .svc-roll-desc{max-width:100%;font-size:.9rem;text-align:center;}

          /* Approach */
          .approach-text{padding:1.5rem 1.5rem 1.5rem 0;}
          .approach-title{font-size:1.3rem;}
          .approach-desc{font-size:.85rem;}
          .approach-canvas-wrap{min-height:180px;padding:1.5rem;}

          /* Domains */
          .domains-grid{flex-wrap:wrap;gap:8px;}
          .domain-card{flex:1 1 calc(50% - 8px)!important;max-width:calc(50% - 4px);aspect-ratio:1/1;height:auto;border-radius:10px;}
          .domain-label{padding:1rem .8rem;}
          .domain-name{font-size:.9rem;}

          /* Domains carousel */
          .domains-alt-section{padding:4rem 2.5vw;}
          .dalt-carousel{height:380px;}
          .dalt-arrow{width:36px;height:36px;}
          .dalt-tab{font-size:.75rem;padding:6px 8px;}
          .dalt-active-label span{font-size:1.2rem;}

          /* Method */
          .method-step{grid-template-columns:48px 1fr;gap:1.5rem;padding:1.5rem 0;}
          .step-num{font-size:.95rem;}
          .step-body h4{font-size:1.15rem;}
          .step-body p{font-size:.85rem;}

          /* Contact */
          .contact-wrap{padding:4.5rem 2.5vw;}
          .fi,.ft{padding:.8rem 1rem;font-size:.9rem;}

          /* Footer */
          footer{padding:2.5rem 2.5vw 2rem;}
          .footer-top{grid-template-columns:1fr;gap:2rem;}
          .footer-links{gap:2rem 3rem;}
          .footer-bottom{flex-direction:column;align-items:flex-start;gap:.6rem;}
        }
        @media(max-width:480px){
          /* Services */
          .svc-roll-center{height:240px;}
          .svc-roll-track{padding-top:84px;}
          .svc-roll-item{font-size:clamp(1.1rem,4.5vw,1.5rem);height:60px;}
          .svc-roll-desc{font-size:.82rem;}

          /* Ticker */
          .sector-ticker{padding:.8rem 0;}
          .sector-ticker-item{font-size:.65rem;padding:0 1.4rem;}

          /* Approach */
          .approach-canvas-wrap{min-height:150px;height:150px;padding:1rem;}
          .approach-title{font-size:1.15rem;}
          .approach-desc{font-size:.8rem;}

          /* Domains carousel */
          .dalt-carousel{height:320px;}
          .dalt-arrow{width:32px;height:32px;}
          .dalt-tab{font-size:.68rem;padding:5px 6px;}
          .dalt-active-label span{font-size:1rem;}

          /* Method */
          .method-step{grid-template-columns:40px 1fr;gap:1.2rem;}
          .step-num{font-size:.85rem;}
          .step-body h4{font-size:1.05rem;}
          .step-body p{font-size:.8rem;}

          /* Contact */
          .contact-wrap{padding:3.5rem 2.5vw;}
        }
        @media(max-width:380px){
          .logo-name{display:none;}
          .logo-sep{display:none;}

          /* Services */
          .svc-roll-center{height:200px;}
          .svc-roll-track{padding-top:70px;}
          .svc-roll-item{font-size:1rem;height:52px;}

          /* Ticker */
          .sector-ticker-item{font-size:.6rem;padding:0 1rem;}

          /* Domains */
          .domain-name{font-size:1rem;}
          .domains-grid{gap:8px;}
          .dalt-carousel{height:280px;}

          /* Approach */
          .approach-canvas-wrap{min-height:120px;height:120px;}
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
            <a href="#approach">Approach</a>
            <a href="#domains">Domains</a>
            <a href="#method">Method</a>
            <a href="#contact" className="nav-cta">Contact us</a>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <header className="hero" ref={heroRef}>
        <canvas id="hero-canvas" ref={canvasRef} />
        <div className="hero-inner">
          <h1 className="hero-h1">
            <span className="hero-line hero-line-1" style={{display:'block'}}>Independent strategic and</span>
            <span className="hero-line hero-line-2" style={{display:'block'}}>financial advisory services dedicated</span>
            <span className="hero-line hero-line-3" style={{display:'block'}}><em>to healthcare innovation</em></span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div className="hero-tags">
            <span>M&amp;A</span><span>Fundraising</span><span>Licensing</span><span>Growth</span>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <ServicesSection />

      {/* SECTOR TICKER */}
      <div className="sector-ticker">
        <div className="sector-ticker-track">
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="sector-ticker-set" aria-hidden={copy > 0}>
              {['Oncology','Rare Diseases','Gene Therapy','Cell Therapy','Neuroscience','Immunology','Cardiology','Respiratory','Metabolic Disorders','Infectious Diseases','Ophthalmology','Dermatology','Women\'s Health','Pediatrics','CNS','Microbiome','RNA Therapeutics','Radiopharmaceuticals'].map((s, i) => (
                <span key={i} className="sector-ticker-item">{s}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* APPROACH */}
      <div style={{ background: '#f0f4fa', width: '100%' }}>
      <section style={{ padding: '5.5rem 2.5vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }} id="approach">
      <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '3.5rem', textAlign: 'left' }} className="reveal">
          <span className="eyebrow">What sets us apart</span>
          <h2 className="section-title">Our Approach</h2>
          <p className="section-lede" style={{ maxWidth: '100%', fontSize: '1.15rem', lineHeight: 1.5 }}>A unique combination of scientific expertise, strategic networks and institutional-grade execution; purpose-built for healthcare companies.</p>
        </div>
        <div className="approach-panels">
          <div className="approach-panel reveal">
            <div className="approach-text">
              <div className="approach-title">Scientific &amp; technical expertise</div>
              <p className="approach-desc">Firsthand knowledge of science and technology, backed by advanced medical and scientific academic training. We speak the language of innovation, and the language of markets.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="brain" /></div>
          </div>
          <div className="approach-panel reveal reveal-d1">
            <div className="approach-text">
              <div className="approach-title">Targeted global network</div>
              <p className="approach-desc">A curated ecosystem of leading healthcare VCs, global and regional strategic partners, forged through years of active involvement in the sector.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="network" /></div>
          </div>
          <div className="approach-panel reveal reveal-d2">
            <div className="approach-text">
              <div className="approach-title">Execution excellence</div>
              <p className="approach-desc">The rigour and standards of top-tier investment banks, with decades of institutional experience, combined with the flexibility and hands-on dedication that high-growth companies demand.</p>
            </div>
            <div className="approach-canvas-wrap"><ApproachCanvas type="curve" /></div>
          </div>
        </div>
      </div>
      </section>
      </div>

      <ExpertiseSection />

      {/* METHOD */}
      <div style={{ background: '#f0f4fa', width: '100%' }}>
      <section style={{ padding: '5.5rem 2.5vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }} id="method">
      <div style={{ maxWidth: 1440, margin: '0 auto', width: '100%' }}>
        <div className="section-head reveal">
          <span className="eyebrow">Methodology</span>
          <h2 className="section-title">Proven Process</h2>
          <p className="section-lede" style={{ maxWidth: '100%', fontSize: '1.3rem', lineHeight: 1.5 }}>A structured, disciplined approach to every engagement, designed to maximise outcomes.</p>
        </div>
        <div className="method-list">
          {[
            ['01','Strategic Audit',  'In-depth assessment of positioning, technology, pipeline, competitive landscape and transaction objectives.'],
            ['02','Structuring',      'Development of a compelling investment narrative, robust financial modelling, preparation of investor-ready materials and data room build-up.'],
            ['03','Targeted Outreach','Identification and confidential engagement of the most relevant counterparties — strategic partners, investors or partners.'],
            ['04','Process Management','End-to-end coordination of workflows, Q&A, due diligence and advisory management.'],
            ['05','Closing & Execution','Negotiation of final terms, resolution of closing conditions and securing of the signature.'],
          ].map(([num,title,copy])=>(
            <div className="method-step reveal" key={num}>
              <div className="step-num">{num}</div>
              <div className="step-body"><h4>{title}</h4><p>{copy}</p></div>
            </div>
          ))}
        </div>
      </div>
      </section>
      </div>

      {/* CONTACT */}
      <div style={{background:'var(--white)',borderTop:'1px solid var(--line)'}} id="contact">
        <div className="contact-wrap">
          <div className="reveal">
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">Let&apos;s discuss your project</h2>
            <p className="section-lede" style={{margin:'1rem auto 0',textAlign:'center',maxWidth:'100%',fontSize:'1.35rem'}}>
              Reach out to explore how we can help you achieve your strategic objectives.
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

          {/* ── Main grid: brand + links ── */}
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-wrap">
                <span className="footer-logo">AP</span>
                <span className="footer-logo-sep"></span>
                <span className="footer-brand-name">Ambroise Partners</span>
              </div>
              <p className="footer-brand-desc">
                Healthcare focused advisory
              </p>
              <div className="footer-contact">
                <a href="mailto:contact@ambroisepartners.com">contact@ambroisepartners.com</a>
                <span>Paris · London</span>
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
                <a href="#services">Services</a>
                <a href="#approach">Approach</a>
                <a href="#domains">Domains</a>
                <a href="#method">Method</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <a href="/legal">Legal notice</a>
                <a href="/privacy">Privacy policy</a>
                <a href="/cookies">Cookie policy</a>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Ambroise Partners. All rights reserved.</div>
          </div>

        </div>
      </footer>
    </>
  );
}

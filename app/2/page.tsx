'use client';

import React, { useEffect, useRef, useState, type FormEvent } from 'react';

/* ─── Approach canvas (same animations, renders better on black) ─── */
function ApproachCanvas({ type }: { type: 'brain' | 'network' | 'curve' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0, W = 0, H = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };

    if (type === 'brain') {
      const nodes: { x:number; y:number; vx:number; vy:number; r:number }[] = [];
      const N = 55;
      const init = () => { nodes.length=0; for(let i=0;i<N;i++) nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+1.2}); };
      const draw = () => {
        ctx.clearRect(0,0,W,H);
        nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});
        for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle=`rgba(15,47,255,${0.28*(1-d/110)})`;ctx.lineWidth=0.8;ctx.stroke();}}
        nodes.forEach(n=>{ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle='rgba(15,47,255,0.75)';ctx.fill();});
        raf=requestAnimationFrame(draw);
      };
      resize();init();draw();
      window.addEventListener('resize',()=>{resize();init();});
      return ()=>cancelAnimationFrame(raf);
    }
    if (type === 'network') {
      const hubs=[{x:.5,y:.5,r:6},{x:.18,y:.28,r:3.5},{x:.82,y:.28,r:3.5},{x:.18,y:.72,r:3.5},{x:.82,y:.72,r:3.5},{x:.5,y:.12,r:2.8},{x:.5,y:.88,r:2.8},{x:.12,y:.5,r:2.8},{x:.88,y:.5,r:2.8}];
      let t=0;
      const draw=()=>{
        ctx.clearRect(0,0,W,H);t+=0.018;
        const cx=hubs[0].x*W,cy=hubs[0].y*H;
        const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,W*.28);
        grad.addColorStop(0,'rgba(15,47,255,0.15)');grad.addColorStop(1,'rgba(15,47,255,0)');
        ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,W*.28,0,Math.PI*2);ctx.fill();
        hubs.slice(1).forEach((h,i)=>{const hx=h.x*W,hy=h.y*H;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(hx,hy);ctx.strokeStyle=`rgba(15,47,255,${0.22+0.10*Math.sin(t+i)})`;ctx.lineWidth=1;ctx.stroke();const p=(Math.sin(t*.8+i*1.1)+1)/2;const px2=cx+(hx-cx)*p,py2=cy+(hy-cy)*p;ctx.beginPath();ctx.arc(px2,py2,2,0,Math.PI*2);ctx.fillStyle='rgba(15,47,255,0.85)';ctx.fill();ctx.beginPath();ctx.arc(hx,hy,h.r,0,Math.PI*2);ctx.fillStyle=`rgba(15,47,255,${0.55+0.15*Math.sin(t+i)})`;ctx.fill();});
        ctx.beginPath();ctx.arc(cx,cy,hubs[0].r*(1+.12*Math.sin(t)),0,Math.PI*2);ctx.fillStyle='rgba(15,47,255,0.9)';ctx.fill();
        raf=requestAnimationFrame(draw);
      };
      resize();draw();window.addEventListener('resize',resize);return()=>cancelAnimationFrame(raf);
    }
    if (type === 'curve') {
      let t=0;
      const draw=()=>{
        ctx.clearRect(0,0,W,H);t+=0.022;
        const pts=80,pad={x:W*.1,y:H*.12},iW=W-pad.x*2,iH=H-pad.y*2;
        for(let i=0;i<=4;i++){const y=pad.y+iH*(1-i/4);ctx.beginPath();ctx.moveTo(pad.x,y);ctx.lineTo(pad.x+iW,y);ctx.strokeStyle='rgba(15,47,255,0.10)';ctx.lineWidth=1;ctx.stroke();}
        ctx.beginPath();ctx.moveTo(pad.x,pad.y+iH);
        for(let i=0;i<=pts;i++){const fx=i/pts,fy=Math.pow(fx,1.6)+Math.sin(fx*Math.PI*2+t)*0.06*(1-fx*.5),x=pad.x+fx*iW,y=pad.y+iH*(1-Math.min(fy,1));i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.lineTo(pad.x+iW,pad.y+iH);ctx.closePath();
        const fill=ctx.createLinearGradient(0,pad.y,0,pad.y+iH);fill.addColorStop(0,'rgba(15,47,255,0.18)');fill.addColorStop(1,'rgba(15,47,255,0.01)');ctx.fillStyle=fill;ctx.fill();
        ctx.beginPath();
        for(let i=0;i<=pts;i++){const fx=i/pts,fy=Math.pow(fx,1.6)+Math.sin(fx*Math.PI*2+t)*0.06*(1-fx*.5),x=pad.x+fx*iW,y=pad.y+iH*(1-Math.min(fy,1));i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle='rgba(15,47,255,0.9)';ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
        const lastFy=Math.pow(1,1.6)+Math.sin(Math.PI*2+t)*0.06*.5;
        const dotY=pad.y+iH*(1-Math.min(lastFy,1));
        ctx.beginPath();ctx.arc(pad.x+iW,dotY,4.5,0,Math.PI*2);ctx.fillStyle='rgba(15,47,255,1)';ctx.fill();
        raf=requestAnimationFrame(draw);
      };
      resize();draw();window.addEventListener('resize',resize);return()=>cancelAnimationFrame(raf);
    }
  }, [type]);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

/* ─── Domain data ─── */
const DOMAINS = [
  { id:1, name:'Biotechnology',   tagline:'From discovery to clinical-stage transactions',     desc:'We advise biotech companies at every stage — from seed financing to late-stage M&A. Our team combines deep scientific expertise with financial rigor to optimally position assets in an increasingly competitive market.',   tags:['Oncology','Gene Therapy','Immunology','Rare Diseases'],         accent:'#4a2fff' },
  { id:2, name:'Pharmaceuticals', tagline:'Portfolio strategy and value-creating transactions', desc:'From licensing deals to full acquisitions, we help pharma companies navigate complex strategic decisions — portfolio optimization, asset divestitures, in-licensing, and cross-border M&A with major industry players.',tags:['Licensing','Portfolio Optimization','Cross-border M&A','Spin-offs'],accent:'#0f2fff' },
  { id:3, name:'Medical Devices',  tagline:'Connecting innovators with strategic buyers',        desc:'The medtech sector demands both technical precision and commercial insight. We advise device companies on fundraising, strategic partnerships, and M&A — from early-stage innovators to established platforms.',          tags:['Surgical Robotics','Implantables','Wearables','Capital Equipment'], accent:'#0f7fff' },
  { id:4, name:'Diagnostics',      tagline:'Structuring deals in a fast-moving landscape',       desc:'Diagnostics sits at the intersection of technology and medicine. We support IVD companies, molecular diagnostics platforms, and point-of-care innovators in capital raises, partnerships, and exit transactions.',       tags:['IVD','Molecular Diagnostics','Point-of-Care','Liquid Biopsy'],      accent:'#2f5fff' },
  { id:5, name:'Digital Health',   tagline:'Where technology meets healthcare finance',          desc:'Digital health requires a unique blend of tech-sector fluency and healthcare domain knowledge. We advise SaaS, AI-driven platforms, and healthtech companies on growth financing, strategic alliances, and M&A.',       tags:['AI / ML','SaaS Platforms','Remote Monitoring','Health Data'],        accent:'#0f2fff' },
];

/* ─── Expertise section (dark) ─── */
function ExpertiseSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const N = DOMAINS.length;
  const CARD_W = 340, GAP = 24, UNIT = CARD_W + GAP;
  const goTo = (i: number) => setActiveIdx(Math.max(0, Math.min(N - 1, i)));

  return (
    <section style={{ background: '#0d0d0d', padding: '8rem 0', overflow: 'hidden', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '340px 1fr', gap: '4rem', paddingLeft: '4vw' }}>

        {/* Left panel */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop:'0.5rem', paddingBottom:'0.5rem' }} className="reveal">
          <div>
            <span style={{ display:'block', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', color:'#b8a07a', marginBottom:'1rem', fontFamily:'var(--sans)' }}>Areas of expertise</span>
            <h2 style={{ fontFamily:'var(--serif)', fontWeight:300, fontSize:'clamp(2.2rem,3.5vw,3.2rem)', lineHeight:1.08, letterSpacing:'-0.025em', color:'#f0ede8', margin:'0 0 1.4rem' }}>Our Domains</h2>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', lineHeight:1.82, color:'#484848', fontWeight:300, maxWidth:270, margin:0 }}>
              We operate at the forefront of five major healthcare verticals, bringing sector-specific expertise to every transaction.
            </p>
          </div>
          <div style={{ marginTop:'3rem' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.1rem', marginBottom:'2.5rem' }}>
              {DOMAINS.map((dom, i) => (
                <button key={dom.id} onClick={() => goTo(i)} style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', fontWeight: activeIdx===i ? 500 : 300, color: activeIdx===i ? '#f0ede8' : '#3a3a3a', padding:'0.45rem 0', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'0.75rem', transition:'color .25s' }}>
                  <span style={{ width:20, height:1, background: activeIdx===i ? dom.accent : '#222', display:'inline-block', flexShrink:0, transition:'background .25s' }} />
                  {dom.name}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
              <button onClick={() => goTo(activeIdx-1)} disabled={activeIdx===0} style={{ width:38, height:38, borderRadius:2, background:'transparent', color: activeIdx===0 ? '#2a2a2a' : '#f0ede8', border:`1px solid ${activeIdx===0?'#1e1e1e':'#3a3a3a'}`, cursor: activeIdx===0?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color .2s, color .2s', flexShrink:0 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => goTo(activeIdx+1)} disabled={activeIdx===N-1} style={{ width:38, height:38, borderRadius:2, background:'transparent', color: activeIdx===N-1 ? '#2a2a2a' : '#f0ede8', border:`1px solid ${activeIdx===N-1?'#1e1e1e':'#3a3a3a'}`, cursor: activeIdx===N-1?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color .2s, color .2s', flexShrink:0 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#333', fontWeight:300, marginLeft:'0.5rem', letterSpacing:'0.06em' }}>
                {String(activeIdx+1).padStart(2,'0')} / {String(N).padStart(2,'0')}
              </span>
            </div>
          </div>
        </div>

        {/* Card track */}
        <div style={{ overflow:'hidden', paddingTop:'0.5rem', paddingBottom:'0.5rem' }}>
          <div style={{ display:'flex', gap:GAP, transform:`translateX(-${activeIdx*UNIT}px)`, transition:'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
            {DOMAINS.map((dom, i) => {
              const isActive = i === activeIdx;
              return (
                <div key={dom.id} onClick={() => goTo(i)} style={{ flexShrink:0, width:CARD_W, borderRadius:2, overflow:'hidden', background:'#0a0a0a', border:`1px solid ${isActive?dom.accent+'40':'#1a1a1a'}`, boxShadow: isActive ? `0 0 60px rgba(15,47,255,0.07), 0 20px 60px rgba(0,0,0,0.4)` : 'none', opacity: isActive ? 1 : 0.4, transform: isActive ? 'scale(1)' : 'scale(0.97)', transition:'opacity .45s, transform .45s, border-color .45s, box-shadow .45s', cursor: isActive?'default':'pointer' } as React.CSSProperties}>
                  {/* Blueprint grid placeholder */}
                  <div style={{ height:200, position:'relative', backgroundImage:'linear-gradient(rgba(15,47,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(15,47,255,0.05) 1px,transparent 1px)', backgroundSize:'24px 24px', backgroundColor:'#080808', display:'flex', alignItems:'flex-end', padding:'1rem 1.4rem' }}>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.55rem', fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color: dom.accent, opacity:0.5 }}>Photo à venir</span>
                  </div>
                  <div style={{ padding:'1.4rem 1.6rem 1.8rem' }}>
                    <span style={{ display:'block', fontFamily:'var(--serif)', fontStyle:'italic', fontSize:'0.8rem', color: dom.accent, marginBottom:'0.35rem' }}>{String(i+1).padStart(2,'0')}</span>
                    <h3 style={{ fontFamily:'var(--serif)', fontWeight:300, fontSize:'1.4rem', lineHeight:1.12, letterSpacing:'-0.02em', color:'#f0ede8', margin:'0 0 0.3rem' }}>{dom.name}</h3>
                    <p style={{ fontFamily:'var(--serif)', fontStyle:'italic', fontSize:'0.82rem', color:'#4a4a4a', margin:'0 0 0.8rem', lineHeight:1.45 }}>{dom.tagline}</p>
                    <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', lineHeight:1.76, color:'#383838', fontWeight:300, margin:'0 0 1rem' }}>{dom.desc}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                      {dom.tags.map(tag => (
                        <span key={tag} style={{ fontSize:'0.55rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'#383838', border:'1px solid #222', borderRadius:0, padding:'0.18rem 0.55rem', fontFamily:'var(--sans)' }}>{tag}</span>
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

/* ─── Main page ─── */
export default function AmbroisePartnersDark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef   = useRef<HTMLElement>(null);

  /* Reveal observer */
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

  /* DNA particle system — same as /1, adapted for pure black */
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d')!;
    const PC = 40000, STICKY_PX = 1500;
    let W = 0, H = 0, scrollProgress = 0, raf = 0;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position:relative;height:calc(100vh + ${STICKY_PX}px);`;
    hero.parentNode!.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);
    hero.style.position = 'sticky';
    hero.style.top = '0';

    const fadeEl = document.createElement('div');
    fadeEl.id = 'hero-fade-2';
    hero.appendChild(fadeEl);

    interface IParticle { update(p:number,t:number):void; draw(p:number):void; }
    let particles: IParticle[] = [];

    function buildParticles() {
      particles = [];
      const SX0=W*.08, SY0=H*1.06, SX1=W*.92, SY1=-H*.06;
      const dvx=SX1-SX0, dvy=SY1-SY0, spineLen=Math.sqrt(dvx*dvx+dvy*dvy);
      const tx=dvx/spineLen, ty=dvy/spineLen, perpX=-ty, perpY=tx;
      const TURNS=4.2, AMP=W*.12, DEPTH_Y=0.13;
      for (let i=0;i<PC;i++) {
        const frac=Math.random(), spX=SX0+tx*spineLen*frac, spY=SY0+ty*spineLen*frac;
        const rnd=Math.random();
        const role=rnd<.55?'core':rnd<.70?'halo':rnd<.84?'rung':'atm';
        const isA=Math.random()<.5, phase=isA?0:Math.PI;
        const angle=frac*TURNS*Math.PI*2+phase, cosA=Math.cos(angle), sinA=Math.sin(angle);
        const depthF=(sinA+1)*.5;
        let tgtX=spX+perpX*cosA*AMP, tgtY=spY+perpY*cosA*AMP+sinA*AMP*DEPTH_Y;
        let sigma:number, alpha:number, size:number, colR=255, colG=255, colB=255;
        if (role==='core') {
          sigma=W*.004*(0.5+Math.random()*.9); alpha=.20+.62*depthF; size=.28+.92*depthF+Math.random()*.22;
          if (Math.random()<.045){alpha=.65+.30*depthF;size=1.0+1.0*depthF;}
          if (isA&&depthF>.62&&Math.random()<.20){colR=178;colG=200;colB=255;}
        } else if (role==='halo') {
          sigma=W*.013*(0.5+Math.random()); alpha=.007+.042*depthF; size=.14+.5*Math.random();
        } else if (role==='rung') {
          const aA=frac*TURNS*Math.PI*2, cosAA=Math.cos(aA), sinAA=Math.sin(aA), t2=Math.random();
          const rungLat=cosAA*AMP*(1-2*t2), rungSin=sinAA*(1-2*t2), rDepthF=(rungSin+1)*.5;
          tgtX=spX+perpX*rungLat; tgtY=spY+perpY*rungLat+rungSin*AMP*DEPTH_Y;
          sigma=W*.0028; alpha=.05+.22*rDepthF; size=.17+.36*rDepthF;
        } else {
          const atmR=AMP*(1.2+Math.random()*2.0), atmA=Math.random()*Math.PI*2;
          tgtX=spX+Math.cos(atmA)*atmR*.65; tgtY=spY+Math.sin(atmA)*atmR*.8;
          sigma=W*.007; alpha=.003+Math.random()*.015; size=.1+Math.random()*.3;
        }
        const u1=Math.max(Math.random(),1e-7), mag=Math.sqrt(-2*Math.log(u1)), scA=Math.random()*Math.PI*2;
        const dnaX=tgtX+Math.cos(scA)*mag*sigma, dnaY=tgtY+Math.sin(scA)*mag*sigma;
        const dist=Math.hypot(dnaX-tgtX,dnaY-tgtY), falloff=Math.max(0,1-dist/(sigma*2.2));
        const finalAlpha=alpha*(0.22+0.78*falloff), finalSize=Math.max(0.1,size);
        const disperseX=Math.random()*W, disperseY=Math.random()*H;
        const spd=Math.random()*.065+.012, ph=Math.random()*Math.PI*2;
        const floatAmp=role==='core'?.70:role==='rung'?.45:role==='halo'?1.4:2.2;
        const colorStr=`rgba(${colR},${colG},${colB},`;
        let x=dnaX, y=dnaY;
        particles.push({
          update(prog,t){
            const eased=prog<.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2;
            const bX=dnaX+(disperseX-dnaX)*eased, bY=dnaY+(disperseY-dnaY)*eased;
            x=bX+Math.sin(t*spd+ph)*floatAmp*(1+eased*1.8);
            y=bY+Math.cos(t*spd*.85+ph)*floatAmp*.9*(1+eased*1.8);
          },
          draw(prog){
            const eased=prog<.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2;
            const a=finalAlpha*(1-eased*.28);
            ctx.beginPath(); ctx.arc(x,y,finalSize,0,Math.PI*2);
            ctx.fillStyle=colorStr+a+')'; ctx.fill();
          },
        });
      }
    }

    function resize() {
      if (!canvas) return;
      W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight;
      buildParticles();
    }
    function animate() {
      ctx.clearRect(0,0,W,H);
      const t=Date.now()*.001;
      for (const p of particles){p.update(scrollProgress,t);p.draw(scrollProgress);}
      const fo=Math.min(Math.max((scrollProgress-.15)/.60,0),1);
      fadeEl.style.opacity=String(fo);
      raf=requestAnimationFrame(animate);
    }
    const onScroll=()=>{scrollProgress=Math.min(Math.max(window.scrollY/STICKY_PX,0),1);};
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',resize);
    resize(); animate();
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',resize);
      if(fadeEl.parentNode) fadeEl.parentNode.removeChild(fadeEl);
      if(wrapper.parentNode){wrapper.parentNode.insertBefore(hero,wrapper);wrapper.parentNode.removeChild(wrapper);}
      hero.style.position=''; hero.style.top='';
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you! We will get back to you shortly.');
    e.currentTarget.reset();
  };

  const SERVICES = [
    { num:'01', title:'M&A',                                  desc:'Buy-side, sell-side and strategic acquisitions across the global healthcare ecosystem.' },
    { num:'02', title:'Fundraising',                           desc:'Growth financing from early-stage to later rounds, partnering with leading healthcare-focused investors.' },
    { num:'03', title:'Licensing & Strategic Partnerships',    desc:'Structuring value-creating licensing and collaboration agreements with global strategic players.' },
    { num:'04', title:'Strategic Advisory & External Growth',  desc:'Independent advice on strategic options, portfolio positioning and long-term growth trajectories.' },
    { num:'05', title:'Capital Raising Solutions',             desc:'We partner with companies across the healthcare landscape to design and implement optimal capital structures — IPOs, Follow-on Offerings, Private Placements, Convertible Debt, and Term Loan Debt Facilities.' },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        :root {
          --bg:     #0a0a0a;
          --surf:   #0f0f0f;
          --surf2:  #111111;
          --line:   #1a1a1a;
          --line2:  #242424;
          --white:  #f0ede8;
          --muted:  #484848;
          --blue:   #0f2fff;
          --gold:   #b8a07a;
          --serif:  'Cormorant Garamond', Georgia, serif;
          --sans:   'Inter', -apple-system, sans-serif;
          --ease:   cubic-bezier(0.22,0.61,0.36,1);
        }

        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--bg);color:var(--white);overflow-x:hidden;line-height:1.65;-webkit-font-smoothing:antialiased;}
        a{color:inherit;text-decoration:none;}

        /* ── NAV ── */
        nav.dark-nav{
          position:fixed;top:0;left:0;right:0;z-index:300;
          display:flex;align-items:center;justify-content:space-between;
          padding:0 4vw;height:64px;
          background:rgba(10,10,10,0.88);
          backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border-bottom:1px solid var(--line);
        }
        .d-logo-wrap{display:flex;align-items:center;gap:.7rem;}
        .d-logo-ap{font-family:var(--serif);font-style:italic;font-weight:400;font-size:1.55rem;letter-spacing:-.01em;color:var(--white);}
        .d-logo-sep{width:1px;height:16px;background:var(--line2);}
        .d-logo-name{font-size:.72rem;font-weight:300;letter-spacing:.2em;text-transform:uppercase;color:rgba(240,237,232,0.3);}
        .d-nav-links{display:flex;gap:0;align-items:center;}
        .d-nav-links a{font-size:.82rem;font-weight:300;color:rgba(240,237,232,0.45);padding:.5rem 1rem;transition:color .18s;}
        .d-nav-links a:hover{color:var(--white);}
        .d-nav-cta{
          margin-left:.5rem;background:transparent!important;color:var(--white)!important;
          padding:.52rem 1.4rem!important;border-radius:2px;
          font-size:.78rem!important;font-weight:400!important;
          border:1px solid var(--line2)!important;
          transition:background .22s!important,border-color .22s!important,color .22s!important;
        }
        .d-nav-cta:hover{background:var(--blue)!important;border-color:var(--blue)!important;color:#fff!important;}

        /* ── HERO ── */
        .d-hero{
          position:relative;min-height:100vh;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:0 5vw;color:var(--white);
          background:#0a0a0a;
        }
        #hero-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
        #hero-fade-2{
          position:absolute;inset:0;z-index:1;pointer-events:none;
          background:linear-gradient(to top,
            #0a0a0a 0%,
            rgba(10,10,10,0.95) 15%,
            rgba(10,10,10,0.80) 35%,
            rgba(10,10,10,0.40) 55%,
            transparent 75%
          );
          opacity:0;transition:opacity 0.05s linear;
        }
        .d-hero-inner{position:relative;z-index:2;max-width:1000px;text-align:center;padding-top:4rem;padding-bottom:2rem;}
        .d-hero-h1{
          font-family:var(--serif);font-weight:300;
          font-size:clamp(4rem,7.5vw,8rem);
          line-height:0.95;letter-spacing:-.03em;margin-bottom:2.2rem;
          opacity:0;animation:dFadeUp .9s .3s var(--ease) forwards;
        }
        .d-hero-h1 .line1{display:block;color:var(--white);}
        .d-hero-h1 .line2{display:block;font-style:italic;color:var(--white);}
        .d-hero-h1 .line3{display:block;font-style:italic;color:rgba(240,237,232,0.28);}
        .d-hero-tags{
          display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;align-items:center;
          margin-bottom:2.5rem;
          opacity:0;animation:dFadeUp .9s .45s var(--ease) forwards;
        }
        .d-hero-tags span{font-size:.68rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:rgba(240,237,232,0.35);font-family:var(--sans);}
        .d-hero-tags .sep{color:rgba(240,237,232,0.15);font-size:.5rem;}
        .d-hero-ctas{
          display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;align-items:center;
          opacity:0;animation:dFadeUp .9s .6s var(--ease) forwards;
        }
        .d-btn-primary{
          background:transparent;color:var(--white);
          padding:.9rem 2.4rem;border-radius:2px;
          font-size:.82rem;font-weight:400;letter-spacing:.04em;
          border:1px solid rgba(240,237,232,0.5);
          transition:background .22s,color .22s,border-color .22s;
          font-family:var(--sans);
        }
        .d-btn-primary:hover{background:var(--white);color:#0a0a0a;border-color:var(--white);}
        .d-btn-secondary{
          font-size:.82rem;font-weight:300;color:rgba(240,237,232,0.4);
          font-family:var(--sans);letter-spacing:.02em;
          display:flex;align-items:center;gap:.45rem;
          transition:color .2s;
        }
        .d-btn-secondary:hover{color:var(--white);}

        /* ── SECTIONS ── */
        .d-section{max-width:1440px;margin:0 auto;padding:8rem 4vw;}
        .d-eyebrow{display:block;font-size:.62rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;font-family:var(--sans);}
        .d-title{font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,4vw,4.2rem);line-height:1.06;letter-spacing:-.025em;margin-bottom:1rem;color:var(--white);}
        .d-lede{color:var(--muted);font-size:.9rem;max-width:54ch;font-weight:300;line-height:1.78;font-family:var(--sans);}
        .d-section-head{margin-bottom:4.5rem;}

        /* ── SERVICES LIST ── */
        .d-svc-row{
          display:grid;grid-template-columns:64px 1fr 1fr;
          gap:3rem;padding:2.8rem 0;
          border-top:1px solid var(--line);
          align-items:start;
          transition:background .2s;cursor:default;
        }
        .d-svc-row:last-child{border-bottom:1px solid var(--line);}
        .d-svc-row:hover{background:#0d0d0d;margin:0 -1rem;padding-left:1rem;padding-right:1rem;}
        .d-svc-num{font-family:var(--serif);font-style:italic;font-size:1rem;color:var(--blue);line-height:1;padding-top:.3rem;}
        .d-svc-title{font-family:var(--serif);font-weight:300;font-size:1.65rem;color:var(--white);line-height:1.1;letter-spacing:-.02em;}
        .d-svc-desc{font-family:var(--sans);font-size:.84rem;line-height:1.78;color:var(--muted);font-weight:300;}

        /* ── APPROACH ── */
        .d-approach-panels{display:flex;flex-direction:column;}
        .d-approach-panel{
          display:grid;grid-template-columns:1fr 1fr;
          border-top:1px solid var(--line);min-height:280px;
        }
        .d-approach-text{padding:4.5rem 4rem;display:flex;flex-direction:column;justify-content:center;position:relative;}
        .d-approach-ghost{
          position:absolute;top:2rem;left:3.5rem;
          font-family:var(--serif);font-style:italic;font-size:6rem;font-weight:300;
          color:#111;line-height:1;pointer-events:none;user-select:none;
          letter-spacing:-.04em;
        }
        .d-approach-num{font-family:var(--serif);font-style:italic;font-size:.9rem;color:var(--blue);margin-bottom:1rem;display:block;position:relative;z-index:1;}
        .d-approach-title{font-family:var(--serif);font-weight:300;font-size:1.7rem;letter-spacing:-.02em;margin-bottom:.9rem;line-height:1.12;color:var(--white);position:relative;z-index:1;}
        .d-approach-desc{color:var(--muted);font-size:.86rem;line-height:1.78;font-weight:300;font-family:var(--sans);position:relative;z-index:1;}
        .d-approach-canvas-wrap{
          background:#080808;
          background-image:linear-gradient(rgba(15,47,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(15,47,255,0.04) 1px,transparent 1px);
          background-size:28px 28px;
          min-height:260px;display:flex;align-items:center;justify-content:center;padding:2rem;
          border-left:1px solid var(--line);
        }

        /* ── VALUES ── */
        .d-values-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);}
        .d-value-card{padding:3.5rem 2.8rem;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transition:background .25s;}
        .d-value-card:hover{background:#0d0d0d;}
        .d-value-tag{display:inline-block;font-family:var(--sans);font-size:.6rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--blue);margin-bottom:1.5rem;border-bottom:1px solid var(--blue);padding-bottom:.3rem;}
        .d-value-title{font-family:var(--serif);font-weight:300;font-size:1.75rem;letter-spacing:-.02em;margin-bottom:.9rem;line-height:1.1;color:var(--white);}
        .d-value-desc{color:var(--muted);font-size:.85rem;line-height:1.78;font-weight:300;font-family:var(--sans);}

        /* ── METHOD ── */
        .d-method-list{border-top:1px solid var(--line);}
        .d-method-step{
          display:grid;grid-template-columns:64px 1fr 40px;gap:2rem;
          padding:2.5rem 0;border-bottom:1px solid var(--line);
          align-items:center;cursor:default;
          transition:background .2s,padding-left .25s var(--ease);
        }
        .d-method-step:hover{background:#0d0d0d;padding-left:1.2rem;margin:0 -1rem;padding-right:1rem;}
        .d-step-num{font-family:var(--serif);font-style:italic;font-size:1rem;color:var(--blue);}
        .d-step-body h4{font-family:var(--serif);font-weight:300;font-size:1.45rem;letter-spacing:-.015em;color:var(--white);margin-bottom:.35rem;line-height:1.1;}
        .d-step-body p{color:var(--muted);font-size:.84rem;line-height:1.72;font-weight:300;font-family:var(--sans);}
        .d-step-arrow{color:#222;width:20px;height:20px;transition:color .2s,transform .2s;}
        .d-method-step:hover .d-step-arrow{color:var(--blue);transform:translateX(4px);}

        /* ── CONTACT ── */
        .d-contact-wrap{max-width:600px;margin:0 auto;padding:8rem 4vw;text-align:center;}
        .d-fl{display:block;font-size:.6rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem;font-family:var(--sans);text-align:left;}
        .d-fi{
          display:block;width:100%;background:transparent;border:none;border-bottom:1px solid var(--line2);
          padding:.85rem 0;font-size:.92rem;color:var(--white);font-family:var(--sans);font-weight:300;
          border-radius:0;outline:none;transition:border-color .2s;caret-color:var(--blue);
        }
        .d-fi:focus{border-bottom-color:var(--blue);}
        .d-ft{
          display:block;width:100%;background:transparent;border:none;border-bottom:1px solid var(--line2);
          padding:.85rem 0;font-size:.92rem;color:var(--white);font-family:var(--sans);font-weight:300;
          border-radius:0;outline:none;resize:none;min-height:120px;transition:border-color .2s;caret-color:var(--blue);
        }
        .d-ft:focus{border-bottom-color:var(--blue);}
        .d-fi::placeholder,.d-ft::placeholder{color:#2a2a2a;}
        .d-fc{display:flex;align-items:flex-start;gap:.75rem;margin-top:1.5rem;font-size:.78rem;color:var(--muted);font-weight:300;font-family:var(--sans);text-align:left;}
        .d-fc input{margin-top:.15rem;accent-color:var(--blue);flex-shrink:0;}
        .d-submit-btn{
          margin-top:2rem;display:inline-block;
          background:transparent;color:var(--white);
          padding:1rem 3rem;border-radius:2px;
          font-size:.82rem;font-weight:400;letter-spacing:.06em;text-transform:uppercase;
          border:1px solid rgba(240,237,232,0.4);cursor:pointer;
          font-family:var(--sans);
          transition:background .22s,color .22s,border-color .22s;
        }
        .d-submit-btn:hover{background:var(--white);color:#0a0a0a;border-color:var(--white);}

        /* ── FOOTER ── */
        footer.d-footer{background:#0a0a0a;color:var(--white);padding:8rem 4vw 4rem;border-top:1px solid var(--line);}
        .d-footer-inner{max-width:1440px;margin:0 auto;}
        .d-footer-cta{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;padding-bottom:4rem;border-bottom:1px solid var(--line);flex-wrap:wrap;}
        .d-footer-cta-headline{font-family:var(--serif);font-weight:300;font-size:clamp(2rem,4vw,3.8rem);line-height:1.06;letter-spacing:-.025em;color:var(--white);}
        .d-footer-cta-headline em{font-style:italic;color:rgba(240,237,232,0.5);}
        .d-footer-cta-btn{display:inline-flex;align-items:center;gap:.55rem;background:transparent;color:var(--white);padding:.85rem 2.2rem;border-radius:2px;font-size:.8rem;font-weight:400;letter-spacing:.04em;border:1px solid var(--line2);white-space:nowrap;flex-shrink:0;font-family:var(--sans);transition:border-color .2s,color .2s;}
        .d-footer-cta-btn:hover{border-color:rgba(240,237,232,0.5);color:var(--white);}
        .d-footer-top{display:grid;grid-template-columns:1fr auto;gap:5rem;padding:4rem 0 3.5rem;border-bottom:1px solid var(--line);align-items:start;}
        .d-footer-logo{font-family:var(--serif);font-style:italic;font-size:2rem;color:var(--white);}
        .d-footer-brand-name{font-size:.58rem;font-weight:400;letter-spacing:.22em;text-transform:uppercase;color:rgba(240,237,232,0.18);margin:.3rem 0 1.3rem;font-family:var(--sans);}
        .d-footer-brand-desc{font-size:.82rem;line-height:1.8;color:rgba(240,237,232,0.28);font-weight:300;max-width:28ch;margin-bottom:1.6rem;font-family:var(--sans);}
        .d-footer-contact{display:flex;flex-direction:column;gap:.4rem;}
        .d-footer-contact a,.d-footer-contact span{font-size:.78rem;color:rgba(240,237,232,0.3);font-weight:300;transition:color .18s;font-family:var(--sans);}
        .d-footer-contact a:hover{color:var(--white);}
        .d-footer-links{display:flex;gap:4rem;flex-wrap:wrap;}
        .d-footer-col-title{font-size:.55rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:rgba(240,237,232,0.16);margin-bottom:1.3rem;font-family:var(--sans);}
        .d-footer-col a{display:block;font-size:.84rem;color:rgba(240,237,232,0.32);margin-bottom:.68rem;transition:color .18s;font-weight:300;font-family:var(--sans);}
        .d-footer-col a:hover{color:var(--white);}
        .d-footer-bottom{padding-top:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
        .d-footer-copy{font-size:.62rem;color:rgba(240,237,232,0.18);letter-spacing:.04em;font-family:var(--sans);}
        .d-footer-right{display:flex;align-items:center;gap:1.8rem;}
        .d-footer-cities{font-size:.62rem;color:rgba(240,237,232,0.18);letter-spacing:.08em;text-transform:uppercase;font-family:var(--sans);}
        .d-footer-social{display:flex;gap:.6rem;}
        .d-footer-social a{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:2px;border:1px solid var(--line);color:rgba(240,237,232,0.3);transition:border-color .18s,color .18s;}
        .d-footer-social a:hover{border-color:rgba(240,237,232,0.4);color:var(--white);}

        /* ── REVEAL ── */
        .reveal{opacity:0;transform:translateY(18px);transition:opacity .65s var(--ease),transform .65s var(--ease);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-d1{transition-delay:.1s;}
        .reveal-d2{transition-delay:.2s;}

        @keyframes dFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}

        /* ── RESPONSIVE ── */
        @media(max-width:960px){
          .d-nav-links a:not(.d-nav-cta){display:none;}
          .d-approach-panel{grid-template-columns:1fr;}
          .d-approach-canvas-wrap{min-height:200px;border-left:none;border-top:1px solid var(--line);}
          .d-values-grid{grid-template-columns:1fr;}
          .d-svc-row{grid-template-columns:48px 1fr;gap:1.5rem;}
          .d-svc-desc{display:none;}
          .d-footer-top{grid-template-columns:1fr;}
        }
        @media(max-width:600px){
          .d-section{padding:4rem 4vw;}
          .d-hero-h1{font-size:clamp(3.2rem,11vw,5rem);}
          footer.d-footer{padding:6rem 4vw 3rem;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="dark-nav">
        <div className="d-logo-wrap">
          <span className="d-logo-ap">AP</span>
          <span className="d-logo-sep" />
          <span className="d-logo-name">Ambroise Partners</span>
        </div>
        <div className="d-nav-links">
          <a href="#services">Services</a>
          <a href="#approach">Expertise</a>
          <a href="#method">Method</a>
          <a href="#about">About</a>
          <a href="#contact" className="d-nav-cta">Contact us</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="d-hero" ref={heroRef}>
        <canvas id="hero-canvas" ref={canvasRef} />
        <div className="d-hero-inner">
          <h1 className="d-hero-h1">
            <span className="line1">Healthcare focused</span>
            <span className="line2">advisory</span>
            <span className="line3">serving innovation</span>
          </h1>
          <div className="d-hero-tags">
            <span>M&amp;A</span>
            <span className="sep">·</span>
            <span>Fundraising</span>
            <span className="sep">·</span>
            <span>Licensing</span>
            <span className="sep">·</span>
            <span>Growth</span>
          </div>
          <div className="d-hero-ctas">
            <a href="#contact" className="d-btn-primary">Get in touch</a>
            <a href="#services" className="d-btn-secondary">
              Our services
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background:'#0a0a0a' }}>
        <div className="d-section">
          <div className="d-section-head reveal">
            <span className="d-eyebrow">What we do</span>
            <h2 className="d-title">Our Services</h2>
          </div>
          <div>
            {SERVICES.map((svc, i) => (
              <div key={i} className="d-svc-row reveal">
                <span className="d-svc-num">{svc.num}</span>
                <h3 className="d-svc-title">{svc.title}</h3>
                <p className="d-svc-desc">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ── */}
      <section id="approach" style={{ background:'#0a0a0a', borderTop:'1px solid #1a1a1a' }}>
        <div className="d-section" style={{ padding:'8rem 4vw 0' }}>
          <div className="d-section-head reveal">
            <h2 className="d-title">Our Approach</h2>
          </div>
        </div>
        <div className="d-approach-panels">
          {[
            { num:'01', title:'Scientific expertise', desc:'Deep understanding of healthcare science and ecosystems, backed by strong medical and scientific academic backgrounds within the team.', type:'brain' as const },
            { num:'02', title:'Deep Network',          desc:'A global network of leading healthcare investors and strategic partners, developed through years of active involvement in the healthcare sector worldwide.', type:'network' as const },
            { num:'03', title:'Execution excellence',  desc:'The rigor and standards of top-tier investment banks, built on more than 10 years of experience in top-tier institutions, combined with hands-on execution, agility and close client support.', type:'curve' as const },
          ].map((panel, i) => (
            <div key={panel.num} className={`d-approach-panel reveal${i===1?' reveal-d1':i===2?' reveal-d2':''}`}>
              <div className="d-approach-text">
                <span className="d-approach-ghost">{panel.num}</span>
                <span className="d-approach-num">{panel.num}</span>
                <div className="d-approach-title">{panel.title}</div>
                <p className="d-approach-desc">{panel.desc}</p>
              </div>
              <div className="d-approach-canvas-wrap">
                <ApproachCanvas type={panel.type} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <ExpertiseSection />

      {/* ── VALUES ── */}
      <section id="values" style={{ background:'#0a0a0a', borderTop:'1px solid #1a1a1a' }}>
        <div className="d-section">
          <div className="d-section-head reveal">
            <span className="d-eyebrow">Values</span>
            <h2 className="d-title">Excellence &amp; alignment</h2>
            <p className="d-lede">Principles that guide every engagement.</p>
          </div>
          <div className="d-values-grid">
            {[
              ['Rigor',       'Institutional-grade materials, sourced data, clear narrative: every deliverable is investor-ready.'],
              ['Transparency','Roadmaps, milestones, clear reporting: you always know where we stand.'],
              ['Alignment',   'Compensation model tied to deal success and value creation.'],
            ].map(([tag, desc], i) => (
              <div key={tag} className={`d-value-card reveal${i===1?' reveal-d1':i===2?' reveal-d2':''}`}>
                <span className="d-value-tag">{tag}</span>
                <div className="d-value-title">{tag}</div>
                <p className="d-value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHOD ── */}
      <section id="method" style={{ background:'#0d0d0d', borderTop:'1px solid #1a1a1a' }}>
        <div className="d-section">
          <div className="d-section-head reveal">
            <span className="d-eyebrow">Methodology</span>
            <h2 className="d-title">Proven process</h2>
          </div>
          <div className="d-method-list">
            {[
              ['01','Strategic Audit',   'Assessment of positioning, pipeline and transaction objectives.'],
              ['02','Structuring',        'Investment narrative, data room, modeling and investor materials.'],
              ['03','Targeted Outreach',  'Sourcing and confidential approach to the most relevant counterparties.'],
              ['04','Process Steering',   'Process coordination, Q&A, due diligence and advisor management.'],
              ['05','Closing',            'Negotiation of final terms and securing the signature.'],
            ].map(([num, title, copy]) => (
              <div key={num} className="d-method-step reveal">
                <div className="d-step-num">{num}</div>
                <div className="d-step-body"><h4>{title}</h4><p>{copy}</p></div>
                <svg className="d-step-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <div id="contact" style={{ background:'#0a0a0a', borderTop:'1px solid #1a1a1a' }}>
        <div className="d-contact-wrap">
          <div className="reveal">
            <span className="d-eyebrow" style={{ justifyContent:'center', display:'block' }}>Get in touch</span>
            <h2 className="d-title">Let&apos;s discuss<br/><em style={{ fontStyle:'italic', color:'rgba(240,237,232,0.4)' }}>your project</em></h2>
            <p className="d-lede" style={{ margin:'1rem auto 0', textAlign:'center' }}>
              Let&apos;s explore together the best options for your next step.
            </p>
          </div>
          <form style={{ marginTop:'3rem', display:'flex', flexDirection:'column', gap:'1.8rem' }} className="reveal" onSubmit={handleSubmit}>
            <div><label className="d-fl">Name</label><input className="d-fi" type="text" required placeholder="Your full name" /></div>
            <div><label className="d-fl">Email</label><input className="d-fi" type="email" required placeholder="you@company.com" /></div>
            <div><label className="d-fl">Message</label><textarea className="d-ft" required placeholder="Describe your project…" /></div>
            <label className="d-fc"><input type="checkbox" required /><span>I agree that my information will be processed to answer my request.</span></label>
            <div style={{ textAlign:'center' }}>
              <button type="submit" className="d-submit-btn">Send message</button>
            </div>
          </form>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="d-footer">
        <div className="d-footer-inner">

          <div className="d-footer-cta">
            <p className="d-footer-cta-headline">
              Ready to discuss<br /><em>your next transaction?</em>
            </p>
            <a href="#contact" className="d-footer-cta-btn">
              Get in touch
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="d-footer-top">
            <div>
              <div className="d-footer-logo">AP</div>
              <div className="d-footer-brand-name">Ambroise Partners</div>
              <p className="d-footer-brand-desc">Healthcare-focused investment banking,<br />serving innovation across EU &amp; US.</p>
              <div className="d-footer-contact">
                <a href="mailto:contact@ambroise-partners.com">contact@ambroise-partners.com</a>
                <span>Paris · New York</span>
              </div>
            </div>
            <div className="d-footer-links">
              <div className="d-footer-col">
                <div className="d-footer-col-title">Services</div>
                <a href="#services">M&amp;A</a>
                <a href="#services">Fundraising</a>
                <a href="#services">Licensing</a>
                <a href="#services">Strategic Advisory</a>
                <a href="#services">Capital Raising</a>
              </div>
              <div className="d-footer-col">
                <div className="d-footer-col-title">Company</div>
                <a href="#approach">Our Domains</a>
                <a href="#approach">Expertise</a>
                <a href="#method">Method</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="d-footer-col">
                <div className="d-footer-col-title">Legal</div>
                <a href="#">Legal notice</a>
                <a href="#">Privacy policy</a>
                <a href="#">Cookie policy</a>
              </div>
            </div>
          </div>

          <div className="d-footer-bottom">
            <div className="d-footer-copy">© 2026 Ambroise Partners. All rights reserved.</div>
            <div className="d-footer-right">
              <span className="d-footer-cities">Paris · New York</span>
              <div className="d-footer-social">
                <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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

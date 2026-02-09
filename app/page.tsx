'use client';

import { useEffect, useState } from 'react';

export default function AmbroisePartners() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.fade-in, .fade-in-section').forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    e.currentTarget.reset();
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    e.currentTarget.reset();
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600&display=swap');

        :root {
          --cobalt: #0b3bff;
          --indigo: #1b2565;
          --sand: #f6f1e9;
          --ink: #0e1117;
          --muted: #6f7682;
          --line: #e5e7eb;
          --card: rgba(255, 255, 255, 0.92);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Manrope', system-ui, -apple-system, sans-serif;
          color: var(--ink);
          background: #ffffff;
          line-height: 1.6;
        }
        a { color: inherit; text-decoration: none; }

        /* Navigation */
        .nav {
          position: fixed; inset: 0 0 auto 0;
          width: 100%;
          background: ${scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
          border-bottom: ${scrolled ? '1px solid rgba(14,17,23,0.06)' : 'none'};
          box-shadow: ${scrolled ? '0 8px 24px rgba(0,0,0,0.06)' : 'none'};
          backdrop-filter: blur(12px);
          z-index: 110;
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, color 0.25s ease;
          color: #0a0f2c;
        }
        .nav-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1.5rem;
          padding: 0.9rem 5vw;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .logo {
          font: 600 1.15rem 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: inherit;
        }
        .nav-links { display: flex; gap: 1.6rem; align-items: center; justify-content: center; justify-self: center; }
        .nav-links a { font-weight: 600; color: inherit; letter-spacing: 0.03em; font-size: 0.95rem; transition: color 0.2s ease; }
        .nav-links a:hover { color: #0d6bff; }
        .cta { display: flex; gap: 0.75rem; }
        .btn {
          border: 1px solid #0b1c3d;
          padding: 0.68rem 1.2rem;
          border-radius: 999px;
          font-weight: 600;
          color: #0b1c3d;
          background: transparent;
          position: relative;
          overflow: hidden;
          transition: color 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }
        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0b1c3d 0%, #0f2c5e 60%, #1446a1 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          z-index: 0;
        }
        .btn span { position: relative; z-index: 1; }
        .btn:hover {
          color: #f4f7ff;
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(11, 28, 61, 0.22);
        }
        .btn:hover::before { transform: scaleX(1); }
        .btn-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%);
          border: none;
          color: #0a1730;
          padding: 0.55rem 1.2rem;
          border-radius: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
          backdrop-filter: blur(14px);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }
        .btn-glass:hover { transform: translateY(-2px); filter: brightness(1.06); box-shadow: 0 16px 38px rgba(0,0,0,0.22); }

        /* Hero */
        .hero {
          padding: 6rem 5vw 5.5rem;
          display: grid;
          gap: 1.8rem;
          max-width: 1500px;
          margin: 0 auto;
        }
        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          padding: 7rem 5.5rem;
          min-height: calc(100vh - 110px);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            180deg,
            #060c1f 0%,
            #07132f 18%,
            #0b2459 34%,
            #0c3f9a 50%,
            #5c9fff 68%,
            #e5efff 86%,
            #ffffff 100%
          );
          color: #0b132f;
          box-shadow: none;
          isolation: isolate;
          text-align: center;
        }
        .hero-card::after, .hero-card::before {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(58px);
          opacity: 0.24;
        }
        .hero-card::after { width: 0; height: 0; background: transparent; top: 0; right: 0; }
        .hero-card::before { width: 360px; height: 360px; background: #e6f0ff; bottom: -140px; left: -80px; }
        .hero h1 {
          font-family: 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          font-size: 1.9rem;
          line-height: 1.3;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        .hero-tags {
          margin-top: 0.8rem;
          display: flex;
          gap: 1.3rem;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .hero-tags span {
          position: relative;
          padding-left: 1rem;
        }
        .hero-tags span:first-child { padding-left: 0; }
        .hero-tags span:not(:first-child)::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 14px;
          border-left: 1px solid rgba(255, 255, 255, 0.5);
        }
        .hero p {
          display: none;
        }
        .hero-actions {
          display: none;
        }
        /* KPI strip */
        .kpi-bar {
          padding: 2rem 6vw 0;
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
          box-shadow: none;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.35rem;
          text-align: center;
        }
        .kpi {
          padding: 0.95rem 0.6rem;
          background: #ffffff;
          box-shadow: none;
        }
        .kpi .num {
          font-family: 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          font-size: clamp(1.5rem, 2vw, 1.9rem);
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #0a0f2c;
        }
        .kpi .label {
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.88rem;
          letter-spacing: 0.01em;
        }

        /* Credentials ticker */
        .credentials {
          padding: 2.5rem 0;
          overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
          border-block: 1px solid #e7eaf2;
        }
        .credentials .track {
          display: flex;
          gap: 3rem;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
        }
        .credentials .item {
          font-family: 'Gotham', 'Montserrat', 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #0a0f2c;
          opacity: 0.7;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .credentials .dot {
          width: 8px; height: 8px; border-radius: 50%; background: #0d6bff; display: inline-block;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Sections */
        section { padding: 4.5rem 6vw; max-width: 1400px; margin: 0 auto; }
        .section-head { text-align: center; max-width: 760px; margin: 0 auto 2.5rem; }
        .eyebrow { text-transform: uppercase; letter-spacing: 2px; color: var(--muted); font-weight: 600; font-size: 0.78rem; }
        .title { font-family: 'Space Grotesk'; font-size: clamp(2rem, 3vw, 2.6rem); letter-spacing: -0.8px; margin: 0.5rem 0 0.75rem; }
        .lede { color: var(--muted); font-size: 1rem; }

        /* Cards */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
        }
        .card {
          background: transparent;
          border: none;
          padding: 1.85rem 1.6rem;
          position: relative;
        }
        .card:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 14%;
          bottom: 14%;
          width: 1px;
          background: transparent;
          transition: background 0.4s ease;
        }
        .card h3 { font-family: 'Space Grotesk'; font-size: 1.25rem; margin-bottom: 0.6rem; }
        .card p { color: var(--muted); }

        /* Split layout */
        .split { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; align-items: start; }
        .contact-wrapper {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }
        .contact-card {
          width: 100%;
          padding: 2.8rem 2.4rem;
          border: 1px solid #e5e7eb;
          box-shadow: none;
          background: #ffffff;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        .contact-card .field label { font-weight: 700; letter-spacing: 0.02em; }
        .contact-card .input, .contact-card textarea {
          background: #f9fbff;
          border: 1px solid #d8dfee;
        }
        .contact-card .input:focus, .contact-card textarea:focus {
          outline: 2px solid rgba(13,107,255,0.14);
          border-color: #0d6bff;
          box-shadow: 0 8px 24px rgba(13,107,255,0.12);
        }
        .contact-card button {
          align-self: center;
          min-width: 180px;
          padding-inline: 1.6rem;
        }

        /* Steps */
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step {
          display: grid; grid-template-columns: 70px 1fr; gap: 1.2rem;
          padding: 1.4rem 1.2rem;
          border-top: 0.5px solid transparent;
          border-bottom: 0.5px solid transparent;
          transition: border-color 0.4s ease;
        }
        .step:first-child { border-top: 0.5px solid transparent; }
        .step:last-child { border-bottom: 0.5px solid transparent; }
        .step-no { font: 700 1.8rem 'Space Grotesk'; color: var(--cobalt); }
        .step h4 { font-size: 1.1rem; margin-bottom: 0.35rem; }

        /* Forms */
        form { width: 100%; }
        .field { display: flex; flex-direction: column; gap: 0.45rem; }
        .field label { font-weight: 600; font-size: 0.9rem; }
        .input, textarea {
          border: 1px solid var(--line);
          padding: 0.9rem 1rem;
          border-radius: 10px;
          font: inherit;
          background: #fff;
        }
        .input:focus, textarea:focus { outline: 2px solid rgba(11,59,255,0.15); border-color: var(--cobalt); }
        textarea { min-height: 140px; resize: vertical; }
        .checkbox { display: flex; gap: 0.7rem; align-items: flex-start; color: var(--muted); font-size: 0.9rem; }

        /* Progressive line reveals */
        .service-card { border: 1px solid transparent; transition: border-color 0.4s ease; }
        .why-item { border-top: 1px solid transparent; border-bottom: 1px solid transparent; transition: border-color 0.4s ease; }
        .value-card { border-left: 2px solid transparent; transition: border-color 0.4s ease; }
        .step { border-top: 0.5px solid transparent; border-bottom: 0.5px solid transparent; transition: border-color 0.4s ease; }
        .card:not(:last-child)::after { background: transparent; transition: background 0.4s ease; }

        /* Footer */
        .footer {
          background: linear-gradient(
            0deg,
            #030816 0%,
            #040d1f 18%,
            #07152e 36%,
            #0a2148 56%,
            #0f3380 70%,
            #1c66f7 80%,
            #5ca5ff 88%,
            #d7e8ff 96%,
            #ffffff 100%
          );
          color: #ffffff;
          padding: 18rem 6vw 4rem;
        }
        .footer-grid { display: grid; gap: 1.8rem; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); }
        .footer a { color: #ffffff; }
        .footer-logo { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ffffff; }
        .foot-note { margin-top: 3rem; color: #e6edff; text-align: center; font-size: 0.9rem; }

        /* Fade-in */
        .fade-in { opacity: 0; transform: translateY(26px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .fade-in, .fade-in-section { transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1); }
        .fade-in:nth-of-type(odd), .fade-in-section:nth-of-type(odd) { transition-duration: 0.75s; }
        .fade-in:nth-of-type(even), .fade-in-section:nth-of-type(even) { transition-duration: 0.55s; }

        /* Reveal of fine lines when sections enter viewport */
        .service-card { border: 1px solid transparent; transition: border-color 0.45s ease 0.12s; }
        .why-item { border-top: 1px solid transparent; border-bottom: 1px solid transparent; transition: border-color 0.45s ease 0.12s; }
        .value-card { border-left: 2px solid transparent; transition: border-color 0.45s ease 0.12s; }
        .step { border-top: 0.5px solid transparent; border-bottom: 0.5px solid transparent; transition: border-color 0.45s ease 0.12s; }
        .card:not(:last-child)::after { background: transparent; transition: background 0.45s ease 0.12s; }

        /* Stagger slight delays for a smoother cascade */
        .services-grid .service-card:nth-child(1) { transition-delay: 0.10s; }
        .services-grid .service-card:nth-child(2) { transition-delay: 0.16s; }
        .services-grid .service-card:nth-child(3) { transition-delay: 0.22s; }
        .why-grid .why-item:nth-child(1),
        .values-grid .value-card:nth-child(1),
        .method-steps .step:nth-child(1) { transition-delay: 0.10s; }
        .why-grid .why-item:nth-child(2),
        .values-grid .value-card:nth-child(2),
        .method-steps .step:nth-child(2) { transition-delay: 0.16s; }
        .why-grid .why-item:nth-child(3),
        .values-grid .value-card:nth-child(3),
        .method-steps .step:nth-child(3) { transition-delay: 0.22s; }
        .method-steps .step:nth-child(4) { transition-delay: 0.28s; }
        .method-steps .step:nth-child(5) { transition-delay: 0.34s; }

        /* Activated state once visible */
        .fade-in.visible .service-card { border-color: #e5e7eb; }
        .fade-in.visible .why-item { border-top-color: #e5e7eb; border-bottom-color: #e5e7eb; }
        .fade-in.visible .value-card { border-left-color: #0a1021; }
        .fade-in.visible .step { border-top-color: #f4f6f8; border-bottom-color: #f4f6f8; }
        .fade-in.visible .card:not(:last-child)::after { background: #e5e7eb; }
        .fade-in.visible .service-card { border-color: #e5e7eb; }
        .fade-in.visible .why-item { border-top-color: #e5e7eb; border-bottom-color: #e5e7eb; }
        .fade-in.visible .value-card { border-left-color: #0a1021; }
        .fade-in.visible .step { border-top-color: #f4f6f8; border-bottom-color: #f4f6f8; }
        .fade-in.visible .card:not(:last-child)::after { background: #e5e7eb; }

        @media (max-width: 960px) {
          .nav-links { display: none; }
          .nav-content { grid-template-columns: auto auto; justify-content: space-between; }
          .cta { justify-self: end; }
          .hero-card { padding: 3.2rem 2.4rem; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-3 .card::after { display: none; }
        }

        @media (max-width: 640px) {
          .nav { padding: 0.9rem 4vw; }
          .nav-content { grid-template-columns: auto auto; gap: 0.8rem; padding: 0.6rem 4vw; }
          .logo { font-size: 1rem; letter-spacing: 0.18em; }
          .cta .btn, .cta .btn span { white-space: nowrap; }
          .cta .btn { padding: 0.5rem 0.9rem; font-size: 0.85rem; }
          .hero { padding: 6.2rem 6vw 4.2rem; }
          .hero-card {
            min-height: auto;
            padding: 3.8rem 1.4rem;
            border-radius: 18px;
          }
          .hero h1 { font-size: 1.45rem; letter-spacing: 0.12em; }
          .hero-tags { gap: 0.9rem; font-size: 0.78rem; flex-wrap: wrap; }
          .hero-tags span { padding-left: 0.8rem; }
          .hero-tags span:not(:first-child)::before { height: 12px; }
          .kpi-bar { padding: 1.6rem 5vw 0; }
          .kpi-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.4rem; }
          .title { font-size: 1.55rem; }
          .lede { font-size: 1rem; }
          .section-head { margin-bottom: 2.6rem; }
          .grid-3 { grid-template-columns: 1fr; gap: 1.5rem; }
          .card { padding: 1.6rem 1.4rem; }
          .steps { gap: 1.2rem; }
          .step { grid-template-columns: 56px 1fr; gap: 1.4rem; padding: 1.6rem 0; }
          .step-no { font-size: 1.2rem; }
          .split { grid-template-columns: 1fr; gap: 1.6rem; }
          .contact-wrapper { padding: 0; }
          .contact-card { width: 100%; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-content">
          <div className="logo">Ambroise Partners</div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#why">Expertise</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="cta">
            <a className="btn" href="#contact"><span>Contact us</span></a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-card fade-in visible">
          <h1>Biotech M&A, precision and impact.</h1>
          <div className="hero-tags">
            <span>M&A</span>
            <span>Growth Financing</span>
            <span>Special Situations</span>
          </div>
        </div>
      </header>

      <div className="kpi-bar fade-in visible">
        <div className="kpi-grid">
          <div className="kpi">
            <div className="num">€2bn+</div>
            <div className="label">Advised transactions (EU/US)</div>
          </div>
          <div className="kpi">
            <div className="num">90%</div>
            <div className="label">Closing rate</div>
          </div>
          <div className="kpi">
            <div className="num">40+</div>
            <div className="label">Cross-border deals</div>
          </div>
          <div className="kpi">
            <div className="num">100%</div>
            <div className="label">Focus Life Sciences</div>
          </div>
        </div>
      </div>

      <section id="services" className={`fade-in ${isVisible['services'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Our services</div>
          <h2 className="title">End-to-end biotech expertise</h2>
          <p className="lede">Tailor-made solutions to structure and secure your strategic transactions.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Fundraising</h3>
            <p>From investment strategy to term negotiation, with access to specialized investors (seed to Series C+).</p>
          </div>
          <div className="card">
            <h3>Biotech M&A</h3>
            <p>Buy-side / sell-side, carve-out and licensing, run with the rigor of a sector-focused investment bank.</p>
          </div>
          <div className="card">
            <h3>Strategic advisory</h3>
            <p>Valuation, financial modeling, option analysis and board-ready support.</p>
          </div>
        </div>
      </section>

      <section id="why" className={`fade-in ${isVisible['why'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Why us</div>
          <h2 className="title">A distinctive approach</h2>
          <p className="lede">We create value by orchestrating every step with precision and transparency.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Scientific expertise</h3>
            <p>Deep understanding of R&D pipelines, regulatory milestones and market access models.</p>
          </div>
          <div className="card">
            <h3>Investor network</h3>
            <p>Direct relationships with biotech funds, corporate ventures and international family offices.</p>
          </div>
          <div className="card">
            <h3>Track record</h3>
            <p>€2bn+ advised, closing rate &gt;90%, cross-border EU/US experience.</p>
          </div>
        </div>
      </section>

      <div className="credentials">
        <div className="track">
          <div className="item"><span className="dot" />€2bn+ advised transactions</div>
          <div className="item"><span className="dot" />Closing &gt; 90%</div>
          <div className="item"><span className="dot" />40+ cross-border deals</div>
          <div className="item"><span className="dot" />100% focus Life Sciences</div>
          <div className="item"><span className="dot" />Team EU / US</div>
          <div className="item"><span className="dot" />Seed to multi-€bn M&A</div>
          <div className="item"><span className="dot" />Biotech fund network</div>
          <div className="item"><span className="dot" />IPO & licensing advisory</div>
          {/* duplicate sequence for seamless loop */}
          <div className="item"><span className="dot" />€2bn+ advised transactions</div>
          <div className="item"><span className="dot" />Closing &gt; 90%</div>
          <div className="item"><span className="dot" />40+ cross-border deals</div>
          <div className="item"><span className="dot" />100% focus Life Sciences</div>
          <div className="item"><span className="dot" />Team EU / US</div>
          <div className="item"><span className="dot" />Seed to multi-€bn M&A</div>
          <div className="item"><span className="dot" />Biotech fund network</div>
          <div className="item"><span className="dot" />IPO & licensing advisory</div>
        </div>
      </div>

      <section id="values" className={`fade-in ${isVisible['values'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Values</div>
          <h2 className="title">Excellence & alignment</h2>
          <p className="lede">Principles that guide every engagement.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Rigor</h3>
            <p>Institutional-grade materials, sourced data, clear narrative: every deliverable is investor-ready.</p>
          </div>
          <div className="card">
            <h3>Transparency</h3>
            <p>Roadmaps, milestones, clear reporting: you always know where we stand.</p>
          </div>
          <div className="card">
            <h3>Alignment</h3>
            <p>Compensation model tied to deal success and value creation.</p>
          </div>
        </div>
      </section>

      <section id="method" className={`fade-in ${isVisible['method'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Methodology</div>
          <h2 className="title">Proven process</h2>
        </div>
        <div className="steps">
          {[
            ['01', 'Strategic audit', 'Assessment of positioning, pipeline and transaction objectives.'],
            ['02', 'Structuring', 'Investment narrative, data room, modeling and investor materials.'],
            ['03', 'Targeted outreach', 'Sourcing and confidential approach to the most relevant counterparties.'],
            ['04', 'Process steering', 'Process coordination, Q&A, due diligence and advisor management.'],
            ['05', 'Closing', 'Negotiation of final terms and securing the signature.'],
          ].map(([no, title, copy]) => (
            <div className="step" key={no}>
              <div className="step-no">{no}</div>
              <div>
                <h4>{title}</h4>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className={`fade-in ${isVisible['about'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Leadership</div>
          <h2 className="title">A biotech-dedicated team</h2>
          <p className="lede">15+ years in sector investment banking (EU & US), IPOs, licensing deals and multi‑billion M&A.</p>
        </div>
        <div className="split">
          <div className="card">
            <h3>Ambition</h3>
            <p>Make top-tier biotech M&A advisory accessible to innovative companies, whatever their stage.</p>
            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.9rem' }}>
              <a className="btn btn-primary" href="mailto:contact@ambroise-partners.com">Email</a>
              <a className="btn" href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <div
            className="card"
            style={{
              background: '#0A1929',
              color: '#fff',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0, 51, 153, 0.18)'
            }}
          >
            <h3 style={{ color: '#fff' }}>Key figures</h3>
            <p style={{ color: 'rgba(255,255,255,0.86)' }}>
              €2bn+ advised · &gt;90% closing · 40+ cross-border biotech deals · 100% life sciences focus.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className={`fade-in ${isVisible['contact'] ? 'visible' : ''}`}>
        <div className="section-head">
          <h2 className="title">Let’s discuss your project</h2>
          <p className="lede">Let’s explore together the best options for your next step.</p>
        </div>
        <div className="contact-wrapper">
          <form onSubmit={handleContactSubmit} className="card contact-card">
            <div className="field">
              <label>Name</label>
              <input className="input" required placeholder="Your full name" />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" required placeholder="you@company.com" />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea required placeholder="Describe your project..." />
            </div>
            <label className="checkbox">
              <input type="checkbox" required style={{ marginTop: '4px' }} />
              I agree that my information will be processed to answer my request.
            </label>
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h4 className="footer-logo">Ambroise Partners</h4>
            <p>Reference biotech fundraising and M&A advisory.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <a href="#services">Services</a><br />
            <a href="#why">Expertise</a><br />
            <a href="#method">Method</a><br />
            <a href="#about">About</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:contact@ambroise-partners.com">contact@ambroise-partners.com</a><br />
            <a href="tel:+33100000000">+33 (0)1 XX XX XX XX</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Legal notice</a><br />
            <a href="#">Privacy policy</a>
          </div>
        </div>
        <div className="foot-note">© 2025 Ambroise Partners. All rights reserved.</div>
      </footer>
    </>
  );
}

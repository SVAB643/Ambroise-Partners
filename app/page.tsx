'use client';

import { useEffect, useState } from 'react';

export default function AmbroisePartners() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

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
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          color: var(--ink);
          background: #ffffff;
          line-height: 1.65;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }

        /* Navigation */
        .nav {
          position: fixed;
          inset: 0 0 auto 0;
          width: 100%;
          background: ${scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
          border-bottom: ${scrolled ? '1px solid rgba(14,17,23,0.06)' : 'none'};
          box-shadow: ${scrolled ? '0 8px 24px rgba(0,0,0,0.06)' : 'none'};
          backdrop-filter: blur(12px);
          z-index: 110;
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, color 0.25s ease;
          color: ${scrolled ? '#0a0f2c' : '#ffffff'};
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
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font: 600 1.05rem 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: inherit;
        }
        .logo-mark {
          font: 700 1.25rem 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          letter-spacing: 0.18em;
        }
        .logo-text {
          font: 600 1rem 'Gotham', 'Gotham SSm A', 'Gotham SSm B', 'Montserrat', 'Inter', sans-serif;
          letter-spacing: 0.14em;
        }
        .nav-links {
          display: flex;
          gap: 1.6rem;
          align-items: center;
          justify-content: center;
          justify-self: center;
        }
        .nav-links a {
          font-weight: 600;
          color: inherit;
          letter-spacing: 0.03em;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }
        .nav-links a:hover { color: #0d6bff; }
        .alt-link {
          border: 1px dashed rgba(255,255,255,0.65);
          padding: 0.55rem 0.95rem;
          border-radius: 999px;
          font-size: 0.85rem;
          color: inherit;
          transition: all 0.2s ease;
          opacity: 0.85;
        }
        .alt-link:hover { opacity: 1; background: rgba(255,255,255,0.08); }
        .cta { display: flex; gap: 0.75rem; }
        .btn {
          border: 1px solid ${scrolled ? '#0b1c3d' : '#ffffff'};
          padding: 0.72rem 1.3rem;
          border-radius: 14px;
          font-weight: 700;
          color: ${scrolled ? '#0b1c3d' : '#ffffff'};
          background: transparent;
          position: relative;
          overflow: hidden;
          transition: color 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
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
        .btn-primary {
          background: linear-gradient(135deg, #0b1c3d 0%, #0f2c5e 60%, #1446a1 100%);
          border: none;
          color: #ffffff;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(11, 28, 61, 0.28);
        }

        /* Mobile Menu */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 120;
        }
        .mobile-menu-btn svg {
          width: 24px;
          height: 24px;
        }
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 320px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
          z-index: 115;
          padding: 5rem 2rem 2rem;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        .mobile-menu.open {
          transform: translateX(0);
        }
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 114;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mobile-nav-links a {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0a0f2c;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .mobile-cta {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Hero */
        .hero {
          padding: 0;
          margin: 0;
        }
        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 0;
          padding: 8.5rem 6vw 7rem;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(
            180deg,
            #050b1e 0%,
            #081434 18%,
            #0b2459 32%,
            #0c3f9a 46%,
            #0b3bff 60%,
            #4f9bff 70%,
            #7cb9ff 78%,
            #d6e8ff 90%,
            #ffffff 97%,
            #ffffff 100%
          );
          color: #ffffff;
          box-shadow: none;
          isolation: isolate;
          text-align: right;
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
          color: #ffffff;
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.45rem;
          max-width: 22ch;
          margin: 0 0 1.6rem;
          line-height: 1.08;
          letter-spacing: 0.06em;
          font-size: clamp(2.6rem, 5vw, 3.8rem);
          text-transform: uppercase;
          font-weight: 700;
        }
        .hero-line {
          display: block;
          white-space: normal;
          text-align: right;
        }
        .hero-tags {
          margin-top: 1.6rem;
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          color: rgba(255, 255, 255, 0.92);
          font-size: 1.05rem;
          letter-spacing: 0.08em;
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
        .hero p { display: none; }
        .hero-actions { display: none; }

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

        /* Sections */
        section { padding: 4.5rem 6vw; max-width: 1400px; margin: 0 auto; }
        .section-head { text-align: center; max-width: 760px; margin: 0 auto 2.5rem; }
        .eyebrow { text-transform: uppercase; letter-spacing: 2px; color: var(--muted); font-weight: 600; font-size: 0.78rem; }
        .title {
          font-family: 'PP Editorial New', 'PPEditorialNew', 'Times New Roman', serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(2.6rem, 3.4vw, 3rem);
          letter-spacing: -0.02em;
          margin: 0.5rem 0 0.85rem;
        }
        .lede { color: var(--muted); font-size: 1rem; }

        /* Cards */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
        }
        .services-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
        }
        .services-grid .card {
          border: none;
        }
        .services-grid .card:nth-child(odd) { border-right: 1px solid var(--line); }
        .services-grid .card:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
        .services-grid .card::after { display: none; }
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
          outline: 2px solid rgba(11,59,255,0.14);
          border-color: var(--cobalt);
          box-shadow: 0 8px 24px rgba(11,59,255,0.12);
        }
        .contact-card button {
          align-self: center;
          min-width: 180px;
          padding-inline: 1.6rem;
        }

        /* Steps */
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 1.2rem;
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

        /* Footer */
        .footer {
          padding: 4rem 6vw 3rem;
          background: #0a0f2c;
        }
        .footer-simple {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
          color: #ffffff;
        }
        .footer a { color: #ffffff; }
        .footer-logo { font-size: 1.2rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ffffff; }
        .footer-lede { margin-top: 0.35rem; color: #e6edff; }
        .footer-contact { display: flex; gap: 1.2rem; flex-wrap: wrap; }
        .foot-note { margin-top: 2.2rem; color: #e6edff; text-align: center; font-size: 0.9rem; }

        /* Fade-in */
        .fade-in, .fade-in-section {
          opacity: 0;
          transform: translateY(36px) scale(0.985);
          filter: blur(4px);
          transition:
            opacity 0.7s ease,
            transform 0.7s ease,
            filter 0.7s ease;
          transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .fade-in.visible, .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        /* Reveal lines */
        .fade-in.visible .service-card { border-color: #e5e7eb; }
        .fade-in.visible .card:not(:last-child)::after { background: #e5e7eb; }
        .fade-in.visible .step { border-top-color: #f4f6f8; border-bottom-color: #f4f6f8; }

        /* Tablet */
        @media (max-width: 960px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: block; }
          .nav-content { grid-template-columns: auto auto; justify-content: space-between; }
          .cta { justify-self: end; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-3 .card::after { display: none; }
          .services-grid { grid-template-columns: 1fr; }
          .services-grid .card { border: none !important; }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .nav-content { padding: 0.75rem 5vw; }
          .logo { font-size: 0.9rem; letter-spacing: 0.14em; }
          .logo-mark { font-size: 1.1rem; }
          .logo-text { font-size: 0.85rem; }
          .cta .btn { padding: 0.6rem 1rem; font-size: 0.85rem; }

          .hero-card {
            min-height: 85vh;
            padding: 6rem 6vw 5rem;
            align-items: center;
            text-align: center;
          }
          .hero h1 {
            font-size: clamp(1.8rem, 6vw, 2.4rem);
            letter-spacing: 0.04em;
            line-height: 1.15;
            max-width: 100%;
            text-align: center;
            align-items: center;
          }
          .hero-line { white-space: normal; text-align: center; }
          .hero-tags {
            gap: 0.8rem;
            font-size: 0.75rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          .hero-tags span { padding-left: 0.7rem; }
          .hero-tags span:not(:first-child)::before { height: 10px; }

          .hero p {
            display: block;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
            max-width: 32ch;
            margin: 1.2rem auto 0;
            text-align: center;
            line-height: 1.6;
          }
          .hero-actions {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
            width: 100%;
            max-width: 300px;
            margin: 1.5rem auto 0;
          }
          .hero-actions .btn {
            width: 100%;
            justify-content: center;
            text-align: center;
            padding: 0.85rem 1.2rem;
            font-size: 0.9rem;
          }

          .kpi-bar { padding: 2.5rem 6vw 0; }
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem 1rem;
          }
          .kpi { padding: 1.2rem 0.8rem; }
          .kpi .num { font-size: 1.6rem; }
          .kpi .label { font-size: 0.82rem; }

          section { padding: 3.5rem 6vw; }
          .title { font-size: 1.85rem; }
          .lede { font-size: 0.95rem; }
          .section-head { margin-bottom: 2.2rem; }

          .card { padding: 2rem 1.2rem; }
          .card h3 { font-size: 1.15rem; }
          .card p { font-size: 0.95rem; line-height: 1.6; }

          .steps { gap: 0; }
          .step {
            grid-template-columns: 50px 1fr;
            gap: 1rem;
            padding: 1.5rem 0.5rem;
          }
          .step-no { font-size: 1.4rem; }
          .step h4 { font-size: 1.05rem; }
          .step p { font-size: 0.92rem; }

          .split { grid-template-columns: 1fr; gap: 1.5rem; }
          .contact-card { padding: 2rem 1.5rem; }
          .contact-card button { min-width: 160px; }

          .footer { padding: 3rem 6vw 2.5rem; }
          .footer-simple { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .footer-contact { flex-direction: column; gap: 0.8rem; font-size: 0.9rem; }
          .foot-note { margin-top: 1.8rem; font-size: 0.85rem; }
        }

        @media (max-width: 480px) {
          .nav-content { padding: 0.7rem 4vw; }
          .hero-card { padding: 5.5rem 5vw 4.5rem; }
          .hero h1 { font-size: 1.65rem; letter-spacing: 0.02em; }
          .kpi-bar { padding: 2rem 5vw 0; }
          section { padding: 3rem 5vw; }
          .title { font-size: 1.65rem; }
          .card { padding: 1.8rem 1rem; }
          .contact-card { padding: 1.8rem 1.2rem; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-mark">AP</span>
            <span className="logo-text">Ambroise Partners</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#why">Expertise</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a className="alt-link" href="/1">Nouvelle version</a>
          </div>
          <div className="cta">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a className="btn" href="#contact"><span>Contact us</span></a>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu} />
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <a href="#services" onClick={closeMobileMenu}>Services</a>
          <a href="#why" onClick={closeMobileMenu}>Expertise</a>
          <a href="#method" onClick={closeMobileMenu}>Method</a>
          <a href="#about" onClick={closeMobileMenu}>About</a>
          <a href="#contact" onClick={closeMobileMenu}>Contact</a>
          <a href="/1" onClick={closeMobileMenu}>Nouvelle version</a>
        </div>
        <div className="mobile-cta">
          <a className="btn btn-primary" href="#contact" onClick={closeMobileMenu}>
            <span>Contact us</span>
          </a>
        </div>
      </div>

      <header className="hero">
        <div className="hero-card fade-in visible">
          <h1>
            <span className="hero-line">Healthcare focused advisory</span>
            <span className="hero-line">serving the innovation</span>
            <span className="hero-line">ecosystem</span>
          </h1>
          <div className="hero-tags">
            <span>M&A</span>
            <span>Fundraising</span>
            <span>Licensing</span>
            <span>Growth</span>
          </div>
          <p>Expert guidance for biotech and medtech companies across Europe and the United States.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact"><span>Get in touch</span></a>
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
          <div className="eyebrow">Our Services</div>
          <h2 className="title">Our Services</h2>
          <p className="lede">We provide end-to-end support across all types of healthcare transactions, from early strategic positioning and preparation to execution and closing.</p>
        </div>
        <div className="grid-3 services-grid">
          <div className="card">
            <h3>M&amp;A</h3>
            <p>Buy-side, sell-side and strategic acquisitions across the global healthcare ecosystem.</p>
          </div>
          <div className="card">
            <h3>Fundraising</h3>
            <p>Growth financing from early-stage to later rounds, partnering with leading healthcare-focused investors.</p>
          </div>
          <div className="card">
            <h3>Licensing &amp; Strategic Partnerships</h3>
            <p>Structuring value-creating licensing and collaboration agreements with global strategic players.</p>
          </div>
          <div className="card">
            <h3>Strategic Advisory &amp; External Growth</h3>
            <p>Independent advice on strategic options, portfolio positioning and long-term growth trajectories.</p>
          </div>
        </div>
      </section>

      <section id="why" className={`fade-in ${isVisible['why'] ? 'visible' : ''}`}>
        <div className="section-head">
          <div className="eyebrow">Our Approach</div>
          <h2 className="title">Our Approach</h2>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Scientific expertise</h3>
            <p>Deep understanding of healthcare science and ecosystems, backed by strong medical and scientific academic backgrounds within the team.</p>
          </div>
          <div className="card">
            <h3>Deep Network</h3>
            <p>A global network of leading healthcare investors and strategic partners, developed through years of active involvement in the healthcare sector worldwide.</p>
          </div>
          <div className="card">
            <h3>Execution excellence</h3>
            <p>The rigor and standards of top-tier investment banks, built on more than 10 years of experience in top-tier institutions, combined with hands-on execution, agility and close client support.</p>
          </div>
        </div>
      </section>

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
            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
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
          <h2 className="title">Let's discuss your project</h2>
          <p className="lede">Let's explore together the best options for your next step.</p>
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
        <div className="footer-simple">
          <div>
            <h4 className="footer-logo">Ambroise Partners</h4>
            <p className="footer-lede">Biotech & medtech advisory — EU / US</p>
          </div>
          <div className="footer-contact">
            <a href="mailto:contact@ambroise-partners.com">contact@ambroise-partners.com</a>
            <a href="tel:+33100000000">+33 (0)1 XX XX XX XX</a>
          </div>
        </div>
        <div className="foot-note">© 2026 Ambroise Partners.</div>
      </footer>
    </>
  );
}

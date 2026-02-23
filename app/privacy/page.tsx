'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--white:#fff;--ink:#1a1a1a;--blue:#0f2fff;--muted:#6b6b78;--line:#e8e8f0;--dark:#080e26;--sans:'Inter',-apple-system,sans-serif;--serif:'Lora',Georgia,serif;--ease:cubic-bezier(0.22,0.61,0.36,1);}
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--white);color:var(--ink);overflow-x:hidden;line-height:1.65;-webkit-font-smoothing:antialiased;}
        a{color:inherit;text-decoration:none;}

        .legal-nav{position:fixed;top:0;left:0;right:0;z-index:300;background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line);box-shadow:0 1px 12px rgba(0,0,0,0.06);}
        .legal-nav-inner{max-width:1440px;margin:0 auto;padding:0 4vw;height:64px;display:flex;align-items:center;justify-content:space-between;}
        .logo-wrap{display:flex;align-items:center;gap:.7rem;}
        .logo-ap{font-family:var(--serif);font-style:italic;font-weight:500;font-size:1.55rem;letter-spacing:-.01em;color:var(--ink);}
        .logo-sep{width:1px;height:16px;background:var(--line);}
        .logo-name{font-size:.95rem;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}
        .back-link{font-size:.84rem;font-weight:400;color:var(--muted);display:flex;align-items:center;gap:.4rem;transition:color .18s;}
        .back-link:hover{color:var(--ink);}

        .legal-hero{padding:10rem 4vw 4rem;text-align:center;background:#f8f7f4;}
        .legal-hero h1{font-family:var(--serif);font-weight:400;font-size:clamp(2.2rem,4vw,3.2rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:1rem;}
        .legal-hero p{color:var(--muted);font-size:.95rem;font-weight:300;}

        .legal-content{max-width:760px;margin:0 auto;padding:4rem 4vw 6rem;}
        .legal-content h2{font-family:var(--serif);font-weight:400;font-size:1.5rem;letter-spacing:-.01em;margin:3rem 0 1rem;line-height:1.2;}
        .legal-content h2:first-child{margin-top:0;}
        .legal-content p{color:var(--muted);font-size:.92rem;line-height:1.82;font-weight:300;margin-bottom:1rem;}
        .legal-content ul{color:var(--muted);font-size:.92rem;line-height:1.82;font-weight:300;margin-bottom:1rem;padding-left:1.5rem;}
        .legal-content li{margin-bottom:.4rem;}
        .legal-content strong{font-weight:500;color:var(--ink);}

        .legal-footer{background:var(--dark);padding:3rem 4vw;text-align:center;}
        .legal-footer p{font-size:.7rem;color:rgba(255,255,255,.3);letter-spacing:.04em;}

        @media(max-width:600px){
          .legal-nav-inner{padding:0 5vw;height:56px;}
          .logo-ap{font-size:1.3rem;}
          .logo-name{font-size:.75rem;}
          .legal-hero{padding:8rem 5vw 3rem;}
          .legal-content{padding:3rem 5vw 4rem;}
        }
        @media(max-width:380px){
          .logo-name,.logo-sep{display:none;}
        }
      `}</style>

      <div className="legal-nav">
        <div className="legal-nav-inner">
          <a href="/2" className="logo-wrap">
            <span className="logo-ap">AP</span>
            <span className="logo-sep" />
            <span className="logo-name">Ambroise Partners</span>
          </a>
          <a href="/2" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
            Back
          </a>
        </div>
      </div>

      <div className="legal-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: February 2026</p>
      </div>

      <div className="legal-content">
        <h2>Introduction</h2>
        <p>Ambroise Partners (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website or interact with our services.</p>

        <h2>Data Controller</h2>
        <p><strong>Ambroise Partners</strong><br />Registered in Paris, France<br />Contact: <a href="mailto:contact@ambroisepartners.com" style={{ color: 'var(--blue)' }}>contact@ambroisepartners.com</a></p>

        <h2>Data We Collect</h2>
        <p>We may collect the following categories of personal data:</p>
        <ul>
          <li><strong>Identity data:</strong> name, job title, company name</li>
          <li><strong>Contact data:</strong> email address, phone number</li>
          <li><strong>Communication data:</strong> messages submitted via our contact form</li>
          <li><strong>Technical data:</strong> IP address, browser type and version, operating system, referral source, pages visited, and duration of visit</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <p>We process your personal data for the following purposes:</p>
        <ul>
          <li>To respond to your inquiries and provide our advisory services</li>
          <li>To maintain and improve our website</li>
          <li>To comply with legal and regulatory obligations</li>
          <li>To protect our legitimate business interests</li>
        </ul>

        <h2>Legal Basis for Processing</h2>
        <p>We process your personal data based on:</p>
        <ul>
          <li><strong>Consent:</strong> when you submit information through our contact form</li>
          <li><strong>Legitimate interest:</strong> to improve our services and website performance</li>
          <li><strong>Legal obligation:</strong> to comply with applicable laws and regulations</li>
        </ul>

        <h2>Data Retention</h2>
        <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, typically no longer than 3 years from the last interaction, unless a longer retention period is required by law.</p>

        <h2>Data Sharing</h2>
        <p>We do not sell your personal data. We may share your data with:</p>
        <ul>
          <li>Service providers who assist us in operating our website (hosting, analytics)</li>
          <li>Professional advisors (legal, accounting) when required</li>
          <li>Authorities when required by law</li>
        </ul>

        <h2>Your Rights</h2>
        <p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Request erasure of your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <a href="mailto:contact@ambroisepartners.com" style={{ color: 'var(--blue)' }}>contact@ambroisepartners.com</a>.</p>

        <h2>International Transfers</h2>
        <p>Your data may be transferred to, and processed in, countries outside the European Economic Area (EEA). When we do so, we ensure appropriate safeguards are in place in accordance with GDPR requirements.</p>

        <h2>Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
      </div>

      <div className="legal-footer">
        <p>&copy; 2026 Ambroise Partners. All rights reserved.</p>
      </div>
    </>
  );
}

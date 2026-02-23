'use client';

import React from 'react';

export default function CookiePolicyPage() {
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
        .legal-content h3{font-family:var(--sans);font-weight:500;font-size:1rem;margin:2rem 0 .6rem;color:var(--ink);}
        .legal-content p{color:var(--muted);font-size:.92rem;line-height:1.82;font-weight:300;margin-bottom:1rem;}
        .legal-content ul{color:var(--muted);font-size:.92rem;line-height:1.82;font-weight:300;margin-bottom:1rem;padding-left:1.5rem;}
        .legal-content li{margin-bottom:.4rem;}
        .legal-content strong{font-weight:500;color:var(--ink);}

        .cookie-table{width:100%;border-collapse:collapse;margin:1.5rem 0 2rem;font-size:.85rem;}
        .cookie-table th{text-align:left;font-weight:500;color:var(--ink);padding:.8rem 1rem;border-bottom:2px solid var(--line);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;}
        .cookie-table td{padding:.75rem 1rem;border-bottom:1px solid var(--line);color:var(--muted);font-weight:300;vertical-align:top;}
        .cookie-table tr:last-child td{border-bottom:none;}

        .legal-footer{background:var(--dark);padding:3rem 4vw;text-align:center;}
        .legal-footer p{font-size:.7rem;color:rgba(255,255,255,.3);letter-spacing:.04em;}

        @media(max-width:600px){
          .legal-nav-inner{padding:0 5vw;height:56px;}
          .logo-ap{font-size:1.3rem;}
          .logo-name{font-size:.75rem;}
          .legal-hero{padding:8rem 5vw 3rem;}
          .legal-content{padding:3rem 5vw 4rem;}
          .cookie-table{font-size:.78rem;}
          .cookie-table th,.cookie-table td{padding:.6rem .7rem;}
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
        <h1>Cookie Policy</h1>
        <p>Last updated: February 2026</p>
      </div>

      <div className="legal-content">
        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you interact with the site.</p>

        <h2>How We Use Cookies</h2>
        <p>Ambroise Partners uses cookies to ensure the proper functioning of our website and to improve your browsing experience. We use the following types of cookies:</p>

        <h3>Strictly Necessary Cookies</h3>
        <p>These cookies are essential for the website to function properly. They cannot be disabled.</p>
        <table className="cookie-table">
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>session_id</td><td>Maintains your session state</td><td>Session</td></tr>
          </tbody>
        </table>

        <h3>Analytics Cookies</h3>
        <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
        <table className="cookie-table">
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td>_ga</td><td>Google Analytics &mdash; distinguishes unique users</td><td>2 years</td></tr>
            <tr><td>_ga_*</td><td>Google Analytics &mdash; maintains session state</td><td>2 years</td></tr>
          </tbody>
        </table>

        <h2>Managing Cookies</h2>
        <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
        <ul>
          <li>View what cookies are stored and delete them individually</li>
          <li>Block third-party cookies</li>
          <li>Block cookies from specific sites</li>
          <li>Block all cookies</li>
          <li>Delete all cookies when you close your browser</li>
        </ul>
        <p>Please note that disabling cookies may affect the functionality of this website.</p>

        <h2>Browser Settings</h2>
        <p>To manage cookies in your browser:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Cookies</li>
          <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data</li>
          <li><strong>Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies</li>
          <li><strong>Edge:</strong> Settings &rarr; Cookies and Site Permissions</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

        <h2>Contact</h2>
        <p>For questions about our use of cookies, please contact us at <a href="mailto:contact@ambroise-partners.com" style={{ color: 'var(--blue)' }}>contact@ambroise-partners.com</a>.</p>
      </div>

      <div className="legal-footer">
        <p>&copy; 2026 Ambroise Partners. All rights reserved.</p>
      </div>
    </>
  );
}

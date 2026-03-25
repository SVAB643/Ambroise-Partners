import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const siteUrl = "https://www.ambroisepartners.com";

export const metadata: Metadata = {
  title: "Ambroise Partners - Healthcare Financial Advisory",
  description: "Strategic and transactional advisory for healthcare companies. M&A, capital raising, partnerships & licensing.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Ambroise Partners - Healthcare Financial Advisory",
    description: "Strategic and transactional advisory for healthcare companies. M&A, capital raising, partnerships & licensing.",
    url: siteUrl,
    siteName: "Ambroise Partners",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Ambroise Partners" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambroise Partners - Healthcare Financial Advisory",
    description: "Strategic and transactional advisory for healthcare companies.",
    images: ["/og-image.svg"],
  },
  keywords: ["healthcare advisory", "M&A", "capital raising", "partnerships", "licensing", "pharma", "biotech", "medtech"],
  authors: [{ name: "Ambroise Partners" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body className="antialiased">
        <div id="page-loader" className="page-loader" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

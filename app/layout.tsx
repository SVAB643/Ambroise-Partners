import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ambroise Partners — Healthcare Advisory",
  description: "Strategic and transactional advisory for healthcare companies. M&A, capital raising, partnerships & licensing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

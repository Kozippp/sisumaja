import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

export const metadata: Metadata = {
  title: "Sisumaja | Eesti esimene creatorhouse",
  description: "Sisumaja on Eesti esimene creatorhouse, kuhu on kolinud kokku 6 eesti sisuloojat.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

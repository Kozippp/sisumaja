import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      </body>
    </html>
  );
}

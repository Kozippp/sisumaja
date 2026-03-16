import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

export const metadata: Metadata = {
  title: "Kozip | Sinu brändi sotsiaalmeedia partner",
  description: "Kozip loob sotsiaalmeedia sisu ja pakub reklaamilahendusi Youtube'is ja lühivideotes. Tõstame sinu brändi nähtavust.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="et" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <RecaptchaProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          </RecaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

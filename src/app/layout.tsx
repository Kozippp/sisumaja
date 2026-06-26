import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { SITE_URL, siteConfig } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kozip | Sinu brändi sotsiaalmeedia partner",
    template: "%s | Kozip",
  },
  description: siteConfig.description,
  keywords: [
    "Kozip",
    "Eesti YouTuber",
    "Eesti sisulooja",
    "influencer-turundus",
    "brändikoostöö",
    "videoturundus",
    "YouTube reklaam",
    "lühivideod",
    "noorte sisulooja",
    "seiklusvideod",
    "toidusisu",
  ],
  authors: [{ name: "Kozip" }],
  creator: "Kozip",
  publisher: "Kozip",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: siteConfig.localeAlternate,
    url: SITE_URL,
    siteName: siteConfig.name,
    title: "Kozip | Sinu brändi sotsiaalmeedia partner",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kozip | Sinu brändi sotsiaalmeedia partner",
    description: siteConfig.description,
  },
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
      <head>
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <RecaptchaProvider>
          <Analytics />
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

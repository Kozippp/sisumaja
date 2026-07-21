import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { SITE_URL, siteConfig, buildAlternates } from "@/lib/site";
import { routing } from "@/i18n/routing";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  const description = en ? siteConfig.descriptionEn : siteConfig.description;
  const title = en
    ? "Kozip | Your brand’s social media partner"
    : "Kozip | Sinu brändi sotsiaalmeedia partner";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Kozip",
    },
    description,
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
    alternates: buildAlternates("/", locale),
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
      locale: en ? siteConfig.localeAlternate : siteConfig.locale,
      alternateLocale: en ? siteConfig.locale : siteConfig.localeAlternate,
      url: en ? `${SITE_URL}/en` : SITE_URL,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Kozip" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Luba staatiline renderdamine (next-intl) selle keele jaoks
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <Analytics />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

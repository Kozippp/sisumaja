/**
 * Keskne saidi-konfiguratsioon — kasutatakse metadata, sitemap'i, robots'i
 * ja structured data (JSON-LD) jaoks. Hoia kõik avalikud "faktid" siin ühes kohas.
 *
 * Domeen tuleb keskkonnamuutujast NEXT_PUBLIC_SITE_URL (sea see Vercelis ja .env.local-is),
 * vaikeväärtus on toodangu domeen.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://reklaam.kozip.ee'
).replace(/\/$/, '');

export const siteConfig = {
  name: 'Kozip',
  /** Alternatiivnimed, et AI ja otsingumootorid seoksid brändi variandid kokku. */
  alternateNames: ['Kozip Eesti', 'Kozip Productions'],
  url: SITE_URL,
  email: 'info@kozip.ee',
  description:
    'Kozip loob sotsiaalmeedia sisu ja pakub reklaamilahendusi YouTube’is ja lühivideotes. Tõstame sinu brändi nähtavust noorte ja kogu pere seas.',
  descriptionEn:
    'Kozip creates social media content and advertising solutions on YouTube and in short-form video. We grow your brand’s visibility among young and family audiences in Estonia.',
  logo: `${SITE_URL}/kozip-logo.png`,
  ogImage: `${SITE_URL}/opengraph-image`,
  locale: 'et_EE',
  localeAlternate: 'en_US',
  /** sameAs — seob veebilehe ja Kozipi brändikanalid AI/otsingu silmis kokku. */
  social: {
    youtube: 'https://www.youtube.com/@Kozip',
    instagram: 'https://www.instagram.com/kozip_eesti/',
    tiktok: 'https://www.tiktok.com/@kozipeesti',
    facebook: 'https://www.facebook.com/KozipEesti',
  },
  /**
   * Kozipi taga olevad inimesed. Neil on ka isiklikud kanalid, kuhu Kozip pakub
   * brändidele reklaami. Lähevad Organization JSON-LD founder/member väljadesse.
   */
  people: [
    {
      name: 'Mihkel Kööbi',
      sameAs: [
        'https://www.tiktok.com/@kozipimihkel',
        'https://www.instagram.com/mihkelkk/',
      ],
    },
    {
      name: 'Maia-Liis Ossip',
      sameAs: [
        'https://www.tiktok.com/@kozipi_maialiis',
        'https://www.instagram.com/maialiis.o/',
      ],
    },
  ],
  /** Teemad, mida Kozip "tunneb" — kasutatakse Organization JSON-LD knowsAbout väljas. */
  knowsAbout: [
    'videoturundus',
    'brändikoostöö',
    'influencer-turundus',
    'YouTube reklaam',
    'lühivideod',
    'sotsiaalmeedia sisu',
    'noorte sihtrühm',
    'Z-generatsioon',
    'seiklussisu',
    'meelelahutus',
    'toidusisu',
    'brändikampaaniad',
  ],
} as const;

export const socialLinks = Object.values(siteConfig.social);

/** Mugav abi absoluutsete URLide tegemiseks (canonical, OG, sitemap). */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Lokaliseeritud tee 'as-needed' strateegiaga:
 * eesti = ilma prefiksita (/koostoo), inglise = /en prefiksiga (/en/koostoo).
 */
export function localePath(path: string, locale: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return p === '/' ? '/en' : `/en${p}`;
  return p;
}

/**
 * Metadata `alternates` plokk: canonical (käesolev keel) + hreflang lingid
 * mõlemale keelele + x-default. Töötab koos metadataBase'iga (suhtelised teed).
 */
export function buildAlternates(path: string, locale: string) {
  return {
    canonical: localePath(path, locale),
    languages: {
      et: localePath(path, 'et'),
      en: localePath(path, 'en'),
      'x-default': localePath(path, 'et'),
    },
  };
}

/**
 * JSON-LD structured data ehitajad (schema.org).
 * Renderda tulemus <JsonLd data={...} /> komponendiga.
 *
 * Eesmärk: anda AI-le ja otsingumootoritele masinloetavad faktid Kozipi,
 * teenuste, tehtud tööde, KKK ja artiklite kohta.
 */
import { siteConfig, SITE_URL, socialLinks, absoluteUrl } from './site';

/** Organisatsioon — peamine "kes on Kozip" fakt. Pane layout'i (kõikidele lehtedele). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: SITE_URL,
    logo: siteConfig.logo,
    image: siteConfig.ogImage,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: socialLinks,
    areaServed: { '@type': 'Country', name: 'Estonia' },
    knowsAbout: siteConfig.knowsAbout,
    founder: siteConfig.people.map((p) => ({
      '@type': 'Person',
      name: p.name,
      sameAs: p.sameAs,
    })),
    knowsLanguage: ['et', 'en'],
  };
}

/** Veebileht ise — seob nime ja URLi, lubab otsingu sitelinks'i. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: SITE_URL,
    inLanguage: ['et', 'en'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** KKK — võimaldab AI-l/Google'il vastuseid otse tsiteerida. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

/** Leivapuru-rada — aitab struktuuri mõista. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Tehtud töö / brändikoostöö video. */
export function creativeWorkSchema(opts: {
  name: string;
  description?: string | null;
  path: string;
  image?: string | null;
  brand?: string | null;
  views?: number | null;
  datePublished?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description || undefined,
    url: absoluteUrl(opts.path),
    image: opts.image || undefined,
    inLanguage: 'et',
    datePublished: opts.datePublished || undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
    ...(opts.brand
      ? { about: { '@type': 'Brand', name: opts.brand }, sponsor: { '@type': 'Organization', name: opts.brand } }
      : {}),
    ...(opts.views
      ? {
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/WatchAction',
            userInteractionCount: opts.views,
          },
        }
      : {}),
  };
}

/** Artikkel / blogipostitus. */
export function articleSchema(opts: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description || undefined,
    url: absoluteUrl(opts.path),
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image || siteConfig.ogImage,
    inLanguage: opts.locale === 'en' ? 'en' : 'et',
    datePublished: opts.datePublished || undefined,
    dateModified: opts.dateModified || opts.datePublished || undefined,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

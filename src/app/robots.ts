import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * robots.txt — lubab nii tavalised otsingumootorid kui ka AI-crawlerid
 * (GPTBot, ClaudeBot, PerplexityBot, Google-Extended jne), sest me TAHAME
 * AI-nähtavust. Blokeerime ainult admin- ja API-teed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/pakkumine'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

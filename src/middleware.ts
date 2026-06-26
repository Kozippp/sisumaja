import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Jäta vahele API-d, Next.js sisemised teed, metadata-failid (robots/sitemap/
  // opengraph-image) ja kõik faililaiendiga staatilised failid.
  matcher: ['/((?!api|_next|_vercel|robots.txt|sitemap.xml|opengraph-image|.*\\..*).*)'],
};

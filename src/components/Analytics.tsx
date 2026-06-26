'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initAnalytics, trackPageview, ANALYTICS_AVAILABLE } from '@/lib/analytics';

/**
 * Laeb PostHog'i (kui võti ja nõusolek olemas) ja saadab lehevaatamisi
 * route-muutusel. Kuulab ka 'cookie-consent-changed' sündmust, et alustada
 * jälgimist kohe pärast nõusoleku andmist.
 */
export default function Analytics() {
  const pathname = usePathname();

  // Init nõusolekul + kuula nõusoleku muutust
  useEffect(() => {
    if (!ANALYTICS_AVAILABLE) return;
    initAnalytics();

    const onConsentChange = () => {
      initAnalytics();
      trackPageview(window.location.href);
    };
    window.addEventListener('cookie-consent-changed', onConsentChange);
    return () => window.removeEventListener('cookie-consent-changed', onConsentChange);
  }, []);

  // Lehevaatamine route-muutusel
  useEffect(() => {
    if (!ANALYTICS_AVAILABLE) return;
    initAnalytics();
    trackPageview(window.location.href);
  }, [pathname]);

  return null;
}

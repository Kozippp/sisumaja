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

    const onConsentChange = () => {
      void initAnalytics().then(() => {
        trackPageview(window.location.href);
      });
    };
    window.addEventListener('cookie-consent-changed', onConsentChange);
    return () => window.removeEventListener('cookie-consent-changed', onConsentChange);
  }, []);

  // Lehevaatamine route-muutusel
  useEffect(() => {
    if (!ANALYTICS_AVAILABLE) return;
    let cancelled = false;
    void initAnalytics().then(() => {
      if (!cancelled) {
        trackPageview(window.location.href);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}

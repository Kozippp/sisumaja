/**
 * Õhuke PostHog wrapper. Kasuta ainult kliendikomponentides.
 *
 * Analüütika laaditakse AINULT siis, kui kasutaja on andnud küpsiste-nõusoleku
 * ("all") JA keskkonnas on NEXT_PUBLIC_POSTHOG_KEY seatud (Vercel / .env.local).
 * Ilma võtmeta või nõusolekuta ei juhtu midagi — sait töötab edasi.
 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
export const ANALYTICS_AVAILABLE = !!POSTHOG_KEY;

interface AnalyticsClient {
  init: (key: string, options: Record<string, unknown>) => void;
  capture: (event: string, properties?: Record<string, unknown>) => void;
  opt_out_capturing: () => void;
  reset: () => void;
}

let initialized = false;
let initializationPromise: Promise<void> | null = null;
let analyticsClient: AnalyticsClient | null = null;

/** Kas kasutaja on nõustunud kõigi küpsistega? */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie-consent') === 'all';
}

/** Initsialiseeri PostHog, kui võti olemas ja nõusolek antud. Idempotentne. */
export async function initAnalytics(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY || initialized || !hasAnalyticsConsent()) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // teeme käsitsi route-muutusel
        capture_pageleave: true, // mõõdab lehel veedetud aega
        autocapture: true, // püüab klikid/sisendid automaatselt
        persistence: 'localStorage+cookie',
      });
      analyticsClient = posthog;
      initialized = true;
    })
    .catch((error) => {
      initializationPromise = null;
      console.error('Analytics initialization failed:', error);
    });

  return initializationPromise;
}

/** Lülita analüütika välja ja kustuta andmed (kui kasutaja võtab nõusoleku tagasi). */
export function disableAnalytics(): void {
  if (typeof window === 'undefined' || !analyticsClient) return;
  try {
    analyticsClient.opt_out_capturing();
    analyticsClient.reset();
    analyticsClient = null;
    initialized = false;
    initializationPromise = null;
  } catch {
    /* ignore */
  }
}

/** Saada custom-sündmus (no-op kui analüütika pole laetud). */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !analyticsClient) return;
  try {
    analyticsClient.capture(event, properties);
  } catch {
    /* ignore */
  }
}

/** Lehevaatamine (kutsutakse route-muutusel). */
export function trackPageview(url: string): void {
  if (typeof window === 'undefined' || !analyticsClient) return;
  try {
    analyticsClient.capture('$pageview', { $current_url: url });
  } catch {
    /* ignore */
  }
}

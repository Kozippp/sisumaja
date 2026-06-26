/**
 * Õhuke PostHog wrapper. Kasuta ainult kliendikomponentides.
 *
 * Analüütika laaditakse AINULT siis, kui kasutaja on andnud küpsiste-nõusoleku
 * ("all") JA keskkonnas on NEXT_PUBLIC_POSTHOG_KEY seatud (Vercel / .env.local).
 * Ilma võtmeta või nõusolekuta ei juhtu midagi — sait töötab edasi.
 */
import posthog from 'posthog-js';

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
export const ANALYTICS_AVAILABLE = !!POSTHOG_KEY;

let initialized = false;

/** Kas kasutaja on nõustunud kõigi küpsistega? */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie-consent') === 'all';
}

/** Initsialiseeri PostHog, kui võti olemas ja nõusolek antud. Idempotentne. */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY || initialized || !hasAnalyticsConsent()) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // teeme käsitsi route-muutusel
    capture_pageleave: true, // mõõdab lehel veedetud aega
    autocapture: true, // püüab klikid/sisendid automaatselt
    persistence: 'localStorage+cookie',
  });
  initialized = true;
}

/** Lülita analüütika välja ja kustuta andmed (kui kasutaja võtab nõusoleku tagasi). */
export function disableAnalytics(): void {
  if (typeof window === 'undefined' || !initialized) return;
  try {
    posthog.opt_out_capturing();
    posthog.reset();
  } catch {
    /* ignore */
  }
}

/** Saada custom-sündmus (no-op kui analüütika pole laetud). */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !initialized) return;
  try {
    posthog.capture(event, properties);
  } catch {
    /* ignore */
  }
}

/** Lehevaatamine (kutsutakse route-muutusel). */
export function trackPageview(url: string): void {
  if (typeof window === 'undefined' || !initialized) return;
  try {
    posthog.capture('$pageview', { $current_url: url });
  } catch {
    /* ignore */
  }
}

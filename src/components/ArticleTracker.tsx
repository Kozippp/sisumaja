'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

/**
 * Jälgib artikli lugemist: kui kaugele scrollitakse (25/50/75/100%),
 * kas jõuti lõpuni ja kui kaua aktiivselt loeti. Annab vastuse küsimusele
 * "mida päriselt loetakse ja mida mitte".
 */
export default function ArticleTracker({ slug, locale }: { slug: string; locale: string }) {
  const started = useRef(Date.now());
  const reached = useRef<Set<number>>(new Set());
  const completed = useRef(false);

  useEffect(() => {
    track('article_view', { slug, locale });
    started.current = Date.now();

    const milestones = [25, 50, 75, 100];

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const m of milestones) {
        if (pct >= m && !reached.current.has(m)) {
          reached.current.add(m);
          track('article_scroll_depth', { slug, locale, depth: m });
          if (m === 100 && !completed.current) {
            completed.current = true;
            track('article_read_complete', {
              slug,
              locale,
              seconds: Math.round((Date.now() - started.current) / 1000),
            });
          }
        }
      }
    };

    const reportTime = () => {
      track('article_read_time', {
        slug,
        locale,
        seconds: Math.round((Date.now() - started.current) / 1000),
        max_depth: reached.current.size ? Math.max(...reached.current) : 0,
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('beforeunload', reportTime);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') reportTime();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('beforeunload', reportTime);
      reportTime();
    };
  }, [slug, locale]);

  return null;
}

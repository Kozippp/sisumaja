'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Eye, Flame } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type CaseStudyCard = {
  id: string | null;
  slug: string;
  label: string;
  thumbnailUrl: string | null;
  views: string | null;
};

type Props = {
  cards: CaseStudyCard[];
  className: string;
  locale: string;
  viewsLabel: string;
};

function formatViews(raw: string | null, locale: string): string | null {
  if (!raw) return null;
  const value = parseInt(raw.replace(/\D/g, ''), 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'et-EE').format(value);
}

export default function LiveCaseStudyCards({ cards, className, locale, viewsLabel }: Props) {
  const [currentCards, setCurrentCards] = useState(cards);
  const projectIds = useMemo(
    () => cards.flatMap((card) => (card.id ? [card.id] : [])),
    [cards]
  );

  useEffect(() => {
    if (projectIds.length === 0) return;

    let isMounted = true;
    const syncViews = async () => {
      try {
        const response = await fetch('/api/sync-project-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectIds }),
        });
        if (!response.ok || !isMounted) return;

        const result = await response.json();
        if (!result.success || !result.data || !isMounted) return;

        setCurrentCards((previousCards) =>
          previousCards.map((card) =>
            card.id && result.data[card.id]
              ? { ...card, views: result.data[card.id] }
              : card
          )
        );
      } catch (error) {
        console.error('Failed to sync case study views:', error);
      }
    };

    syncViews();
    return () => {
      isMounted = false;
    };
  }, [projectIds]);

  return (
    <div className={className}>
      {currentCards.map((card) => {
        const views = formatViews(card.views, locale);
        return (
          <Link key={card.slug} href={`/tehtud-tood/${card.slug}`} className="group block">
            <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden relative border border-white/5 group-hover:border-primary/50 transition-all duration-500">
              {card.thumbnailUrl ? (
                <img
                  src={card.thumbnailUrl}
                  alt={card.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                  <Flame className="w-8 h-8 text-neutral-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {views && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  {views} {viewsLabel}
                </span>
              )}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              <p className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-snug drop-shadow">
                {card.label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

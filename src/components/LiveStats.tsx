'use client';

import { useEffect, useState, useRef } from 'react';
import { Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface LiveStatsProps {
  projectId: string;
  initialViews: string | null;
  initialLikes: string | null;
  initialComments: string | null;
  initialShares: string | null;
  initialSaves: string | null;
  showYoutubeStats: boolean | null;
}

export default function LiveStats({ 
  projectId, 
  initialViews, 
  initialLikes, 
  initialComments, 
  initialShares,
  initialSaves,
  showYoutubeStats
}: LiveStatsProps) {
  const t = useTranslations('projectPage');
  
  const [stats, setStats] = useState({
    views: showYoutubeStats ? null : initialViews,
    likes: showYoutubeStats ? null : initialLikes,
    comments: showYoutubeStats ? null : initialComments,
    shares: initialShares,
    saves: initialSaves,
  });

  const [isLoaded, setIsLoaded] = useState(!showYoutubeStats);

  useEffect(() => {
    if (!showYoutubeStats) return;

    let isMounted = true;
    let fallbackTimer: NodeJS.Timeout;

    const fetchStats = async () => {
      if (document.hidden) return;

      try {
        const res = await fetch('/api/update-project-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success && data.data) {
             setStats(prev => ({
                ...prev,
                views: data.data.stat_views,
                likes: data.data.stat_likes,
                comments: data.data.stat_comments,
             }));
             setIsLoaded(true);
             if (fallbackTimer) clearTimeout(fallbackTimer);
          }
        }
      } catch (err) {
        console.error('Failed to update stats', err);
      }
    };

    fallbackTimer = setTimeout(() => {
        if (isMounted && !isLoaded) {
            setStats({
                views: initialViews,
                likes: initialLikes,
                comments: initialComments,
                shares: initialShares,
                saves: initialSaves,
            });
            setIsLoaded(true);
        }
    }, 2000);

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => {
        isMounted = false;
        clearInterval(interval);
        clearTimeout(fallbackTimer);
    };
  }, [projectId, showYoutubeStats, initialViews, initialLikes, initialComments, initialShares, initialSaves, isLoaded]);

  const hasStatValue = (v: string | null | number) => {
    if (v == null || v === '') return false;
    const raw = String(v).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '');
    return (parseInt(raw) || 0) > 0;
  };
  const hasData = hasStatValue(stats.views) || hasStatValue(stats.likes) || hasStatValue(stats.comments) || hasStatValue(stats.shares) || hasStatValue(stats.saves);
  if (!hasData && isLoaded) return null;

  const statItems: { icon: typeof Eye; value: string | null | number; label: string; isLoading: boolean }[] = [];
  if (hasStatValue(stats.views)) statItems.push({ icon: Eye, value: stats.views, label: t('views'), isLoading: !isLoaded && !!showYoutubeStats && !stats.views });
  if (hasStatValue(stats.likes)) statItems.push({ icon: Heart, value: stats.likes, label: t('likes'), isLoading: !isLoaded && !!showYoutubeStats && !stats.likes });
  if (hasStatValue(stats.comments)) statItems.push({ icon: MessageCircle, value: stats.comments, label: t('comments'), isLoading: !isLoaded && !!showYoutubeStats && !stats.comments });
  if (hasStatValue(stats.shares)) statItems.push({ icon: Share2, value: stats.shares, label: t('shares'), isLoading: false });
  if (hasStatValue(stats.saves)) statItems.push({ icon: Bookmark, value: stats.saves, label: t('saves'), isLoading: false });

  const count = statItems.length;

  const mobileLayoutClass =
    count <= 3
      ? "flex flex-row flex-wrap justify-center gap-4"
      : count === 4
        ? "grid grid-cols-2 gap-4"
        : "grid grid-cols-6 gap-4";

  return (
    <div className={`w-full max-w-md md:max-w-none ${mobileLayoutClass} md:flex md:flex-row md:flex-nowrap md:justify-center md:gap-16 pb-8 border-b-2 border-pink-500 px-2 sm:px-4 md:px-12 min-h-[120px]`}>
        {statItems.map((item, i) => (
          <div
            key={item.label}
            className={
              count <= 3
                ? "flex-1 min-w-0 md:flex-none md:min-w-[120px]"
                : count === 5 && i < 2
                  ? "md:flex-none md:min-w-[120px] col-span-3"
                  : count === 5 && i >= 2
                    ? "md:flex-none md:min-w-[120px] col-span-2"
                    : "md:flex-none md:min-w-[120px]"
            }
          >
            <StatItem
              icon={item.icon}
              value={item.value}
              label={item.label}
              isLoading={item.isLoading}
            />
          </div>
        ))}
    </div>
  );
}

function StatItem({ icon: Icon, value, label, isLoading }: { icon: any, value: string | null | number, label: string, isLoading: boolean }) {
    let numValue = 0;
    if (value) {
        const rawString = String(value).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '');
        numValue = parseInt(rawString) || 0;
    }

    return (
        <div className="group flex flex-col items-center justify-center flex-1 min-w-0 md:flex-none md:min-w-[120px] relative">
            <Icon className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform duration-300" />
            
            <div className="text-xl md:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 h-[1.3em] relative w-full flex justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-8 h-1 bg-neutral-800 rounded animate-pulse" />
                        </motion.div>
                    ) : (
                        // Render Ticker immediately when value is present
                        <NumberTicker value={numValue} />
                    )}
                </AnimatePresence>
            </div>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-pink-400 transition-colors text-center">
                {label}
            </div>
        </div>
    );
}

function usePrevious(value: number) {
  const ref = useRef(value);
  const prev = useRef(value);

  if (value !== ref.current) {
      prev.current = ref.current;
      ref.current = value;
  }
  return prev.current;
}

function NumberTicker({ value }: { value: number }) {
    const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const chars = formatted.split('');
    const prevValue = usePrevious(value);
    
    // Direction logic
    const direction = value > prevValue ? 1 : -1;

    return (
        <div className="flex items-center justify-center">
            {chars.map((char, i) => {
                if (char === ' ' || char === '\u00A0') {
                    return <span key={`space-${i}`} className="w-[0.25em]">&nbsp;</span>;
                }
                
                // Add staggered delay to digits for "Spin" effect
                return (
                    <AnimatedDigit 
                        key={`digit-${chars.length - i}`} 
                        char={char} 
                        direction={direction} 
                        index={i} // Pass index for stagger
                    />
                );
            })}
        </div>
    );
}

const variants = {
    enter: (direction: number) => ({
        y: direction > 0 ? "-150%" : "150%", // Start further out for dramatic effect
        opacity: 0,
        filter: "blur(8px)"
    }),
    center: {
        y: "0%",
        opacity: 1,
        filter: "blur(0px)"
    },
    exit: (direction: number) => ({
        y: direction > 0 ? "150%" : "-150%",
        opacity: 0,
        filter: "blur(8px)"
    })
};

function AnimatedDigit({ char, direction, index }: { char: string, direction: number, index: number }) {
     return (
        <div className="relative h-[1.2em] w-[0.6em] overflow-hidden text-center mx-[1px]">
             <AnimatePresence mode="popLayout" initial={true} custom={direction}>
                <motion.span
                    key={char}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 16, 
                        mass: 1,
                        delay: index * 0.03 // Subtle cascade per digit
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {char}
                </motion.span>
             </AnimatePresence>
             <span className="invisible">{char}</span>
        </div>
     )
}

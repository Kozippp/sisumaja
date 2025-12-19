'use client';

import { useEffect, useState, useRef } from 'react';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveStatsProps {
  projectId: string;
  initialViews: string | null;
  initialLikes: string | null;
  initialComments: string | null;
  initialShares: string | null;
  showYoutubeStats: boolean | null;
}

export default function LiveStats({ 
  projectId, 
  initialViews, 
  initialLikes, 
  initialComments, 
  initialShares,
  showYoutubeStats
}: LiveStatsProps) {
  const [stats, setStats] = useState({
    views: showYoutubeStats ? null : initialViews,
    likes: showYoutubeStats ? null : initialLikes,
    comments: showYoutubeStats ? null : initialComments,
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
             setStats({
                views: data.data.stat_views,
                likes: data.data.stat_likes,
                comments: data.data.stat_comments,
             });
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
            });
            setIsLoaded(true);
        }
    }, 3000);

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => {
        isMounted = false;
        clearInterval(interval);
        clearTimeout(fallbackTimer);
    };
  }, [projectId, showYoutubeStats, initialViews, initialLikes, initialComments, isLoaded]);

  const hasData = stats.views || stats.likes || stats.comments;
  if (!hasData && isLoaded) return null;

  return (
    <div className="inline-flex w-full max-w-md md:max-w-none flex-nowrap justify-between md:justify-center gap-4 md:gap-16 pb-8 border-b-2 border-pink-500 px-2 sm:px-4 md:px-12 min-h-[120px]">
        <StatItem 
            index={0}
            icon={Eye}
            value={stats.views} 
            label="Vaatamist" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.views}
        />
        <StatItem 
            index={1}
            icon={Heart}
            value={stats.likes} 
            label="Like'i" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.likes}
        />
        <StatItem 
            index={2}
            icon={MessageCircle}
            value={stats.comments} 
            label="Kommentaari" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.comments}
        />
    </div>
  );
}

function StatItem({ icon: Icon, value, label, isLoading, index }: { icon: any, value: string | null | number, label: string, isLoading: boolean, index: number }) {
    const finalValue = value ? (parseInt(String(value).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '')) || 0) : 0;
    
    // Count-up animation state
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        if (!isLoading && finalValue > 0) {
            // Stagger animation: Delay start based on index
            const timer = setTimeout(() => {
                setDisplayValue(finalValue);
            }, 100 + (index * 150));
            return () => clearTimeout(timer);
        }
    }, [finalValue, isLoading, index]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            className="group flex flex-col items-center justify-center flex-1 min-w-0 md:flex-none md:min-w-[120px] relative"
        >
            <Icon className="w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform duration-300" />
            
            <div className="text-xl md:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 h-[1.3em] relative w-full flex justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-8 h-1 bg-neutral-800 rounded animate-pulse" />
                        </motion.div>
                    ) : (
                        <NumberTicker value={displayValue} />
                    )}
                </AnimatePresence>
            </div>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-pink-400 transition-colors text-center">
                {label}
            </div>
        </motion.div>
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
    // Formatting: 1000 -> "1 000"
    const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const chars = formatted.split('');
    
    const prevValue = usePrevious(value);
    // Direction: 1 = Increase (Top->Down), -1 = Decrease (Bottom->Up)
    // Exception: Initial load (0 -> X) should always be Top->Down (1)
    const direction = prevValue === 0 ? 1 : (value > prevValue ? 1 : -1);

    return (
        <div className="flex items-center justify-center">
            {chars.map((char, i) => {
                if (char === ' ' || char === '\u00A0') {
                    return <span key={`space-${i}`} className="w-[0.25em]">&nbsp;</span>;
                }
                return <AnimatedDigit key={`digit-${chars.length - i}`} char={char} direction={direction} />;
            })}
        </div>
    );
}

const variants = {
    enter: (direction: number) => ({
        y: direction > 0 ? "-100%" : "100%",
        opacity: 0,
        filter: "blur(4px)"
    }),
    center: {
        y: "0%",
        opacity: 1,
        filter: "blur(0px)"
    },
    exit: (direction: number) => ({
        y: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        filter: "blur(4px)"
    })
};

function AnimatedDigit({ char, direction }: { char: string, direction: number }) {
     return (
        <div className="relative h-[1.2em] w-[0.6em] overflow-hidden text-center mx-[1px]">
             <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                    key={char}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ 
                        type: "spring", 
                        stiffness: 150, 
                        damping: 18, 
                        mass: 0.8 
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

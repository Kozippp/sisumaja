'use client';

import { useEffect, useState } from 'react';
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
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
  // If showYoutubeStats is true, we start with null to show loading/waiting state.
  // This prevents the "glitch" of showing DB data then jumping to Live data immediately.
  const [stats, setStats] = useState({
    views: showYoutubeStats ? null : initialViews,
    likes: showYoutubeStats ? null : initialLikes,
    comments: showYoutubeStats ? null : initialComments,
    shares: initialShares
  });

  const [isLoaded, setIsLoaded] = useState(!showYoutubeStats);

  useEffect(() => {
    // If we're not using live stats, we're done (data is passed via props)
    if (!showYoutubeStats) return;

    const formatNumber = (num: number | string) => {
       return parseInt(String(num)).toLocaleString('et-EE');
    };

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
                views: formatNumber(data.data.stat_views),
                likes: formatNumber(data.data.stat_likes),
                comments: formatNumber(data.data.stat_comments),
             }));
             setIsLoaded(true);
             if (fallbackTimer) clearTimeout(fallbackTimer);
          }
        }
      } catch (err) {
        console.error('Failed to update stats', err);
      }
    };

    // 1. Fallback: If YouTube data doesn't arrive in 3 seconds, show DB data.
    fallbackTimer = setTimeout(() => {
        if (isMounted && !isLoaded) {
            setStats({
                views: initialViews,
                likes: initialLikes,
                comments: initialComments,
                shares: initialShares
            });
            setIsLoaded(true);
        }
    }, 3000);

    // 2. Initial fetch
    fetchStats();

    // 3. Polling
    const interval = setInterval(fetchStats, 10000);

    return () => {
        isMounted = false;
        clearInterval(interval);
        clearTimeout(fallbackTimer);
    };
  }, [projectId, showYoutubeStats, initialViews, initialLikes, initialComments, initialShares, isLoaded]);

  // If we have no data at all (and not loading), render nothing
  const hasData = stats.views || stats.likes || stats.comments || stats.shares;
  if (!hasData && isLoaded) return null;

  return (
    <div className="inline-flex w-full max-w-md md:max-w-none flex-nowrap justify-between md:justify-center gap-4 md:gap-16 pb-8 border-b-2 border-pink-500 px-2 sm:px-4 md:px-12 min-h-[120px]">
        <StatItem 
            icon={Eye}
            value={stats.views} 
            label="Vaatamist" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.views}
        />
        <StatItem 
            icon={Heart}
            value={stats.likes} 
            label="Like'i" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.likes}
        />
        <StatItem 
            icon={MessageCircle}
            value={stats.comments} 
            label="Kommentaari" 
            isLoading={!isLoaded && !!showYoutubeStats && !stats.comments}
        />
        <StatItem 
            icon={Share2}
            value={stats.shares} 
            label="Jagamist" 
            isLoading={false}
        />
    </div>
  );
}

function StatItem({ icon: Icon, value, label, isLoading }: { icon: any, value: string | null, label: string, isLoading: boolean }) {
    let displayValue = value;
    
    // Parse value for clean display
    if (value) {
        const rawString = String(value).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '');
        const num = parseInt(rawString);
        if (!isNaN(num)) {
            displayValue = num.toLocaleString('et-EE').replace(/,/g, ' ');
        }
    }

    return (
        <div className="group flex flex-col items-center justify-center flex-1 min-w-0 md:flex-none md:min-w-[120px] relative">
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
                        displayValue && (
                            <motion.span
                                key={displayValue}
                                initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 120, 
                                    damping: 14,
                                    mass: 1
                                }}
                                className="block tabular-nums whitespace-nowrap"
                            >
                                {displayValue}
                            </motion.span>
                        )
                    )}
                </AnimatePresence>
            </div>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-pink-400 transition-colors text-center">
                {label}
            </div>
        </div>
    );
}

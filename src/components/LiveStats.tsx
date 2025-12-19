'use client';

import { useEffect, useState } from 'react';
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

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
    views: initialViews,
    likes: initialLikes,
    comments: initialComments,
    shares: initialShares
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Sync props to state if they change
    setStats({
        views: initialViews,
        likes: initialLikes,
        comments: initialComments,
        shares: initialShares
    });
  }, [initialViews, initialLikes, initialComments, initialShares]);

  useEffect(() => {
    if (!showYoutubeStats) return;

    const formatNumber = (num: number | string) => {
       return parseInt(String(num)).toLocaleString('et-EE');
    };

    const fetchStats = async () => {
      if (document.hidden) return;

      try {
        setIsUpdating(true);
        const res = await fetch('/api/update-project-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
             setStats(prev => ({
                ...prev,
                views: formatNumber(data.data.stat_views),
                likes: formatNumber(data.data.stat_likes),
                comments: formatNumber(data.data.stat_comments),
             }));
          }
        }
      } catch (err) {
        console.error('Failed to update stats', err);
      } finally {
        setIsUpdating(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [projectId, showYoutubeStats]);

  // If no stats at all, don't render anything
  if (!stats.views && !stats.likes && !stats.comments && !stats.shares) {
    return null;
  }

  return (
    <div className="inline-flex w-full max-w-md md:max-w-none flex-nowrap justify-between md:justify-center gap-4 md:gap-16 pb-8 border-b-2 border-pink-500 px-2 sm:px-4 md:px-12">
        <StatItem 
            icon={Eye}
            value={stats.views} 
            label="Vaatamist" 
            isLive={!!showYoutubeStats}
            isUpdating={isUpdating && !!showYoutubeStats}
        />
        <StatItem 
            icon={Heart}
            value={stats.likes} 
            label="Like'i" 
            isLive={!!showYoutubeStats}
        />
        <StatItem 
            icon={MessageCircle}
            value={stats.comments} 
            label="Kommentaari" 
            isLive={!!showYoutubeStats}
        />
        <StatItem 
            icon={Share2}
            value={stats.shares} 
            label="Jagamist" 
            isLive={false}
        />
    </div>
  );
}

function StatItem({ icon: Icon, value, label, isLive, isUpdating }: { icon: any, value: string | null, label: string, isLive: boolean, isUpdating?: boolean }) {
    if (!value || value === '0') return null;

    let displayValue = value;
    // Clean string to get raw number, then format
    const rawString = String(value).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '');
    const num = parseInt(rawString);
    
    if (!isNaN(num) && rawString.length > 0) {
        displayValue = num.toLocaleString('et-EE').replace(/,/g, ' ');
    }

    return (
        <div className="group flex flex-col items-center justify-center flex-1 min-w-0 md:flex-none md:min-w-[120px] relative">
            {isLive && (
                <div className="absolute -top-2 -right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Live andmed YouTube'ist">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </div>
            )}
            
            <Icon className={`w-7 h-7 md:w-8 md:h-8 mb-3 md:mb-4 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform duration-300 ${isUpdating ? 'text-red-500 animate-pulse' : 'text-pink-500'}`} />
            
            <div className="text-xl md:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 tabular-nums">
                {displayValue}
            </div>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-pink-400 transition-colors text-center">
                {label}
            </div>
        </div>
    );
}

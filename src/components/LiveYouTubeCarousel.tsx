'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { formatViewCount } from '@/lib/youtube';
import { Database } from '@/types/database.types';

type FeaturedVideo = Database['public']['Tables']['featured_videos']['Row'];

interface LiveYouTubeCarouselProps {
  initialVideos: FeaturedVideo[];
}

export default function LiveYouTubeCarousel({ initialVideos }: LiveYouTubeCarouselProps) {
  const [videos, setVideos] = useState<FeaturedVideo[]>(initialVideos);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncVideos = async () => {
      if (document.hidden) return;

      try {
        const res = await fetch('/api/sync-featured-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success && data.data) {
            setVideos(data.data);
            setIsLoaded(true);
          }
        }
      } catch (err) {
        console.error('Failed to sync videos', err);
        setIsLoaded(true);
      }
    };

    syncVideos();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No featured videos yet
      </div>
    );
  }

  // Calculate animation duration based on number of videos
  // ~4 seconds per video for smooth scrolling
  const animationDuration = videos.length * 4;

  return (
    <>
      {/* Infinite Scroll Carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-carousel-${videos[0]?.id || 'default'} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .carousel-track-${videos[0]?.id || 'default'} {
          animation: scroll-carousel-${videos[0]?.id || 'default'} ${animationDuration}s linear infinite;
        }
        
        .carousel-track-${videos[0]?.id || 'default'}:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
        
        <div className={`carousel-track-${videos[0]?.id || 'default'} flex gap-6`}>
          {/* Render videos THREE times for truly seamless loop */}
          {[...videos, ...videos, ...videos].map((video, idx) => (
            <a
              key={`${video.id}-${idx}`}
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/50 transition-all duration-300 mb-3">
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-bold text-white">
                  {formatViewCount(video.view_count)} vaatamist
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                {video.title}
              </h4>
            </a>
          ))}
        </div>
      </div>

      {/* Content Categories */}
      <div className="flex flex-wrap justify-center gap-3 mt-12">
        {[
          "Eksperimendid",
          "Reality-Sarjad",
          "Reisimine",
          "Odav vs. Kallis",
          "Väljakutsed",
          "Toitumine",
          "Trenn"
        ].map((tag, i) => (
          <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-fuchsia-500/30 hover:text-white transition-all cursor-default">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

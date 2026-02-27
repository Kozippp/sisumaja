'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { formatViewCount } from '@/lib/youtube';
import { Database } from '@/types/database.types';

type FeaturedVideo = Database['public']['Tables']['featured_videos']['Row'];

interface LiveYouTubeCarouselProps {
  initialVideos: FeaturedVideo[];
}

// Tune carousel speed from this single value (seconds per one video card).
const SECONDS_PER_VIDEO = 6;
const MIN_SCROLL_DURATION_SECONDS = 16;

export default function LiveYouTubeCarousel({ initialVideos }: LiveYouTubeCarouselProps) {
  const [videos, setVideos] = useState<FeaturedVideo[]>(initialVideos);
  const [scrollDistance, setScrollDistance] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

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
          }
        }
      } catch (err) {
        console.error('Failed to sync videos', err);
      }
    };

    syncVideos();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScrollDistance = () => {
      // Track contains 2 identical video sets, so half width = one full cycle distance.
      setScrollDistance(track.scrollWidth / 2);
    };

    updateScrollDistance();

    const resizeObserver = new ResizeObserver(updateScrollDistance);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
    };
  }, [videos]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No featured videos yet
      </div>
    );
  }

  const animationDuration = Math.max(
    videos.length * SECONDS_PER_VIDEO,
    MIN_SCROLL_DURATION_SECONDS
  );

  return (
    <>
      {/* Infinite Scroll Carousel */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll-carousel-${videos[0]?.id || 'default'} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--scroll-distance, 0px)));
          }
        }
        
        .carousel-track-${videos[0]?.id || 'default'} {
          width: max-content;
          animation: scroll-carousel-${videos[0]?.id || 'default'} var(--scroll-duration, 20s) linear infinite;
        }
        
        .carousel-track-${videos[0]?.id || 'default'}:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
        
        <div
          ref={trackRef}
          className={`carousel-track-${videos[0]?.id || 'default'} flex gap-6`}
          style={
            {
              '--scroll-distance': `${scrollDistance}px`,
              '--scroll-duration': `${animationDuration}s`,
            } as CSSProperties
          }
        >
          {/* Render videos twice and scroll exactly one full set width. */}
          {[...videos, ...videos].map((video, idx) => (
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

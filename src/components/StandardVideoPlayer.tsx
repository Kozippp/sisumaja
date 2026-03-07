"use client";

import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface StandardVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string | null;
  title?: string;
}

// Function to detect if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export const StandardVideoPlayer = ({ videoUrl, thumbnailUrl, title }: StandardVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Check if it's a YouTube video
  const isYouTube = isYouTubeUrl(videoUrl);
  const youtubeVideoId = isYouTube ? getYouTubeVideoId(videoUrl) : null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  // If it's YouTube, render iframe
  if (isYouTube && youtubeVideoId) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl w-full">
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?controls=1&modestbranding=1&rel=0`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  // Regular video player
  return (
    <div 
      className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl w-full group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleVideoClick}
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play Overlay (Big Center Button) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
            <button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-white" fill="currentColor" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

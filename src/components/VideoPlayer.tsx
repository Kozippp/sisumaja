"use client";

import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string | null;
  title?: string;
}

export const VideoPlayer = ({ videoUrl, thumbnailUrl, title }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

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

  return (
    <div 
      className="relative rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl inline-block max-w-[605px] min-w-[325px]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
    >
      <div className="relative aspect-[9/16] bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleVideoClick}
          loop
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play/Pause Overlay */}
        {showControls && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: isPlaying ? 0 : 1 }}
          >
            <button
              onClick={togglePlay}
              className="pointer-events-auto w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" fill="currentColor" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {title && (
              <div className="mt-3 text-white text-sm font-medium">
                {title}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

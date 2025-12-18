'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaGalleryProps {
  media: string[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
        <div className="aspect-video w-full bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 text-gray-600">
            <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Meedia puudub</p>
            </div>
        </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden group">
        {isVideo(media[currentIndex]) ? (
          <video 
            src={media[currentIndex]} 
            controls 
            className="w-full h-full object-contain"
          />
        ) : (
          <img 
            src={media[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`} 
            className="w-full h-full object-contain"
          />
        )}

        {media.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {media.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            currentIndex === idx ? "bg-primary w-6" : "bg-white/50 hover:bg-white"
                        )}
                    />
                ))}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-2 scrollbar-hide justify-center">
            {media.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                        "relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 border-2",
                        currentIndex === idx 
                            ? "border-primary opacity-100 scale-105" 
                            : "border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
                    )}
                >
                     {isVideo(item) ? (
                        <video src={item} className="w-full h-full object-cover" />
                    ) : (
                        <img src={item} alt="" className="w-full h-full object-cover" />
                    )}
                </button>
            ))}
        </div>
      )}
    </div>
  );
}

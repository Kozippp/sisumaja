'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface MediaGalleryProps {
  media: string[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Drag to scroll state for thumbnails
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasDragged = useRef(false);

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
    setDirection(1);
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    setIsDraggingThumb(true);
    hasDragged.current = false;
    dragStartX.current = e.pageX - (thumbnailsRef.current?.offsetLeft || 0);
    dragStartScrollLeft.current = thumbnailsRef.current?.scrollLeft || 0;
  };

  const handleThumbMouseLeave = () => {
    setIsDraggingThumb(false);
  };

  const handleThumbMouseUp = () => {
    setIsDraggingThumb(false);
  };

  const handleThumbMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingThumb) return;
    e.preventDefault();
    const x = e.pageX - (thumbnailsRef.current?.offsetLeft || 0);
    const walk = (x - dragStartX.current) * 2; // scroll-fast multiplier
    
    if (Math.abs(walk) > 5) {
        hasDragged.current = true;
    }

    if (thumbnailsRef.current) {
        thumbnailsRef.current.scrollLeft = dragStartScrollLeft.current - walk;
    }
  };

  const onThumbClick = (idx: number) => {
      if (hasDragged.current) return;
      setDirection(idx > currentIndex ? 1 : -1);
      setCurrentIndex(idx);
  };

  useEffect(() => {
    if (thumbnailsRef.current && !isDraggingThumb) {
        const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
  }, [currentIndex, isDraggingThumb]);


  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden group touch-pan-y select-none">
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 200, damping: 50 },
                    opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
                {isVideo(media[currentIndex]) ? (
                <div className="w-full h-full flex items-center justify-center">
                    {/* Video wrapper to handle drag vs click issues if needed */}
                     <video 
                        src={media[currentIndex]} 
                        controls 
                        className="w-full h-full object-contain pointer-events-auto"
                        playsInline
                    />
                </div>
                ) : (
                <img 
                    src={media[currentIndex]} 
                    alt={`Slide ${currentIndex + 1}`} 
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                />
                )}
            </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <>
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="pointer-events-auto p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 pointer-events-none z-10">
                {media.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all pointer-events-auto",
                            currentIndex === idx ? "bg-primary w-6" : "bg-white/50 hover:bg-white"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {media.length > 1 && (
        <div 
            ref={thumbnailsRef}
            className={cn(
                "flex gap-2 overflow-x-auto p-2 scrollbar-hide justify-start cursor-grab active:cursor-grabbing",
                isDraggingThumb && "cursor-grabbing"
            )}
            onMouseDown={handleThumbMouseDown}
            onMouseLeave={handleThumbMouseLeave}
            onMouseUp={handleThumbMouseUp}
            onMouseMove={handleThumbMouseMove}
        >
            {media.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onThumbClick(idx)}
                    className={cn(
                        "relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 border-2 select-none",
                        currentIndex === idx 
                            ? "border-primary opacity-100 scale-105" 
                            : "border-transparent opacity-60 hover:opacity-100" 
                    )}
                    draggable={false}
                >
                     {isVideo(item) ? (
                        <video src={item} className="w-full h-full object-cover pointer-events-none" muted playsInline />
                    ) : (
                        <img src={item} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                    )}
                </button>
            ))}
        </div>
      )}
    </div>
  );
}

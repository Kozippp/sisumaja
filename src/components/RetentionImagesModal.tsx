"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { RetentionImage } from "@/types/retention-images";
import { cn } from "@/lib/utils";

interface RetentionImagesModalProps {
  images: RetentionImage[];
  isOpen: boolean;
  onClose: () => void;
}

export function RetentionImagesModal({ images, isOpen, onClose }: RetentionImagesModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || images.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-5xl w-full bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
          aria-label="Sulge"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="relative aspect-video bg-neutral-800">
          <Image
            src={currentImage.image_url}
            alt={currentImage.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Image Info & Navigation */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Image Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{currentImage.title}</h3>
              {currentImage.description && (
                <p className="text-gray-400 text-sm">{currentImage.description}</p>
              )}
            </div>

            {/* Right: Navigation (only if multiple images) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                  aria-label="Eelmine pilt"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
                  {currentIndex + 1} / {images.length}
                </span>
                
                <button
                  onClick={handleNext}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                  aria-label="Järgmine pilt"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Navigation (if multiple images) */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentIndex
                      ? "border-fuchsia-500 opacity-100"
                      : "border-white/10 opacity-50 hover:opacity-75"
                  )}
                >
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

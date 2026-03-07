"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { RetentionImage } from "@/types/retention-images";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RetentionImagesModalProps {
  images: RetentionImage[];
  isOpen: boolean;
  onClose: () => void;
}

export function RetentionImagesModal({ images, isOpen, onClose }: RetentionImagesModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when opening or changing images
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"
          >
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-transparent to-blue-900/20 opacity-50" />
          </motion.div>
          
          <div className="relative w-full h-full flex flex-col pointer-events-none z-10 p-4 md:p-8">
            {/* Main Content Area - clicking outside card closes modal */}
            <div 
              className="flex-1 flex items-center justify-center pointer-events-auto min-h-0 mb-6 cursor-pointer"
              onClick={onClose}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-auto h-auto max-w-[95vw] max-h-[70vh] bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative flex flex-col overflow-hidden cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white z-20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative flex items-center justify-center p-2 md:p-6">
                   {currentImage && (
                     <img
                       src={currentImage.image_url}
                       alt={currentImage.title}
                       className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                     />
                   )}
                </div>
              </motion.div>
            </div>

            {/* Bottom Thumbnails */}
            {images.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="h-24 md:h-32 mt-auto pointer-events-auto overflow-x-auto flex gap-4 items-center justify-center px-4 pb-4 scrollbar-hide snap-x"
              >
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "flex-shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden border-2 transition-all relative snap-center",
                      index === currentIndex ? "border-fuchsia-500 scale-110 shadow-lg shadow-fuchsia-500/20" : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
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
              </motion.div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types/testimonials";
import Image from "next/image";
import { Star, Quote, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "published")
        .order("order", { ascending: true })
      .order("created_at", { ascending: false });
      
      if (data) {
        setTestimonials(data);
      }
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  if (loading) return <div className="py-20 text-center text-white/20">Laen tagasisidet...</div>;
  if (testimonials.length === 0) return null;

  const selectedTestimonial = testimonials.find(t => t.id === selectedId);

  return (
    <section className="py-32 bg-neutral-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fännid <span className="text-fuchsia-500">räägivad</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Vaata, mida meie kliendid ja koostööpartnerid meie kohta arvavad.
          </p>
        </motion.div>

        {/* Masonry Grid Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: index * 0.1 }
              }}
              viewport={{ once: true }}
              onClick={() => setSelectedId(testimonial.id)}
              className={cn(
                "break-inside-avoid cursor-pointer",
                !testimonial.show_on_mobile && "hidden md:inline-block"
              )}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2, delay: 0 }
              }}
            >
              {testimonial.type === 'text' ? (
                <TextTestimonialCard testimonial={testimonial} />
              ) : (
                <ImageTestimonialCard testimonial={testimonial} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {selectedId && selectedTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"
            >
              {/* Glow Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-transparent to-blue-900/20 opacity-50" />
            </motion.div>
            
            <div className="relative w-full h-full flex flex-col pointer-events-none z-10 p-4 md:p-8">
              {/* Main Content Area - clicking outside card closes modal */}
              <div 
                className="flex-1 flex items-center justify-center pointer-events-auto min-h-0 mb-6 cursor-pointer"
                onClick={() => setSelectedId(null)}
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
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white z-20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {selectedTestimonial.type === 'text' ? (
                    <div className="p-8 md:p-12 overflow-y-auto max-w-3xl max-h-[70vh]">
                       <TextTestimonialCard testimonial={selectedTestimonial} expanded />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center p-2 md:p-6">
                       {selectedTestimonial.image_url && (
                         <img
                           src={selectedTestimonial.image_url}
                           alt="Tagasiside"
                           className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                         />
                       )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Bottom Thumbnails */}
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="h-24 md:h-32 mt-auto pointer-events-auto overflow-x-auto flex gap-4 items-center justify-center px-4 pb-4 scrollbar-hide snap-x"
              >
                {testimonials.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={cn(
                      "flex-shrink-0 h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden border-2 transition-all relative snap-center",
                      selectedId === t.id ? "border-fuchsia-500 scale-110 shadow-lg shadow-fuchsia-500/20" : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                    )}
                  >
                    {t.type === 'image' && t.image_url ? (
                      <Image 
                        src={t.image_url} 
                        alt="" 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] text-gray-400 leading-tight line-clamp-3">
                          {t.author_name}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TextTestimonialCard({ testimonial, expanded = false }: { testimonial: Testimonial, expanded?: boolean }) {
  return (
    <div className={cn(
      "bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 transition-colors relative group h-full",
      !expanded && "hover:border-white/10"
    )}>
      {/* Quote Icon Background */}
      <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors">
        <Quote className="w-12 h-12 rotate-180" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-neutral-800 flex-shrink-0">
            {testimonial.image_url ? (
              <Image 
                src={testimonial.image_url} 
                alt={testimonial.author_name || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white/50">
                {(testimonial.author_name || '?').charAt(0)}
              </div>
            )}
          </div>
          
          <div>
            <div className="font-bold text-white text-lg leading-tight">{testimonial.author_name}</div>
            <div className="text-gray-400 text-sm mt-1">
              {testimonial.author_role}
              {testimonial.author_role && testimonial.author_company && <span className="mx-1">•</span>}
              {testimonial.author_company && (
                <span className="text-fuchsia-400 font-medium">{testimonial.author_company}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>

        <p className={cn(
          "text-gray-300 leading-relaxed italic",
          expanded ? "text-xl md:text-2xl" : "text-lg"
        )}>
          "{testimonial.content}"
        </p>
      </div>
    </div>
  );
}

function ImageTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative rounded-3xl overflow-hidden group border border-white/5 hover:border-white/10 transition-all bg-neutral-900">
       <div className="relative w-full">
         {testimonial.image_url && (
           <Image
             src={testimonial.image_url}
             alt="Tagasiside kuvatõmmis"
             width={600}
             height={800}
             className="w-full h-auto object-contain"
           />
         )}
       </div>
    </div>
  );
}

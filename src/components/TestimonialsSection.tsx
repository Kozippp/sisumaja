"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types/testimonials";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (data) {
        setTestimonials(data);
      }
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  if (loading) return <div className="py-20 text-center text-white/20">Laen tagasisidet...</div>;
  if (testimonials.length === 0) return null;

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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid"
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
    </section>
  );
}

function TextTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative group">
      {/* Quote Icon Background */}
      <div className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors">
        <Quote className="w-12 h-12 rotate-180" />
      </div>

      <div className="relative z-10">
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

        <p className="text-gray-300 leading-relaxed text-lg italic">
          "{testimonial.content}"
        </p>
      </div>
    </div>
  );
}

function ImageTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative rounded-3xl overflow-hidden group border border-white/5 hover:border-white/10 transition-all">
       {/* Background Overlay for text readability if needed, but mostly just the image */}
       <div className="relative w-full">
         {testimonial.image_url && (
           <Image
             src={testimonial.image_url}
             alt="Tagasiside kuvatõmmis"
             width={600}
             height={800}
             className="w-full h-auto object-contain bg-neutral-900"
           />
         )}
       </div>
       
       {/* Verified Badge */}
       <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-lg">
         VERIFIED
       </div>
    </div>
  );
}

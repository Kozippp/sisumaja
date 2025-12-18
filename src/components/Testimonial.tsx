"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  imageSrc?: string;
  className?: string;
}

export function Testimonial({ 
  quote, 
  author, 
  role, 
  company, 
  imageSrc,
  className 
}: TestimonialProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
        
        {/* Background gradient effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start relative z-10">
          {/* Avatar / Image Side */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 relative">
                {imageSrc ? (
                  <Image 
                    src={imageSrc} 
                    alt={author}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xl font-bold text-white">
                    {author.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-neutral-900 rounded-full p-2 border border-white/10">
                <Quote className="w-4 h-4 text-primary fill-primary" />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex-1 space-y-6">
            <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed">
              "{quote}"
            </blockquote>
            
            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
              <div>
                <div className="font-bold text-white text-lg">{author}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-primary">{role}</span>
                  {company && (
                    <>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{company}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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
    <div className={cn("bg-neutral-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/5 relative group hover:bg-neutral-900/80 transition-all duration-500", className)}>
       
       <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Quote Icon - Desktop: Left side, Mobile: Hidden or Top */}
          <div className="hidden md:block">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary fill-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            {/* Quote Text */}
            <div className="relative">
              {/* Mobile quote icon */}
              <Quote className="w-8 h-8 text-primary/20 fill-primary absolute -top-4 -left-2 md:hidden" />
              <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                "{quote}"
              </blockquote>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-neutral-800 flex-shrink-0">
                {imageSrc ? (
                  <Image 
                    src={imageSrc} 
                    alt={author}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white/50">
                    {author.charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <div className="font-bold text-white text-lg leading-none mb-1.5">{author}</div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-400">{role}</span>
                  {company && (
                    <>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span className="text-primary font-medium">{company}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
       </div>
    </div>
  );
}

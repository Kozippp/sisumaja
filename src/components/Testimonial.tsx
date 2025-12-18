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
    <div className={cn("bg-neutral-900 rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden", className)}>
       {/* Background decoration */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

       <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-shrink-0 text-center sm:text-left relative">
              
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 relative bg-neutral-800">
                {imageSrc ? (
                  <Image 
                    src={imageSrc} 
                    alt={author}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                    {author.charAt(0)}
                  </div>
                )}
              </div>

              {/* Vertical Divider (Hidden on mobile, visible on sm+) */}
              <div className="hidden sm:block w-px h-16 bg-white/10" />

              {/* Info */}
              <div className="space-y-1">
                  <div className="font-bold text-xl text-white">{author}</div>
                  <div className="text-gray-400 text-sm">{role}</div>
                  {company && <div className="text-primary font-medium">{company}</div>}
              </div>
          </div>

          {/* Quote Section */}
          <div className="flex-1 relative border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 mt-4 lg:mt-0">
             <Quote className="w-8 h-8 text-primary/40 absolute -top-4 lg:-top-6 -left-2 lg:-left-6 transform -scale-x-100" />
             <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed italic relative z-10 text-center lg:text-left">
                "{quote}"
             </blockquote>
          </div>

       </div>
    </div>
  );
}

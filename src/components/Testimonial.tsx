import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  imageSrc?: string;
  className?: string;
  date?: string; // Optional date if available
}

export function Testimonial({ 
  quote, 
  author, 
  role, 
  company, 
  imageSrc,
  className,
  date
}: TestimonialProps) {
  return (
    <div className={cn("bg-neutral-900 rounded-3xl p-8 border border-white/5", className)}>
       
       <div className="flex flex-col gap-6">
          
          {/* Header: Avatar + Name/Role */}
          <div className="flex items-center gap-4">
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
                <div className="font-bold text-white text-lg leading-tight">{author}</div>
                <div className="text-gray-400 text-sm mt-0.5">
                  {role}
                  {company && <span className="text-primary ml-1">• {company}</span>}
                </div>
              </div>
          </div>

          {/* Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ))}
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Suurepärane koostöö!</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {quote}
            </p>
          </div>

       </div>
    </div>
  );
}

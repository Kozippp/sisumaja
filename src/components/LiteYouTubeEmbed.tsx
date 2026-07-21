"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

interface LiteYouTubeEmbedProps {
  videoId: string;
  title?: string;
  thumbnailUrl?: string | null;
  startTime?: string | null;
  imageSizes: string;
}

export function LiteYouTubeEmbed({
  videoId,
  title,
  thumbnailUrl,
  startTime,
  imageSizes,
}: LiteYouTubeEmbedProps) {
  const [isActivated, setIsActivated] = useState(false);
  const accessibleTitle = title || "YouTube video";
  const posterUrl = thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (isActivated) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0${startTime ? `&start=${startTime}` : ""}`}
        title={accessibleTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsActivated(true)}
      className="group absolute inset-0 h-full w-full overflow-hidden bg-black"
      aria-label={`Play ${accessibleTitle}`}
      data-lite-youtube
    >
      <Image
        src={posterUrl}
        alt=""
        fill
        sizes={imageSizes}
        className="object-cover"
      />
      <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110 group-hover:bg-white">
        <Play className="ml-1 h-7 w-7 fill-current text-black" aria-hidden="true" />
      </span>
    </button>
  );
}

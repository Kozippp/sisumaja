"use client";

import { useEffect } from 'react';

export const TikTokEmbed = ({ videoId }: { videoId: string }) => {
  useEffect(() => {
    const scriptUrl = "https://www.tiktok.com/embed.js";
    let script = document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      document.body.appendChild(script);
    } else {
        // @ts-ignore
        if (window.tiktok?.embed?.load) {
             // @ts-ignore
            window.tiktok.embed.load();
        }
    }
  }, [videoId]);

  return (
    <div className="rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl inline-block">
      <blockquote 
        className="tiktok-embed" 
        cite={`https://www.tiktok.com/@kozipeesti/video/${videoId}`} 
        data-video-id={videoId} 
        style={{ maxWidth: '605px', minWidth: '325px', margin: 0 }} 
      > 
        <section> </section> 
      </blockquote>
    </div>
  );
};

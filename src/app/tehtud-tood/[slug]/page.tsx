import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Youtube, Instagram, Calendar, Clock, Play, Link as LinkIcon, ExternalLink } from "lucide-react";
import MediaGallery from "@/components/MediaGallery";
import { Database } from "@/types/database.types";
import { ContentBlock, CustomLink } from "@/components/admin/ProjectForm";
import { Testimonial } from "@/components/Testimonial";
import LiveStats from "@/components/LiveStats";
import { MotionWrapper, MotionItem } from "@/components/MotionWrapper";
import { getLocale } from '@/lib/locale';
import { getTranslations } from 'next-intl/server';

type Project = Database['public']['Tables']['projects']['Row'];

// Define interface for params
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single<Pick<Project, 'title' | 'description'>>();

  if (!project) {
    return {
      title: "Projekt ei leitud",
    };
  }

  return {
    title: `${project.title} | Sisumaja`,
    description: project.description,
  };
}

export const revalidate = 60;

// Helper to extract YouTube ID and params (supports regular videos and Shorts)
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  
  let videoId = null;
  let timeParam = '';

  // Handle standard watch URLs and YouTube Shorts (youtube.com/shorts/VIDEO_ID)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?/]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
  }

  // Handle time param (?t=120)
  const timeMatch = url.match(/[?&]t=([^#&]*)/);
  if (timeMatch && timeMatch[1]) {
    timeParam = `?start=${timeMatch[1].replace('s', '')}`;
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}${timeParam}` : null;
};

// Detect YouTube Shorts URL for vertical display (like homepage)
const isYoutubeShortsUrl = (url: string) => url && url.includes('/shorts/');

// Renderers for different block types
const TextBlock = ({ block }: { block: ContentBlock }) => (
  <div className="max-w-3xl mx-auto w-full px-4 mb-16 text-center">
    {block.title && (
      <h2 className="text-3xl font-bold text-white mb-6 uppercase text-center">
        {block.title}
      </h2>
    )}
    {block.content && (
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 text-center">
        <p className="whitespace-pre-wrap">{block.content}</p>
      </div>
    )}
  </div>
);

const MediaBlock = ({ block }: { block: ContentBlock }) => {
  const isRightLayout = block.layout === 'right';
  const hasText = !!block.content;
  
  // Content rendering helper
  const renderMedia = () => {
    if (block.type === 'video' && block.mediaUrl) {
      const embedUrl = getYoutubeEmbedUrl(block.mediaUrl);
      const isShorts = isYoutubeShortsUrl(block.mediaUrl);
      return (
        <div className={`relative bg-black overflow-hidden shadow-2xl border border-white/10 ${isShorts ? 'aspect-[9/16] rounded-[2.5rem] max-w-[340px] mx-auto' : 'aspect-video rounded-xl'}`}>
            {embedUrl ? (
                <iframe 
                    src={embedUrl} 
                    className="w-full h-full" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Video ei leitud</div>
            )}
        </div>
      );
    } 
    
    if (block.type === 'image' && block.mediaUrl) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img src={block.mediaUrl} alt={block.title || ""} className="w-full h-auto object-cover" />
            </div>
        );
    }

    if (block.type === 'carousel' && block.mediaItems && block.mediaItems.length > 0) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
                 <MediaGallery media={block.mediaItems} />
            </div>
        );
    }
    
    return null;
  };

  if (!hasText) {
    // Full width media if no text
    return (
        <div className="max-w-5xl mx-auto w-full px-4 mb-16">
            {block.title && <h2 className="text-2xl font-bold text-white mb-4 uppercase text-center">{block.title}</h2>}
            {renderMedia()}
        </div>
    );
  }

  // Split layout
  return (
    <div className="max-w-7xl mx-auto w-full px-4 mb-16">
      <div className={`flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 items-start ${isRightLayout ? 'lg:flex-row-reverse' : ''}`}>
         {/* Media Side */}
         <div className="w-full lg:w-1/2">
             {renderMedia()}
         </div>
         
         {/* Text Side */}
         <div className="w-full lg:w-1/2">
            {block.title && <h2 className="text-3xl font-bold text-white mb-6 uppercase">{block.title}</h2>}
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="whitespace-pre-wrap">{block.content}</p>
            </div>
         </div>
      </div>
    </div>
  );
};


export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('projectPage');

  // Fetch current project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single<Project>();

  if (!project) {
    notFound();
  }

  // Get localized title for display
  const displayTitle = locale === 'en' && project.title_en ? project.title_en : project.title;

  // Fetch other projects for "See also"
  const { data: otherProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .neq("id", project.id)
    .limit(3)
    .returns<Project[]>();

  // Determine content blocks based on locale
  let blocks: ContentBlock[] = [];
  
  // Use English content if locale is 'en' and English content exists
  const contentToUse = (locale === 'en' && project.content_en && Array.isArray(project.content_en) && project.content_en.length > 0) 
    ? project.content_en 
    : project.content;
  
  if (contentToUse && Array.isArray(contentToUse) && contentToUse.length > 0) {
      blocks = contentToUse as unknown as ContentBlock[];
  } else {
      // Fallback: Construct blocks from legacy fields ONLY if no new content exists
      if (project.description) {
          const descToUse = (locale === 'en' && project.description_en) ? project.description_en : project.description;
          blocks.push({
              id: 'legacy-desc',
              type: 'text',
              content: descToUse
          });
      }

      const legacyMedia = Array.isArray(project.media_gallery) ? project.media_gallery.map(String) : [];
      if (legacyMedia.length > 0) {
          blocks.push({
              id: 'legacy-gallery',
              type: 'carousel',
              mediaItems: legacyMedia,
              layout: 'left'
          });
      }
  }

  // Links - use English version if available
  let links: CustomLink[] = [];
  const linksToUse = (locale === 'en' && project.links_en && Array.isArray(project.links_en) && project.links_en.length > 0)
    ? project.links_en
    : project.links;
    
  if (linksToUse && Array.isArray(linksToUse)) {
      links = linksToUse as unknown as CustomLink[];
  }
  // If no new links, construct from legacy
  if (links.length === 0) {
      if (project.youtube_url) links.push({ id: 'yt', type: 'youtube', label: t('watchOnYouTube'), url: project.youtube_url });
      if (project.instagram_url) links.push({ id: 'ig', type: 'instagram', label: t('viewOnInstagram'), url: project.instagram_url });
      if (project.tiktok_url) links.push({ id: 'tt', type: 'tiktok', label: t('watchOnTikTok'), url: project.tiktok_url });
  }

  // Helper to check if stat has value
  const hasStatValue = (v: string | null | undefined | number) => {
    if (!v) return false;
    const raw = String(v).replace(/\s/g, '').replace(/k/i, '000').replace(/\D/g, '');
    return (parseInt(raw) || 0) > 0;
  };

  // Check if we have any stats to show (including YouTube auto-stats)
  const hasStats = 
    project.show_youtube_stats || 
    hasStatValue(project.stat_views) || 
    hasStatValue(project.stat_likes) || 
    hasStatValue(project.stat_comments) || 
    hasStatValue(project.stat_shares) || 
    hasStatValue(project.stat_saves);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header Section */}
      <div className={`relative pt-32 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 ${hasStats ? 'pb-16' : 'pb-8'}`}>
        <MotionWrapper className="max-w-5xl mx-auto text-center">
            <MotionItem>
            <Link href="/tehtud-tood" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToAll')}
            </Link>
            </MotionItem>
            
            <MotionItem>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-8 uppercase leading-tight tracking-tight break-words hyphens-auto">
                {displayTitle}
            </h1>
            </MotionItem>

            {/* Dates Row */}
            <MotionItem>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400 ${hasStats ? 'mb-10' : 'mb-0'}`}>
                {project.collaboration_completed_at && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white" />
                        <span>
                            {t('published')}: <span className="text-white font-medium">{new Date(project.collaboration_completed_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'et-EE', { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </span>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span>
                         {t('lastUpdated')}: <span className="text-gray-300 font-medium">{new Date(project.updated_at ?? new Date()).toLocaleDateString(locale === 'en' ? 'en-US' : 'et-EE', { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                    </span>
                </div>
            </div>
            </MotionItem>

            {/* Stats Bar (Modern) - Live Component */}
            {hasStats && (
            <MotionItem>
            <div className="relative mt-16 mb-12 w-full flex justify-center px-4">
               <div className="w-full max-w-5xl">
                <LiveStats 
                    projectId={project.id}
                    initialViews={project.stat_views}
                    initialLikes={project.stat_likes}
                    initialComments={project.stat_comments}
                    initialShares={project.stat_shares}
                    initialSaves={project.stat_saves}
                    showYoutubeStats={project.show_youtube_stats}
                />
               </div>
            </div>
            </MotionItem>
            )}
        </MotionWrapper>
      </div>

      {/* Content Blocks */}
      <MotionWrapper className="py-16">
          {blocks.map((block) => (
            <MotionItem key={block.id}>
              {block.type === 'text' ? (
                  <TextBlock block={block} />
              ) : (
                  <MediaBlock block={block} />
              )}
            </MotionItem>
          ))}
      </MotionWrapper>

      {/* Footer / Links Section */}
      <MotionWrapper className="max-w-5xl mx-auto px-4 pb-0 my-0">

        {/* Client Quote */}
        {project.client_quote && (
          <MotionItem className="mb-24 px-4">
             <Testimonial 
                quote={(locale === 'en' && project.client_quote_en) ? project.client_quote_en : project.client_quote}
                author={project.client_name || t('client')}
                role={project.client_role || t('partner')}
                imageSrc={project.client_avatar_url || undefined}
                stars={project.client_review_stars ?? 5}
                title={((locale === 'en' && project.client_review_title_en) ? project.client_review_title_en : project.client_review_title) || undefined}
                className="max-w-4xl mx-auto"
             />
          </MotionItem>
        )}

        {/* Social Links (Dynamic) */}
        {links.length > 0 && (
            <MotionItem className="mb-24 text-center py-9">
                 <h2 className="text-2xl font-bold text-white mb-8 uppercase">
                   {t('viewOnSocial')}
                 </h2>
                 <div className="flex flex-wrap justify-center gap-4">
                    {links.map((link) => {
                        let Icon = ExternalLink;
                        let bgClass = "bg-neutral-800 hover:bg-neutral-700";
                        let textClass = "text-white";

                        if (link.type === 'youtube') {
                            Icon = Youtube;
                            bgClass = "bg-[#FF0000] hover:bg-[#CC0000]";
                        } else if (link.type === 'instagram') {
                            Icon = Instagram;
                            bgClass = "bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#2f55a4] hover:opacity-90";
                        } else if (link.type === 'tiktok') {
                            // Custom icon for tiktok below
                             bgClass = "bg-[#000000] border border-white/20 hover:bg-neutral-900";
                        }

                        return (
                            <a 
                                key={link.id} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${bgClass} ${textClass}`}
                            >
                                {link.type === 'tiktok' ? (
                                    <svg
                                        className="w-5 h-5 fill-current"
                                        viewBox="0 0 24 24"
                                        style={{ color: "rgba(255, 255, 255, 1)" }}
                                    >
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.09-.65 2.58-.71 5.3-.17 7.92.56 2.73 2.18 5.17 4.5 6.64-1.35 1.05-2.96 1.76-4.66 1.95-2.8.31-5.71-.5-7.9-2.3C6.3 20.37 5.01 17.5 5.5 14.5c.34-2.13 1.39-4.13 2.98-5.71 1.58-1.57 3.75-2.47 5.98-2.5v4.03c-1.39.05-2.73.68-3.64 1.76-.94 1.13-1.39 2.63-1.19 4.1.25 1.83 1.34 3.48 2.96 4.39 1.69.95 3.8.84 5.39-.27.87-.6 1.56-1.45 1.95-2.43.51-1.32.61-2.78.3-4.19H12.52v-13.8z" />
                                    </svg>
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                                {link.label}
                            </a>
                        );
                    })}
                 </div>
            </MotionItem>
        )}
      </MotionWrapper>

      {/* See Also */}
      {otherProjects && otherProjects.length > 0 && (
          <div className="bg-neutral-900/50 py-24 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-white mb-12 uppercase text-center">
                  {t('checkOtherProjects')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherProjects.map((p) => {
                    const otherTitle = (locale === 'en' && p.title_en) ? p.title_en : p.title;
                    return (
                    <Link key={p.id} href={`/tehtud-tood/${p.slug}`} className="group block">
                    <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-6 relative border border-neutral-800 group-hover:border-primary transition-all shadow-lg">
                        {p.thumbnail_url ? (
                        <img src={p.thumbnail_url} alt={otherTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          {locale === 'en' ? 'No image' : 'Pilt puudub'}
                        </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors text-center">{otherTitle}</h3>
                    </Link>
                    );
                })}
                </div>
            </div>
          </div>
        )}
    </div>
  );
}

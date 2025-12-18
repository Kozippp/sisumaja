import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Youtube, Instagram, Calendar, Clock, Play, Link as LinkIcon, ExternalLink } from "lucide-react";
import MediaGallery from "@/components/MediaGallery";
import { Database } from "@/types/database.types";
import { ContentBlock, CustomLink } from "@/components/admin/ProjectForm";

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

// Helper to extract YouTube ID and params
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  
  let videoId = null;
  let timeParam = '';

  // Handle standard watch URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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

// Renderers for different block types
const TextBlock = ({ block }: { block: ContentBlock }) => (
  <div className="max-w-3xl mx-auto w-full px-4 mb-16">
    {block.title && <h2 className="text-3xl font-bold text-white mb-6 uppercase">{block.title}</h2>}
    {block.content && (
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
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
      return (
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
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
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
                <img src={block.mediaUrl} alt={block.title || ""} className="w-full h-auto object-cover" />
            </div>
        );
    }

    if (block.type === 'carousel' && block.mediaItems && block.mediaItems.length > 0) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
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
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${isRightLayout ? 'lg:flex-row-reverse' : ''}`}>
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

  // Fetch current project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single<Project>();

  if (!project) {
    notFound();
  }

  // Fetch other projects for "See also"
  const { data: otherProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .neq("id", project.id)
    .limit(3)
    .returns<Project[]>();

  // Determine content blocks
  let blocks: ContentBlock[] = [];
  
  if (project.content && Array.isArray(project.content) && project.content.length > 0) {
      blocks = project.content as unknown as ContentBlock[];
  } else {
      // Fallback: Construct blocks from legacy fields ONLY if no new content exists
      // If user clears content but keeps description, we might want to respect that? 
      // Current logic: If content array exists (even empty), we use it. If null, we use fallback.
      
      if (project.description) {
          blocks.push({
              id: 'legacy-desc',
              type: 'text',
              content: project.description
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

  // Links
  let links: CustomLink[] = [];
  if (project.links && Array.isArray(project.links)) {
      links = project.links as unknown as CustomLink[];
  }
  // If no new links, construct from legacy
  if (links.length === 0) {
      if (project.youtube_url) links.push({ id: 'yt', type: 'youtube', label: 'Vaata YouTube\'is', url: project.youtube_url });
      if (project.instagram_url) links.push({ id: 'ig', type: 'instagram', label: 'Vaata Instagramis', url: project.instagram_url });
      if (project.tiktok_url) links.push({ id: 'tt', type: 'tiktok', label: 'Vaata TikTokis', url: project.tiktok_url });
  }

  // Check if we have any stats to show
  const hasStats = project.stat_views || project.stat_likes || project.stat_comments || project.stat_shares;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-5xl mx-auto text-center">
            <Link href="/tehtud-tood" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tagasi tehtud tööde juurde
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase leading-tight tracking-tight">
                {project.title}
            </h1>

            {/* Dates Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400 mb-10">
                {project.collaboration_completed_at && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                            Avalikustatud: <span className="text-white font-medium">{new Date(project.collaboration_completed_at).toLocaleDateString('et-EE', { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </span>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                         Viimati uuendatud: <span className="text-gray-300 font-medium">{new Date(project.updated_at).toLocaleDateString('et-EE', { 
                                year: 'numeric', 
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                    </span>
                </div>
            </div>

            {/* Stats Bar (Modern) */}
            {hasStats && (
                <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-12 bg-neutral-900/50 rounded-2xl px-8 py-4 border border-neutral-800 backdrop-blur-sm">
                    {project.stat_views && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-800 rounded-full text-primary">
                                <Eye className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-bold text-white leading-none">{parseInt(project.stat_views.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Vaatamist</div>
                            </div>
                        </div>
                    )}
                    {project.stat_likes && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-800 rounded-full text-primary">
                                <Heart className="w-5 h-5" />
                            </div>
                             <div className="text-left">
                                <div className="text-lg font-bold text-white leading-none">{parseInt(project.stat_likes.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Like&apos;i</div>
                            </div>
                        </div>
                    )}
                    {project.stat_comments && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-800 rounded-full text-primary">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                             <div className="text-left">
                                <div className="text-lg font-bold text-white leading-none">{parseInt(project.stat_comments.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Kommentaari</div>
                            </div>
                        </div>
                    )}
                     {project.stat_shares && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-800 rounded-full text-primary">
                                <Share2 className="w-5 h-5" />
                            </div>
                             <div className="text-left">
                                <div className="text-lg font-bold text-white leading-none">{parseInt(project.stat_shares.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Jagamist</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="py-16">
          {blocks.map((block) => (
              block.type === 'text' ? (
                  <TextBlock key={block.id} block={block} />
              ) : (
                  <MediaBlock key={block.id} block={block} />
              )
          ))}
      </div>

      {/* Footer / Links Section */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        
        {/* Social Links (Dynamic) */}
        {links.length > 0 && (
            <div className="mb-24 text-center">
                 <h2 className="text-2xl font-bold text-white mb-8 uppercase">Vaata projekti sotsiaalmeedias</h2>
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
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.09-.65 2.58-.71 5.3-.17 7.92.56 2.73 2.18 5.17 4.5 6.64-1.35 1.05-2.96 1.76-4.66 1.95-2.8.31-5.71-.5-7.9-2.3C6.3 20.37 5.01 17.5 5.5 14.5c.34-2.13 1.39-4.13 2.98-5.71 1.58-1.57 3.75-2.47 5.98-2.5v4.03c-1.39.05-2.73.68-3.64 1.76-.94 1.13-1.39 2.63-1.19 4.1.25 1.83 1.34 3.48 2.96 4.39 1.69.95 3.8.84 5.39-.27.87-.6 1.56-1.45 1.95-2.43.51-1.32.61-2.78.3-4.19H12.52v-13.8z"/></svg>
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                                {link.label}
                            </a>
                        );
                    })}
                 </div>
            </div>
        )}

        {/* Client Quote */}
        {project.client_quote && (
             <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 border border-neutral-800 relative text-center">
                <div className="inline-block mb-6">
                    {project.client_avatar_url ? (
                        <img src={project.client_avatar_url} alt={project.client_name || "Klient"} className="w-20 h-20 rounded-full object-cover border-4 border-neutral-800 mx-auto" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-2xl font-bold text-gray-600">
                             {project.client_name?.charAt(0) || "K"}
                        </div>
                    )}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-white mb-6 max-w-2xl mx-auto leading-relaxed">
                    &ldquo;{project.client_quote}&rdquo;
                </blockquote>
                <div>
                    <div className="font-bold text-white text-lg">{project.client_name || "Klient"}</div>
                    <div className="text-primary font-bold uppercase text-sm tracking-wide">{project.client_role || "Koostööpartner"}</div>
                </div>
             </div>
        )}
      </div>

      {/* See Also */}
      {otherProjects && otherProjects.length > 0 && (
          <div className="bg-neutral-900/50 py-24 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-white mb-12 uppercase text-center">Vaata ka teisi töid</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherProjects.map((p) => (
                    <Link key={p.id} href={`/tehtud-tood/${p.slug}`} className="group block">
                    <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-6 relative border border-neutral-800 group-hover:border-primary transition-all shadow-lg">
                        {p.thumbnail_url ? (
                        <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">Pilt puudub</div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors text-center">{p.title}</h3>
                    </Link>
                ))}
                </div>
            </div>
          </div>
        )}
    </div>
  );
}

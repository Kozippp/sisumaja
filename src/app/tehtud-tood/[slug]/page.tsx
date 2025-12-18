import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2, Youtube, Instagram, Calendar, Clock } from "lucide-react";
import MediaGallery from "@/components/MediaGallery";
import { Database } from "@/types/database.types";

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

  // Parse media gallery safely
  const mediaGallery = Array.isArray(project.media_gallery) 
    ? project.media_gallery.map(String) 
    : [];

  // Add thumbnail to gallery if it exists and gallery is empty (fallback)
  if (mediaGallery.length === 0 && project.thumbnail_url) {
      mediaGallery.push(project.thumbnail_url);
  }

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tehtud-tood" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tagasi tehtud tööde juurde
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Media */}
          <div>
            <MediaGallery media={mediaGallery} />
            
            {/* Social Links Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {project.youtube_url && (
                <a 
                  href={project.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#FF0000] text-white px-4 py-2 rounded-full font-bold hover:opacity-90 transition-opacity"
                >
                  <Youtube className="w-5 h-5" />
                  Vaata YouTube&apos;is
                </a>
              )}
              {project.instagram_url && (
                <a 
                  href={project.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#2f55a4] text-white px-4 py-2 rounded-full font-bold hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                  Vaata Instagramis
                </a>
              )}
               {project.tiktok_url && (
                <a 
                  href={project.tiktok_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#000000] border border-white/20 text-white px-4 py-2 rounded-full font-bold hover:bg-neutral-900 transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.09-.65 2.58-.71 5.3-.17 7.92.56 2.73 2.18 5.17 4.5 6.64-1.35 1.05-2.96 1.76-4.66 1.95-2.8.31-5.71-.5-7.9-2.3C6.3 20.37 5.01 17.5 5.5 14.5c.34-2.13 1.39-4.13 2.98-5.71 1.58-1.57 3.75-2.47 5.98-2.5v4.03c-1.39.05-2.73.68-3.64 1.76-.94 1.13-1.39 2.63-1.19 4.1.25 1.83 1.34 3.48 2.96 4.39 1.69.95 3.8.84 5.39-.27.87-.6 1.56-1.45 1.95-2.43.51-1.32.61-2.78.3-4.19H12.52v-13.8z"/></svg>
                  Vaata TikTokis
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase leading-tight">{project.title}</h1>
            
            {/* Dates Section */}
            <div className="bg-neutral-900/50 px-4 py-3 rounded-lg border border-neutral-800 mb-6 inline-block">
              <div className="flex flex-col gap-2">
                {project.collaboration_completed_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-400">Valminud:</span>
                    <span className="text-sm text-white font-medium">
                      {new Date(project.collaboration_completed_at).toLocaleDateString('et-EE', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Viimati uuendatud:</span>
                  <span className="text-sm text-gray-300 font-medium">
                    {new Date(project.updated_at).toLocaleDateString('et-EE', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 mb-8">
              <p className="whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Stats */}
            {(project.stat_views || project.stat_likes || project.stat_comments || project.stat_shares) && (
              <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 mb-12 inline-block">
                <div className="flex gap-6">
                  {project.stat_views && (
                    <div className="text-center">
                      <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{parseInt(project.stat_views.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Vaatamist</div>
                    </div>
                  )}
                  {project.stat_likes && (
                    <div className="text-center">
                      <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{parseInt(project.stat_likes.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Like&apos;i</div>
                    </div>
                  )}
                  {project.stat_comments && (
                    <div className="text-center">
                      <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{parseInt(project.stat_comments.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Kommentaari</div>
                    </div>
                  )}
                  {project.stat_shares && (
                    <div className="text-center">
                      <Share2 className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{parseInt(project.stat_shares.replace(/\D/g, '') || '0').toLocaleString('et-EE').replace(/,/g, ' ')}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Jagamist</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Feedback */}
            {project.client_quote && (
              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 relative">
                <div className="text-primary text-6xl font-serif absolute top-4 left-6 opacity-20">&ldquo;</div>
                <p className="text-lg text-gray-300 italic mb-6 relative z-10">{project.client_quote}</p>
                <div className="flex items-center">
                  {project.client_avatar_url ? (
                    <img src={project.client_avatar_url} alt={project.client_name || "Klient"} className="w-12 h-12 rounded-full object-cover mr-4 border border-neutral-700" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-gray-500">{project.client_name?.charAt(0) || "K"}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white">{project.client_name || "Klient"}</div>
                    <div className="text-sm text-primary">{project.client_role || "Koostööpartner"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* See Also */}
        {otherProjects && otherProjects.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-900">
            <h2 className="text-3xl font-bold text-white mb-8 uppercase">Vaata ka teisi töid</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherProjects.map((p) => (
                <Link key={p.id} href={`/tehtud-tood/${p.slug}`} className="group block">
                  <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-4 relative border border-neutral-800 group-hover:border-primary transition-all">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">Pilt puudub</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


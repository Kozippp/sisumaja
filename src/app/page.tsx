import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Play, Star, Zap, TrendingUp, Clapperboard, Users, MessageCircle, CheckCircle, Youtube, Video, Mic, BadgeCheck, Smartphone, Repeat, Eye, BarChart3, ThumbsUp, Target } from "lucide-react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import * as motion from "framer-motion/client";
import LiveYouTubeCarousel from "@/components/LiveYouTubeCarousel";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { YouTubeComparisonTable } from "@/components/YouTubeComparisonTable";
import { VideoPlayer } from "@/components/VideoPlayer";
import { StandardVideoPlayer } from "@/components/StandardVideoPlayer";
import { SocialMediaComparisonTable } from "@/components/SocialMediaComparisonTable";
import { TrainingSection } from "@/components/TrainingSection";
import { RetentionImagesModal } from "@/components/RetentionImagesModal";
import { RetentionLink } from "@/components/RetentionLink";
import { ContactForm } from "@/components/ContactForm";
import { getTranslations } from 'next-intl/server';
import { getLocale } from '@/lib/locale';

export const revalidate = 60;

type Project = Database['public']['Tables']['projects']['Row'];
type ClientLogo = Database['public']['Tables']['client_logos']['Row'];
type SocialStats = Database['public']['Tables']['social_stats']['Row'];
type FeaturedVideo = Database['public']['Tables']['featured_videos']['Row'];
type ShortsVideo = Database['public']['Tables']['shorts_videos']['Row'];
type YoutubeAdVideo = Database['public']['Tables']['youtube_ad_videos']['Row'];
type RetentionImage = Database['public']['Tables']['retention_images']['Row'];

// Helper function to get localized project content
function getLocalizedProject(project: Project, locale: string) {
  return {
    ...project,
    title: locale === 'en' && project.title_en ? project.title_en : project.title,
    description: locale === 'en' && project.description_en ? project.description_en : project.description,
  };
}

async function getRecentProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return data || [];
}

async function getYoutubeProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .eq("project_type", "youtube_ad")
    .eq("show_on_frontpage_youtube", true)
    .order("published_at", { ascending: false });
  return data || [];
}

async function getShortsProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .eq("project_type", "shorts")
    .eq("show_on_frontpage_shorts", true)
    .order("published_at", { ascending: false })
    .limit(4);
  return data || [];
}

async function getTrainingProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .eq("project_type", "training")
    .order("published_at", { ascending: false });
  return data || [];
}

async function getClientLogos(): Promise<ClientLogo[]> {
  const { data } = await supabase
    .from("client_logos")
    .select("*")
    .order("display_order", { ascending: true });
  return data || [];
}

async function getSocialStats(): Promise<SocialStats> {
  const { data } = await supabase
    .from("social_stats")
    .select("*")
    .limit(1)
    .single();
  return data || { id: '', followers: '15.4K', views: '1M+', updated_at: '' };
}

async function getFeaturedVideos(): Promise<FeaturedVideo[]> {
  const { data } = await supabase
    .from("featured_videos")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  return data || [];
}

async function getShortsVideos(): Promise<ShortsVideo[]> {
  const { data } = await supabase
    .from("shorts_videos")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .limit(1);
  return data || [];
}

async function getYoutubeAdVideos(): Promise<YoutubeAdVideo[]> {
  const { data } = await supabase
    .from("youtube_ad_videos")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);
  return data || [];
}

async function getRetentionImages(): Promise<RetentionImage[]> {
  const { data } = await supabase
    .from("retention_images")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return data || [];
}

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations();
  
  const recentProjects = await getRecentProjects();
  const youtubeProjects = await getYoutubeProjects();
  const shortsProjects = await getShortsProjects();
  const trainingProjects = await getTrainingProjects();
  const clientLogos = await getClientLogos();
  const socialStats = await getSocialStats();
  const featuredVideos = await getFeaturedVideos();
  const shortsVideos = await getShortsVideos();
  const youtubeAdVideos = await getYoutubeAdVideos();
  const retentionImages = await getRetentionImages();

  // Localize projects
  const localizedRecentProjects = recentProjects.map(p => getLocalizedProject(p, locale));
  const localizedYoutubeProjects = youtubeProjects.map(p => getLocalizedProject(p, locale));
  const localizedShortsProjects = shortsProjects.map(p => getLocalizedProject(p, locale));
  const localizedTrainingProjects = trainingProjects.map(p => getLocalizedProject(p, locale));

  const SERVICES = [
    {
      id: "youtube",
      title: t('services.youtube.title'),
      icon: <Youtube className="w-8 h-8" />,
      description: t('services.youtube.description'),
      href: "#youtube-service"
    },
    {
      id: "shorts",
      title: t('services.shorts.title'),
      icon: <Video className="w-8 h-8" />,
      description: t('services.shorts.description'),
      href: "#shorts-service"
    },
    {
      id: "training",
      title: t('services.training.title'),
      icon: <Mic className="w-8 h-8" />,
      description: t('services.training.description'),
      href: "#training-service"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden text-white font-sans selection:bg-fuchsia-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col px-4 pt-20 pb-10 overflow-hidden">
        
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-black to-black opacity-50" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Two Column Layout: Instagram Profile (Left) + Text (Right) on desktop. Mobile: Text first, Profile below, both centered in viewport */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center justify-items-center mb-6 pt-[18vh] lg:pt-0">
            
            {/* Oval Glow Effect Behind Both Elements */}
            <div className="absolute inset-0 -inset-x-20 bg-fuchsia-500/20 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
            
            {/* Main Text - order-1 on mobile (top), order-2 on desktop (right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative text-center lg:text-left z-10 order-1 lg:order-2 w-full"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-6">
                {t('hero.title')}<br />{locale === 'et' ? 'Eesti ' : ''}<span className="text-fuchsia-500">{t('hero.titleBold')}</span><br />{t('hero.titleEnd')}
              </h1>
            </motion.div>

            {/* Instagram Profile Card - order-2 on mobile (below text), order-1 on desktop (left). Smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center lg:justify-end z-10 order-2 lg:order-1 w-full"
            >
              <div className="relative group cursor-default scale-90 lg:scale-100 origin-center">
                {/* Instagram-style Card - smaller padding and content on mobile */}
                <Link href="#about" className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-5 pr-6 lg:p-8 lg:pr-12 rounded-2xl lg:rounded-3xl flex items-center gap-4 lg:gap-8 transform hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                  {/* Profile Picture with Story Ring - smaller on mobile */}
                  <div className="relative flex-shrink-0">
                     <div className="absolute -inset-[4px] lg:-inset-[5px] bg-gradient-to-tr from-yellow-500 via-fuchsia-500 to-purple-600 rounded-full opacity-100"></div>
                     <div className="relative w-24 h-24 lg:w-40 lg:h-40 rounded-full overflow-hidden border-[4px] lg:border-[5px] border-black">
                        <Image 
                          src="/kozip-profile.png"
                          alt="Kozip"
                          fill
                          className="object-cover"
                          priority
                        />
                     </div>
                  </div>

                  {/* Profile Info - smaller text on mobile */}
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5 lg:mb-1">
                      <h2 className="text-lg lg:text-2xl font-bold text-white tracking-tight truncate">{t('hero.profileName')}</h2>
                      <BadgeCheck className="w-5 h-5 lg:w-7 lg:h-7 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base font-medium mb-2 lg:mb-4">{t('hero.profileTitle')}</p>
                    
                    {/* Stats - smaller on mobile */}
                    <div className="flex items-center gap-4 lg:gap-8 text-sm lg:text-base">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-lg lg:text-2xl">{socialStats.followers}</span>
                        <span className="text-gray-500 text-xs">{t('hero.followersLabel')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-lg lg:text-2xl">{socialStats.views}</span>
                        <span className="text-gray-500 text-xs">{t('hero.viewsLabel')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>

          </div>

            {/* Service Cards - compact horizontal layout on mobile, full cards on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4">
              {SERVICES.map((service, index) => {
                const colors = {
                  youtube: {
                    icon: 'text-red-500',
                    hoverIcon: 'group-hover:text-red-400',
                    hoverTitle: 'group-hover:text-red-300',
                    hoverGradient: 'from-red-500/10',
                    arrow: 'text-red-500'
                  },
                  shorts: {
                    icon: 'text-blue-500',
                    hoverIcon: 'group-hover:text-blue-400',
                    hoverTitle: 'group-hover:text-blue-300',
                    hoverGradient: 'from-blue-500/10',
                    arrow: 'text-blue-500'
                  },
                  training: {
                    icon: 'text-green-500',
                    hoverIcon: 'group-hover:text-green-400',
                    hoverTitle: 'group-hover:text-green-300',
                    hoverGradient: 'from-green-500/10',
                    arrow: 'text-green-500'
                  }
                };
                
                const serviceColors = colors[service.id as keyof typeof colors];
                
                return (
                  <motion.a
                    key={service.id}
                    href={service.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    className="group relative p-4 md:p-8 rounded-2xl hover:bg-white/5 hover:border hover:border-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${serviceColors.hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Icon - left on mobile, centered on desktop */}
                    <div className={`relative z-10 flex-shrink-0 p-2.5 md:p-4 rounded-full bg-black/50 md:mb-4 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8 ${serviceColors.icon} ${serviceColors.hoverIcon} group-hover:scale-110 transition-all duration-300`}>
                      {service.icon}
                    </div>
                    
                    {/* Text - right on mobile, add padding for arrow */}
                    <div className="relative z-10 flex-1 min-w-0 pr-8 md:pr-0 md:contents">
                      <h3 className={`text-base md:text-xl font-bold md:mb-2 ${serviceColors.hoverTitle} transition-colors`}>{service.title}</h3>
                      <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors line-clamp-2 md:line-clamp-none">{service.description}</p>
                    </div>
                    
                    {/* Arrow - always visible on mobile (right edge), hover-reveal on desktop */}
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-4 md:right-4 flex-shrink-0 w-5 h-5 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:transform md:translate-y-2 md:group-hover:translate-y-0 duration-300 ${serviceColors.arrow}`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Client Logos - Desktop Only (inside hero, at the bottom) */}
          <div className="hidden lg:block mt-auto pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col items-center gap-6 w-full">
                <h3 className="text-lg font-bold text-white text-center">{t('clients.title')}</h3>
                <div className="w-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
                  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
                  
                  <div className="flex gap-16 animate-infinite-scroll-slow whitespace-nowrap min-w-max">
                    {[...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (
                      <div key={idx} className="flex items-center">
                        {client.is_mock || !client.logo_url ? (
                          <div className="text-xl font-bold text-white uppercase cursor-default">
                            {client.name}
                          </div>
                        ) : (
                          <div className="relative h-10 w-28 overflow-hidden">
                            <div 
                              style={{
                                transform: `scale(${(client.logo_scale || 100) / 100})`,
                                width: '100%',
                                height: '100%',
                                position: 'relative'
                              }}
                            >
                              <Image 
                                src={client.logo_url} 
                                alt={client.name}
                                fill
                                className="object-contain"
                                style={{
                                  objectPosition: `${client.logo_position_x || 50}% ${client.logo_position_y || 50}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. BRAND QUOTE / MISSION REMOVED */}
      {/* 3. CLIENT CAROUSEL (Mobile Only) - Title on top, carousel below */}
      <section className="lg:hidden py-12 bg-black overflow-hidden border-y border-white/5">
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col gap-6">
          <h3 className="text-xl md:text-2xl font-bold text-white text-center">{t('clients.title')}</h3>
          <div className="w-full overflow-hidden relative min-h-[3rem]">
            <div className="absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-12 md:gap-16 animate-infinite-scroll-slow whitespace-nowrap min-w-max py-2">
              {[...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (
                <div key={idx} className="flex items-center shrink-0">
                  {client.is_mock || !client.logo_url ? (
                    <div className="text-xl md:text-2xl font-bold text-white uppercase cursor-default">
                      {client.name}
                    </div>
                  ) : (
                    <div className="relative h-10 w-24 md:h-12 md:w-32 overflow-hidden shrink-0">
                      <div 
                        style={{
                          transform: `scale(${(client.logo_scale || 100) / 100})`,
                          width: '100%',
                          height: '100%',
                          position: 'relative'
                        }}
                      >
                        <Image 
                          src={client.logo_url} 
                          alt={client.name}
                          fill
                          className="object-contain"
                          style={{
                            objectPosition: `${client.logo_position_x || 50}% ${client.logo_position_y || 50}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO IS KOZIP */}
      <section id="about" className="py-32 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Intro & Main Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="relative order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10"
              >
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                   <Image 
                     src="/kes-on-kozip-new.png" 
                     alt="Kozip tiim" 
                     fill 
                     className="object-cover" 
                   />
                </div>
              </motion.div>
            </div>
            
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">{t('about.title')} <span className="text-fuchsia-500">{t('about.titleBrand')}</span>?</h2>
                
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    <span className="text-white font-bold">{t('about.intro1')}</span>{t('about.intro1Rest')}
                  </p>
                  <p>
                    {t('about.intro2')} <span className="text-fuchsia-400 font-medium">{t('about.intro2Bold')}</span> {t('about.intro2End')}
                  </p>
                  <p>
                    <span className="text-white font-bold">{t('about.intro3Bold')}</span> {t('about.intro3')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* YouTube Content Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{t('about.carouselTitle')}</h3>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">{t('about.carouselSubtitle')}</p>
            </div>
            
            <LiveYouTubeCarousel initialVideos={featuredVideos} />
          </motion.div>

        </div>
      </section>

      {/* 5. SOCIAL PROOF */}
      <TestimonialsSection />

      {/* 6. SERVICES DETAIL */}
      <div className="bg-neutral-950">
        
        {/* Service 1: YouTube */}
        <section id="youtube-service" className="py-32 border-b border-white/5 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Centered Intro */}
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-6">
                <Youtube className="w-4 h-4" /> {t('youtubeService.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">{t('youtubeService.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">{t('youtubeService.titleBrand')}</span> {t('youtubeService.titleEnd')}</h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                {t('youtubeService.subtitle')}
              </p>
            </div>

            {/* Two Column: "Mida tähendab..." + Video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
              {/* Left Column: Text */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{t('youtubeService.whatIsMeaning')}</h3>
                <p className="text-lg text-gray-400 leading-relaxed">
                  {t('youtubeService.whatIsDescription')}
                </p>
              </div>

              {/* Right Column: Video */}
              <div>
                {youtubeAdVideos.length > 0 ? (
                  <StandardVideoPlayer 
                    videoUrl={youtubeAdVideos[0].video_url}
                    thumbnailUrl={youtubeAdVideos[0].thumbnail_url}
                    title={youtubeAdVideos[0].title}
                  />
                ) : (
                  <div className="aspect-video bg-neutral-900 rounded-2xl border border-white/10 flex items-center justify-center text-gray-500">
                    <p>{t('common.videoMissing')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Second Row: Stats Card + Why Effective */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
              {/* Left Column: Stats Card "Kes meie videoid vaatab?" - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block">
                <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-6">{t('youtubeService.statsTitle')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsViews')}</div>
                      <div className="text-3xl font-black text-blue-500 mb-1">{t('youtubeService.statsViewsValue')}</div>
                      <div className="text-sm text-gray-400">{t('youtubeService.statsViewsDesc')}</div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsWatch')}</div>
                      <div className="text-3xl font-black text-green-500 mb-1">{t('youtubeService.statsWatchValue')}</div>
                      <div className="text-sm text-gray-400">{t('youtubeService.statsWatchDesc')}</div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsDevice')}</div>
                      <div className="text-3xl font-black text-fuchsia-500 mb-1">{t('youtubeService.statsDeviceValue')}</div>
                      <div className="text-sm text-gray-400">{t('youtubeService.statsDeviceDesc')}</div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4">
                      <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsAudience')}</div>
                      <div className="text-3xl font-black text-yellow-500 mb-1">{t('youtubeService.statsAudienceValue')}</div>
                      <div className="text-sm text-gray-400">{t('youtubeService.statsAudienceDesc')}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-6">
                    {t('youtubeService.statsNote')}
                  </p>
                </div>
              </div>

              {/* Right Column: All 3 Points */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">{t('youtubeService.whyEffectiveTitle')}</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-fuchsia-500">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{t('youtubeService.reason1Title')}</h4>
                      <p className="text-lg text-gray-400 leading-relaxed">
                        {t('youtubeService.reason1Desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{t('youtubeService.reason2Title')}</h4>
                      <p className="text-lg text-gray-400 leading-relaxed">
                        {t('youtubeService.reason2Desc')} <RetentionLink images={retentionImages} /> {t('youtubeService.reason2DescRest')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-green-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{t('youtubeService.reason3Title')}</h4>
                      <p className="text-lg text-gray-400 leading-relaxed">
                        {t('youtubeService.reason3Desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Stats Card "Kes meie videoid vaatab?" - Shown below the "Miks see nii efektiivne on?" section */}
            <div className="lg:hidden mb-24">
              <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6">{t('youtubeService.statsTitle')}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsViews')}</div>
                    <div className="text-3xl font-black text-blue-500 mb-1">{t('youtubeService.statsViewsValue')}</div>
                    <div className="text-sm text-gray-400">{t('youtubeService.statsViewsDesc')}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsWatch')}</div>
                    <div className="text-3xl font-black text-green-500 mb-1">{t('youtubeService.statsWatchValue')}</div>
                    <div className="text-sm text-gray-400">{t('youtubeService.statsWatchDesc')}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsDevice')}</div>
                    <div className="text-3xl font-black text-fuchsia-500 mb-1">{t('youtubeService.statsDeviceValue')}</div>
                    <div className="text-sm text-gray-400">{t('youtubeService.statsDeviceDesc')}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-white-400 mb-1">{t('youtubeService.statsAudience')}</div>
                    <div className="text-3xl font-black text-yellow-500 mb-1">{t('youtubeService.statsAudienceValue')}</div>
                    <div className="text-sm text-gray-400">{t('youtubeService.statsAudienceDesc')}</div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mt-6">
                  {t('youtubeService.statsNote')}
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mb-24">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">{t('youtubeService.comparisonTitle')}</h3>
              <YouTubeComparisonTable />
            </div>

            {/* Selected Works Section */}
            <div>
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-2xl font-bold text-white">{t('youtubeService.portfolioTitle')}</h3>
                <Link href="/tehtud-tood" className="text-sm font-bold uppercase text-gray-400 hover:text-white flex items-center gap-2">
                  {t('youtubeService.portfolioViewAll')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {localizedYoutubeProjects.length > 0 ? (
                  localizedYoutubeProjects.map((project) => (
                    <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block">
                      <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-fuchsia-500/50 transition-all duration-300 relative">
                        {project.thumbnail_url ? (
                          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">{t('youtubeService.noImage')}</div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full">
                            <ArrowRight className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-500 transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
                    <p>{t('youtubeService.selectProjects')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-fuchsia-500 hover:text-white transition-all duration-300">
                {t('youtubeService.ctaButton')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* Service 2: Shorts */}
        <section id="shorts-service" className="py-32 border-b border-white/5 bg-gradient-to-b from-neutral-900 to-black relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Header Area */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-6">
                <Smartphone className="w-4 h-4" /> {t('shortsService.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">{t('shortsService.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">{t('shortsService.titleBrand')}</span></h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                {t('shortsService.subtitle')}
              </p>
            </div>

            {/* Main Feature Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              
              {/* Left: The Video Player */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-full flex justify-center">
                {shortsVideos.length > 0 ? (
                  <VideoPlayer 
                    videoUrl={shortsVideos[0].video_url}
                    thumbnailUrl={shortsVideos[0].thumbnail_url}
                    title={shortsVideos[0].title}
                  />
                ) : (
                  <div className="rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl inline-block max-w-[605px] min-w-[325px]">
                    <div className="aspect-[9/16] flex items-center justify-center text-gray-500">
                      <p>{t('shortsService.addVideo')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Why It Works (The "Expert" text) */}
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{t('shortsService.whatIsMeaning')}</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {t('shortsService.whatIsDescription')}
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6">{t('shortsService.whyEffectiveTitle')}</h3>
                
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mt-1 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{t('shortsService.reason1Title')}</h4>
                        <p className="text-gray-400 leading-relaxed">
                          {t('shortsService.reason1Desc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mt-1 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{t('shortsService.reason2Title')}</h4>
                        <p className="text-gray-400 leading-relaxed">
                          {t('shortsService.reason2Desc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mt-1 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{t('shortsService.reason3Title')}</h4>
                        <p className="text-gray-400 leading-relaxed">
                          {t('shortsService.reason3Desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* New Statistics Section - Koostöövideote statistika */}
            <div className="mb-24">
              <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6">{t('shortsService.statsTitle')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* 1. Vaatamisi */}
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">{t('shortsService.statsViews')}</div>
                    <div className="text-3xl font-black text-blue-500 mb-1">{t('shortsService.statsViewsValue')}</div>
                    <div className="text-sm text-gray-400">{t('shortsService.statsViewsDesc')}</div>
                  </div>

                  {/* 2. Platvormid */}
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">{t('shortsService.statsPlatforms')}</div>
                    <div className="text-3xl font-black text-fuchsia-500 mb-1">{t('shortsService.statsPlatformsValue')}</div>
                    <div className="text-sm text-gray-400 leading-tight">{t('shortsService.statsPlatformsDesc')}</div>
                  </div>

                  {/* 3. Kaasatus */}
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">{t('shortsService.statsEngagement')}</div>
                    <div className="text-3xl font-black text-green-500 mb-1">{t('shortsService.statsEngagementValue')}</div>
                    <div className="text-sm text-gray-400">{t('shortsService.statsEngagementDesc')}</div>
                  </div>

                  {/* 4. Nišš */}
                  <div className="bg-black/40 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">{t('shortsService.statsNiche')}</div>
                    <div className="text-3xl font-black text-yellow-500 mb-1">{t('shortsService.statsNicheValue')}</div>
                    <div className="text-sm text-gray-400 leading-tight">{t('shortsService.statsNicheDesc')}</div>
                  </div>
                </div>
              </div>
            </div>


            {/* Tehtud tööd (Shorts/Reels) */}
            {localizedShortsProjects.length > 0 && (
            <div className="relative">
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-2xl font-bold text-white">{t('shortsService.portfolioTitle')}</h3>
                <Link href="/tehtud-tood?filter=shorts" className="text-sm font-bold uppercase text-gray-400 hover:text-white flex items-center gap-2">
                  {t('shortsService.portfolioViewAll')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {localizedShortsProjects.map((project) => (
                  <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block relative aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-fuchsia-500/50 transition-all duration-300">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 bg-neutral-800">
                         <Video className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-full">
                            <Play className="w-3 h-3 text-white fill-current" />
                         </div>
                         <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t('shortsService.portfolioReelLabel')}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-fuchsia-400 transition-colors">{project.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            )}

            {/* CTA at end of TikTok block */}
            <div className="mt-16 text-center">
              <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-fuchsia-500 hover:text-white transition-all duration-300">
                {t('shortsService.ctaButton')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* Service 3: Training */}
        <TrainingSection trainingProjects={trainingProjects} />
      </div>

      {/* 7. CONTACT FORM – same as /kontakt */}
      <section id="contact" className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">{t('contact.title')}</h2>
            <p className="text-gray-400">{t('contact.subtitle')}</p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* 8. RECENT WORKS (Existing Component Reuse) */}
      <section className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black uppercase">{t('recentWorks.title')}</h2>
            <Link href="/tehtud-tood" className="text-sm font-bold uppercase text-gray-400 hover:text-white flex items-center gap-2">
              {t('recentWorks.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {localizedRecentProjects.length > 0 ? (
              localizedRecentProjects.map((project) => (
                <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block">
                  <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-fuchsia-500/50 transition-all duration-300">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">{t('common.imageMissing')}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-500 transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                {t('recentWorks.noWorks')}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

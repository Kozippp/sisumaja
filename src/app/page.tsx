import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Play, Star, Zap, TrendingUp, Clapperboard, Users, MessageCircle, Send, CheckCircle, Youtube, Video, Mic, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import * as motion from "framer-motion/client";

export const revalidate = 60;

type Project = Database['public']['Tables']['projects']['Row'];
type ClientLogo = Database['public']['Tables']['client_logos']['Row'];

async function getRecentProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return data || [];
}

async function getClientLogos(): Promise<ClientLogo[]> {
  const { data } = await supabase
    .from("client_logos")
    .select("*")
    .order("display_order", { ascending: true });
  return data || [];
}

const SERVICES = [
  {
    id: "youtube",
    title: "YouTube'i Reklaam",
    icon: <Youtube className="w-8 h-8" />,
    description: "Autentne reklaam integreeritud meie YouTube'i videotesse.",
    href: "#youtube-service"
  },
  {
    id: "shorts",
    title: "Lühivideod",
    icon: <Video className="w-8 h-8" />,
    description: "Kiire ja haarav sisu TikTokis, Instagramis ja YouTube Shortsis.",
    href: "#shorts-service"
  },
  {
    id: "training",
    title: "Esinemised & Koolitused",
    icon: <Mic className="w-8 h-8" />,
    description: "Jagame kogemusi turundusest, sotsiaalmeediast, investeerimisest ja ettevõtlusest.",
    href: "#training-service"
  }
];

export default async function Home() {
  const recentProjects = await getRecentProjects();
  const clientLogos = await getClientLogos();

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden text-white font-sans selection:bg-fuchsia-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-10 overflow-hidden">
        
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

        <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
          
          {/* Logo / Branding */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex flex-col items-center"
          >
            <div className="relative mb-8 group cursor-default">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-fuchsia-500/30 rounded-3xl blur-[60px] opacity-50 animate-pulse group-hover:opacity-70 transition-opacity duration-500"></div>
              
              {/* Instagram-style Card */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 pr-10 rounded-3xl flex items-center gap-6 transform hover:scale-[1.02] transition-transform duration-500">
                {/* Profile Picture with Story Ring */}
                <div className="relative">
                   <div className="absolute -inset-[3px] bg-gradient-to-tr from-yellow-500 via-fuchsia-500 to-purple-600 rounded-full opacity-100"></div>
                   <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-black">
                      <Image 
                        src="/kozip-profile.png"
                        alt="Kozip"
                        fill
                        className="object-cover"
                        priority
                      />
                   </div>
                </div>

                {/* Profile Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">@Kozip_Eesti</h2>
                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-3">Digital Creator</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">15.4K</span>
                      <span className="text-gray-500 text-xs">Followers</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">1.2K</span>
                      <span className="text-gray-500 text-xs">Following</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">1M+</span>
                      <span className="text-gray-500 text-xs">Views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Reklaami oma brändi Eesti <span className="text-fuchsia-500 font-bold">ägedaimates kogupere videote</span> keskel
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {SERVICES.map((service, index) => (
              <motion.a
                key={service.id}
                href={service.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col items-center text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 p-4 rounded-full bg-black/50 mb-4 text-fuchsia-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="relative z-10 text-xl font-bold mb-2 group-hover:text-fuchsia-300 transition-colors">{service.title}</h3>
                <p className="relative z-10 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{service.description}</p>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <ArrowRight className="w-5 h-5 text-fuchsia-500" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Scroll Indicator Removed */}
        </div>
      </section>

      {/* 2. BRAND QUOTE / MISSION REMOVED */}
      {/* 3. CLIENT CAROUSEL (Infinite) */}
      <section className="py-12 bg-black overflow-hidden border-y border-white/5">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8">
            <h3 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">Rahulolevad Kliendid:</h3>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
              
              <div className="flex gap-16 animate-infinite-scroll-slow whitespace-nowrap min-w-max">
                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, idx) => (
                  <div key={idx} className="flex items-center">
                    {client.is_mock || !client.logo_url ? (
                      <div className="text-2xl font-bold text-gray-700 uppercase hover:text-white transition-colors cursor-default">
                        {client.name}
                      </div>
                    ) : (
                      <div className="relative h-12 w-32 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                        <Image 
                          src={client.logo_url} 
                          alt={client.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO IS KOZIP */}
      <section className="py-32 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10"
            >
              {/* Placeholder for trailer/video */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center group cursor-pointer">
                 <Image 
                   src="/sisumaja-elu.jpg" 
                   alt="Kozip tiim" 
                   fill 
                   className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                       <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                 </div>
                 <div className="absolute bottom-8 left-8">
                    <span className="px-3 py-1 rounded-full bg-fuchsia-500 text-xs font-bold uppercase text-white">Vaata treilerit</span>
                 </div>
              </div>
            </motion.div>
          </div>
          
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Kes on <span className="text-fuchsia-500">Kozip</span>?</h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                Kozip on loovagentuur ja sisuloojate kollektiiv, mis on välja kasvanud edukast Sisumaja projektist. Me ühendame tipptasemel videoproduktsiooni ja sotsiaalmeedia ekspertiisi.
              </p>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Meie eesmärk on aidata ettevõtetel jõuda oma sihtgrupini autentsel ja meeldejääval moel. Me teame, mis töötab TikTokis ja YouTube'is, sest me elame seal.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-3xl font-bold text-white mb-2">1M+</h4>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Igakuist vaatamist</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                   <h4 className="text-3xl font-bold text-white mb-2">100+</h4>
                   <p className="text-sm text-gray-400 uppercase tracking-wider">Õnnestunud koostööd</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF */}
      <section className="py-24 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">Fännid räägivad</h2>
            <p className="text-gray-400">Meil on kogukond, mis hoolib ja kaasa elab.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-900/50 p-8 rounded-2xl border border-white/5 hover:border-fuchsia-500/30 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-fuchsia-500 fill-current" />)}
                </div>
                <p className="text-gray-300 italic mb-6">"Teie sisu on lihtsalt nii äge ja inspireeriv! Ootan iga uut videot suure huviga."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700" />
                  <div>
                    <p className="font-bold text-sm text-white">Maria K.</p>
                    <p className="text-xs text-gray-500">Pikaajaline jälgija</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SERVICES DETAIL */}
      <div className="bg-neutral-950">
        
        {/* Service 1: YouTube */}
        <section id="youtube-service" className="py-32 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-6">
                  <Youtube className="w-4 h-4" /> YouTube
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Kas reklaam Kozipi YouTube'i kanalil oleks sulle kasulik?</h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  YouTube on koht, kus inimesed veedavad aega süvenenult. Meie videotesse integreeritud reklaam ei ole lihtsalt "segav faktor", vaid osa sisust, mida vaataja naudib.
                </p>
                <ul className="space-y-4 mb-10">
                  {["Kõrge vaatamismäär", "Pikaajaline nähtavus (SEO)", "Usaldusväärne soovitus"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-fuchsia-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-fuchsia-500 hover:text-white transition-all duration-300">
                  Võta ühendust <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Mock Portfolio items */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`rounded-xl overflow-hidden bg-neutral-900 border border-white/10 ${i === 2 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                     <div className="w-full h-full bg-neutral-800 animate-pulse" /> 
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service 2: Shorts */}
        <section id="shorts-service" className="py-32 border-b border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="order-2 lg:order-1 grid grid-cols-3 gap-4">
                 {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-neutral-900 border border-white/10 aspect-[9/16] transform hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-full h-full bg-neutral-800 animate-pulse" /> 
                  </div>
                ))}
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-6">
                  <Video className="w-4 h-4" /> Shorts & Reels
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Lühivideod, mis levivad kulutulena.</h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  TikTok, Instagram Reels ja YouTube Shorts on tänapäeva turunduse "must-have". Me teame, kuidas haarata tähelepanu esimese 3 sekundiga ja hoida seda lõpuni.
                </p>
                <p className="text-gray-500 mb-8">
                  Loome sisu, mis tundub loomulik ja mida inimesed tahavad jagada. Ei mingit igavat korporatiivset juttu.
                </p>
                <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300">
                  Küsi pakkumist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service 3: Training */}
        <section id="training-service" className="py-32 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-6">
                <Mic className="w-4 h-4" /> Koolitused
             </div>
             <h2 className="text-4xl md:text-5xl font-black mb-6 max-w-3xl mx-auto">Jagame oma teadmisi laval ja koolitusruumis.</h2>
             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
               Oleme esinenud suurimatel lavadel ja koolitanud ettevõtteid sisuloome teemadel.
             </p>
             
             {/* Carousel Placeholder */}
             <div className="relative max-w-4xl mx-auto aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 mb-12 group">
                <div className="absolute inset-0 flex items-center justify-center">
                   <p className="text-gray-600">Koolituste galerii karusell</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent text-left">
                   <h3 className="text-2xl font-bold text-white mb-2">Turunduskonverents 2025</h3>
                   <p className="text-gray-300">Rääkisime sellest, kuidas luua sisu, mis kõnetab noori...</p>
                </div>
             </div>

             <div className="flex flex-wrap justify-center gap-4">
                {["Sisuloome koolitus", "Õhtujuhtimine", "Sotsiaalmeedia strateegia", "Noorteturundus"].map((tag, i) => (
                   <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">{tag}</span>
                ))}
             </div>
             <div className="mt-12">
               <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-fuchsia-600 text-white font-bold rounded-full hover:bg-fuchsia-700 transition-all duration-300 shadow-lg shadow-fuchsia-900/50">
                  Kutsu meid esinema <Zap className="w-4 h-4" />
                </Link>
             </div>
          </div>
        </section>
      </div>

      {/* 7. CONTACT FORM */}
      <section id="contact" className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Alustame koostööd</h2>
            <p className="text-gray-400">Kirjuta meile oma ideest ja teeme selle teoks.</p>
          </div>

          <form className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold uppercase text-gray-400">Nimi</label>
                <input type="text" id="name" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" placeholder="Sinu nimi" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold uppercase text-gray-400">Email</label>
                <input type="email" id="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" placeholder="sinu@email.ee" />
              </div>
            </div>
            <div className="space-y-2 mb-8">
               <label htmlFor="message" className="text-sm font-bold uppercase text-gray-400">Sõnum</label>
               <textarea id="message" rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" placeholder="Kirjelda oma ideed või küsimust..."></textarea>
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-fuchsia-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
              Saada kiri <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 8. RECENT WORKS (Existing Component Reuse) */}
      <section className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black uppercase">Viimased tööd</h2>
            <Link href="/tehtud-tood" className="text-sm font-bold uppercase text-gray-400 hover:text-white flex items-center gap-2">
              Vaata kõiki <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block">
                  <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-fuchsia-500/50 transition-all duration-300">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">Pilt puudub</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-500 transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                Hetkel avalikud tööd puuduvad.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

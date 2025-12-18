import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, User, Play, Star, Zap, TrendingUp, Clapperboard, Users } from "lucide-react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import { Testimonial } from "@/components/Testimonial";
import * as motion from "framer-motion/client";

export const revalidate = 60;

type Project = Database['public']['Tables']['projects']['Row'];

async function getRecentProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return data || [];
}

const TEAM_MEMBERS = [
  { name: "Kris", role: "Sisulooja", image: "/Kris.jpg" },
  { name: "Gerhard", role: "Sisulooja", image: "/Gerhard.jpg" },
  { name: "Mihkel", role: "Sisulooja", image: "/Mihkel.jpg" },
  { name: "Maia-Liis", role: "Sisulooja", image: "/Maia-Liis.jpg" },
  { name: "Aston", role: "Sisulooja", image: "/Aston.jpg" },
  { name: "Gepu", role: "Sisulooja", image: "/Gepu.jpg" },
];

const FEATURES = [
  {
    icon: <Clapperboard className="w-6 h-6 text-primary" />,
    title: "Sisumaja kanal",
    description: "Loome iganädalaselt koos videoid Sisumaja YouTube’i kanalile.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Kogukond",
    description: "Kaasame teisi sisuloojaid ning arendame sisuloome maastikku kõigi heaks.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: "Efektiivne turundus",
    description: "Reklaamime oma videotes brände, kelle väärtused ühtivad meie omadega.",
  },
];

export default async function Home() {
  const recentProjects = await getRecentProjects();

  const titleText = "SISUMAJA";

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
        
        {/* Grain Overlay - adds texture to prevent banding and "cheap" look */}
        <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
        />

        {/* Abstract Background Elements - Animated */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4], 
              x: [-50, 50, -50],
              y: [-20, 20, -20]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 -left-64 w-[800px] h-[800px] bg-purple-600/40 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.8, 0.4],
              x: [50, -50, 50],
              y: [20, -50, 20]
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2 
            }}
            className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-blue-600/40 rounded-full blur-[100px]" 
          />
          {/* Third subtle orb for depth */}
           <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-fuchsia-500/20 rounded-full blur-[130px]" 
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Eesti esimene creatorhouse
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9] flex justify-center overflow-hidden">
            {/* Split text animation for "Sisu" */}
            {"Sisu".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.33, 1, 0.68, 1],
                  delay: index * 0.05 + 0.2 
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {/* "maja" as a single block to preserve gradient */}
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.33, 1, 0.68, 1],
                delay: 4 * 0.05 + 0.2 // Delay after "Sisu"
              }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600"
            >
              maja
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Pakume uuenduslikku meelelahutust Eesti rahvale ning efektiivset turunduskanalit meiega resoneeruvatele ettevõtele.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href="/kontakt" 
              className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative uppercase tracking-wide text-sm flex items-center gap-2">
                Võta ühendust <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link 
              href="/tehtud-tood" 
              className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all hover:scale-105 active:scale-95 uppercase tracking-wide text-sm flex items-center gap-2"
            >
              Vaata tehtud töid
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="mt-16 text-left"
          >
            <Testimonial 
              quote="Sisumajaga koostöö on nagu hea ilutulestik. Põnev alustada, särab eredalt keskel ja lõppeb alati imeilusalt. Nooruslik energia annab iga ettevõtte sisule kohe kindlasti palju juurde!"
              author="Carl"
              role="Tegevjuht"
              company="Koostööpartner"
              className="mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Intro / Features Section */}
      <section className="py-32 bg-neutral-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 uppercase tracking-tight leading-none">
                Mitte lihtsalt <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">üks kanal</span>, vaid <br/>
                kogukond.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Sisumajja on kokku kolinud 6 andekat sisuloojat, kes elavad ja loovad sisu koos 24/7. Meie eesmärk on pakkuda Eesti rahvale uut ja ägedat seltskondlikku meelelahutust ning arendada Eesti sisuloome maastikku paremaks kõikidele.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                   <div className="text-4xl font-bold text-white mb-2">6+</div>
                   <div className="text-gray-500 text-sm uppercase tracking-wider">Sisuloojat</div>
                </div>
                <div>
                   <div className="text-4xl font-bold text-white mb-2">40+ AASTAT</div>
                   <div className="text-gray-500 text-sm uppercase tracking-wider">kogemust sotsiaalmeedias kokku</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 relative">
                 <Image 
                   src="/sisumaja-elu.jpg"
                   alt="Sisumaja elu"
                   fill
                   className="object-cover"
                   priority
                 />
                 {/* Decorative elements */}
                 <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors duration-300">
                <div className="bg-neutral-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 uppercase">Sisumaja Liikmed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Saa tuttavaks Sisumaja tuumikuga.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="group relative">
                <div className="aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-neutral-800 group-hover:border-primary transition-all duration-300 relative">
                  {member.image ? (
                    <Image 
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-800 group-hover:text-primary transition-colors">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     <p className="text-white font-bold text-sm">{member.name}</p>
                     <p className="text-primary text-xs uppercase tracking-wider">{member.role}</p>
                  </div>
                </div>
                <div className="text-center lg:hidden">
                   <h3 className="text-white font-bold text-sm">{member.name}</h3>
                   <p className="text-gray-500 text-xs uppercase tracking-wider">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="py-32 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
               <h2 className="text-5xl font-black text-white mb-4 uppercase">Viimased tööd</h2>
               <p className="text-gray-400 text-lg">Siin näed viimaseid koostöid brändidega.</p>
            </div>
            <Link 
              href="/tehtud-tood" 
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-wide text-sm font-bold group"
            >
              Vaata kõiki <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block">
                  <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative border border-white/5 group-hover:border-primary/50 transition-all duration-500">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">Pilt puudub</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold uppercase tracking-widest border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">Vaata lähemalt</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-500 line-clamp-2">{project.description}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p>Hetkel avalikud tööd puuduvad.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

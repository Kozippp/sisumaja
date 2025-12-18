import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, User, Play, Star, Zap, TrendingUp } from "lucide-react";
import { Database } from "@/types/database.types";

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
  { name: "Liige 1", role: "Sisulooja", image: null },
  { name: "Liige 2", role: "Sisulooja", image: null },
  { name: "Liige 3", role: "Sisulooja", image: null },
  { name: "Liige 4", role: "Sisulooja", image: null },
  { name: "Liige 5", role: "Sisulooja", image: null },
  { name: "Liige 6", role: "Sisulooja", image: null },
];

const FEATURES = [
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    title: "Tipptasemel Sisu",
    description: "Loome sisu, mis ei jäta kedagi külmaks. Kvaliteet on meie visiitkaart.",
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Kiire Teostus",
    description: "Ideest teostuseni vaid loetud päevadega. Oleme paindlikud ja kiired.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: "Lai Haare",
    description: "Meie sisu jõuab sadade tuhandete eestlasteni iga kuu.",
  },
];

export default async function Home() {
  const recentProjects = await getRecentProjects();

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black" />
          {/* Placeholder for Video Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <div className="text-neutral-800 text-[20vw] font-black uppercase tracking-tighter select-none">Sisumaja</div>
          </div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Eesti esimene creatorhouse
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
            Sisu<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">maja</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Sisumaja pakub uuenduslikku meelelahutust Eesti rahvale ning efektiivset turunduskanalit ettevõtele, kelle väärtused kattuvad meie omadega.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
              <Play className="w-4 h-4 fill-current" /> Vaata videot
            </Link>
          </div>
        </div>
      </section>

      {/* Intro / Features Section */}
      <section className="py-32 bg-neutral-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 uppercase tracking-tight leading-none">
                Mitte lihtsalt <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">kodu</span>, vaid <br/>
                stuudio.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Sisumaja on unikaalne projekt Eesti meelelahutusmaastikul. Oleme kokku toonud 6 andekat sisuloojat, kes elavad ja loovad koos 24/7. See on keskkond, kus sünnivad ideed, mis levivad kulutulena.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                   <div className="text-4xl font-bold text-white mb-2">6+</div>
                   <div className="text-gray-500 text-sm uppercase tracking-wider">Sisuloojat</div>
                </div>
                <div>
                   <div className="text-4xl font-bold text-white mb-2">1M+</div>
                   <div className="text-gray-500 text-sm uppercase tracking-wider">Igakuist vaatamist</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 relative">
                 <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    <span className="text-neutral-700 font-bold text-xl uppercase">Sisumaja Elu</span>
                 </div>
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
            <h2 className="text-5xl font-black text-white mb-6 uppercase">Meie Tiim</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Saa tuttavaks nägudega kaamera taga (ja ees).
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="group relative">
                <div className="aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-neutral-800 group-hover:border-primary transition-all duration-300 relative">
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-800 group-hover:text-primary transition-colors">
                    <User className="w-16 h-16" />
                  </div>
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
               <p className="text-gray-400 text-lg">Vaata, mida oleme hiljuti korda saatnud</p>
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

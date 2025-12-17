import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Database } from "@/types/database.types";

export const revalidate = 60; // Revalidate every 60 seconds

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
  { name: "Liige 1", role: "Sisulooja", image: "/placeholder-user.jpg" },
  { name: "Liige 2", role: "Sisulooja", image: "/placeholder-user.jpg" },
  { name: "Liige 3", role: "Sisulooja", image: "/placeholder-user.jpg" },
  { name: "Liige 4", role: "Sisulooja", image: "/placeholder-user.jpg" },
  { name: "Liige 5", role: "Sisulooja", image: "/placeholder-user.jpg" },
  { name: "Liige 6", role: "Sisulooja", image: "/placeholder-user.jpg" },
];

export default async function Home() {
  const recentProjects = await getRecentProjects();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        {/* Placeholder for Video Background */}
        <div className="absolute inset-0 bg-neutral-900 opacity-50 z-0 flex items-center justify-center">
            <span className="text-neutral-700 font-bold text-4xl transform -rotate-12">VIDEO TAUST</span>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase">
            Sisu<span className="text-primary">maja</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Eesti esimene creatorhouse. 6 sisuloojat, üks katusealune, lõputu meelelahutus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/kontakt" 
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-fuchsia-700 transition-all uppercase tracking-wide text-sm"
            >
              Võta ühendust
            </Link>
            <Link 
              href="/tehtud-tood" 
              className="px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-wide text-sm"
            >
              Vaata töid
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 uppercase">Mis on Sisumaja?</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Sisumaja on unikaalne projekt Eesti meelelahutusmaastikul. Oleme kokku toonud 6 andekat sisuloojat, kes elavad ja loovad koos.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Meie eesmärk on pakkuda brändidele ja fännidele autentset, lõbusat ja professionaalset sisu. Teeme koostööd Eesti suurimate ettevõtetega ja loome kampaaniaid, mis kõnetavad.
              </p>
            </div>
            <div className="aspect-video bg-neutral-800 rounded-2xl flex items-center justify-center border border-neutral-700">
               <span className="text-gray-500">Tutvustav pilt või video</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-16 text-center uppercase">Meie Tiim</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="group relative">
                <div className="aspect-[3/4] bg-neutral-900 rounded-xl overflow-hidden mb-4 border border-neutral-800 group-hover:border-primary transition-colors">
                  {/* Placeholder for image */}
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-700">
                    <User className="w-20 h-20" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-primary text-sm uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="py-24 bg-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-bold text-white mb-2 uppercase">Viimased tööd</h2>
               <p className="text-gray-400">Vaata, mida oleme hiljuti teinud</p>
            </div>
            <Link href="/tehtud-tood" className="hidden md:flex items-center text-primary hover:text-fuchsia-400 transition-colors">
              Vaata kõiki <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block">
                  <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-4 relative border border-neutral-800 group-hover:border-primary transition-all">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">Pilt puudub</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest border border-white px-4 py-2 rounded-full">Vaata lähemalt</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">{project.description}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500 bg-neutral-900/30 rounded-xl border border-dashed border-neutral-800">
                <p>Hetkel avalikud tööd puuduvad.</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/tehtud-tood" className="inline-flex items-center text-primary hover:text-fuchsia-400 transition-colors">
              Vaata kõiki <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

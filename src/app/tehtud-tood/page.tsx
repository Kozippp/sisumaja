import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from "next";
import { Database } from "@/types/database.types";
import { ArrowUpRight, Calendar } from "lucide-react";

type Project = Database['public']['Tables']['projects']['Row'];

export const metadata: Metadata = {
  title: "Tehtud tööd | Sisumaja",
  description: "Vaata Sisumaja tehtud töid ja koostööprojekte.",
};

export const revalidate = 60;

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("published_at", { ascending: false });
  return data || [];
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter">Tehtud tööd</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Siin näed kellega ja kuidas oleme brändidega koostööd teinud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link key={project.id} href={`/tehtud-tood/${project.slug}`} className="group block h-full">
                <article className="flex flex-col h-full">
                  <div className="aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative border border-white/5 group-hover:border-primary/50 transition-all duration-500">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 bg-neutral-900">
                        <span className="uppercase tracking-widest text-sm">Pilt puudub</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-gray-500 line-clamp-2 leading-relaxed mb-3">{project.description}</p>
                    {project.collaboration_completed_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Completed {new Date(project.collaboration_completed_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))
          ) : (
             <div className="col-span-3 text-center py-32 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <h3 className="text-2xl font-bold text-white mb-2">Töid ei leitud</h3>
                <p>Hetkel avalikud tööd puuduvad. Tule varsti tagasi!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tehtud tööd | Sisumaja",
  description: "Vaata Sisumaja tehtud töid ja koostööprojekte.",
};

export const revalidate = 60;

async function getProjects() {
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
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Tehtud tööd</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Oleme teinud koostööd paljude ägedate brändidega. Siin on valik meie lemmikutest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
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
             <div className="col-span-3 text-center py-24 text-gray-500 bg-neutral-900/30 rounded-xl border border-dashed border-neutral-800">
                <p className="text-xl">Hetkel avalikud tööd puuduvad.</p>
                <p className="text-sm mt-2">Tule varsti tagasi!</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}


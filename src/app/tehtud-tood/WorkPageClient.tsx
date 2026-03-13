'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, Youtube, Clapperboard, GraduationCap, Mic } from "lucide-react";
import { Database } from "@/types/database.types";

type Project = Database['public']['Tables']['projects']['Row'];
type FilterType = 'all' | 'youtube_ad' | 'shorts' | 'training';

const TYPE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  youtube_ad: { label: 'YouTube reklaam', icon: Youtube, color: 'text-red-400 bg-red-500/10' },
  shorts: { label: 'Lühivideo koostöö', icon: Clapperboard, color: 'text-blue-400 bg-blue-500/10' },
  training: { label: 'Koolitus / Üritus', icon: GraduationCap, color: 'text-green-400 bg-green-500/10' },
};

const FILTER_ACTIVE_STYLES: Record<FilterType, string> = {
  all: 'bg-white border-white text-black',
  youtube_ad: 'bg-red-500 border-red-500 text-white',
  shorts: 'bg-blue-500 border-blue-500 text-white',
  training: 'bg-green-500 border-green-500 text-white',
};

interface WorkPageClientProps {
  projects: Project[];
}

export default function WorkPageClient({ projects }: WorkPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.project_type === activeFilter);

  const counts = {
    all: projects.length,
    youtube_ad: projects.filter(p => p.project_type === 'youtube_ad').length,
    shorts: projects.filter(p => p.project_type === 'shorts').length,
    training: projects.filter(p => p.project_type === 'training').length,
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[56px] md:text-[56px] font-black text-white mb-0 uppercase tracking-tighter">Tehtud tööd</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Siin näed, mis brändidega ja kuidas oleme koostööd teinud.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-12">
          {([
            { value: 'all', label: 'Kõik tööd', icon: null },
            { value: 'youtube_ad', label: 'YouTube reklaam', icon: Youtube },
            { value: 'shorts', label: 'Lühivideod', icon: Clapperboard },
            { value: 'training', label: 'Esinemised', icon: Mic },
          ] as { value: FilterType; label: string; icon: React.ElementType | null }[]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeFilter === value
                  ? FILTER_ACTIVE_STYLES[value]
                  : 'bg-transparent border-neutral-700 text-gray-400 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${
                activeFilter === value
                  ? value === 'all' ? 'bg-black/15 text-black' : 'bg-white/25 text-white'
                  : 'bg-neutral-800 text-gray-500'
              }`}>
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map((project) => {
              const typeInfo = project.project_type ? TYPE_LABELS[project.project_type] : null;
              const TypeIcon = typeInfo?.icon;
              return (
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
                      {typeInfo && TypeIcon && (
                        <div className={`absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${typeInfo.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                      </div>
                      <p className="text-gray-500 line-clamp-2 leading-relaxed mb-3">{project.description}</p>
                      {project.collaboration_completed_at && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>Valminud {new Date(project.collaboration_completed_at).toLocaleDateString('et-EE', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-32 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">Töid ei leitud</h3>
              <p>Selles kategoorias pole hetkel avalikke töid. Tule varsti tagasi!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

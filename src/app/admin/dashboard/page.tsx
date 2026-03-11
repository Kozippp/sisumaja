'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Users, TrendingUp, Youtube, MessageSquare, Video, BarChart3, GraduationCap, Clapperboard, ImageIcon } from 'lucide-react';
import { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

type ProjectType = 'all' | 'youtube_ad' | 'shorts' | 'training';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [typeFilter, setTypeFilter] = useState<ProjectType>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchProjects();
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Oled kindel, et soovid seda tööd kustutada? See peidetakse ka avalikust "Tehtud tööd" vaatest.')) {
      const { error } = await supabase
        .from('projects')
        .update({ is_visible: false })
        .eq('id', id);

      if (error) {
        alert('Töö kustutamine ebaõnnestus: ' + error.message);
        return;
      }

      fetchProjects();
    }
  };

  const toggleVisibility = async (project: Project) => {
    await supabase
      .from('projects')
      .update({ is_visible: !project.is_visible })
      .eq('id', project.id);
    fetchProjects();
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
          <h1 className="text-3xl font-bold text-white uppercase">Admin Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
            <Link 
              href="/admin/social-stats" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Statistika
            </Link>
            <Link 
              href="/admin/clients" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Klientide logod
            </Link>
            <Link 
              href="/admin/featured-videos" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <Youtube className="w-4 h-4 mr-2" />
              YouTube Videod
            </Link>
            <Link 
              href="/admin/shorts-videos" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <Video className="w-4 h-4 mr-2" />
              Lühivideod
            </Link>
            <Link 
              href="/admin/youtube-ad-videos" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <Video className="w-4 h-4 mr-2" />
              YouTube Reklaam
            </Link>
            <Link 
              href="/admin/testimonials" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Tagasiside
            </Link>
            <Link 
              href="/admin/retention-images" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Retention Pildid
            </Link>
            <Link 
              href="/admin/image-optimizer" 
              className="bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 hover:text-white transition-colors flex items-center text-sm"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Optimizer
            </Link>
            <Link 
              href="/admin/new" 
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Lisa uus töö
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-neutral-900 text-gray-400 px-4 py-2 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors flex items-center text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logi välja
            </button>
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { value: 'all', label: 'Kõik', icon: null },
            { value: 'youtube_ad', label: 'YouTube reklaam', icon: Youtube },
            { value: 'shorts', label: 'Lühivideo koostöö', icon: Clapperboard },
            { value: 'training', label: 'Koolitused', icon: GraduationCap },
          ].map(({ value, label, icon: Icon }) => {
            const count = value === 'all' ? projects.length : projects.filter(p => (p as Project & { project_type?: string }).project_type === value).length;
            return (
              <button
                key={value}
                onClick={() => setTypeFilter(value as ProjectType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  typeFilter === value
                    ? 'bg-primary text-white'
                    : 'bg-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeFilter === value ? 'bg-white/20' : 'bg-neutral-700'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 text-gray-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Pealkiri</th>
                <th className="px-6 py-4 font-medium">Tüüp</th>
                <th className="px-6 py-4 font-medium">Klient</th>
                <th className="px-6 py-4 font-medium">Staatus</th>
                <th className="px-6 py-4 font-medium text-right">Tegevused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {projects
                .filter(p => typeFilter === 'all' || (p as Project & { project_type?: string }).project_type === typeFilter)
                .map((project) => {
                  const pt = (project as Project & { project_type?: string }).project_type;
                  return (
                    <tr key={project.id} className="text-gray-300 hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                      <td className="px-6 py-4">
                        {pt === 'youtube_ad' && <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full w-fit"><Youtube className="w-3 h-3" /> YouTube</span>}
                        {pt === 'shorts' && <span className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded-full w-fit"><Clapperboard className="w-3 h-3" /> Lühivideo</span>}
                        {pt === 'training' && <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full w-fit"><GraduationCap className="w-3 h-3" /> Koolitus</span>}
                        {!pt && <span className="text-xs text-gray-600">-</span>}
                      </td>
                      <td className="px-6 py-4">{project.client_name || '-'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleVisibility(project)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            project.is_visible 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                              : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          }`}
                        >
                          {project.is_visible ? (
                            <><Eye className="w-3 h-3" /> Avalik</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Peidetud</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/edit/${project.id}`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {projects.filter(p => typeFilter === 'all' || (p as Project & { project_type?: string }).project_type === typeFilter).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Ühtegi tööd pole selles kategoorias lisatud.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


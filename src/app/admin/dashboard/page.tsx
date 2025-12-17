'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Oled kindel, et soovid seda tööd kustutada?')) {
      await supabase.from('projects').delete().eq('id', id);
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
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white uppercase">Admin Dashboard</h1>
          <div className="flex gap-4">
             <Link 
              href="/admin/new" 
              className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Lisa uus töö
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-neutral-900 text-gray-400 px-4 py-2 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logi välja
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 text-gray-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Pealkiri</th>
                <th className="px-6 py-4 font-medium">Klient</th>
                <th className="px-6 py-4 font-medium">Staatus</th>
                <th className="px-6 py-4 font-medium text-right">Tegevused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {projects.map((project) => (
                <tr key={project.id} className="text-gray-300 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{project.title}</td>
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
                       {/* Note: Edit page not implemented yet, linking to # */}
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
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Ühtegi tööd pole veel lisatud.
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


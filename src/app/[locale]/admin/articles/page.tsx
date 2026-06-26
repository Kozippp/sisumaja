'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, ExternalLink } from 'lucide-react';
import { Database } from '@/types/database.types';

type Article = Database['public']['Tables']['articles']['Row'];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);
  const router = useRouter();

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      // Tabel võib veel puududa, kui migratsiooni pole rakendatud
      setTableMissing(true);
    } else {
      setArticles(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin/login'); return; }
      fetchArticles();
    };
    checkUser();
  }, [router]);

  const togglePublished = async (a: Article) => {
    await supabase
      .from('articles')
      .update({
        is_published: !a.is_published,
        published_at: !a.is_published && !a.published_at ? new Date().toISOString() : a.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', a.id);
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Kustutada see artikkel jäädavalt?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) { alert('Kustutamine ebaõnnestus: ' + error.message); return; }
      fetchArticles();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Tagasi töölauale
        </Link>

        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-white uppercase">Artiklid</h1>
          <Link href="/admin/articles/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" /> Uus artikkel
          </Link>
        </div>

        {tableMissing && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-lg text-sm mb-6">
            Artiklite tabelit pole veel andmebaasis. Rakenda migratsioon
            <code className="mx-1 px-1 bg-black/40 rounded">supabase/migrations/create_articles_table.sql</code>
            (Supabase SQL editoris või CLI-ga), seejärel värskenda lehte.
          </div>
        )}

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-950 text-gray-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Pealkiri</th>
                <th className="px-6 py-4 font-medium">Staatus</th>
                <th className="px-6 py-4 font-medium text-right">Tegevused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {articles.map((a) => (
                <tr key={a.id} className="text-gray-300 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{a.title}</div>
                    <div className="text-xs text-gray-600">/artiklid/{a.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(a)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        a.is_published
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}
                    >
                      {a.is_published ? <><Eye className="w-3 h-3" /> Avaldatud</> : <><EyeOff className="w-3 h-3" /> Mustand</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {a.is_published && (
                        <a href={`/artiklid/${a.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link href={`/admin/articles/${a.id}`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && !tableMissing && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Ühtegi artiklit pole veel lisatud.
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

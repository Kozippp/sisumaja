'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import { Database } from '@/types/database.types';

type SocialStats = Database['public']['Tables']['social_stats']['Row'];

export default function SocialStatsPage() {
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [followers, setFollowers] = useState('');
  const [views, setViews] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      fetchStats();
    };
    checkUser();
  }, [router]);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('social_stats')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setStats(data);
      setFollowers(data.followers);
      setViews(data.views);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!stats) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('social_stats')
      .update({
        followers,
        views,
        updated_at: new Date().toISOString()
      })
      .eq('id', stats.id);

    if (error) {
      alert('Viga salvestamisel: ' + error.message);
    } else {
      alert('Statistika edukalt uuendatud!');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <Link 
              href="/admin/dashboard" 
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tagasi Dashboard'i
            </Link>
            <h1 className="text-3xl font-bold text-white uppercase flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-fuchsia-500" />
              Sotsiaalmeedia Statistika
            </h1>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8">
          <p className="text-gray-400 mb-8">
            Siin saad muuta avalikul lehel kuvatavat jälgijate ja vaatamiste arvu.
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="followers" className="block text-sm font-medium text-gray-300 mb-2">
                Jälgijate arv
              </label>
              <input
                type="text"
                id="followers"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-fuchsia-500 transition-colors"
                placeholder="nt. 15.4K"
              />
              <p className="text-sm text-gray-500 mt-2">
                Näide: 15.4K, 20K, 25.5K
              </p>
            </div>

            <div>
              <label htmlFor="views" className="block text-sm font-medium text-gray-300 mb-2">
                Vaatamiste arv
              </label>
              <input
                type="text"
                id="views"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-fuchsia-500 transition-colors"
                placeholder="nt. 1M+"
              />
              <p className="text-sm text-gray-500 mt-2">
                Näide: 1M+, 500K, 2.5M+
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-fuchsia-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvestan...' : 'Salvesta muudatused'}
            </button>
          </div>

          {stats && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-neutral-800">
              <p className="text-xs text-gray-500">
                Viimati uuendatud: {new Date(stats.updated_at).toLocaleString('et-EE')}
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="mt-12 bg-neutral-900 rounded-xl border border-neutral-800 p-8">
          <h2 className="text-xl font-bold text-white mb-6 uppercase">Eelvaade</h2>
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 pr-10 rounded-3xl flex items-center gap-6 inline-flex">
            {/* Profile Picture with Story Ring */}
            <div className="relative">
              <div className="absolute -inset-[3px] bg-gradient-to-tr from-yellow-500 via-fuchsia-500 to-purple-600 rounded-full opacity-100"></div>
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-black bg-neutral-800">
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">@Kozip_Eesti</h3>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-3">Digital Creator</p>
              
              {/* Stats */}
              <div className="flex items-center gap-8 text-base">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-2xl">{followers || '15.4K'}</span>
                  <span className="text-gray-500 text-sm">Jälgijaid</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-2xl">{views || '1M+'}</span>
                  <span className="text-gray-500 text-sm">Vaatamisi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

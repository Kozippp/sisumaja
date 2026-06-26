'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

/** Lihtne slug-generaator pealkirjast (täpitähed -> ascii). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/õ/g, 'o').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/š/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

type FormState = {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  cover_image_url: string;
  is_published: boolean;
  published_at: string;
};

const empty: FormState = {
  slug: '', title: '', title_en: '', excerpt: '', excerpt_en: '',
  content: '', content_en: '', cover_image_url: '', is_published: false, published_at: '',
};

export default function ArticleForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const load = useCallback(async () => {
    if (!articleId) return;
    const { data, error } = await supabase.from('articles').select('*').eq('id', articleId).single();
    if (error) { setError(error.message); setLoading(false); return; }
    if (data) {
      setForm({
        slug: data.slug ?? '',
        title: data.title ?? '',
        title_en: data.title_en ?? '',
        excerpt: data.excerpt ?? '',
        excerpt_en: data.excerpt_en ?? '',
        content: data.content ?? '',
        content_en: data.content_en ?? '',
        cover_image_url: data.cover_image_url ?? '',
        is_published: !!data.is_published,
        published_at: data.published_at ? data.published_at.slice(0, 10) : '',
      });
      setSlugTouched(true);
    }
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin/login'); return; }
      load();
    };
    checkUser();
  }, [router, load]);

  const handleTitle = (value: string) => {
    set('title', value);
    if (!slugTouched && !articleId) set('slug', slugify(value));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!form.title.trim() || !form.slug.trim()) {
      setError('Pealkiri ja slug on kohustuslikud.');
      setSaving(false);
      return;
    }

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      title_en: form.title_en.trim() || null,
      excerpt: form.excerpt.trim() || null,
      excerpt_en: form.excerpt_en.trim() || null,
      content: form.content || null,
      content_en: form.content_en || null,
      cover_image_url: form.cover_image_url.trim() || null,
      is_published: form.is_published,
      // kui avaldatud aga kuupäev puudu, pane praegune; muidu vali väli
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : form.is_published
          ? new Date().toISOString()
          : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = articleId
      ? await supabase.from('articles').update(payload).eq('id', articleId)
      : await supabase.from('articles').insert(payload);

    if (error) {
      setError('Salvestamine ebaõnnestus: ' + error.message);
      setSaving(false);
      return;
    }
    router.push('/admin/articles');
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Laen...</div>;
  }

  const inputCls = 'w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors';
  const labelCls = 'block text-sm font-medium text-gray-400 mb-2';

  return (
    <div className="min-h-screen bg-black pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Tagasi artiklite juurde
        </Link>
        <h1 className="text-3xl font-bold text-white uppercase mb-8">
          {articleId ? 'Muuda artiklit' : 'Uus artikkel'}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className={labelCls}>Pealkiri (eesti) *</label>
            <input className={inputCls} value={form.title} onChange={(e) => handleTitle(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Pealkiri (inglise)</label>
            <input className={inputCls} value={form.title_en} onChange={(e) => set('title_en', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
              required
            />
            <p className="text-xs text-gray-600 mt-1">/artiklid/{form.slug || '...'}</p>
          </div>
          <div>
            <label className={labelCls}>Sissejuhatus / kokkuvõte (eesti)</label>
            <textarea className={inputCls} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Sissejuhatus / kokkuvõte (inglise)</label>
            <textarea className={inputCls} rows={2} value={form.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Sisu (eesti)</label>
            <textarea className={`${inputCls} font-mono text-sm`} rows={16} value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Kirjuta artikkel siia. Lõigud eralda tühja reaga. ## alustab vahepealkirja." />
          </div>
          <div>
            <label className={labelCls}>Sisu (inglise)</label>
            <textarea className={`${inputCls} font-mono text-sm`} rows={16} value={form.content_en} onChange={(e) => set('content_en', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Kaanepildi URL</label>
            <input className={inputCls} value={form.cover_image_url} onChange={(e) => set('cover_image_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-3 text-white">
              <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="w-5 h-5 accent-fuchsia-600" />
              Avaldatud (nähtav avalikult)
            </label>
            <div className="flex-1">
              <label className={labelCls}>Avaldamise kuupäev</label>
              <input type="date" className={inputCls} value={form.published_at} onChange={(e) => set('published_at', e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-fuchsia-700 transition-colors uppercase tracking-wide disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvestan...' : 'Salvesta'}
          </button>
        </form>
      </div>
    </div>
  );
}

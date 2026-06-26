import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export type Article = Database['public']['Tables']['articles']['Row'];

/** Lokaliseeritud vaade artiklist (valib et/en väljad). */
export type LocalizedArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  updated_at: string | null;
};

export function localizeArticle(a: Article, locale: string): LocalizedArticle {
  const en = locale === 'en';
  return {
    slug: a.slug,
    title: (en && a.title_en) || a.title,
    excerpt: (en && a.excerpt_en) || a.excerpt,
    content: (en && a.content_en) || a.content,
    cover_image_url: a.cover_image_url,
    published_at: a.published_at,
    updated_at: a.updated_at,
  };
}

/** Kõik avaldatud artiklid (uuemad ees). Tagastab tühja massiivi, kui tabelit pole. */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

/** Üks avaldatud artikkel slug'i järgi, või null. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single<Article>();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/** Hinnanguline lugemisaeg minutites (~200 sõna/min). */
export function readingMinutes(content: string | null | undefined): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

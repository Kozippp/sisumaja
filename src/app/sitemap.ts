import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600; // uuenda sitemap'i kord tunnis

/**
 * Dünaamiline sitemap.xml — staatilised lehed + kõik nähtavad tehtud tööd
 * ja artiklid. Iga uus case study / artikkel ilmub siia automaatselt.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/koostoo'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/tehtud-tood'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/artiklid'), changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/kontakt'), changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/privaatsuspoliitika'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/kasutustingimused'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/kupsiste-poliitika'), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Tehtud tööd
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('is_visible', true);
    projectRoutes = (data ?? []).map((p) => ({
      url: absoluteUrl(`/tehtud-tood/${p.slug}`),
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // ignoreeri — sitemap toimib ka ilma projektideta
  }

  // Artiklid (tabel võib veel puududa enne migratsiooni — siis lihtsalt jäetakse vahele)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('is_published', true);
    if (!error) {
      articleRoutes = (data ?? []).map((a) => ({
        url: absoluteUrl(`/artiklid/${a.slug}`),
        lastModified: a.updated_at
          ? new Date(a.updated_at)
          : a.published_at
            ? new Date(a.published_at)
            : undefined,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch {
    // tabel puudub veel — ok
  }

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}

import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { absoluteUrl, localePath } from '@/lib/site';

export const revalidate = 3600; // uuenda sitemap'i kord tunnis

/** Üks sitemap-kirje koos hreflang-alternatiividega (et + en). */
function entry(
  path: string,
  opts: { changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number; lastModified?: Date } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(localePath(path, 'et')),
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        et: absoluteUrl(localePath(path, 'et')),
        en: absoluteUrl(localePath(path, 'en')),
      },
    },
  };
}

/**
 * Dünaamiline sitemap.xml — staatilised lehed + kõik nähtavad tehtud tööd
 * ja artiklid, mõlemas keeles (et + en) hreflang-linkidega.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', { changeFrequency: 'weekly', priority: 1 }),
    entry('/koostoo', { changeFrequency: 'monthly', priority: 0.9 }),
    entry('/tehtud-tood', { changeFrequency: 'weekly', priority: 0.8 }),
    entry('/artiklid', { changeFrequency: 'weekly', priority: 0.7 }),
    entry('/kontakt', { changeFrequency: 'yearly', priority: 0.6 }),
    entry('/privaatsuspoliitika', { changeFrequency: 'yearly', priority: 0.2 }),
    entry('/kasutustingimused', { changeFrequency: 'yearly', priority: 0.2 }),
    entry('/kupsiste-poliitika', { changeFrequency: 'yearly', priority: 0.2 }),
  ];

  // Tehtud tööd
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('is_visible', true);
    projectRoutes = (data ?? []).map((p) =>
      entry(`/tehtud-tood/${p.slug}`, {
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      }),
    );
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
      articleRoutes = (data ?? []).map((a) =>
        entry(`/artiklid/${a.slug}`, {
          lastModified: a.updated_at
            ? new Date(a.updated_at)
            : a.published_at
              ? new Date(a.published_at)
              : undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        }),
      );
    }
  } catch {
    // tabel puudub veel — ok
  }

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}

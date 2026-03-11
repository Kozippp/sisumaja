/**
 * Utilities for the image optimizer admin page.
 * Parses Supabase storage URLs and extracts bucket/path.
 */

const SUPABASE_STORAGE_PATTERN = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export function parseSupabaseStorageUrl(url: string): { bucket: string; path: string } | null {
  try {
    const match = url.match(SUPABASE_STORAGE_PATTERN);
    if (!match) return null;
    return { bucket: match[1], path: match[2] };
  } catch {
    return null;
  }
}

export function isOurSupabaseImage(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return SUPABASE_STORAGE_PATTERN.test(url) && url.includes('supabase.co');
}

export type ImageSource = {
  table: string;
  rowId: string;
  column: string;
  label: string;
};

export type ImageEntry = {
  url: string;
  bucket: string;
  path: string;
  sources: ImageSource[];
  isOptimized: boolean; // .webp in path or already webp
};

function addImage(
  entries: Map<string, ImageEntry>,
  url: string,
  source: ImageSource
) {
  const parsed = parseSupabaseStorageUrl(url);
  if (!parsed) return;

  const key = url;
  const existing = entries.get(key);
  const isOptimized = url.toLowerCase().endsWith('.webp');

  if (existing) {
    existing.sources.push(source);
  } else {
    entries.set(key, {
      url,
      bucket: parsed.bucket,
      path: parsed.path,
      sources: [source],
      isOptimized,
    });
  }
}

type Row = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function collectAllImages(sb: any): Promise<ImageEntry[]> {
  const entries = new Map<string, ImageEntry>();

  const { data: projects } = await sb.from('projects').select('id, title, thumbnail_url, client_avatar_url, media_gallery, content');
  if (projects) {
    for (const p of projects) {
      const id = String(p.id ?? '');
      const title = String(p.title ?? '');
      if (p.thumbnail_url) addImage(entries, String(p.thumbnail_url), { table: 'projects', rowId: id, column: 'thumbnail_url', label: `Project: ${title}` });
      if (p.client_avatar_url) addImage(entries, String(p.client_avatar_url), { table: 'projects', rowId: id, column: 'client_avatar_url', label: `Project: ${title}` });
      if (Array.isArray(p.media_gallery)) {
        for (const u of p.media_gallery) if (u) addImage(entries, String(u), { table: 'projects', rowId: id, column: 'media_gallery', label: `Project: ${title}` });
      }
      if (Array.isArray(p.content)) {
        for (const block of p.content as Row[]) {
          if (block?.mediaUrl) addImage(entries, String(block.mediaUrl), { table: 'projects', rowId: id, column: 'content', label: `Project: ${title}` });
          if (block?.thumbnailUrl) addImage(entries, String(block.thumbnailUrl), { table: 'projects', rowId: id, column: 'content', label: `Project: ${title}` });
          if (Array.isArray(block?.mediaItems)) {
            for (const u of block.mediaItems) if (u) addImage(entries, String(u), { table: 'projects', rowId: id, column: 'content', label: `Project: ${title}` });
          }
        }
      }
    }
  }

  const { data: retention } = await sb.from('retention_images').select('id, title, image_url');
  if (retention) {
    for (const r of retention) {
      if (r.image_url) addImage(entries, String(r.image_url), { table: 'retention_images', rowId: String(r.id), column: 'image_url', label: `Retention: ${r.title ?? ''}` });
    }
  }

  const { data: testimonials } = await sb.from('testimonials').select('id, content, image_url');
  if (testimonials) {
    for (const t of testimonials) {
      if (t.image_url) addImage(entries, String(t.image_url), { table: 'testimonials', rowId: String(t.id), column: 'image_url', label: 'Testimonial' });
    }
  }

  const { data: clients } = await sb.from('client_logos').select('id, name, logo_url');
  if (clients) {
    for (const c of clients) {
      if (c.logo_url) addImage(entries, String(c.logo_url), { table: 'client_logos', rowId: String(c.id), column: 'logo_url', label: `Client: ${c.name ?? ''}` });
    }
  }

  const { data: shorts } = await sb.from('shorts_videos').select('id, title, thumbnail_url');
  if (shorts) {
    for (const s of shorts) {
      if (s.thumbnail_url) addImage(entries, String(s.thumbnail_url), { table: 'shorts_videos', rowId: String(s.id), column: 'thumbnail_url', label: `Shorts: ${s.title ?? ''}` });
    }
  }

  const { data: ytAds } = await sb.from('youtube_ad_videos').select('id, title, thumbnail_url');
  if (ytAds) {
    for (const y of ytAds) {
      if (y.thumbnail_url) addImage(entries, String(y.thumbnail_url), { table: 'youtube_ad_videos', rowId: String(y.id), column: 'thumbnail_url', label: `YouTube Ad: ${y.title ?? ''}` });
    }
  }

  return Array.from(entries.values());
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Loader2, Check, X, ImageIcon } from 'lucide-react';
import { collectAllImages, type ImageEntry } from '@/lib/imageOptimizer';
import { optimizeImage } from '@/lib/optimizeImage';

export default function AdminImageOptimizer() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [previewEntry, setPreviewEntry] = useState<{
    entry: ImageEntry;
    optimizedUrl: string;
    optimizedFile: File;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      const list = await collectAllImages(supabase);
      setImages(list);
      setLoading(false);
    };
    run();
  }, [router]);

  async function handleOptimizeClick(entry: ImageEntry) {
    setOptimizingId(entry.url);
    try {
      const { data: blob, error } = await supabase.storage
        .from(entry.bucket)
        .download(entry.path);

      if (error || !blob) {
        throw new Error(error?.message ?? 'Failed to download image');
      }

      const ext = entry.path.split('.').pop() || 'jpg';
      const file = new File([blob], `image.${ext}`, { type: blob.type });
      const optimized = await optimizeImage(file);

      if (optimized === file) {
        alert('Image could not be optimized (e.g. already WebP or unsupported format)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewEntry({
          entry,
          optimizedUrl: reader.result as string,
          optimizedFile: optimized,
        });
      };
      reader.readAsDataURL(optimized);
    } catch (err) {
      console.error(err);
      alert('Failed to load image: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setOptimizingId(null);
    }
  }

  async function handleUseOptimized() {
    if (!previewEntry) return;
    setOptimizingId(previewEntry.entry.url);
    try {
      const { entry, optimizedFile } = previewEntry;
      const newPath = `optimized/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(entry.bucket)
        .upload(newPath, optimizedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(entry.bucket).getPublicUrl(newPath);
      const newUrl = data.publicUrl;

      const updatedRows = new Set<string>();
      for (const src of entry.sources) {
        const rowKey = `${src.table}:${src.rowId}`;
        if (updatedRows.has(rowKey)) continue;

        if (src.table === 'projects') {
          const { data: project } = await supabase
            .from('projects')
            .select('thumbnail_url, client_avatar_url, media_gallery, content')
            .eq('id', src.rowId)
            .single();

          if (!project) continue;

          const updates: Record<string, unknown> = {};
          if (project.thumbnail_url === entry.url) updates.thumbnail_url = newUrl;
          if (project.client_avatar_url === entry.url) updates.client_avatar_url = newUrl;
          if (Array.isArray(project.media_gallery) && project.media_gallery.includes(entry.url)) {
            updates.media_gallery = (project.media_gallery as string[]).map((u) => u === entry.url ? newUrl : u);
          }
          if (Array.isArray(project.content) && JSON.stringify(project.content).includes(entry.url)) {
            updates.content = replaceUrlInContent(project.content, entry.url, newUrl);
          }

          if (Object.keys(updates).length > 0) {
            await supabase.from('projects').update(updates).eq('id', src.rowId);
            updatedRows.add(rowKey);
          }
        } else {
          const { error } = await (supabase as any)
            .from(src.table)
            .update({ [src.column]: newUrl })
            .eq('id', src.rowId);

          if (!error) updatedRows.add(rowKey);
        }
      }

      setImages(prev => prev.map(img =>
        img.url === entry.url
          ? { ...img, url: newUrl, path: newPath, isOptimized: true }
          : img
      ));
      setPreviewEntry(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setOptimizingId(null);
    }
  }

  function replaceUrlInContent(content: unknown[], oldUrl: string, newUrl: string): unknown[] {
    return content.map(item => {
      if (typeof item !== 'object' || !item) return item;
      const block = item as Record<string, unknown>;
      const out: Record<string, unknown> = { ...block };
      if (block.mediaUrl === oldUrl) out.mediaUrl = newUrl;
      if (block.thumbnailUrl === oldUrl) out.thumbnailUrl = newUrl;
      if (Array.isArray(block.mediaItems)) {
        out.mediaItems = (block.mediaItems as string[]).map((u) => u === oldUrl ? newUrl : u);
      }
      return out;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            Image Optimizer
          </h1>
          <div />
        </div>

        <p className="text-gray-400 mb-6">
          All images from your website. Click &quot;Optimize&quot; to preview and optionally replace with a smaller WebP version.
        </p>

        {images.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900 rounded-xl border border-neutral-800 text-gray-500">
            No images found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((entry) => (
              <div
                key={entry.url}
                className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden group"
              >
                <div className="aspect-square relative bg-black">
                  <img
                    src={entry.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {entry.isOptimized && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500/80 text-white text-xs font-bold rounded">
                      WebP
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 truncate mb-2" title={entry.sources.map(s => s.label).join(', ')}>
                    {entry.sources[0]?.label ?? 'Unknown'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOptimizeClick(entry)}
                    disabled={entry.isOptimized || optimizingId === entry.url}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    {optimizingId === entry.url ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    {entry.isOptimized ? 'Already optimized' : 'Optimize'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview modal */}
        {previewEntry && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Original vs Optimized</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Original</p>
                    <img
                      src={previewEntry.entry.url}
                      alt="Original"
                      className="w-full aspect-video object-contain bg-black rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Optimized (WebP)</p>
                    <img
                      src={previewEntry.optimizedUrl}
                      alt="Optimized"
                      className="w-full aspect-video object-contain bg-black rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewEntry(null)}
                    className="px-4 py-2 rounded-lg bg-neutral-700 text-gray-300 hover:bg-neutral-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Keep original
                  </button>
                  <button
                    type="button"
                    onClick={handleUseOptimized}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2"
                  >
                    {optimizingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Use optimized
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

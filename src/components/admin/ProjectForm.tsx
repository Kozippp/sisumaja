'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/database.types';
import { X, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

interface ProjectFormProps {
  initialData?: Project;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    title: '',
    slug: '',
    description: '',
    thumbnail_url: '',
    media_gallery: [], // We'll cast this to string[] internally
    youtube_url: '',
    tiktok_url: '',
    instagram_url: '',
    stat_views: '',
    stat_likes: '',
    stat_comments: '',
    stat_shares: '',
    client_name: '',
    client_role: '',
    client_avatar_url: '',
    client_quote: '',
    is_visible: false,
    ...initialData,
  });

  const [mediaItems, setMediaItems] = useState<string[]>(
    Array.isArray(initialData?.media_gallery) ? (initialData?.media_gallery as string[]) : []
  );

  useEffect(() => {
    if (initialData) {
        setMediaItems(Array.isArray(initialData.media_gallery) ? (initialData.media_gallery as string[]) : []);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !initialData && !formData.slug) {
        setFormData(prev => ({
            ...prev,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
    }
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('project-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, thumbnail_url: url }));
    } catch (err: any) {
      setError('Pildi üleslaadimine ebaõnnestus: ' + err.message);
    } finally {
      setUploading(false);
    }
  };
  
  const handleClientAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, client_avatar_url: url }));
    } catch (err: any) {
      setError('Pildi üleslaadimine ebaõnnestus: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
         const url = await uploadFile(e.target.files[i]);
         newUrls.push(url);
      }
      setMediaItems(prev => [...prev, ...newUrls]);
    } catch (err: any) {
      setError('Meedia üleslaadimine ebaõnnestus: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = {
        ...formData,
        media_gallery: mediaItems,
        published_at: formData.published_at || new Date().toISOString(), // Ensure published_at is set
    };

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('projects')
          // @ts-ignore
          .update(submissionData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          // @ts-ignore
          .insert(submissionData);
        if (error) throw error;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-24 text-white">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Info */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Põhiinfo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pealkiri *</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-black border border-neutral-700 rounded p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Slug (URL) *</label>
                <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full bg-black border border-neutral-700 rounded p-2"
                    required
                />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Kirjeldus</label>
            <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black border border-neutral-700 rounded p-2"
            />
        </div>
        
        {/* Thumbnail */}
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail Pilt</label>
            <div className="flex items-center gap-4">
                {formData.thumbnail_url && (
                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-24 h-16 object-cover rounded border border-neutral-700" />
                )}
                <label className="cursor-pointer bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition-colors flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lae pilt'}
                    <input type="file" onChange={handleThumbnailUpload} accept="image/*" className="hidden" />
                </label>
                <input 
                    type="text" 
                    placeholder="või sisesta URL käsitsi" 
                    name="thumbnail_url"
                    value={formData.thumbnail_url || ''} 
                    onChange={handleChange}
                    className="flex-1 bg-black border border-neutral-700 rounded p-2"
                />
            </div>
        </div>
      </div>

      {/* Media Gallery */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Meedia Galerii (Karussell)</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaItems.map((url, idx) => (
                <div key={idx} className="relative group aspect-video bg-black rounded border border-neutral-700 overflow-hidden">
                    {url.match(/\.(mp4|webm)$/i) ? (
                        <video src={url} className="w-full h-full object-cover" />
                    ) : (
                        <img src={url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                        type="button"
                        onClick={() => removeMediaItem(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
             <label className="cursor-pointer aspect-video bg-neutral-800 rounded border border-neutral-700 border-dashed hover:border-primary flex items-center justify-center transition-colors">
                <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                    <span className="text-xs text-gray-500">Lisa faile</span>
                </div>
                <input type="file" onChange={handleMediaUpload} accept="image/*,video/*" multiple className="hidden" />
            </label>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Statistika (Täida vaid olemasolevad)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Vaatamised</label>
                <input name="stat_views" value={formData.stat_views || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" placeholder="nt. 50k" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Like'id</label>
                <input name="stat_likes" value={formData.stat_likes || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" placeholder="nt. 2000" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Kommentaarid</label>
                <input name="stat_comments" value={formData.stat_comments || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Jagamised</label>
                <input name="stat_shares" value={formData.stat_shares || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Lingid</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Video Link</label>
                <input name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">TikTok Video Link</label>
                <input name="tiktok_url" value={formData.tiktok_url || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Instagram Postituse Link</label>
                <input name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
        </div>
      </div>

       {/* Client Feedback */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Kliendi Tagasiside</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Kliendi Nimi</label>
                <input name="client_name" value={formData.client_name || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Kliendi Amet</label>
                <input name="client_role" value={formData.client_role || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Kliendi Pilt (Avatar)</label>
            <div className="flex items-center gap-4">
                 {formData.client_avatar_url && (
                    <img src={formData.client_avatar_url} alt="Client" className="w-12 h-12 rounded-full object-cover border border-neutral-700" />
                )}
                <label className="cursor-pointer bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition-colors flex items-center text-sm">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lae pilt'}
                    <input type="file" onChange={handleClientAvatarUpload} accept="image/*" className="hidden" />
                </label>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tagasiside (Tsitaat)</label>
             <textarea
                name="client_quote"
                value={formData.client_quote || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black border border-neutral-700 rounded p-2"
            />
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-2">
        <input
            type="checkbox"
            id="is_visible"
            name="is_visible"
            checked={formData.is_visible || false}
            onChange={handleChange}
            className="w-5 h-5 accent-primary"
        />
        <label htmlFor="is_visible" className="text-white font-medium">Avalikusta koheselt?</label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-lg hover:bg-fuchsia-700 transition-colors uppercase tracking-wide disabled:opacity-50"
        >
            {loading ? 'Salvestan...' : (initialData ? 'Uuenda tööd' : 'Lisa uus töö')}
        </button>
        <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-4 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors uppercase tracking-wide"
        >
            Tühista
        </button>
      </div>
    </form>
  );
}


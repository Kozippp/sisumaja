'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/database.types';
import { X, Plus, Image as ImageIcon, Loader2, Video, Type, GalleryHorizontal, ArrowUp, ArrowDown, Trash2, LayoutTemplate, Link as LinkIcon, Youtube, Instagram } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

// Content Block Types
type BlockType = 'text' | 'image' | 'video' | 'carousel';
type LayoutType = 'left' | 'right';

// Link Types
type LinkType = 'youtube' | 'instagram' | 'tiktok' | 'other';
export interface CustomLink {
    id: string;
    type: LinkType;
    label: string;
    url: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  layout?: LayoutType;
  title?: string;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaItems?: string[];
}

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
    media_gallery: [], // Legacy support
    content: [], // New Content Blocks
    links: [], // New Custom Links
    youtube_url: '',
    tiktok_url: '',
    instagram_url: '',
    youtube_video_id: '',
    show_youtube_stats: false,
    stat_views: '',
    stat_likes: '',
    stat_comments: '',
    stat_shares: '',
    client_name: '',
    client_role: '',
    client_avatar_url: '',
    client_quote: '',
    client_review_stars: 5,
    client_review_title: '',
    is_visible: false,
    collaboration_completed_at: null,
    ...initialData,
  });

  // Load content blocks from initialData
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(() => {
    if (initialData?.content && Array.isArray(initialData.content)) {
      return initialData.content as unknown as ContentBlock[];
    }
    return [];
  });

  // Load custom links from initialData
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(() => {
    if (initialData?.links && Array.isArray(initialData.links)) {
        return initialData.links as unknown as CustomLink[];
    }
    return [];
  });


  // Legacy media items state (kept for backward compatibility or easy migration)
  const [mediaItems, setMediaItems] = useState<string[]>(
    Array.isArray(initialData?.media_gallery) ? (initialData?.media_gallery as string[]) : []
  );

  useEffect(() => {
    if (initialData) {
        setMediaItems(Array.isArray(initialData.media_gallery) ? (initialData.media_gallery as string[]) : []);
        if (initialData.content && Array.isArray(initialData.content)) {
            setContentBlocks(initialData.content as unknown as ContentBlock[]);
        }
        if (initialData.links && Array.isArray(initialData.links)) {
            setCustomLinks(initialData.links as unknown as CustomLink[]);
        }
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Pildi üleslaadimine ebaõnnestus: ' + errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Pildi üleslaadimine ebaõnnestus: ' + errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Meedia üleslaadimine ebaõnnestus: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  // --- CONTENT BUILDER FUNCTIONS ---

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      layout: 'left', // Default layout
      title: '',
      content: '',
      mediaUrl: '',
      thumbnailUrl: '',
      mediaItems: [],
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === contentBlocks.length - 1)
    ) return;

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(contentBlocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleBlockMediaUpload = async (file: File, blockId: string, field: 'mediaUrl' | 'thumbnailUrl') => {
    setUploading(true);
    try {
        const url = await uploadFile(file);
        updateBlock(blockId, { [field]: url });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError('Faili üleslaadimine ebaõnnestus: ' + errorMessage);
    } finally {
        setUploading(false);
    }
  };

  const handleBlockCarouselUpload = async (files: FileList, blockId: string) => {
    setUploading(true);
    try {
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = await uploadFile(files[i]);
            newUrls.push(url);
        }
        const block = contentBlocks.find(b => b.id === blockId);
        const currentItems = block?.mediaItems || [];
        updateBlock(blockId, { mediaItems: [...currentItems, ...newUrls] });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError('Galerii üleslaadimine ebaõnnestus: ' + errorMessage);
    } finally {
        setUploading(false);
    }
  };

  // --- LINKS BUILDER FUNCTIONS ---
  const addLink = () => {
    const newLink: CustomLink = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'youtube', // default
        label: '',
        url: ''
    };
    setCustomLinks([...customLinks, newLink]);
  };

  const removeLink = (id: string) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
     if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === customLinks.length - 1)
    ) return;
    
    const newLinks = [...customLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    setCustomLinks(newLinks);
  };

  const updateLink = (id: string, updates: Partial<CustomLink>) => {
      setCustomLinks(customLinks.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // ---------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Ensure title is always defined
    const title = formData.title || '';
    if (!title.trim()) {
      setError('Pealkiri on kohustuslik.');
      setLoading(false);
      return;
    }

    // Ensure slug is always defined
    const slug = formData.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    if (!slug.trim()) {
      setError('Slug on kohustuslik. Palun sisesta pealkiri või slug.');
      setLoading(false);
      return;
    }

    const submissionData = {
        ...formData,
        title, // Ensure title is always a string
        slug, // Ensure slug is always a string
        media_gallery: mediaItems,
        content: contentBlocks as unknown as Database['public']['Tables']['projects']['Insert']['content'], // Cast for Supabase
        links: customLinks as unknown as Database['public']['Tables']['projects']['Insert']['links'],
        published_at: formData.published_at || new Date().toISOString(),
    };

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(submissionData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert(submissionData);
        if (error) throw error;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-24 text-white">
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Projekti avaldamise kuupäev</label>
            <input
                type="date"
                name="collaboration_completed_at"
                value={formData.collaboration_completed_at ? new Date(formData.collaboration_completed_at).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                    const value = e.target.value ? new Date(e.target.value).toISOString() : null;
                    setFormData(prev => ({ ...prev, collaboration_completed_at: value }));
                }}
                className="w-full bg-black border border-neutral-700 rounded p-2"
            />
             <p className="text-xs text-gray-500 mt-1">Kuupäev, millal projekt avalikustati. See ilmub lehel pealkirja all.</p>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Lühikirjeldus (SEO & List View)</label>
            <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black border border-neutral-700 rounded p-2"
            />
             <p className="text-xs text-gray-500 mt-1">See tekst on nähtav Google otsingus ja tehtud tööde nimekirjas. Projekti detailvaates seda EI kuvata.</p>
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

      {/* --- CONTENT BUILDER --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-2xl font-bold">Sisu Segmendid (Builder)</h3>
            <div className="flex gap-2">
                <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm transition-colors"><Type className="w-4 h-4" /> Tekst</button>
                <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm transition-colors"><ImageIcon className="w-4 h-4" /> Pilt</button>
                <button type="button" onClick={() => addBlock('video')} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm transition-colors"><Video className="w-4 h-4" /> Video</button>
                <button type="button" onClick={() => addBlock('carousel')} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm transition-colors"><GalleryHorizontal className="w-4 h-4" /> Karussell</button>
            </div>
        </div>

        {contentBlocks.length === 0 && (
            <div className="text-center py-12 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl">
                <p className="text-gray-500">Pole ühtegi segmenti lisatud. Vali ülevalt tüüp, et alustada.</p>
            </div>
        )}

        <div className="space-y-6">
            {contentBlocks.map((block, index) => (
                <div key={block.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden relative group">
                    {/* Block Header / Controls */}
                    <div className="bg-neutral-800/50 px-4 py-2 flex items-center justify-between border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider">{block.type}</span>
                            <span className="text-gray-500 text-xs font-mono">#{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-neutral-700 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                            <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === contentBlocks.length - 1} className="p-1 hover:bg-neutral-700 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-neutral-700 mx-1" />
                            <button type="button" onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-500/20 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Layout Toggle (Only for media blocks) */}
                        {block.type !== 'text' && (
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm text-gray-400">Paigutus (Desktop):</span>
                                <div className="flex bg-black rounded p-1 border border-neutral-800">
                                    <button 
                                        type="button"
                                        onClick={() => updateBlock(block.id, { layout: 'left' })}
                                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${block.layout === 'left' ? 'bg-neutral-800 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <LayoutTemplate className="w-4 h-4 rotate-180" /> Meedia Vasakul
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => updateBlock(block.id, { layout: 'right' })}
                                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${block.layout === 'right' ? 'bg-neutral-800 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <LayoutTemplate className="w-4 h-4" /> Meedia Paremal
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Text Fields (Common) */}
                        <div className="grid grid-cols-1 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pealkiri (Valikuline)</label>
                                <input 
                                    type="text" 
                                    value={block.title || ''} 
                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                    className="w-full bg-black border border-neutral-700 rounded p-2 text-sm"
                                    placeholder="Sektsiooni pealkiri"
                                />
                             </div>
                             
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tekst / Kirjeldus</label>
                                <textarea 
                                    value={block.content || ''} 
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    className="w-full bg-black border border-neutral-700 rounded p-2 text-sm"
                                    rows={block.type === 'text' ? 5 : 3}
                                    placeholder="Kirjuta siia..."
                                />
                             </div>
                        </div>

                        {/* Media Fields */}
                        {block.type === 'image' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pilt</label>
                                <div className="flex items-start gap-4">
                                    {block.mediaUrl ? (
                                        <img src={block.mediaUrl} alt="" className="w-32 h-20 object-cover rounded border border-neutral-700 bg-black" />
                                    ) : (
                                        <div className="w-32 h-20 bg-black border border-neutral-700 rounded flex items-center justify-center text-gray-600">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            type="text"
                                            value={block.mediaUrl || ''}
                                            onChange={(e) => updateBlock(block.id, { mediaUrl: e.target.value })}
                                            className="w-full bg-black border border-neutral-700 rounded p-2 text-sm"
                                            placeholder="Pildi URL"
                                        />
                                        <label className="inline-flex items-center gap-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-xs transition-colors">
                                            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                                            Lae failist
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleBlockMediaUpload(e.target.files[0], block.id, 'mediaUrl')} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {block.type === 'video' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video URL (YouTube/Vimeo)</label>
                                    <input 
                                        type="text"
                                        value={block.mediaUrl || ''}
                                        onChange={(e) => updateBlock(block.id, { mediaUrl: e.target.value })}
                                        className="w-full bg-black border border-neutral-700 rounded p-2 text-sm"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custom Thumbnail (Valikuline)</label>
                                    <div className="flex items-start gap-4">
                                        {block.thumbnailUrl ? (
                                            <img src={block.thumbnailUrl} alt="" className="w-32 h-20 object-cover rounded border border-neutral-700 bg-black" />
                                        ) : (
                                            <div className="w-32 h-20 bg-black border border-neutral-700 rounded flex items-center justify-center text-gray-600 text-xs text-center p-2">
                                                Auto (YouTube)
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <label className="inline-flex items-center gap-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-xs transition-colors">
                                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                                                Lae thumbnail
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleBlockMediaUpload(e.target.files[0], block.id, 'thumbnailUrl')} />
                                            </label>
                                            {block.thumbnailUrl && (
                                                <button 
                                                    type="button"
                                                    onClick={() => updateBlock(block.id, { thumbnailUrl: '' })}
                                                    className="ml-2 text-red-500 text-xs hover:underline"
                                                >
                                                    Eemalda
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {block.type === 'carousel' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Galerii Pildid</label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {block.mediaItems?.map((url, i) => (
                                        <div key={i} className="aspect-square bg-black rounded border border-neutral-700 relative group overflow-hidden">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const newItems = block.mediaItems?.filter((_, idx) => idx !== i);
                                                    updateBlock(block.id, { mediaItems: newItems });
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square bg-neutral-800 rounded border border-neutral-700 border-dashed hover:border-primary flex items-center justify-center cursor-pointer transition-colors">
                                        <Plus className="w-5 h-5 text-gray-400" />
                                        <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => e.target.files && handleBlockCarouselUpload(e.target.files, block.id)} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
      {/* ----------------------- */}

      {/* Stats */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <h3 className="text-xl font-bold border-b border-neutral-800 pb-2 mb-4">Statistika</h3>
        
        {/* Auto Stats Switch */}
        <div className="bg-black p-4 rounded border border-neutral-700 mb-6">
            <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            name="show_youtube_stats"
                            checked={formData.show_youtube_stats || false}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </div>
                    <span className="font-bold text-white flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        Automaatne YouTube Statistika
                    </span>
                </label>
            </div>

            {formData.show_youtube_stats && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Video Link</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={formData.youtube_video_id || ''}
                                onChange={(e) => {
                                    // Try to extract ID immediately
                                    const val = e.target.value;
                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                    const match = val.match(regExp);
                                    const id = (match && match[2].length === 11) ? match[2] : val;
                                    
                                    setFormData(prev => ({ ...prev, youtube_video_id: id }));
                                }}
                                className="flex-1 bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Video ID: <span className="font-mono text-yellow-500">{formData.youtube_video_id || 'Puudub'}</span>
                        </p>
                    </div>
                     <p className="text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                        ⚠️ Kui see on sisse lülitatud, kirjutab süsteem allolevad numbrid automaatselt üle iga kord, kui keegi seda projekti vaatab.
                    </p>
                </div>
            )}
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-opacity ${formData.show_youtube_stats ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Vaatamised</label>
                <input name="stat_views" value={formData.stat_views || ''} onChange={handleChange} className="w-full bg-black border border-neutral-700 rounded p-2" placeholder="nt. 50k" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Like&apos;id</label>
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

      {/* Social Links Builder (NEW) */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
            <h3 className="text-xl font-bold">Lingid (Sotsiaalmeedia)</h3>
             <button type="button" onClick={addLink} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm transition-colors"><Plus className="w-4 h-4" /> Lisa Link</button>
        </div>
        
         {customLinks.length === 0 && (
            <p className="text-gray-500 text-sm">Lisa siia lingid sotsiaalmeediasse (nt. YouTube, TikTok, Instagram).</p>
        )}

        <div className="space-y-4">
            {customLinks.map((link, index) => (
                <div key={link.id} className="flex items-center gap-4 bg-black p-4 rounded border border-neutral-800">
                     <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => moveLink(index, 'up')} disabled={index === 0} className="p-1 hover:bg-neutral-800 rounded text-gray-500 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                        <button type="button" onClick={() => moveLink(index, 'down')} disabled={index === customLinks.length - 1} className="p-1 hover:bg-neutral-800 rounded text-gray-500 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                    </div>
                    
                    {/* Icon Select */}
                    <div>
                        <select 
                            value={link.type}
                            onChange={(e) => updateLink(link.id, { type: e.target.value as LinkType })}
                            className="bg-neutral-900 border border-neutral-700 rounded p-2 text-sm"
                        >
                            <option value="youtube">YouTube</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="other">Muu Link</option>
                        </select>
                    </div>

                    {/* Label Input */}
                     <div className="flex-1">
                        <input 
                            type="text"
                            placeholder="Nupu tekst (nt. Vaata videot)"
                            value={link.label}
                            onChange={(e) => updateLink(link.id, { label: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm"
                        />
                    </div>

                    {/* URL Input */}
                     <div className="flex-[2]">
                        <input 
                            type="text"
                            placeholder="URL (https://...)"
                            value={link.url}
                            onChange={(e) => updateLink(link.id, { url: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-sm"
                        />
                    </div>

                    <button type="button" onClick={() => removeLink(link.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">Tagasiside pealkiri</label>
                 <input 
                    name="client_review_title" 
                    value={formData.client_review_title || ''} 
                    onChange={handleChange} 
                    className="w-full bg-black border border-neutral-700 rounded p-2" 
                    placeholder="nt. Suurepärane koostöö!"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">Hinne (1-5 tärni)</label>
                 <select 
                    name="client_review_stars" 
                    value={formData.client_review_stars || 5} 
                    onChange={handleChange} 
                    className="w-full bg-black border border-neutral-700 rounded p-2"
                >
                    <option value={5}>5 Tärni</option>
                    <option value={4}>4 Tärni</option>
                    <option value={3}>3 Tärni</option>
                    <option value={2}>2 Tärni</option>
                    <option value={1}>1 Tärn</option>
                </select>
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

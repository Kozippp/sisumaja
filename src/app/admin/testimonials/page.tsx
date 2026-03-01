"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, Save, X, Upload, MessageSquare, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Testimonial, TestimonialFormData, TestimonialType } from "@/types/testimonials";
import { cn } from "@/lib/utils";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const initialFormState: TestimonialFormData = {
    type: 'text',
    content: '',
    author_name: '',
    author_role: '',
    author_company: '',
    image_url: '',
    status: 'draft'
  };

  const [formData, setFormData] = useState<TestimonialFormData>(initialFormState);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials:", error);
    } else {
      // @ts-ignore - Supabase types might not be up to date yet
      setTestimonials(data || []);
    }
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('testimonials')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([formData]);

        if (error) throw error;
      }

      fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Error saving testimonial!");
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(testimonial: Testimonial) {
    setFormData({
      type: testimonial.type,
      content: testimonial.content || '',
      author_name: testimonial.author_name || '',
      author_role: testimonial.author_role || '',
      author_company: testimonial.author_company || '',
      image_url: testimonial.image_url || '',
      status: testimonial.status
    });
    setEditingId(testimonial.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm("Oled kindel, et soovid selle tagasiside kustutada?")) return;

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchTestimonials();
    } else {
      alert("Error deleting testimonial!");
    }
  }

  async function toggleStatus(testimonial: Testimonial) {
    const newStatus = testimonial.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from("testimonials")
      .update({ status: newStatus })
      .eq("id", testimonial.id);

    if (!error) {
      fetchTestimonials();
    }
  }

  function resetForm() {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(false);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tagasi töölauale
            </Link>
            <h1 className="text-3xl font-bold">Tagasiside haldus</h1>
            <p className="text-gray-400 mt-2">
              Halda klientide tagasisidet ja kuvatõmmiseid
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Lisa uus tagasiside
          </button>
        </div>

        {/* Form Modal / Section */}
        {isFormOpen && (
          <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Muuda tagasisidet" : "Lisa uus tagasiside"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'text' })}
                  className={cn(
                    "flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all",
                    formData.type === 'text' 
                      ? "bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-400" 
                      : "bg-black/20 border-white/10 text-gray-400 hover:bg-white/5"
                  )}
                >
                  <MessageSquare className="w-5 h-5" />
                  Tekstiline tagasiside
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'image' })}
                  className={cn(
                    "flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all",
                    formData.type === 'image' 
                      ? "bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-400" 
                      : "bg-black/20 border-white/10 text-gray-400 hover:bg-white/5"
                  )}
                >
                  <ImageIcon className="w-5 h-5" />
                  Kuvatõmmis (Screenshot)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Content */}
                <div className="space-y-4">
                  {formData.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tagasiside sisu</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                          placeholder="Kirjuta siia kliendi tagasiside..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Nimi</label>
                          <input
                            type="text"
                            required
                            value={formData.author_name || ''}
                            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                            placeholder="nt. Liis Nõges"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Amet</label>
                          <input
                            type="text"
                            value={formData.author_role || ''}
                            onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                            placeholder="nt. Turundusjuht"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Ettevõte</label>
                        <input
                          type="text"
                          value={formData.author_company || ''}
                          onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                          placeholder="nt. LHV Pank"
                        />
                      </div>
                    </>
                  )}
                  
                  {formData.type === 'image' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Kirjeldus (Adminile)</label>
                        <input
                          type="text"
                          value={formData.author_name || ''}
                          onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                          placeholder="nt. Tagasiside Facebookist"
                        />
                     </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Staatus</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="draft">Mustand (Draft)</option>
                      <option value="published">Avalik (Published)</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {formData.type === 'text' ? 'Autori pilt (Valikuline)' : 'Kuvatõmmis (Kohustuslik)'}
                  </label>
                  
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors relative group">
                    {formData.image_url ? (
                      <div className="relative w-full aspect-video">
                        <Image 
                          src={formData.image_url} 
                          alt="Preview" 
                          fill 
                          className="object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-500 mb-4" />
                        <p className="text-gray-400 text-sm mb-2">Lohista pilt siia või vajuta valimiseks</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      </>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Tühista
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Salvesta muudatused" : "Lisa tagasiside"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Laen andmeid...</div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-neutral-900 rounded-xl border border-white/5">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pole ühtegi tagasisidet</h3>
              <p className="text-gray-400 mb-6">Lisa esimene tagasiside, et näha seda siin.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold text-white transition-colors"
              >
                Lisa uus
              </button>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className={cn(
                  "bg-neutral-900 rounded-xl overflow-hidden border transition-all hover:border-white/20 group relative",
                  testimonial.status === 'published' ? "border-white/10" : "border-yellow-500/20 opacity-75"
                )}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold uppercase",
                    testimonial.status === 'published' 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {testimonial.status === 'published' ? 'Avalik' : 'Mustand'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {testimonial.type === 'image' && testimonial.image_url ? (
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-black mb-4">
                      <Image 
                        src={testimonial.image_url} 
                        alt="Testimonial screenshot" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center gap-3">
                        {testimonial.image_url ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image 
                              src={testimonial.image_url} 
                              alt={testimonial.author_name || ''} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-400 font-bold">
                            {(testimonial.author_name || '?')[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{testimonial.author_name}</div>
                          <div className="text-xs text-gray-400">
                            {testimonial.author_role}
                            {testimonial.author_company && ` • ${testimonial.author_company}`}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-4 italic">"{testimonial.content}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="text-xs text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(testimonial)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title={testimonial.status === 'published' ? "Peida" : "Avalikusta"}
                      >
                        {testimonial.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
                        title="Muuda"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                        title="Kustuta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

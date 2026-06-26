"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, Save, X, Upload, Image as ImageIcon, GripVertical, Zap } from "lucide-react";
import { optimizeImage } from "@/lib/optimizeImage";
import Link from "next/link";
import Image from "next/image";
import { RetentionImage, RetentionImageFormData } from "@/types/retention-images";
import { cn } from "@/lib/utils";

export default function AdminRetentionImages() {
  const [images, setImages] = useState<RetentionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const initialFormState: RetentionImageFormData = {
    title: '',
    description: '',
    image_url: '',
    is_active: true
  };

  const [formData, setFormData] = useState<RetentionImageFormData>(initialFormState);
  const [optimizeImages, setOptimizeImages] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("retention_images")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching retention images:", error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploading(true);
    let file = e.target.files[0];
    if (optimizeImages) {
      file = await optimizeImage(file);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('retention-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('retention-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Pildi üleslaadimine ebaõnnestus!');
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
          .from("retention_images")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("retention_images")
          .insert([formData]);

        if (error) throw error;
      }

      fetchImages();
      resetForm();
    } catch (error) {
      console.error("Error saving retention image:", error);
      alert("Salvestamine ebaõnnestus!");
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(image: RetentionImage) {
    setFormData({
      title: image.title,
      description: image.description || '',
      image_url: image.image_url,
      is_active: image.is_active
    });
    setEditingId(image.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm("Oled kindel, et soovid selle pildi kustutada?")) return;

    const { error } = await supabase
      .from("retention_images")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchImages();
    } else {
      alert("Kustutamine ebaõnnestus!");
    }
  }

  async function toggleActive(image: RetentionImage) {
    const { error } = await supabase
      .from("retention_images")
      .update({ is_active: !image.is_active })
      .eq("id", image.id);

    if (!error) {
      fetchImages();
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex >= images.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    const currentItem = images[currentIndex];
    const swapItem = images[swapIndex];
    
    const newList = [...images];
    newList[currentIndex] = swapItem;
    newList[swapIndex] = currentItem;
    setImages(newList);

    try {
      await supabase.from("retention_images").update({ display_order: swapIndex }).eq("id", currentItem.id);
      await supabase.from("retention_images").update({ display_order: currentIndex }).eq("id", swapItem.id);
    } catch (error) {
      console.error("Error reordering:", error);
      fetchImages();
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
            <h1 className="text-3xl font-bold">Retention Piltide Haldus</h1>
            <p className="text-gray-400 mt-2">
              Halda retention graafikute pilte, mis kuvatakse "Reaalne huvi" lingi klõpsamisel
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
            Lisa uus pilt
          </button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Muuda pilti" : "Lisa uus pilt"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Pealkiri</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                      placeholder="nt. Vaatajate püsimise graafik"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Kirjeldus (Valikuline)</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500"
                      placeholder="Lühike kirjeldus pildist..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Staatus</label>
                    <div className="flex items-center gap-3 p-3 bg-black/50 border border-white/10 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 accent-fuchsia-600 rounded cursor-pointer"
                        id="is_active"
                      />
                      <label htmlFor="is_active" className="text-white cursor-pointer select-none">
                        Aktiivne (nähtav avalikul lehel)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Pilt (Kohustuslik)
                  </label>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={optimizeImages}
                      onChange={(e) => setOptimizeImages(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-fuchsia-500 focus:ring-fuchsia-500"
                    />
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Optimize image (WebP, smaller file)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors relative group min-h-[300px]">
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
                        <p className="text-gray-500 text-xs">Soovituslik: retention graafiku kuvatõmmis</p>
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
                  disabled={uploading || !formData.image_url}
                  className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Salvesta muudatused" : "Lisa pilt"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Laen andmeid...</div>
          ) : images.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-neutral-900 rounded-xl border border-white/5">
              <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pole ühtegi pilti</h3>
              <p className="text-gray-400 mb-6">Lisa esimene retention pilt, et näha seda siin.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold text-white transition-colors"
              >
                Lisa uus
              </button>
            </div>
          ) : (
            images.map((image, index) => (
              <div 
                key={image.id} 
                className={cn(
                  "bg-neutral-900 rounded-xl overflow-hidden border transition-all hover:border-white/20 group relative",
                  image.is_active ? "border-white/10" : "border-yellow-500/20 opacity-75"
                )}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold uppercase",
                    image.is_active 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {image.is_active ? 'Aktiivne' : 'Peidetud'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Reorder Controls */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg p-1 backdrop-blur-sm">
                    <button
                      onClick={() => handleReorder(image.id, "up")}
                      disabled={index === 0}
                      className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed text-white"
                      title="Liiguta üles"
                    >
                      <GripVertical className="w-3 h-3 rotate-180" />
                    </button>
                    <button
                      onClick={() => handleReorder(image.id, "down")}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed text-white"
                      title="Liiguta alla"
                    >
                      <GripVertical className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
                    <Image 
                      src={image.image_url} 
                      alt={image.title} 
                      fill 
                      className="object-contain"
                    />
                  </div>

                  <h3 className="font-bold text-white mb-1">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{image.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="text-xs text-gray-500">
                      {new Date(image.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(image)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title={image.is_active ? "Peida" : "Aktiveeri"}
                      >
                        {image.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(image)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
                        title="Muuda"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
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

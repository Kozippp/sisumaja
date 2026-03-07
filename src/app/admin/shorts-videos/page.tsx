"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, GripVertical, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ShortsVideo = Database['public']['Tables']['shorts_videos']['Row'];

export default function AdminShortsVideos() {
  const [videos, setVideos] = useState<ShortsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'video' | 'thumbnail' | 'database' | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("shorts_videos")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching videos:", error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  }

  async function handleUploadVideo(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!videoFile) {
      setError("Video file is required");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload video file
      setUploadStage('video');
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${videoExt}`;
      
      const { error: videoUploadError, data: videoData } = await supabase.storage
        .from('shorts-videos')
        .upload(`videos/${videoFileName}`, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (videoUploadError) throw videoUploadError;
      setUploadProgress(thumbnailFile ? 50 : 80);

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('shorts-videos')
        .getPublicUrl(`videos/${videoFileName}`);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        setUploadStage('thumbnail');
        const thumbExt = thumbnailFile.name.split('.').pop();
        const thumbFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${thumbExt}`;
        const { error: thumbUploadError } = await supabase.storage
          .from('shorts-videos')
          .upload(`thumbnails/${thumbFileName}`, thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (thumbUploadError) throw thumbUploadError;
        setUploadProgress(80);

        const { data: { publicUrl } } = supabase.storage
          .from('shorts-videos')
          .getPublicUrl(`thumbnails/${thumbFileName}`);
        
        thumbnailUrl = publicUrl;
      }

      // Get next display order
      setUploadStage('database');
      setUploadProgress(90);
      
      const maxOrder = videos.length > 0 
        ? Math.max(...videos.map(v => v.display_order)) 
        : 0;

      // Insert record into database
      const { error: dbError } = await supabase
        .from('shorts_videos')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          display_order: maxOrder + 1,
          is_visible: true
        });

      if (dbError) throw dbError;
      
      setUploadProgress(100);

      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      setShowForm(false);
      
      fetchVideos();
    } catch (err: any) {
      console.error("Error uploading video:", err);
      setError(err.message || "Failed to upload video");
    }
    
    setUploading(false);
    setUploadProgress(0);
    setUploadStage(null);
  }

  async function handleToggleVisibility(video: ShortsVideo) {
    const { error } = await supabase
      .from("shorts_videos")
      .update({ is_visible: !video.is_visible })
      .eq("id", video.id);

    if (!error) {
      fetchVideos();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this video?")) return;

    const { error } = await supabase
      .from("shorts_videos")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchVideos();
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const currentIndex = videos.findIndex((v) => v.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === videos.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentVideo = videos[currentIndex];
    const swapVideo = videos[swapIndex];

    await supabase
      .from("shorts_videos")
      .update({ display_order: swapVideo.display_order })
      .eq("id", currentVideo.id);

    await supabase
      .from("shorts_videos")
      .update({ display_order: currentVideo.display_order })
      .eq("id", swapVideo.id);

    fetchVideos();
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
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Shorts Videos</h1>
            <p className="text-gray-400 mt-2">
              Manage short-form videos displayed on the homepage
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Video"}
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Upload New Video</h2>
            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Video File *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-700"
                  disabled={uploading}
                />
                <p className="text-gray-500 text-sm mt-1">Supported formats: MP4, WebM, MOV</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Thumbnail (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-700"
                  disabled={uploading}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {uploadStage === 'video' && 'Uploading video...'}
                      {uploadStage === 'thumbnail' && 'Uploading thumbnail...'}
                      {uploadStage === 'database' && 'Saving to database...'}
                    </span>
                    <span className="text-fuchsia-400 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-fuchsia-600 to-purple-600 h-full transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !title || !videoFile}
                className="w-full px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </form>
          </div>
        )}

        {/* Videos List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No videos yet. Upload your first video above!
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`bg-neutral-900 rounded-xl p-6 border ${
                  video.is_visible ? "border-white/10" : "border-gray-700"
                }`}
              >
                <div className="flex gap-6">
                  {/* Video Preview */}
                  <div className="relative w-32 aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={video.video_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                    {!video.is_visible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <EyeOff className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReorder(video.id, "up")}
                          disabled={index === 0}
                          className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <GripVertical className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => handleReorder(video.id, "down")}
                          disabled={index === videos.length - 1}
                          className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleToggleVisibility(video)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          video.is_visible
                            ? "bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400"
                            : "bg-green-600/20 hover:bg-green-600/30 text-green-400"
                        }`}
                      >
                        {video.is_visible ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Show
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

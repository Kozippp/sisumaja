"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { ArrowLeft, Plus, Trash2, RefreshCw, Eye, EyeOff, GripVertical, ExternalLink, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatViewCount } from "@/lib/youtube";

type FeaturedVideo = Database['public']['Tables']['featured_videos']['Row'];

export default function AdminFeaturedVideos() {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingVideo, setAddingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("featured_videos")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching videos:", error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAddingVideo(true);

    try {
      const response = await fetch("/api/featured-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: newVideoUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to add video");
        setAddingVideo(false);
        return;
      }

      setNewVideoUrl("");
      fetchVideos();
    } catch (err) {
      setError("Failed to add video");
    }
    setAddingVideo(false);
  }

  async function handleSyncVideo(id: string) {
    setSyncingId(id);
    try {
      const response = await fetch("/api/featured-videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (err) {
      console.error("Error syncing video:", err);
    }
    setSyncingId(null);
  }

  async function handleToggleVisibility(video: FeaturedVideo) {
    const { error } = await supabase
      .from("featured_videos")
      .update({ is_visible: !video.is_visible })
      .eq("id", video.id);

    if (!error) {
      fetchVideos();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this video?")) return;

    const { error } = await supabase
      .from("featured_videos")
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

    // Swap display orders
    await supabase
      .from("featured_videos")
      .update({ display_order: swapVideo.display_order })
      .eq("id", currentVideo.id);

    await supabase
      .from("featured_videos")
      .update({ display_order: currentVideo.display_order })
      .eq("id", swapVideo.id);

    fetchVideos();
  }

  function startEditUrl(video: FeaturedVideo) {
    setEditingId(video.id);
    setEditUrl(video.youtube_url);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditUrl("");
  }

  async function saveEditUrl(id: string) {
    if (!editUrl.trim()) {
      alert("URL cannot be empty");
      return;
    }

    try {
      // Extract video ID from the URL using the youtube helper
      const videoId = await extractVideoId(editUrl);
      if (!videoId) {
        alert("Invalid YouTube URL");
        return;
      }

      // Update URL and video ID in database
      const { error } = await supabase
        .from("featured_videos")
        .update({ 
          youtube_url: editUrl,
          youtube_video_id: videoId
        })
        .eq("id", id);

      if (error) {
        alert("Failed to update URL");
        return;
      }

      // Then sync to fetch fresh YouTube data
      await handleSyncVideo(id);
      
      setEditingId(null);
      setEditUrl("");
    } catch (err) {
      console.error("Error updating URL:", err);
      alert("Failed to update URL");
    }
  }

  async function extractVideoId(url: string): Promise<string | null> {
    // Simple extraction logic
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
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
            <h1 className="text-3xl font-bold">Featured YouTube Videos</h1>
            <p className="text-gray-400 mt-2">
              Manage videos displayed in the homepage carousel
            </p>
          </div>
        </div>

        {/* Add New Video Form */}
        <div className="bg-neutral-900 rounded-xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Add New Video</h2>
          <form onSubmit={handleAddVideo} className="flex gap-4">
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL or Video ID"
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
              disabled={addingVideo}
            />
            <button
              type="submit"
              disabled={addingVideo || !newVideoUrl}
              className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {addingVideo ? "Adding..." : "Add Video"}
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Supported formats: youtube.com/watch?v=..., youtu.be/..., or just the video ID
          </p>
        </div>

        {/* Videos List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No videos yet. Add your first video above!
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
                  {/* Thumbnail */}
                  <div className="relative w-64 aspect-video rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    {!video.is_visible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <EyeOff className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold line-clamp-2">
                        {video.title}
                      </h3>
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

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="font-semibold text-fuchsia-400">
                        {formatViewCount(video.view_count)} views
                      </span>
                      <span>•</span>
                      {editingId === video.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="flex-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-fuchsia-500"
                            placeholder="YouTube URL"
                          />
                          <button
                            onClick={() => saveEditUrl(video.id)}
                            className="p-1 hover:bg-green-600/20 text-green-400 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 hover:bg-red-600/20 text-red-400 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <a
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-1"
                          >
                            View on YouTube
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => startEditUrl(video)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Edit URL"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {video.last_synced_at && (
                        <>
                          <span>•</span>
                          <span>
                            Synced: {new Date(video.last_synced_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSyncVideo(video.id)}
                        disabled={syncingId === video.id}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            syncingId === video.id ? "animate-spin" : ""
                          }`}
                        />
                        {syncingId === video.id ? "Syncing..." : "Sync from YouTube"}
                      </button>

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

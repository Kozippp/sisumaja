import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { fetchYouTubeVideosData } from '@/lib/youtube';

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Get all visible featured videos
    const { data: videos, error: fetchError } = await supabase
      .from('featured_videos')
      .select('*')
      .eq('is_visible', true);

    if (fetchError) {
      console.error('Error fetching videos:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      );
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // The API accepts up to 50 IDs at once, so all carousel view counts refresh in one request.
    const youtubeVideos = await fetchYouTubeVideosData(videos.map((video) => video.youtube_video_id));
    const youtubeVideoById = new Map(youtubeVideos.map((video) => [video.videoId, video]));
    const lastSyncedAt = new Date().toISOString();
    const updates = videos.flatMap((video) => {
      const youtubeVideo = youtubeVideoById.get(video.youtube_video_id);
      return youtubeVideo
        ? [{
            id: video.id,
            view_count: youtubeVideo.viewCount,
            title: youtubeVideo.title,
            thumbnail_url: youtubeVideo.thumbnailUrl,
          }]
        : [];
    });

    await Promise.all(updates.map(async (update) => {
      const { error } = await supabase
        .from('featured_videos')
        .update({ ...update, last_synced_at: lastSyncedAt })
        .eq('id', update.id);
      if (error) console.error(`Error syncing featured video ${update.id}:`, error);
    }));

    // Return updated videos
    const { data: updatedVideos } = await supabase
      .from('featured_videos')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    return NextResponse.json({ 
      success: true, 
      data: updatedVideos || [] 
    });

  } catch (error) {
    console.error('Error syncing featured videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchYouTubeVideoData } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
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

    // Fetch fresh data from YouTube for all videos
    const updates = await Promise.all(
      videos.map(async (video) => {
        try {
          const videoData = await fetchYouTubeVideoData(video.youtube_video_id);
          if (videoData) {
            return {
              id: video.id,
              view_count: videoData.viewCount,
              title: videoData.title,
              thumbnail_url: videoData.thumbnailUrl
            };
          }
          return null;
        } catch (err) {
          console.error(`Error fetching data for ${video.youtube_video_id}:`, err);
          return null;
        }
      })
    );

    // Filter out failed updates and update database
    const validUpdates = updates.filter(u => u !== null);
    
    for (const update of validUpdates) {
      if (update) {
        await supabase
          .from('featured_videos')
          .update({
            view_count: update.view_count,
            title: update.title,
            thumbnail_url: update.thumbnail_url,
            last_synced_at: new Date().toISOString()
          })
          .eq('id', update.id);
      }
    }

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

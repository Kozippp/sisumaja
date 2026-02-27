import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractYouTubeVideoId, fetchYouTubeVideoData } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch video data from YouTube
    const videoData = await fetchYouTubeVideoData(videoId);
    if (!videoData) {
      return NextResponse.json(
        { error: 'Could not fetch video data from YouTube' },
        { status: 500 }
      );
    }

    // Get the highest display_order to add new video at the end
    const { data: existingVideos } = await supabase
      .from('featured_videos')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = existingVideos && existingVideos.length > 0 
      ? existingVideos[0].display_order + 1 
      : 0;

    // Insert into database
    const { data, error } = await supabase
      .from('featured_videos')
      .insert({
        youtube_url: youtubeUrl,
        youtube_video_id: videoData.videoId,
        title: videoData.title,
        thumbnail_url: videoData.thumbnailUrl,
        view_count: videoData.viewCount,
        display_order: nextOrder,
        last_synced_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error adding featured video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get video from database
    const { data: video, error: fetchError } = await supabase
      .from('featured_videos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Fetch fresh data from YouTube
    const videoData = await fetchYouTubeVideoData(video.youtube_video_id);
    if (!videoData) {
      return NextResponse.json(
        { error: 'Could not fetch video data from YouTube' },
        { status: 500 }
      );
    }

    // Update database
    const { data, error } = await supabase
      .from('featured_videos')
      .update({
        title: videoData.title,
        thumbnail_url: videoData.thumbnailUrl,
        view_count: videoData.viewCount,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error syncing featured video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

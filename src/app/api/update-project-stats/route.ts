import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Prefer service role key for backend operations to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    if (!YOUTUBE_API_KEY) {
      // If we don't have the key, we can't update, but we shouldn't crash the frontend.
      return NextResponse.json({ error: 'YouTube API Key missing on server' }, { status: 500 });
    }

    // 1. Fetch project details
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('youtube_video_id, show_youtube_stats')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.show_youtube_stats || !project.youtube_video_id) {
      return NextResponse.json({ message: 'Auto-update disabled', skipped: true });
    }

    // 2. Fetch data from YouTube
    const youtubeResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${project.youtube_video_id}&key=${YOUTUBE_API_KEY}`
    );

    const youtubeData = await youtubeResponse.json();

    if (!youtubeData.items || youtubeData.items.length === 0) {
      console.error('YouTube video not found:', project.youtube_video_id);
      return NextResponse.json({ error: 'Video not found on YouTube' }, { status: 404 });
    }

    const stats = youtubeData.items[0].statistics;
    
    // Convert to strings as DB expects text (or numbers, based on schema, but here TEXT)
    const newStats = {
      stat_views: stats.viewCount,
      stat_likes: stats.likeCount,
      stat_comments: stats.commentCount,
    };

    // 3. Update database
    const { error: updateError } = await supabase
      .from('projects')
      .update(newStats)
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating Supabase:', updateError);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: newStats 
    });

  } catch (error) {
    console.error('Error in update-project-stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


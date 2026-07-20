import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { fetchYouTubeVideosData } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { projectIds } = await request.json();
    if (!Array.isArray(projectIds)) {
      return NextResponse.json({ error: 'Project IDs are required' }, { status: 400 });
    }

    const ids = [...new Set(projectIds.filter((id): id is string => typeof id === 'string'))].slice(0, 50);
    if (ids.length === 0) return NextResponse.json({ success: true, data: {} });

    const supabase = getSupabaseServer();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, youtube_video_id, show_youtube_stats')
      .in('id', ids)
      .eq('is_visible', true);

    if (error) {
      console.error('Error fetching projects for stats sync:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    const automaticProjects = (projects || []).filter(
      (project) => project.show_youtube_stats && project.youtube_video_id
    );
    if (automaticProjects.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    const youtubeVideos = await fetchYouTubeVideosData(
      automaticProjects.map((project) => project.youtube_video_id!)
    );
    const youtubeVideoById = new Map(youtubeVideos.map((video) => [video.videoId, video]));
    const updates = automaticProjects.flatMap((project) => {
      const youtubeVideo = youtubeVideoById.get(project.youtube_video_id!);
      return youtubeVideo
        ? [{
            id: project.id,
            stat_views: String(youtubeVideo.viewCount),
          }]
        : [];
    });

    // Preserve manually maintained fields. Only YouTube's available statistics are overwritten.
    await Promise.all(updates.map(async ({ id, stat_views }) => {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ stat_views })
        .eq('id', id);
      if (updateError) console.error(`Error syncing project ${id}:`, updateError);
    }));

    return NextResponse.json({
      success: true,
      data: Object.fromEntries(updates.map(({ id, stat_views }) => [id, stat_views])),
    });
  } catch (error) {
    console.error('Error syncing project statistics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// YouTube API utilities

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
}

type YouTubeApiVideo = {
  id: string;
  snippet?: {
    title?: string;
    thumbnails?: {
      maxres?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: { viewCount?: string };
};

/**
 * Extract video ID from YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/,
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

/**
 * Fetch data for up to 50 YouTube videos per API request.
 */
export async function fetchYouTubeVideosData(videoIds: string[]): Promise<YouTubeVideoData[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('YouTube API key not configured');
    return [];
  }

  const uniqueIds = [...new Set(videoIds.filter((id) => /^[a-zA-Z0-9_-]{11}$/.test(id)))];
  const batches = Array.from({ length: Math.ceil(uniqueIds.length / 50) }, (_, index) =>
    uniqueIds.slice(index * 50, (index + 1) * 50)
  );
  const videos: YouTubeVideoData[] = [];

  try {
    for (const batch of batches) {
      const params = new URLSearchParams({
        id: batch.join(','),
        part: 'snippet,statistics',
        key: apiKey,
      });
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);

      if (!response.ok) {
        console.error('YouTube API error:', response.status);
        continue;
      }

      const data = (await response.json()) as { items?: YouTubeApiVideo[] };
      for (const video of data.items || []) {
        const thumbnails = video.snippet?.thumbnails;
        const thumbnailUrl =
          thumbnails?.maxres?.url ||
          thumbnails?.high?.url ||
          thumbnails?.medium?.url ||
          thumbnails?.default?.url;

        if (!video.id || !video.snippet?.title || !thumbnailUrl) continue;

        videos.push({
          videoId: video.id,
          title: video.snippet.title,
          thumbnailUrl,
          viewCount: parseInt(video.statistics?.viewCount || '0', 10),
        });
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
  }

  return videos;
}

/** Fetch video data for one YouTube video. */
export async function fetchYouTubeVideoData(videoId: string): Promise<YouTubeVideoData | null> {
  const [video] = await fetchYouTubeVideosData([videoId]);
  return video || null;
}

/**
 * Format view count for display (e.g., 1.2M, 45K)
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

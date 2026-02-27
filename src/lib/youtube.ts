// YouTube API utilities

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
}

/**
 * Extract video ID from YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
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

/**
 * Fetch video data from YouTube Data API
 */
export async function fetchYouTubeVideoData(videoId: string): Promise<YouTubeVideoData | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.error('YouTube API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${apiKey}`
    );

    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.error('Video not found:', videoId);
      return null;
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;

    // Get highest quality thumbnail available
    const thumbnails = snippet.thumbnails;
    const thumbnailUrl = 
      thumbnails.maxres?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url;

    return {
      videoId,
      title: snippet.title,
      thumbnailUrl,
      viewCount: parseInt(statistics.viewCount || '0', 10)
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return null;
  }
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

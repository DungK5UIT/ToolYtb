import { useState, useEffect } from 'react';
import { fetchActiveChannels, fetchLatestVideosForChannel } from '../services/youtubeApiService';

interface Video {
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelName: string;
  channelId: string;
}

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getDownloads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const activeChannels = await fetchActiveChannels();
      
      const videoPromises = activeChannels.map(async (channel: any) => {
        const videos = await fetchLatestVideosForChannel(channel.channelId, 5);
        return videos.map((video: any) => ({
          ...video,
          channelName: channel.channelName,
          channelId: channel.channelId
        }));
      });

      const allVideos = (await Promise.all(videoPromises)).flat();
      
      // Sắp xếp video theo ngày xuất bản (mới nhất đầu tiên)
      allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      setDownloads(allVideos);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDownloads();
  }, []);

  return { downloads, loading, error, getDownloads };
};
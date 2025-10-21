import { useState, useEffect } from 'react';
import { fetchActiveChannels, fetchLatestVideosForChannel } from '../services/youtubeApiService';
import { Video, Channel } from '../types';

export const useLatestVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const activeChannels: Channel[] = await fetchActiveChannels();
      
      const videoPromises = activeChannels.map(async (channel) => {
        const latestVideos = await fetchLatestVideosForChannel(channel.channelId, 5);
        return latestVideos.map((video: any) => ({
          id: video.videoId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: video.publishedAt,
          description: video.description,
          channelName: channel.channelName,
        }));
      });

      const allVideos = (await Promise.all(videoPromises)).flat();
      
      // Sắp xếp video theo ngày xuất bản (mới nhất đầu tiên)
      allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      setVideos(allVideos);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  return { videos, loading, error, getVideos };
};
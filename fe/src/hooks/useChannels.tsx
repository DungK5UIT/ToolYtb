import { useState, useEffect } from 'react';
import { fetchChannels, unsubscribeFromChannel } from '../services/youtubeApiService';
import { Channel } from '../types/channel';

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getChannels = async () => {
    try {
      const data = await fetchChannels();
      setChannels(data);
    } catch (err) {
      setError("Không thể tải danh sách kênh. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId: string) => {
    try {
      await unsubscribeFromChannel(channelId);
      setChannels(prevChannels =>
        prevChannels.map(channel => 
          channel.channelId === channelId ? { ...channel, active: false } : channel
        )
      );
    } catch (err) {
      setError("Không thể ngừng theo dõi kênh.");
    }
  };

  useEffect(() => {
    getChannels();
  }, []);

  return { channels, isLoading, error, handleUnsubscribe, getChannels };
};
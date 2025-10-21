import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/youtubeApiService';

interface DashboardStats {
  totalChannels: number;
  activeChannels: number;
  inactiveChannels: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getStats = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats({
        totalChannels: data.totalChannels,
        activeChannels: data.activeChannels,
        inactiveChannels: data.inactiveChannels,
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return { stats, loading, error, getStats };
};
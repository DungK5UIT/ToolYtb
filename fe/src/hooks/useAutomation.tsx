import { useState, useEffect, useCallback } from 'react';
import downloadService from '../api/downloadService';
import channelService, { ChannelResponse, WebhookEvent } from '../api/channelService';
import websocketService from '../services/websocketService';

const USE_API = process.env.REACT_APP_USE_API === 'true';

export interface AutomationStatus {
  channelId: string;
  channelName: string;
  enabled: boolean;
  settings: {
    quality: '720p' | '1080p' | '480p' | '360p' | '240p';
    format: 'mp4' | 'webm' | 'mp3';
    audioOnly: boolean;
    maxDuration?: number;
    titleFilter?: string;
  };
  statistics: {
    totalAutoDownloads: number;
    lastAutoDownload?: string;
    successRate: number;
  };
}

export interface AutomationOverview {
  totalChannels: number;
  activeAutomations: number;
  totalAutoDownloads: number;
  averageSuccessRate: number;
  recentWebhooks: number;
}

export interface UseAutomationReturn {
  automationStatuses: AutomationStatus[];
  channels: ChannelResponse[];
  webhookEvents: WebhookEvent[];
  overview: AutomationOverview;
  loading: boolean;
  error: string | null;
  
  enableAutomation: (channelId: string, settings: any) => Promise<void>;
  disableAutomation: (channelId: string) => Promise<void>;
  updateAutomationSettings: (channelId: string, settings: any) => Promise<void>;
  simulateWebhook: (channelId: string, videoData?: any) => Promise<void>;
  testWebhook: (channelId: string) => Promise<boolean>;
  resubscribeWebhook: (channelId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  
  isWebSocketConnected: boolean;
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  
  isUsingApi: boolean;
}

const useAutomation = (options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  connectWebSocket?: boolean;
} = {}): UseAutomationReturn => {
  
  const { 
    autoRefresh = false, 
    refreshInterval = 30000,
    connectWebSocket: shouldConnectWS = true 
  } = options;

  const [automationStatuses, setAutomationStatuses] = useState<AutomationStatus[]>([]);
  const [channels, setChannels] = useState<ChannelResponse[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [overview, setOverview] = useState<AutomationOverview>({
    totalChannels: 0,
    activeAutomations: 0,
    totalAutoDownloads: 0,
    averageSuccessRate: 0,
    recentWebhooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const loadData = useCallback(async () => {
    if (!USE_API) {
      setChannels([]);
      setAutomationStatuses([]);
      setWebhookEvents([]);
      setOverview({
        totalChannels: 0,
        activeAutomations: 0,
        totalAutoDownloads: 0,
        averageSuccessRate: 0,
        recentWebhooks: 0
      });
      return;
    }

    try {
      setError(null);
      const channelsData = await channelService.getAllChannels();
      setChannels(channelsData);
      const automationPromises = channelsData.map(async (channel) => {
        const status = await downloadService.getChannelAutomationStatus(channel.channelId);
        return {
          channelId: channel.channelId,
          channelName: channel.channelName,
          enabled: status.enabled,
          settings: {
            quality: (status.settings.quality as '720p' | '1080p' | '480p' | '360p' | '240p') || '720p',
            format: (status.settings.format as 'mp4' | 'webm' | 'mp3') || 'mp4',
            audioOnly: status.settings.audioOnly || false,
            maxDuration: status.settings.maxDuration,
            titleFilter: status.settings.titleFilter
          },
          statistics: status.statistics
        };
      });

      const automationData = await Promise.all(automationPromises);
      setAutomationStatuses(automationData);

      const webhookData = await channelService.getWebhookEvents({ 
        size: 20, 
        page: 0 
      });
      setWebhookEvents(webhookData.content);

      const overview: AutomationOverview = {
        totalChannels: channelsData.length,
        activeAutomations: channelsData.length,
        totalAutoDownloads: automationData.reduce((sum, a) => sum + a.statistics.totalAutoDownloads, 0),
        averageSuccessRate: automationData.length > 0 
          ? Math.round(automationData.reduce((sum, a) => sum + a.statistics.successRate, 0) / automationData.length)
          : 0,
        recentWebhooks: webhookData.content.filter(e => e.status === 'COMPLETED').length
      };
      setOverview(overview);

    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể tải dữ liệu automation');
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await loadData();
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  const enableAutomation = useCallback(async (channelId: string, settings: any) => {
    if (!USE_API) {
      return;
    }

    try {
      setError(null);
      await downloadService.enableAutoDownloadForChannel(channelId, settings);
      

      setAutomationStatuses(prev => prev.map(status => 
        status.channelId === channelId 
          ? { ...status, enabled: true, settings }
          : status
      ));


      setTimeout(() => refreshData(), 1000);
      
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể bật tự động tải');
      throw error;
    }
  }, [refreshData]);


  const disableAutomation = useCallback(async (channelId: string) => {
    if (!USE_API) {
      return;
    }

    try {
      setError(null);
      await downloadService.disableAutoDownloadForChannel(channelId);
      

      setAutomationStatuses(prev => prev.map(status => 
        status.channelId === channelId 
          ? { ...status, enabled: false }
          : status
      ));
      
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể tắt tự động tải');
      throw error;
    }
  }, []);


  const updateAutomationSettings = useCallback(async (channelId: string, settings: any) => {
    if (!USE_API) {
      return;
    }

    try {
      setError(null);
      await downloadService.enableAutoDownloadForChannel(channelId, settings);
      setAutomationStatuses(prev => prev.map(status => 
        status.channelId === channelId 
          ? { ...status, settings }
          : status
      ));
      
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể cập nhật cài đặt tự động');
      throw error;
    }
  }, []);


  const simulateWebhook = useCallback(async (channelId: string, videoData?: any) => {
    if (!USE_API) {
      return;
    }

    try {
      setError(null);
      const channel = channels.find(c => c.channelId === channelId);
      if (!channel) throw new Error('Channel not found');

      const defaultVideoData = {
        videoId: `demo_${Date.now()}`,
        channelId: channelId,
        title: `Demo Video - ${new Date().toLocaleString('vi-VN')}`,
        description: 'Video demo để test automation workflow'
      };

      await channelService.simulateNewVideoWebhook(videoData || defaultVideoData);
      

      setTimeout(() => {
        loadData();
      }, 2000);
      
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể mô phỏng webhook');
      throw error;
    }
  }, [channels, loadData]);


  const testWebhook = useCallback(async (channelId: string): Promise<boolean> => {
    if (!USE_API) {
      return false;
    }

    try {
      setError(null);
      const result = await channelService.testWebhookConnectivity(channelId);
      return result.success;
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể kiểm tra webhook');
      return false;
    }
  }, []);


  const resubscribeWebhook = useCallback(async (channelId: string) => {
    if (!USE_API) {
      return;
    }

    try {
      setError(null);
      await channelService.resubscribeWebhook(channelId);
    } catch (error: any) {
      setError(error.userMessage || error.message || 'Không thể đăng ký lại webhook');
      throw error;
    }
  }, []);


  const connectWebSocket = useCallback(async () => {
    try {
      await websocketService.connect();
      setIsWebSocketConnected(true);
      

      websocketService.onNewVideo((data) => {

        setTimeout(() => loadData(), 1000);
      });

      websocketService.onDownloadCompleted((data) => {

        setTimeout(() => loadData(), 1000);
      });

    } catch (error) {
      setIsWebSocketConnected(false);
    }
  }, [loadData]);

  const disconnectWebSocket = useCallback(() => {
    websocketService.disconnect();
    setIsWebSocketConnected(false);
  }, []);


  useEffect(() => {
    refreshData();
  }, [refreshData]);


  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshData]);


  useEffect(() => {
    if (shouldConnectWS) {
      connectWebSocket();
      
      return () => {
        disconnectWebSocket();
      };
    }
  }, [shouldConnectWS, connectWebSocket, disconnectWebSocket]);

  return {
    automationStatuses,
    channels,
    webhookEvents,
    overview,
    loading,
    error,
    
    enableAutomation,
    disableAutomation,  
    updateAutomationSettings,
    simulateWebhook,
    testWebhook,
    resubscribeWebhook,
    refreshData,
    
    isWebSocketConnected,
    connectWebSocket,
    disconnectWebSocket,

    isUsingApi: USE_API
  };
};

export default useAutomation;

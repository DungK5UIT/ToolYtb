import apiClient from './axiosConfig';

export interface ChannelSubscriptionRequest {
  channelId: string;
  channelName: string;
  description?: string;
}

export interface ChannelResponse {
  id: string;
  channelId: string;
  channelName: string;
  description?: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  subscribedDate: string;
  lastChecked?: string;
  videoCount?: number;
  avatarUrl?: string;
}

export interface ChannelStatistics {
  totalChannels: number;
  activeChannels: number;
  pausedChannels: number;
  errorChannels: number;
  totalVideos: number;
}

export interface VideoResponse {
  id: string;
  videoId: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  duration: number;
  publishedAt: string;
  description?: string;
}

export interface WebhookEvent {
  id: string;
  videoId: string;
  channelId: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnailUrl?: string;
  duration?: number;
  eventType: 'NEW_VIDEO' | 'VIDEO_UPDATED' | 'CHANNEL_UPDATED';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processedAt?: string;
  errorMessage?: string;
}

export interface ChannelWebhookStatus {
  channelId: string;
  channelName: string;
  webhookUrl: string;
  subscriptionStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'FAILED';
  lastPing?: string;
  expiration?: string;
}

class ChannelService {
  async getAllChannels(): Promise<ChannelResponse[]> {
    const response = await apiClient.get('/api/v1/channels');
    return response.data;
  }

  async getChannelById(channelId: string): Promise<ChannelResponse> {
    const response = await apiClient.get(`/api/v1/channels/${channelId}`);
    return response.data;
  }

  async getActiveChannels(): Promise<ChannelResponse[]> {
    const response = await apiClient.get('/api/v1/channels/active');
    return response.data;
  }

  async subscribeToChannel(data: ChannelSubscriptionRequest): Promise<ChannelResponse> {
    const response = await apiClient.post('/api/v1/channels/subscribe', data);
    return response.data;
  }

  async unsubscribeFromChannel(channelId: string): Promise<void> {
    await apiClient.delete(`/api/v1/channels/${channelId}/unsubscribe`);
  }

  async toggleChannelStatus(channelId: string): Promise<ChannelResponse> {
    const response = await apiClient.put(`/api/v1/channels/${channelId}/toggle`);
    return response.data;
  }

  async refreshChannelSubscription(channelId: string): Promise<void> {
    await apiClient.post(`/api/v1/channels/${channelId}/refresh`);
  }

  async getLatestVideosForChannel(channelId: string, limit: number = 5): Promise<VideoResponse[]> {
    const response = await apiClient.get(`/api/v1/channels/${channelId}/videos/latest`, {
      params: { limit }
    });
    return response.data;
  }

  async getChannelStatistics(): Promise<ChannelStatistics> {
    const response = await apiClient.get('/api/v1/channels/statistics');
    return response.data;
  }




  async simulateNewVideoWebhook(videoData: {
    videoId: string;
    channelId: string;
    title: string;
    description?: string;
    publishedAt?: string;
    thumbnailUrl?: string;
    duration?: number;
  }): Promise<void> {
    const webhookPayload = {
      videoId: videoData.videoId,
      channelId: videoData.channelId,
      title: videoData.title,
      description: videoData.description || `Demo video - ${videoData.title}`,
      publishedAt: videoData.publishedAt || new Date().toISOString(),
      thumbnailUrl: videoData.thumbnailUrl || `https://i.ytimg.com/vi/${videoData.videoId}/maxresdefault.jpg`,
      duration: videoData.duration || 213,
      eventType: 'NEW_VIDEO'
    };

    await apiClient.post('/api/webhook/youtube', webhookPayload);
  }


  async getWebhookEvents(params: {
    page?: number;
    size?: number;
    channelId?: string;
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  } = {}): Promise<{
    content: WebhookEvent[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }> {
    const response = await apiClient.get('/api/v1/webhook/events', { params });
    return response.data;
  }


  async getChannelWebhookStatus(channelId: string): Promise<ChannelWebhookStatus> {
    const response = await apiClient.get(`/api/v1/channels/${channelId}/webhook-status`);
    return response.data;
  }


  async testWebhookConnectivity(channelId: string): Promise<{
    success: boolean;
    message: string;
    responseTime?: number;
  }> {
    const response = await apiClient.post(`/api/v1/channels/${channelId}/test-webhook`);
    return response.data;
  }


  async resubscribeWebhook(channelId: string): Promise<void> {
    await apiClient.post(`/api/v1/channels/${channelId}/resubscribe-webhook`);
  }
}

const channelService = new ChannelService();
export default channelService;

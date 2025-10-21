import apiClient from './axiosConfig';

export interface StartDownloadRequest {
  videoId: string;
  channelId: string;
  quality: '720p' | '1080p' | '480p' | '360p' | '240p';
  format: 'mp4' | 'webm' | 'mp3';
}

export interface BatchDownloadRequest extends StartDownloadRequest {}

export interface DownloadResponse {
  id: string;
  videoId: string;
  channelId: string;
  title: string;
  channelName: string;
  status: 'PENDING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  quality: string;
  format: string;
  downloadSpeed?: string;
  filePath?: string;
  thumbnailUrl?: string;
  duration?: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadProgress {
  videoId: string;
  progress: number;
  downloadSpeed: string;
  estimatedTimeRemaining?: number;
}

export interface DownloadStatistics {
  totalDownloads: number;
  completedDownloads: number;
  failedDownloads: number;
  inProgressDownloads: number;  
  activeDownloads?: number;     
  totalSize: string;
  averageSpeed: string;
}

export interface QueueStatus {
  queueSize: number;
  activeDownloads: number;
  maxConcurrentDownloads: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  status?: 'PENDING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

class DownloadService {
  async startDownload(data: StartDownloadRequest): Promise<DownloadResponse> {
    const response = await apiClient.post('/api/v1/downloads/start', data);
    return response.data;
  }

  async startBatchDownload(downloads: BatchDownloadRequest[]): Promise<DownloadResponse[]> {
    const response = await apiClient.post('/api/v1/downloads/batch', downloads);
    return response.data;
  }

  async getDownloadStatus(videoId: string): Promise<DownloadResponse> {
    const response = await apiClient.get(`/api/v1/downloads/${videoId}/status`);
    return response.data;
  }

  async getDownloadProgress(videoId: string): Promise<DownloadProgress> {
    const response = await apiClient.get(`/api/v1/downloads/${videoId}/progress`);
    return response.data;
  }

  async retryDownload(videoId: string): Promise<DownloadResponse> {
    const response = await apiClient.post(`/api/v1/downloads/${videoId}/retry`);
    return response.data;
  }

  async cancelDownload(videoId: string): Promise<void> {
    await apiClient.delete(`/api/v1/downloads/${videoId}/cancel`);
  }

  async getAllDownloads(params: PaginationParams = {}): Promise<PaginatedResponse<DownloadResponse>> {
    const response = await apiClient.get('/api/v1/downloads', { params });
    return response.data;
  }

  async getActiveDownloads(): Promise<DownloadResponse[]> {
    const response = await apiClient.get('/api/v1/downloads/active');
    return response.data;
  }

  async getFailedDownloads(): Promise<DownloadResponse[]> {
    const response = await apiClient.get('/api/v1/downloads/failed');
    return response.data;
  }



  async getDownloadStatistics(): Promise<DownloadStatistics> {
    const response = await apiClient.get('/api/v1/downloads/statistics');
    return response.data;
  }

  async getQueueStatus(): Promise<QueueStatus> {
    const response = await apiClient.get('/api/v1/downloads/queue');
    return response.data;
  }


  async healthCheck(): Promise<{
    status: 'UP' | 'DOWN';
    components: {
      database: { status: string };
      kafka: { status: string };
      diskSpace: { status: string; details: { free: number; total: number } };
    };
  }> {
    const response = await apiClient.get('/api/actuator/health');
    return response.data;
  }


  async getDetailedStatistics(): Promise<DownloadStatistics & {
    averageDownloadTime: number;
    successRate: number;
    topChannels: Array<{ channelId: string; channelName: string; downloadCount: number }>;
    dailyStats: Array<{ date: string; downloads: number; success: number; failed: number }>;
  }> {
    const response = await apiClient.get('/api/v1/downloads/statistics/detailed');
    return response.data;
  }


  async retryAllFailedDownloads(): Promise<{
    retriedCount: number;
    successCount: number;
    failedCount: number;
  }> {
    const response = await apiClient.post('/api/v1/downloads/failed/retry-all');
    return response.data;
  }


  async clearCompletedDownloads(olderThanDays: number = 30): Promise<{
    deletedCount: number;
  }> {
    const response = await apiClient.delete(`/api/v1/downloads/completed/clear`, {
      params: { olderThanDays }
    });
    return response.data;
  }


  async bulkCancelDownloads(videoIds: string[]): Promise<{
    cancelledCount: number;
    failedCount: number;
  }> {
    const response = await apiClient.post('/api/v1/downloads/bulk/cancel', { videoIds });
    return response.data;
  }


  async getDownloadSpeedAnalytics(): Promise<{
    averageSpeed: number;
    peakSpeed: number;
    slowestSpeed: number;
    speedByHour: Array<{ hour: number; avgSpeed: number }>;
    speedByQuality: Array<{ quality: string; avgSpeed: number }>;
  }> {
    const response = await apiClient.get('/api/v1/downloads/analytics/speed');
    return response.data;
  }


  async updatePendingDownloadQuality(
    videoId: string, 
    quality: '720p' | '1080p' | '480p' | '360p' | '240p'
  ): Promise<DownloadResponse> {
    const response = await apiClient.put(`/api/v1/downloads/${videoId}/quality`, { quality });
    return response.data;
  }


  async enableAutoDownloadForChannel(
    channelId: string,
    settings: {
      quality?: '720p' | '1080p' | '480p' | '360p' | '240p';
      format?: 'mp4' | 'webm' | 'mp3';
      audioOnly?: boolean;
      maxDuration?: number;
      titleFilter?: string;
    } = {}
  ): Promise<{
    success: boolean;
    automationRuleId: string;
    message: string;
  }> {
    const response = await apiClient.post(`/api/v1/downloads/automation/enable/${channelId}`, settings);
    return response.data;
  }


  async disableAutoDownloadForChannel(channelId: string): Promise<void> {
    await apiClient.delete(`/api/v1/downloads/automation/disable/${channelId}`);
  }


  async getChannelAutomationStatus(channelId: string): Promise<{
    enabled: boolean;
    settings: {
      quality: string;
      format: string;
      audioOnly: boolean;
      maxDuration?: number;
      titleFilter?: string;
    };
    statistics: {
      totalAutoDownloads: number;
      lastAutoDownload?: string;
      successRate: number;
    };
  }> {
    const response = await apiClient.get(`/api/v1/downloads/automation/status/${channelId}`);
    return response.data;
  }
}

const downloadService = new DownloadService();
export default downloadService;
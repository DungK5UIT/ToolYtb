export type ApiStatus = 'ACTIVE' | 'PAUSED' | 'ERROR';
export type UIStatus = 'Hoạt động' | 'Tạm dừng' | 'Lỗi';

export interface Channel {
  id: string;
  channelId: string;
  channelName: string;
  description?: string;
  thumbnailUrl: string;
  active: boolean;
  subscriberCount: number;
  videoCount: number;
  lastVideoAt: string;
  subscribedAt: string;
  lastCheckedAt: string;
}

export interface Video {
  id: string; 
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  description: string;
  channelName?: string; 
  channelId: string; 
}

export interface DashboardStats {
  totalChannels: number;
  activeChannels: number;
  inactiveChannels: number;
}

export interface ApiConfig {
  useApi: boolean;
  gatewayUrl: string;
  channelServiceUrl: string;
  downloadServiceUrl: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const mapApiStatusToUI = (apiStatus: ApiStatus): UIStatus => {
  const statusMap: Record<ApiStatus, UIStatus> = {
    'ACTIVE': 'Hoạt động',
    'PAUSED': 'Tạm dừng', 
    'ERROR': 'Lỗi',
  };
  return statusMap[apiStatus] || 'Lỗi';
};

export const mapUIStatusToApi = (uiStatus: UIStatus): ApiStatus => {
  const statusMap: Record<UIStatus, ApiStatus> = {
    'Hoạt động': 'ACTIVE',
    'Tạm dừng': 'PAUSED',
    'Lỗi': 'ERROR',
  };
  return statusMap[uiStatus] || 'ERROR';
};
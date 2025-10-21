  
export interface Channel {
  id: number;
  channelId: string;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  active: boolean;
  subscriberCount: number;
  videoCount: number;
  lastVideoAt: string | null;
  subscribedAt: string;
  lastCheckedAt: string;
}
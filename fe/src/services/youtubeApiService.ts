import axios from 'axios';

const API_URL = 'http://34.142.129.128:9002/api/v1';

export const fetchChannels = async () => {
  try {
    const response = await axios.get(`${API_URL}/channels`);
    return response.data.content;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kênh:", error);
    throw error;
  }
};

export const fetchActiveChannels = async () => {
  try {
    const response = await axios.get(`${API_URL}/channels/active`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kênh đang hoạt động:", error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/channels/statistics`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê dashboard:", error);
    throw error;
  }
};

export const fetchLatestVideosForChannel = async (channelId: string, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}/channels/${channelId}/videos/latest?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy video của kênh ${channelId}:`, error);
    throw error;
  }
};

export const unsubscribeFromChannel = async (channelId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/channels/${channelId}/unsubscribe`);
    return response.status;
  } catch (error) {
    console.error("Lỗi khi ngừng theo dõi kênh:", error);
    throw error;
  }
};

export const subscribeToChannel = async (channelData: { channelId: string; channelName: string; description: string; }) => {
  try {
    const response = await axios.post(`${API_URL}/channels/subscribe`, channelData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi theo dõi kênh mới:", error);
    throw error;
  }
};

export const fetchChannelById = async (channelId: string) => {
  try {
    const response = await axios.get(`${API_URL}/channels/${channelId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết kênh:", error);
    throw error;
  }
};

export const downloadVideo = async (videoId: string, quality: string) => {
  try {
    const downloadUrl = `${API_URL}/channels/videos/${videoId}/download-direct?quality=${quality}`;
    const response = await axios.get(downloadUrl, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${videoId}-${quality}.mp4`);
    document.body.appendChild(link);
    link.click();
    
    window.URL.revokeObjectURL(url);
    link.remove();
    
    return {
      status: 'success',
      message: 'Video download started',
      downloadPath: 'Downloaded to your browser downloads folder'
    };
  } catch (error) {
    console.error("Lỗi khi tải video:", error);
    throw error;
  }
};

export const updateYoutubeApiKey = async (apiKey: string, description: string) => {
  try {
    const response = await axios.put(`${API_URL}/admin/api-keys/youtube`, {
      apiKey,
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật YouTube API Key:", error);
    throw error;
  }
};
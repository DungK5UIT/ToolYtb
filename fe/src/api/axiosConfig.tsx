import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://103.75.187.176:9001',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API Configuration: Connected to', 'http://103.75.187.176:9001');

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.method?.toUpperCase(), response.config.url, `(${response.status})`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, `(${error.response?.status || 'Network Error'})`);
    
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (status === 401) {
      error.userMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    } else if (status === 403) {
      error.userMessage = 'Bạn không có quyền truy cập chức năng này.';
    } else if (status === 404) {
      error.userMessage = 'Không tìm thấy dữ liệu yêu cầu.';
    } else if (status >= 500) {
      error.userMessage = 'Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
      error.userMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    } else if (status >= 400 && status < 500) {
      error.userMessage = message || 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
    } else {
      error.userMessage = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
# YouTube Dashboard - Tool Quản Lý Video Tự Động

Dashboard quản lý hệ thống tự động tải video YouTube với giao diện hiện đại và responsive.

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn

### Cài đặt và chạy
```bash
npm install
npm start
```

Truy cập: http://localhost:3000

### Build production
```bash
npm run build
```

## 📱 Tính năng

- **Dashboard**: Thống kê tổng quan, danh sách video gần đây
- **Quản lý kênh**: Thêm/xóa kênh YouTube cần theo dõi  
- **Video đã tải**: Xem tất cả video với trạng thái download
- **Responsive**: Tối ưu cho cả desktop và mobile
- **Real-time**: Cập nhật tiến trình download trực tiếp

## 🔧 Công nghệ sử dụng

- React 19 + TypeScript
- TailwindCSS
- React Router v7
- Axios + Socket.io
- Heroicons

## 📂 Cấu trúc dự án

```
src/
├── pages/          # Các trang chính
├── components/     # Components tái sử dụng
├── api/           # Cấu hình API
└── ...
```

## 🐳 Docker

```bash
docker build -t youtube-dashboard .
docker run -p 3000:3000 youtube-dashboard
```

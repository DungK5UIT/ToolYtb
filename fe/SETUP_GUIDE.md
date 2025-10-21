# Hướng dẫn chạy dự án YouTube Dashboard

## Yêu cầu hệ thống
- Node.js phiên bản 18+ 
- npm hoặc yarn

## Cách chạy dự án sau khi giải nén

### 1. Giải nén và vào thư mục dự án
```bash
unzip Tool_youtube.zip
cd Tool_youtube/new-dashboard
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy dự án ở chế độ development
```bash
npm start
```

Dự án sẽ chạy tại: http://localhost:3000

### 4. Build cho production (tùy chọn)
```bash
npm run build
```

## Cấu trúc dự án
- `src/pages/` - Các trang chính (Dashboard, Channel Management, Videos, Settings)
- `src/components/` - Components tái sử dụng
- `src/api/` - Cấu hình API (hiện tại trỏ đến localhost:8080)

## Lưu ý
- Trang đăng nhập chỉ mang tính demo, bấm "Đăng nhập" để vào dashboard
- API backend hiện tại trỏ đến `http://localhost:8080/api`
- Tất cả dữ liệu hiện tại là mock data


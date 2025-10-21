# Giai đoạn 1: Build ứng dụng React
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

COPY . .

# Chạy build ứng dụng React
RUN npm run build

# Giai đoạn 2: Phục vụ ứng dụng
# Sử dụng một image Node.js nhỏ gọn
FROM node:18-alpine

WORKDIR /app

# Cài đặt serve-static để phục vụ các file tĩnh
RUN npm install -g serve

# Sao chép các file đã build từ giai đoạn 1
COPY --from=build /app/build ./

# Mở cổng để truy cập ứng dụng
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["serve", "-s", "."]
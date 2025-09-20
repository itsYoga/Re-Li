# 多階段建構
FROM node:18-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴（如果沒有 package-lock.json 則使用 npm install）
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 複製原始碼
COPY . .

# 建構應用
RUN npm run build

# 生產階段
FROM nginx:alpine

# 複製建構結果到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]

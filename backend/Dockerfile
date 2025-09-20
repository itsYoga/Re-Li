# 使用 Node.js 18 Alpine 作為基礎映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝系統依賴
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴（如果沒有 package-lock.json 則使用 npm install）
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --only=production; fi

# 複製原始碼
COPY . .

# 建構 TypeScript
RUN npm run build

# 建立非 root 用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 變更檔案擁有者
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 啟動應用
CMD ["npm", "start"]

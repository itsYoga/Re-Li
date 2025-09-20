# Re:li - 記憶釀酒師與時空膠囊的結合體驗

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql" />
  <img src="https://img.shields.io/badge/Docker-支援-blue?logo=docker" />
</div>

## 🌟 專案概述

**Re:li** 是一個創新的 LINE MINI App，結合了「記憶釀酒師」的回溯功能與「時空膠囊」的期許功能，創造出在情感時間軸上無比強大的體驗。它讓使用者重新發現與摯友的美好回憶，並將珍貴時刻封存成時空膠囊傳遞給未來。

### 🎯 核心概念

- **Re:** 代表 `Replay` (重溫)、`Recall` (回憶)、`Return` (回歸)
- **li:** 代表 `Life` (生活)、`Love` (愛)、`Link` (連結)
- **Re:li:** 整個詞合在一起就是「重新連結」，重新連結過去與未來

## 🚀 主要功能

### 1. 記憶釀酒師 (Memory Brewer)
- **AI 智慧發掘**: 自動分析 LINE 聊天記錄，識別珍貴回憶片段
- **情感分析**: 使用本地 AI 分析對話的情感色彩和重要程度
- **回憶分類**: 根據內容自動標籤和分類回憶片段
- **隱私保護**: 所有分析都在使用者手機上完成，不上傳原始數據

### 2. 時空膠囊 (Time Capsule)
- **膠囊製作**: 選擇回憶片段，添加新訊息，設定解鎖時間
- **定時發送**: 系統會在指定時間自動發送膠囊給接收者
- **匿名選項**: 可選擇匿名發送，保護隱私
- **公開分享**: 可選擇將膠囊公開分享給社群

### 3. 個人管理
- **我的膠囊**: 管理已送出和已收到的膠囊
- **回憶庫**: 瀏覽所有被發掘的回憶片段
- **統計分析**: 查看情感趨勢和回憶分佈

## 🏗️ 技術架構

### 前端 (Frontend)
- **框架**: React 18 + TypeScript
- **建構工具**: Vite
- **樣式**: Tailwind CSS + Framer Motion
- **狀態管理**: React Hooks + Context
- **路由**: React Router DOM
- **LINE 整合**: LIFF (LINE Frontend Framework)

### 後端 (Backend)
- **框架**: Node.js + Express.js
- **語言**: TypeScript
- **資料庫**: PostgreSQL
- **ORM**: Knex.js
- **認證**: JWT
- **排程**: node-cron
- **日誌**: winston

### AI 處理 (AI Processing)
- **語言**: TypeScript
- **NLP 庫**: natural, sentiment
- **處理方式**: 本地端處理，保護隱私
- **功能**: 情感分析、關鍵詞提取、回憶分類

### 資料庫 (Database)
- **主資料庫**: PostgreSQL
- **快取**: Redis (可選)
- **遷移**: Knex.js migrations
- **種子資料**: Knex.js seeds

## 📁 專案結構

```
re-li/
├── frontend/                 # React 前端應用
│   ├── src/
│   │   ├── components/      # 可重用組件
│   │   ├── pages/          # 頁面組件
│   │   ├── services/       # API 服務
│   │   ├── hooks/          # 自定義 Hooks
│   │   └── utils/          # 工具函數
│   ├── public/             # 靜態資源
│   └── package.json
├── backend/                 # Node.js 後端 API
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # 中間件
│   │   ├── models/         # 資料模型
│   │   ├── services/       # 業務邏輯
│   │   └── config/         # 配置檔案
│   └── package.json
├── ai-processing/           # AI 處理模組
│   ├── src/
│   │   ├── emotionAnalyzer.ts
│   │   ├── memoryExtractor.ts
│   │   └── index.ts
│   └── package.json
├── database/                # 資料庫相關
│   ├── migrations/         # 資料庫遷移
│   └── seeds/             # 種子資料
├── docs/                   # 文檔
│   ├── API.md
│   └── DEVELOPMENT.md
├── docker-compose.yml      # Docker 編排
└── README.md
```

## 🛠️ 安裝與運行

### 環境需求

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (可選)
- Git

### 方法一：Docker 運行 (推薦)

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd re-li
   ```

2. **啟動服務**
   ```bash
   docker-compose up -d
   ```

3. **訪問應用**
   - 前端: http://localhost:3000
   - 後端 API: http://localhost:3001
   - 資料庫: localhost:5432

### 方法二：本地開發

1. **安裝依賴**
   ```bash
   # 安裝所有依賴
   npm run install:all
   ```

2. **設置資料庫**
   ```bash
   # 創建 PostgreSQL 資料庫
   createdb reli_db
   
   # 運行遷移
   cd backend
   npm run migrate
   npm run seed
   ```

3. **設置環境變數**
   ```bash
   # 複製環境變數範本
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # 編輯環境變數
   nano backend/.env
   nano frontend/.env
   ```

4. **啟動開發服務**
   ```bash
   # 啟動所有服務
   npm run dev
   
   # 或分別啟動
   npm run dev:frontend  # 前端
   npm run dev:backend   # 後端
   ```

## 🔧 開發指南

### 可用腳本

```bash
# 安裝所有依賴
npm run install:all

# 開發模式
npm run dev                 # 啟動所有服務
npm run dev:frontend        # 僅前端
npm run dev:backend         # 僅後端

# 建構
npm run build               # 建構所有服務
npm run build:frontend      # 建構前端
npm run build:backend       # 建構後端

# 測試
npm run test                # 運行所有測試
npm run test:frontend       # 前端測試
npm run test:backend        # 後端測試

# 資料庫
npm run migrate             # 運行遷移
npm run seed                # 載入種子資料
npm run rollback            # 回滾遷移

# 清理
npm run clean               # 清理所有 node_modules
npm run clean:frontend      # 清理前端
npm run clean:backend       # 清理後端
```

### 環境變數配置

#### 後端 (.env)
```env
# 資料庫配置
DATABASE_URL=postgresql://username:password@localhost:5432/reli_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reli_db
DB_USER=username
DB_PASSWORD=password

# 伺服器配置
PORT=3001
NODE_ENV=development

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here

# 前端 URL
FRONTEND_URL=http://localhost:3000

# LINE 配置
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
```

#### 前端 (.env)
```env
# API 配置
VITE_API_BASE_URL=http://localhost:3001/api

# LINE 配置
VITE_LIFF_ID=your-liff-id

# 應用配置
VITE_APP_TITLE=Re:li
```

## 🐛 常見問題與解決方案

### 1. 前端無法載入
**問題**: 前端頁面空白或載入失敗
**解決方案**:
```bash
# 檢查依賴是否正確安裝
cd frontend
npm install

# 檢查 Tailwind CSS 配置
npm run build

# 清除快取重新啟動
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. 後端資料庫連接失敗
**問題**: 後端無法連接 PostgreSQL
**解決方案**:
```bash
# 檢查 PostgreSQL 是否運行
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux

# 檢查資料庫是否存在
psql -l | grep reli_db

# 創建資料庫
createdb reli_db

# 檢查環境變數
cat backend/.env
```

### 3. Docker 容器啟動失敗
**問題**: Docker Compose 無法啟動服務
**解決方案**:
```bash
# 檢查 Docker 是否運行
docker --version
docker-compose --version

# 重新建構容器
docker-compose down
docker-compose up -d --build

# 查看容器日誌
docker-compose logs frontend
docker-compose logs backend
```

### 4. Tailwind CSS 樣式不生效
**問題**: 樣式沒有正確載入
**解決方案**:
```bash
# 檢查 PostCSS 配置
cat frontend/postcss.config.js

# 重新安裝 Tailwind
cd frontend
npm uninstall tailwindcss
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# 重新生成配置
npx tailwindcss init -p
```

### 5. AI 處理模組錯誤
**問題**: AI 相關功能無法使用
**解決方案**:
```bash
# 檢查 AI 模組依賴
cd ai-processing
npm install

# 檢查 TensorFlow.js 兼容性
npm list @tensorflow/tfjs

# 如果遇到 Xcode 許可證問題 (macOS)
sudo xcodebuild -license accept
```

## 📊 API 文檔

### 認證相關
- `POST /api/auth/login` - 使用者登入
- `POST /api/auth/logout` - 使用者登出
- `GET /api/auth/profile` - 獲取使用者資料

### 回憶相關
- `GET /api/memories` - 獲取使用者回憶列表
- `POST /api/memories/process` - 處理聊天記錄
- `GET /api/memories/:id` - 獲取特定回憶

### 膠囊相關
- `GET /api/capsules` - 獲取膠囊列表
- `POST /api/capsules` - 創建新膠囊
- `PUT /api/capsules/:id` - 更新膠囊
- `DELETE /api/capsules/:id` - 刪除膠囊
- `POST /api/capsules/:id/unlock` - 解鎖膠囊

詳細 API 文檔請參考 [API.md](./docs/API.md)

## 🚀 部署指南

### 生產環境部署

1. **準備伺服器**
   ```bash
   # 安裝 Docker 和 Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # 安裝 Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **配置環境變數**
   ```bash
   # 複製生產環境配置
   cp docker-compose.prod.yml docker-compose.yml
   
   # 編輯生產環境變數
   nano .env.production
   ```

3. **啟動服務**
   ```bash
   # 建構並啟動生產環境
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

### 監控與維護

```bash
# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f

# 重啟服務
docker-compose restart

# 更新服務
docker-compose pull
docker-compose up -d
```

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 支援與聯絡

- **專案維護者**: Re:li Team
- **Email**: support@reli.app
- **Issues**: [GitHub Issues](https://github.com/your-org/re-li/issues)
- **文檔**: [專案文檔](./docs/)

## 🙏 致謝

- React 社群提供的優秀框架
- Tailwind CSS 團隊的設計系統
- LINE 開發者平台的支援
- 所有開源貢獻者的無私奉獻

---

<div align="center">
  <p>Made with ❤️ by Re:li Team</p>
  <p>重新連結過去與未來的美好</p>
</div>
# Re:li 開發者指南

## 🚀 快速開始

### 1. 環境設置
```bash
# 克隆專案
git clone <repository-url>
cd re-li

# 安裝所有依賴
npm run install:all

# 設置資料庫
createdb reli_db

# 運行遷移和種子資料
cd backend
npm run migrate
npm run seed

# 啟動開發服務
cd ..
npm run dev
```

### 2. 訪問應用
- 前端: http://localhost:3000
- 後端 API: http://localhost:3001
- API 文檔: http://localhost:3001/api/docs

## 🏗️ 專案架構詳解

### 前端架構 (React + TypeScript)

```
frontend/src/
├── components/           # 可重用組件
│   ├── common/          # 通用組件
│   ├── forms/           # 表單組件
│   └── ui/              # UI 組件
├── pages/               # 頁面組件
│   ├── AuthPage.tsx     # 登入頁面
│   ├── HomePage.tsx     # 首頁
│   ├── MemoryBrewerPage.tsx  # 記憶釀酒師
│   └── CapsuleCreationPage.tsx  # 膠囊創建
├── services/            # API 服務
│   ├── api.ts          # API 客戶端
│   └── MemoryProcessor.ts  # 記憶處理
├── hooks/               # 自定義 Hooks
├── utils/               # 工具函數
├── types/               # TypeScript 類型定義
└── styles/              # 樣式檔案
```

### 後端架構 (Node.js + Express)

```
backend/src/
├── routes/              # API 路由
│   ├── auth.ts         # 認證路由
│   ├── memories.ts     # 回憶路由
│   ├── capsules.ts     # 膠囊路由
│   └── users.ts        # 使用者路由
├── middleware/          # 中間件
│   ├── auth.ts         # 認證中間件
│   ├── errorHandler.ts # 錯誤處理
│   └── requestLogger.ts # 請求日誌
├── services/            # 業務邏輯
│   ├── authService.ts  # 認證服務
│   ├── memoryService.ts # 回憶服務
│   └── capsuleService.ts # 膠囊服務
├── models/              # 資料模型
├── config/              # 配置檔案
└── utils/               # 工具函數
```

### AI 處理架構

```
ai-processing/src/
├── emotionAnalyzer.ts   # 情感分析器
├── memoryExtractor.ts   # 回憶提取器
├── nlpProcessor.ts      # NLP 處理器
└── index.ts            # 入口檔案
```

## 🔧 開發工作流程

### 1. 功能開發
```bash
# 創建新分支
git checkout -b feature/new-feature

# 開發功能
# ... 編寫代碼 ...

# 測試功能
npm run test

# 提交變更
git add .
git commit -m "feat: add new feature"

# 推送分支
git push origin feature/new-feature
```

### 2. 資料庫變更
```bash
# 創建遷移檔案
cd backend
npx knex migrate:make add_new_table

# 編輯遷移檔案
# ... 編寫遷移邏輯 ...

# 運行遷移
npm run migrate

# 創建種子資料
npx knex seed:make new_seed_data
```

### 3. API 開發
```bash
# 添加新路由
# 1. 在 routes/ 中創建路由檔案
# 2. 在 services/ 中實現業務邏輯
# 3. 在 middleware/ 中添加必要的中間件
# 4. 更新 API 文檔

# 測試 API
curl -X GET http://localhost:3001/api/health
```

## 🐛 除錯指南

### 前端除錯
```bash
# 檢查 React 開發者工具
# 1. 安裝 React Developer Tools 瀏覽器擴展
# 2. 檢查 Console 中的錯誤訊息
# 3. 使用 React DevTools 檢查組件狀態

# 檢查網路請求
# 1. 打開瀏覽器開發者工具
# 2. 查看 Network 標籤
# 3. 檢查 API 請求是否成功

# 檢查 Tailwind CSS
# 1. 確認 Tailwind 配置正確
# 2. 檢查 PostCSS 配置
# 3. 確認樣式檔案正確導入
```

### 後端除錯
```bash
# 檢查日誌
tail -f backend/logs/app.log

# 檢查資料庫連接
cd backend
npm run db:test

# 檢查 API 端點
curl -X GET http://localhost:3001/api/health
```

### 資料庫除錯
```bash
# 連接資料庫
psql -d reli_db

# 檢查表結構
\dt

# 檢查資料
SELECT * FROM users LIMIT 5;

# 檢查遷移狀態
SELECT * FROM knex_migrations;
```

## 🧪 測試指南

### 運行測試
```bash
# 運行所有測試
npm run test

# 運行前端測試
npm run test:frontend

# 運行後端測試
npm run test:backend

# 運行特定測試
npm run test -- --grep "memory processing"
```

### 測試覆蓋率
```bash
# 生成覆蓋率報告
npm run test:coverage

# 查看覆蓋率報告
open coverage/lcov-report/index.html
```

## 📦 建構與部署

### 本地建構
```bash
# 建構前端
cd frontend
npm run build

# 建構後端
cd backend
npm run build

# 建構所有服務
npm run build:all
```

### Docker 建構
```bash
# 建構 Docker 映像
docker-compose build

# 建構特定服務
docker-compose build frontend
docker-compose build backend
```

### 生產部署
```bash
# 使用 Docker Compose 部署
docker-compose -f docker-compose.prod.yml up -d

# 使用 PM2 部署
npm install -g pm2
pm2 start ecosystem.config.js
```

## 🔍 程式碼品質

### ESLint 檢查
```bash
# 檢查前端程式碼
cd frontend
npm run lint

# 檢查後端程式碼
cd backend
npm run lint

# 自動修復問題
npm run lint:fix
```

### TypeScript 檢查
```bash
# 檢查類型
npm run type-check

# 檢查前端類型
cd frontend
npm run type-check

# 檢查後端類型
cd backend
npm run type-check
```

## 📊 效能監控

### 前端效能
```bash
# 建構分析
cd frontend
npm run build:analyze

# 檢查包大小
npm run build:size
```

### 後端效能
```bash
# 啟動效能監控
cd backend
npm run dev:profile

# 檢查記憶體使用
npm run dev:memory
```

## 🛠️ 常用命令

### 開發命令
```bash
# 啟動開發服務
npm run dev

# 重新安裝依賴
npm run clean:all
npm run install:all

# 重置資料庫
npm run db:reset

# 查看服務狀態
docker-compose ps
```

### 除錯命令
```bash
# 查看日誌
docker-compose logs -f

# 進入容器
docker-compose exec frontend sh
docker-compose exec backend sh

# 重啟服務
docker-compose restart
```

## 📚 學習資源

### React 開發
- [React 官方文檔](https://react.dev/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

### Node.js 開發
- [Express.js 文檔](https://expressjs.com/)
- [Knex.js 查詢建構器](https://knexjs.org/)
- [PostgreSQL 文檔](https://www.postgresql.org/docs/)

### LINE 開發
- [LINE Developers 文檔](https://developers.line.biz/)
- [LIFF 文檔](https://developers.line.biz/en/docs/liff/)

## 🤝 貢獻指南

### 提交規範
```bash
# 功能提交
git commit -m "feat: add new feature"

# 修復提交
git commit -m "fix: resolve bug in memory processing"

# 文檔提交
git commit -m "docs: update API documentation"

# 樣式提交
git commit -m "style: format code with prettier"

# 重構提交
git commit -m "refactor: improve memory extraction logic"
```

### Pull Request 流程
1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 創建 Pull Request
5. 等待 Code Review
6. 合併到主分支

## 📞 技術支援

### 內部支援
- **技術負責人**: @tech-lead
- **前端負責人**: @frontend-lead
- **後端負責人**: @backend-lead

### 外部資源
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Issues](https://github.com/your-org/re-li/issues)
- [Discord 開發者頻道](https://discord.gg/your-server)

---

**Happy Coding! 🚀**

# Re:li 開發指南

## 🚀 快速開始

### 環境需求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **PostgreSQL**: 12.0 或更高版本
- **Git**: 2.0.0 或更高版本

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/your-username/re-li.git
   cd re-li
   ```

2. **安裝所有依賴**
   ```bash
   npm run install:all
   ```

3. **設定環境變數**
   ```bash
   # 複製環境變數範例檔案
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # 編輯環境變數
   nano backend/.env
   nano frontend/.env
   ```

4. **啟動資料庫**
   ```bash
   # 使用 Docker Compose
   docker-compose up postgres -d
   
   # 或手動啟動 PostgreSQL
   # 確保 PostgreSQL 在 localhost:5432 運行
   ```

5. **執行資料庫遷移**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

6. **啟動開發伺服器**
   ```bash
   # 啟動所有服務
   npm run dev
   
   # 或分別啟動
   npm run dev:backend  # 後端 API (http://localhost:3001)
   npm run dev:frontend # 前端應用 (http://localhost:3000)
   npm run dev:ai       # AI 處理模組
   ```

## 🏗️ 專案架構

### 前端架構

```
frontend/
├── src/
│   ├── components/          # 可重用的 React 組件
│   │   └── MemoryCard.tsx  # 回憶卡片組件
│   ├── pages/              # 頁面組件
│   │   ├── HomePage.tsx    # 首頁
│   │   ├── AuthPage.tsx    # 登入頁面
│   │   ├── MemoryBrewerPage.tsx    # 記憶釀酒師頁面
│   │   ├── CapsuleCreationPage.tsx # 膠囊創建頁面
│   │   ├── MyCapsulesPage.tsx      # 我的膠囊頁面
│   │   └── LoadingPage.tsx # 載入頁面
│   ├── services/           # API 服務
│   │   └── MemoryProcessor.ts # 記憶處理服務
│   ├── utils/              # 工具函數
│   ├── App.tsx             # 主應用組件
│   ├── main.tsx            # 應用入口
│   └── index.css           # 全域樣式
├── public/                 # 靜態資源
├── package.json
└── vite.config.ts          # Vite 配置
```

### 後端架構

```
backend/
├── src/
│   ├── routes/             # API 路由
│   │   ├── auth.ts         # 認證路由
│   │   ├── capsules.ts     # 膠囊路由
│   │   ├── memories.ts     # 回憶路由
│   │   └── users.ts        # 用戶路由
│   ├── middleware/         # 中介軟體
│   │   ├── auth.ts         # 認證中介軟體
│   │   ├── errorHandler.ts # 錯誤處理
│   │   └── requestLogger.ts # 請求日誌
│   ├── services/           # 業務邏輯服務
│   │   ├── lineService.ts  # LINE 服務
│   │   └── scheduler.ts    # 排程服務
│   ├── config/             # 配置檔案
│   │   └── database.ts     # 資料庫配置
│   ├── utils/              # 工具函數
│   │   └── logger.ts       # 日誌工具
│   └── index.ts            # 應用入口
├── database/               # 資料庫相關
│   ├── migrations/         # 資料庫遷移
│   └── seeds/             # 種子資料
├── package.json
└── tsconfig.json          # TypeScript 配置
```

### AI 處理模組架構

```
ai-processing/
├── src/
│   ├── emotionAnalyzer.ts  # 情感分析器
│   ├── memoryExtractor.ts  # 回憶提取器
│   └── index.ts           # 模組入口
├── models/                # AI 模型檔案
├── package.json
└── tsconfig.json
```

## 🔧 開發工具

### 程式碼品質

- **ESLint**: 程式碼檢查
- **Prettier**: 程式碼格式化
- **TypeScript**: 類型檢查

### 執行檢查

```bash
# 檢查所有模組
npm run lint

# 檢查特定模組
npm run lint:frontend
npm run lint:backend
npm run lint:ai

# 類型檢查
cd frontend && npm run type-check
cd backend && npm run type-check
```

### 測試

```bash
# 執行所有測試
npm run test

# 執行特定模組測試
npm run test:frontend
npm run test:backend
npm run test:ai
```

## 📊 資料庫管理

### 遷移

```bash
cd backend

# 創建新遷移
npx knex migrate:make migration_name

# 執行遷移
npm run migrate

# 回滾遷移
npx knex migrate:rollback
```

### 種子資料

```bash
cd backend

# 執行種子資料
npm run seed

# 重新執行種子資料
npx knex seed:run --specific=01_users.js
```

## 🚀 部署

### 建構應用

```bash
# 建構所有模組
npm run build

# 建構特定模組
npm run build:frontend
npm run build:backend
npm run build:ai
```

### Docker 部署

```bash
# 建構映像
docker-compose build

# 啟動服務
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

## 🔍 除錯

### 前端除錯

1. 開啟瀏覽器開發者工具
2. 檢查 Console 和 Network 標籤
3. 使用 React Developer Tools 擴充功能

### 後端除錯

1. 檢查終端機輸出
2. 查看日誌檔案 (`backend/logs/`)
3. 使用 Postman 或 curl 測試 API

### 資料庫除錯

```bash
# 連接到資料庫
psql -h localhost -U reli_user -d reli_db

# 查看表格
\dt

# 查看資料
SELECT * FROM users LIMIT 10;
```

## 📝 程式碼規範

### TypeScript

- 使用嚴格的類型檢查
- 避免使用 `any` 類型
- 為所有函數添加類型註解

### React

- 使用函數組件和 Hooks
- 使用 TypeScript 介面定義 Props
- 遵循 React 最佳實踐

### Node.js

- 使用 async/await 而非回調
- 適當處理錯誤
- 使用中介軟體模式

### 資料庫

- 使用參數化查詢防止 SQL 注入
- 為查詢添加適當的索引
- 遵循資料庫正規化原則

## 🤝 貢獻流程

1. **Fork 專案**
2. **創建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交變更**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **開啟 Pull Request**

## 📚 相關資源

- [React 官方文件](https://reactjs.org/docs)
- [Node.js 官方文件](https://nodejs.org/docs)
- [TypeScript 官方文件](https://www.typescriptlang.org/docs)
- [PostgreSQL 官方文件](https://www.postgresql.org/docs)
- [LINE LIFF 文件](https://developers.line.biz/en/docs/liff/)

## ❓ 常見問題

### Q: 如何重置資料庫？

```bash
cd backend
npx knex migrate:rollback --all
npx knex migrate:latest
npm run seed
```

### Q: 如何清除所有快取？

```bash
npm run clean
npm run install:all
```

### Q: 如何查看 API 文件？

啟動後端服務後，訪問 `http://localhost:3001/api-docs`

### Q: 如何設定 LINE 開發者帳號？

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 創建新的 Provider 和 Channel
3. 設定 LIFF App
4. 更新環境變數中的 LINE 相關設定

---

如有其他問題，請查看 [GitHub Issues](https://github.com/your-username/re-li/issues) 或聯繫開發團隊。

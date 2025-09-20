import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { authMiddleware } from './middleware/auth'

// 路由
import authRoutes from './routes/auth'
import capsuleRoutes from './routes/capsules'
import memoryRoutes from './routes/memories'
import userRoutes from './routes/users'

// 服務
import { initializeDatabase } from './config/database'
import { initializeScheduler } from './services/scheduler'
import { logger } from './utils/logger'

// 載入環境變數
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 安全中介軟體
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS 設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// 壓縮
app.use(compression())

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 限制每個 IP 每 15 分鐘最多 100 個請求
  message: {
    error: '請求過於頻繁，請稍後再試',
    retryAfter: '15 分鐘'
  }
})
app.use('/api/', limiter)

// 解析中介軟體
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 請求日誌
app.use(requestLogger)

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/capsules', authMiddleware, capsuleRoutes)
app.use('/api/memories', authMiddleware, memoryRoutes)
app.use('/api/users', authMiddleware, userRoutes)

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '找不到請求的資源',
    path: req.originalUrl,
    method: req.method
  })
})

// 錯誤處理
app.use(errorHandler)

// 啟動伺服器
async function startServer() {
  try {
    // 初始化資料庫
    await initializeDatabase()
    logger.info('資料庫連接成功')

    // 初始化排程器
    initializeScheduler()
    logger.info('排程器啟動成功')

    // 啟動伺服器
    app.listen(PORT, () => {
      logger.info(`🚀 Re:li 後端服務啟動成功`)
      logger.info(`📍 服務地址: http://localhost:${PORT}`)
      logger.info(`🌍 環境: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('伺服器啟動失敗:', error)
    process.exit(1)
  }
}

// 優雅關閉
process.on('SIGTERM', () => {
  logger.info('收到 SIGTERM 信號，正在關閉伺服器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('收到 SIGINT 信號，正在關閉伺服器...')
  process.exit(0)
})

// 未處理的 Promise 拒絕
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未處理的 Promise 拒絕:', reason)
  process.exit(1)
})

// 未捕獲的異常
process.on('uncaughtException', (error) => {
  logger.error('未捕獲的異常:', error)
  process.exit(1)
})

startServer()

import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // 記錄請求開始
  logger.info('API 請求開始', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // 攔截回應結束事件
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    }

    // 根據狀態碼選擇日誌級別
    if (res.statusCode >= 500) {
      logger.error('API 請求完成 (伺服器錯誤)', logData)
    } else if (res.statusCode >= 400) {
      logger.warn('API 請求完成 (客戶端錯誤)', logData)
    } else {
      logger.info('API 請求完成', logData)
    }
  })

  next()
}

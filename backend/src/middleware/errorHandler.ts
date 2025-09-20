import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error

  // 記錄錯誤
  logger.error('API 錯誤:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // 處理特定錯誤類型
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = '資料驗證失敗'
  } else if (error.name === 'CastError') {
    statusCode = 400
    message = '無效的資料格式'
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = '無效的認證 token'
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = '認證 token 已過期'
  }

  // 在開發環境中返回詳細錯誤資訊
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isDevelopment && { 
        stack: error.stack,
        details: error.message 
      })
    },
    timestamp: new Date().toISOString(),
    path: req.url
  })
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../config/database'
import { logger } from '../utils/logger'

interface AuthRequest extends Request {
  user?: {
    userId: string
    lineUserId: string
    displayName: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        error: '未提供認證令牌',
        message: '請先登入'
      })
    }

    // 驗證 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    // 查找使用者
    const user = await db('users')
      .where('id', decoded.userId)
      .first()

    if (!user) {
      return res.status(401).json({
        error: '無效的認證令牌',
        message: '使用者不存在'
      })
    }

    // 將使用者資訊添加到請求物件
    req.user = {
      userId: user.id,
      lineUserId: user.line_user_id,
      displayName: user.display_name
    }

    next()
  } catch (error) {
    logger.error('認證中介軟體錯誤:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: '無效的認證令牌',
        message: '請重新登入'
      })
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: '認證令牌已過期',
        message: '請重新登入'
      })
    }

    res.status(500).json({
      error: '認證失敗',
      message: '伺服器內部錯誤'
    })
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      const user = await db('users')
        .where('id', decoded.userId)
        .first()

      if (user) {
        req.user = {
          userId: user.id,
          lineUserId: user.line_user_id,
          displayName: user.display_name
        }
      }
    }

    next()
  } catch (error) {
    // 可選認證失敗時不中斷請求
    next()
  }
}

import express from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger'

const router = express.Router()

// LINE 登入驗證
router.post('/line-login', async (req, res) => {
  try {
    const { lineUserId, displayName, pictureUrl, statusMessage } = req.body

    if (!lineUserId || !displayName) {
      return res.status(400).json({
        error: '缺少必要參數',
        message: 'LINE User ID 和顯示名稱為必填'
      })
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: lineUserId,
        displayName,
        type: 'line_user'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    // 這裡可以將用戶資訊存入資料庫
    // await saveUserToDatabase({ lineUserId, displayName, pictureUrl, statusMessage })

    logger.info(`用戶登入成功: ${displayName} (${lineUserId})`)

    res.json({
      success: true,
      token,
      user: {
        id: lineUserId,
        displayName,
        pictureUrl,
        statusMessage
      }
    })

  } catch (error) {
    logger.error('LINE 登入失敗:', error)
    res.status(500).json({
      error: '登入失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 驗證 token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: '未授權',
        message: '缺少有效的認證 token'
      })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

    res.json({
      success: true,
      user: {
        id: decoded.userId,
        displayName: decoded.displayName,
        type: decoded.type
      }
    })

  } catch (error) {
    logger.error('Token 驗證失敗:', error)
    res.status(401).json({
      error: '認證失敗',
      message: '無效的 token'
    })
  }
})

// 登出
router.post('/logout', async (req, res) => {
  try {
    // 這裡可以實作 token 黑名單機制
    logger.info('用戶登出')
    
    res.json({
      success: true,
      message: '登出成功'
    })

  } catch (error) {
    logger.error('登出失敗:', error)
    res.status(500).json({
      error: '登出失敗',
      message: '伺服器內部錯誤'
    })
  }
})

export default router

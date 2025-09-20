import express from 'express'
import { logger } from '../utils/logger'

const router = express.Router()

// 獲取用戶資料
router.get('/profile', async (req, res) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 這裡應該從資料庫查詢用戶資料
    // 暫時返回模擬數據
    const userProfile = {
      id: userId,
      displayName: '用戶',
      pictureUrl: 'https://via.placeholder.com/100',
      statusMessage: '享受美好回憶',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      stats: {
        totalMemories: 15,
        totalCapsulesSent: 3,
        totalCapsulesReceived: 2,
        totalCapsulesUnlocked: 1
      }
    }

    logger.info(`用戶 ${userId} 獲取個人資料`)

    res.json({
      success: true,
      user: userProfile
    })

  } catch (error) {
    logger.error('獲取用戶資料失敗:', error)
    res.status(500).json({
      error: '獲取失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 更新用戶資料
router.put('/profile', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { displayName, statusMessage } = req.body

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 驗證輸入
    if (displayName && displayName.length > 50) {
      return res.status(400).json({
        error: '顯示名稱過長',
        message: '顯示名稱不能超過 50 個字符'
      })
    }

    if (statusMessage && statusMessage.length > 100) {
      return res.status(400).json({
        error: '狀態訊息過長',
        message: '狀態訊息不能超過 100 個字符'
      })
    }

    // 這裡應該更新資料庫中的用戶資料
    // await updateUserProfile(userId, { displayName, statusMessage })

    logger.info(`用戶 ${userId} 更新個人資料`)

    res.json({
      success: true,
      message: '個人資料已更新',
      user: {
        id: userId,
        displayName: displayName || '用戶',
        statusMessage: statusMessage || ''
      }
    })

  } catch (error) {
    logger.error('更新用戶資料失敗:', error)
    res.status(500).json({
      error: '更新失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 獲取用戶統計資訊
router.get('/stats', async (req, res) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 模擬統計數據
    const stats = {
      memories: {
        total: 15,
        thisMonth: 5,
        emotionDistribution: {
          joy: 5,
          gratitude: 4,
          love: 3,
          warmth: 2,
          excitement: 1
        }
      },
      capsules: {
        sent: {
          total: 3,
          unlocked: 1,
          pending: 2
        },
        received: {
          total: 2,
          unlocked: 1,
          pending: 1
        }
      },
      activity: {
        lastActiveAt: new Date().toISOString(),
        totalSessions: 25,
        averageSessionDuration: 15 // 分鐘
      }
    }

    logger.info(`用戶 ${userId} 獲取統計資訊`)

    res.json({
      success: true,
      stats
    })

  } catch (error) {
    logger.error('獲取用戶統計失敗:', error)
    res.status(500).json({
      error: '獲取失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 獲取用戶的膠囊活動
router.get('/activity', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { type = 'all', limit = 10 } = req.query

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 模擬活動數據
    const activities = [
      {
        id: 'activity_1',
        type: 'capsule_sent',
        description: '送出了時空膠囊給小明',
        timestamp: '2024-01-20T15:30:00Z',
        data: {
          recipientName: '小明',
          unlockTime: '2024-12-25T00:00:00Z'
        }
      },
      {
        id: 'activity_2',
        type: 'capsule_received',
        description: '收到了來自小華的時空膠囊',
        timestamp: '2024-01-18T09:15:00Z',
        data: {
          senderName: '小華',
          isUnlocked: true
        }
      },
      {
        id: 'activity_3',
        type: 'memory_created',
        description: '創建了新的回憶片段',
        timestamp: '2024-01-15T14:20:00Z',
        data: {
          memoryId: 'memory_1',
          emotion: 'joy'
        }
      }
    ]

    // 根據類型篩選
    let filteredActivities = activities
    if (type !== 'all') {
      filteredActivities = activities.filter(activity => activity.type === type)
    }

    // 限制數量
    filteredActivities = filteredActivities.slice(0, Number(limit))

    logger.info(`用戶 ${userId} 獲取活動記錄`)

    res.json({
      success: true,
      activities: filteredActivities,
      total: activities.length
    })

  } catch (error) {
    logger.error('獲取用戶活動失敗:', error)
    res.status(500).json({
      error: '獲取失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 刪除用戶帳號
router.delete('/account', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { confirmPassword } = req.body

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 這裡應該實作帳號刪除邏輯
    // 包括刪除所有相關數據：回憶、膠囊等
    // await deleteUserAccount(userId)

    logger.info(`用戶 ${userId} 刪除帳號`)

    res.json({
      success: true,
      message: '帳號已成功刪除'
    })

  } catch (error) {
    logger.error('刪除用戶帳號失敗:', error)
    res.status(500).json({
      error: '刪除失敗',
      message: '伺服器內部錯誤'
    })
  }
})

export default router

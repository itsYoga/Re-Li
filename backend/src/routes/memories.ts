import express from 'express'
import { logger } from '../utils/logger'

const router = express.Router()

// 獲取用戶的回憶片段
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { emotion, tag, startDate, endDate, limit = 20, offset = 0 } = req.query

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 這裡應該從資料庫查詢用戶的回憶片段
    // 暫時返回模擬數據
    const mockMemories = [
      {
        id: 'memory_1',
        timestamp: '2024-01-15T10:30:00Z',
        content: '今天天氣真好，我們一起去公園散步吧！',
        emotion: 'joy',
        tags: ['戶外', '朋友', '開心'],
        participants: ['我', '朋友'],
        confidence: 0.8,
        intensity: 0.7,
        processedAt: '2024-01-20T15:30:00Z',
        source: 'chat_export'
      },
      {
        id: 'memory_2',
        timestamp: '2024-01-10T20:15:00Z',
        content: '謝謝你一直以來的支持，真的很感動',
        emotion: 'gratitude',
        tags: ['感謝', '友情', '溫暖'],
        participants: ['我', '朋友'],
        confidence: 0.9,
        intensity: 0.8,
        processedAt: '2024-01-20T15:30:00Z',
        source: 'chat_export'
      }
    ]

    // 應用篩選條件
    let filteredMemories = mockMemories

    if (emotion) {
      filteredMemories = filteredMemories.filter(m => m.emotion === emotion)
    }

    if (tag) {
      filteredMemories = filteredMemories.filter(m => 
        m.tags.some(t => t.toLowerCase().includes((tag as string).toLowerCase()))
      )
    }

    if (startDate) {
      filteredMemories = filteredMemories.filter(m => 
        new Date(m.timestamp) >= new Date(startDate as string)
      )
    }

    if (endDate) {
      filteredMemories = filteredMemories.filter(m => 
        new Date(m.timestamp) <= new Date(endDate as string)
      )
    }

    // 分頁
    const paginatedMemories = filteredMemories
      .slice(Number(offset), Number(offset) + Number(limit))

    logger.info(`用戶 ${userId} 獲取回憶片段，共 ${paginatedMemories.length} 個`)

    res.json({
      success: true,
      memories: paginatedMemories,
      pagination: {
        total: filteredMemories.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < filteredMemories.length
      }
    })

  } catch (error) {
    logger.error('獲取回憶片段失敗:', error)
    res.status(500).json({
      error: '獲取失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 獲取回憶統計資訊
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
      totalMemories: 15,
      emotionDistribution: {
        joy: 5,
        gratitude: 4,
        love: 3,
        warmth: 2,
        excitement: 1
      },
      topTags: [
        { tag: '朋友', count: 8 },
        { tag: '開心', count: 5 },
        { tag: '感謝', count: 4 },
        { tag: '戶外', count: 3 },
        { tag: '溫暖', count: 2 }
      ],
      timeRange: {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-20T23:59:59Z'
      },
      averageIntensity: 0.75
    }

    logger.info(`用戶 ${userId} 獲取回憶統計`)

    res.json({
      success: true,
      stats
    })

  } catch (error) {
    logger.error('獲取回憶統計失敗:', error)
    res.status(500).json({
      error: '獲取失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 搜尋回憶片段
router.get('/search', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { q, emotion, limit = 10 } = req.query

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    if (!q) {
      return res.status(400).json({
        error: '缺少搜尋關鍵字',
        message: '請提供搜尋關鍵字'
      })
    }

    // 模擬搜尋結果
    const searchResults = [
      {
        id: 'memory_1',
        timestamp: '2024-01-15T10:30:00Z',
        content: '今天天氣真好，我們一起去公園散步吧！',
        emotion: 'joy',
        tags: ['戶外', '朋友'],
        participants: ['我', '朋友'],
        confidence: 0.8,
        intensity: 0.7,
        processedAt: '2024-01-20T15:30:00Z',
        source: 'chat_export',
        relevanceScore: 0.9
      }
    ]

    logger.info(`用戶 ${userId} 搜尋回憶: "${q}"`)

    res.json({
      success: true,
      results: searchResults,
      query: q,
      total: searchResults.length
    })

  } catch (error) {
    logger.error('搜尋回憶失敗:', error)
    res.status(500).json({
      error: '搜尋失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 刪除回憶片段
router.delete('/:memoryId', async (req, res) => {
  try {
    const userId = (req as any).user?.id
    const { memoryId } = req.params

    if (!userId) {
      return res.status(401).json({
        error: '未授權',
        message: '請先登入'
      })
    }

    // 這裡應該從資料庫刪除回憶片段
    // await deleteMemoryFromDatabase(userId, memoryId)

    logger.info(`用戶 ${userId} 刪除回憶片段: ${memoryId}`)

    res.json({
      success: true,
      message: '回憶片段已刪除'
    })

  } catch (error) {
    logger.error('刪除回憶片段失敗:', error)
    res.status(500).json({
      error: '刪除失敗',
      message: '伺服器內部錯誤'
    })
  }
})

export default router

import express from 'express'
import Joi from 'joi'
import { db } from '../config/database'
import { logger } from '../utils/logger'
import { sendLineNotification } from '../services/lineService'

interface AuthRequest extends express.Request {
  user?: {
    userId: string
    lineUserId: string
    displayName: string
  }
}

const router = express.Router()

// 創建時空膠囊的驗證 schema
const createCapsuleSchema = Joi.object({
  recipientId: Joi.string().required(),
  memorySnippet: Joi.object({
    id: Joi.string().required(),
    timestamp: Joi.string().required(),
    content: Joi.string().required(),
    emotion: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
    participants: Joi.array().items(Joi.string()).required()
  }).required(),
  newMessage: Joi.string().max(1000).required(),
  unlockTime: Joi.date().greater('now').required(),
  isAnonymous: Joi.boolean().default(false)
})

// 創建時空膠囊
router.post('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { error, value } = createCapsuleSchema.validate(req.body)
    if (error) {
      res.status(400).json({
        error: '請求資料格式錯誤',
        details: error.details[0].message
      })
      return
    }

    const {
      recipientId,
      memorySnippet,
      newMessage,
      unlockTime,
      isAnonymous
    } = value

    const senderId = req.user?.userId

    // 檢查接收者是否存在
    const recipient = await db('users')
      .where('line_user_id', recipientId)
      .first()

    if (!recipient) {
      res.status(404).json({
        error: '找不到指定的接收者'
      })
      return
    }

    // 創建時空膠囊
    const [capsule] = await db('capsules')
      .insert({
        sender_id: senderId,
        recipient_id: recipient.id,
        memory_snippet: JSON.stringify(memorySnippet),
        new_message: newMessage,
        unlock_time: new Date(unlockTime),
        is_anonymous: isAnonymous,
        status: 'pending',
        created_at: new Date()
      })
      .returning('*')

    logger.info(`時空膠囊已創建: ${capsule.id}`)

    res.status(201).json({
      success: true,
      data: {
        capsuleId: capsule.id,
        unlockTime: capsule.unlock_time,
        message: '時空膠囊創建成功'
      }
    })

  } catch (error) {
    logger.error('創建時空膠囊時發生錯誤:', error)
    res.status(500).json({
      error: '創建時空膠囊失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 獲取使用者的時空膠囊
router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { type = 'all' } = req.query

    let query = db('capsules')
      .select(
        'capsules.*',
        'sender.display_name as sender_name',
        'recipient.display_name as recipient_name'
      )
      .leftJoin('users as sender', 'capsules.sender_id', 'sender.id')
      .leftJoin('users as recipient', 'capsules.recipient_id', 'recipient.id')

    if (type === 'sent') {
      query = query.where('capsules.sender_id', userId)
    } else if (type === 'received') {
      query = query.where('capsules.recipient_id', userId)
    } else {
      query = query.where(function() {
        this.where('capsules.sender_id', userId)
          .orWhere('capsules.recipient_id', userId)
      })
    }

    const capsules = await query
      .orderBy('capsules.created_at', 'desc')

    res.json({
      success: true,
      data: capsules.map(capsule => ({
        id: capsule.id,
        senderName: capsule.sender_name,
        recipientName: capsule.recipient_name,
        memorySnippet: JSON.parse(capsule.memory_snippet),
        newMessage: capsule.new_message,
        unlockTime: capsule.unlock_time,
        status: capsule.status,
        isAnonymous: capsule.is_anonymous,
        createdAt: capsule.created_at
      }))
    })

  } catch (error) {
    logger.error('獲取時空膠囊時發生錯誤:', error)
    res.status(500).json({
      error: '獲取時空膠囊失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 解鎖時空膠囊
router.post('/:id/unlock', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    // 查找膠囊
    const capsule = await db('capsules')
      .where('id', id)
      .where('recipient_id', userId)
      .first()

    if (!capsule) {
      res.status(404).json({
        error: '找不到指定的時空膠囊'
      })
      return
    }

    // 檢查是否已解鎖
    if (capsule.status === 'unlocked') {
      res.status(400).json({
        error: '此膠囊已經解鎖'
      })
      return
    }

    // 檢查解鎖時間
    const now = new Date()
    const unlockTime = new Date(capsule.unlock_time)

    if (now < unlockTime) {
      res.status(400).json({
        error: '膠囊尚未到解鎖時間',
        unlockTime: capsule.unlock_time
      })
      return
    }

    // 更新膠囊狀態
    await db('capsules')
      .where('id', id)
      .update({
        status: 'unlocked',
        unlocked_at: now
      })

    logger.info(`時空膠囊已解鎖: ${id}`)

    res.json({
      success: true,
      data: {
        memorySnippet: JSON.parse(capsule.memory_snippet),
        newMessage: capsule.new_message,
        senderName: capsule.is_anonymous ? '匿名' : '發送者',
        unlockedAt: now
      }
    })

  } catch (error) {
    logger.error('解鎖時空膠囊時發生錯誤:', error)
    res.status(500).json({
      error: '解鎖時空膠囊失敗',
      message: '伺服器內部錯誤'
    })
  }
})

// 刪除時空膠囊
router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.userId

    // 檢查膠囊是否屬於使用者
    const capsule = await db('capsules')
      .where('id', id)
      .where('sender_id', userId)
      .first()

    if (!capsule) {
      res.status(404).json({
        error: '找不到指定的時空膠囊或無權限刪除'
      })
      return
    }

    // 檢查膠囊狀態
    if (capsule.status === 'unlocked') {
      res.status(400).json({
        error: '已解鎖的膠囊無法刪除'
      })
      return
    }

    // 刪除膠囊
    await db('capsules')
      .where('id', id)
      .del()

    logger.info(`時空膠囊已刪除: ${id}`)

    res.json({
      success: true,
      message: '時空膠囊已刪除'
    })

  } catch (error) {
    logger.error('刪除時空膠囊時發生錯誤:', error)
    res.status(500).json({
      error: '刪除時空膠囊失敗',
      message: '伺服器內部錯誤'
    })
  }
})

export default router

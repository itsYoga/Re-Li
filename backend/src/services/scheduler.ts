import cron from 'node-cron'
import { db } from '../config/database'
import { sendLineNotification } from './lineService'
import { logger } from '../utils/logger'

export function initializeScheduler() {
  // 每分鐘檢查一次是否有膠囊需要解鎖
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndUnlockCapsules()
    } catch (error) {
      logger.error('檢查膠囊解鎖時發生錯誤:', error)
    }
  })

  // 每天凌晨 2 點清理過期的膠囊
  cron.schedule('0 2 * * *', async () => {
    try {
      await cleanupExpiredCapsules()
    } catch (error) {
      logger.error('清理過期膠囊時發生錯誤:', error)
    }
  })

  logger.info('排程器已啟動')
}

async function checkAndUnlockCapsules() {
  const now = new Date()
  
  // 查找需要解鎖的膠囊
  const capsulesToUnlock = await db('capsules')
    .select(
      'capsules.*',
      'recipient.line_user_id as recipient_line_id',
      'recipient.display_name as recipient_name'
    )
    .leftJoin('users as recipient', 'capsules.recipient_id', 'recipient.id')
    .where('capsules.status', 'pending')
    .where('capsules.unlock_time', '<=', now)

  for (const capsule of capsulesToUnlock) {
    try {
      // 發送 LINE 通知
      await sendLineNotification({
        userId: capsule.recipient_line_id,
        message: {
          type: 'text',
          text: `🎉 您有一個時空膠囊可以解鎖了！\n\n來自 ${capsule.is_anonymous ? '匿名' : '朋友'} 的珍貴回憶正在等待您開啟。\n\n點擊下方按鈕立即解鎖：`
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'uri',
                label: '解鎖膠囊',
                uri: `${process.env.FRONTEND_URL}/my-capsules?unlock=${capsule.id}`
              }
            }
          ]
        }
      })

      logger.info(`已發送膠囊解鎖通知: ${capsule.id}`)
    } catch (error) {
      logger.error(`發送膠囊解鎖通知失敗: ${capsule.id}`, error)
    }
  }
}

async function cleanupExpiredCapsules() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // 刪除 30 天前創建且已解鎖的膠囊
  const deletedCount = await db('capsules')
    .where('status', 'unlocked')
    .where('created_at', '<', thirtyDaysAgo)
    .del()

  if (deletedCount > 0) {
    logger.info(`已清理 ${deletedCount} 個過期的膠囊`)
  }
}

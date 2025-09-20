import axios from 'axios'
import { logger } from '../utils/logger'

interface LineMessage {
  type: string
  text?: string
  [key: string]: any
}

interface LineNotification {
  userId: string
  message: LineMessage
  quickReply?: {
    items: Array<{
      type: string
      action: {
        type: string
        label: string
        uri?: string
        text?: string
      }
    }>
  }
}

const LINE_API_BASE_URL = 'https://api.line.me/v2'

export async function sendLineNotification(notification: LineNotification) {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('LINE Channel Access Token 未設定')
    }

    const message = {
      to: notification.userId,
      messages: [
        {
          type: 'text',
          text: notification.message.text
        }
      ]
    }

    // 如果有快速回覆，添加到訊息中
    if (notification.quickReply) {
      message.messages[0].quickReply = notification.quickReply
    }

    const response = await axios.post(
      `${LINE_API_BASE_URL}/bot/message/push`,
      message,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    logger.info(`LINE 通知發送成功: ${notification.userId}`)
    return response.data

  } catch (error) {
    logger.error('發送 LINE 通知失敗:', error)
    throw error
  }
}

export async function sendFlexMessage(userId: string, flexMessage: any) {
  try {
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN

    if (!accessToken) {
      throw new Error('LINE Channel Access Token 未設定')
    }

    const message = {
      to: userId,
      messages: [flexMessage]
    }

    const response = await axios.post(
      `${LINE_API_BASE_URL}/bot/message/push`,
      message,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    logger.info(`LINE Flex 訊息發送成功: ${userId}`)
    return response.data

  } catch (error) {
    logger.error('發送 LINE Flex 訊息失敗:', error)
    throw error
  }
}

export function createCapsuleUnlockFlexMessage(capsuleData: any) {
  return {
    type: 'flex',
    altText: '時空膠囊解鎖通知',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🎉 時空膠囊解鎖通知',
            weight: 'bold',
            size: 'lg',
            color: '#FF6B6B'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '您有一個珍貴的時空膠囊可以解鎖了！',
            wrap: true,
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'md'
          },
          {
            type: 'text',
            text: `來自：${capsuleData.senderName || '匿名'}`,
            size: 'sm',
            color: '#666666',
            margin: 'md'
          },
          {
            type: 'text',
            text: `創建時間：${new Date(capsuleData.createdAt).toLocaleDateString('zh-TW')}`,
            size: 'sm',
            color: '#666666',
            margin: 'sm'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '立即解鎖',
              uri: `${process.env.FRONTEND_URL}/my-capsules?unlock=${capsuleData.id}`
            },
            style: 'primary',
            color: '#FF6B6B'
          }
        ]
      }
    }
  }
}

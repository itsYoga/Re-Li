import JSZip from 'jszip'
import { EmotionAnalyzer, EmotionAnalysisResult } from './emotionAnalyzer'

export interface MemorySnippet {
  id: string
  timestamp: string
  content: string
  emotion: string
  tags: string[]
  participants: string[]
  confidence: number
  intensity: number
}

export interface ChatMessage {
  timestamp: string
  sender: string
  content: string
  type: 'text' | 'image' | 'sticker' | 'file'
}

export class MemoryExtractor {
  private emotionAnalyzer: EmotionAnalyzer
  private keyMoments: string[]
  private positivePatterns: RegExp[]

  constructor() {
    this.emotionAnalyzer = new EmotionAnalyzer()
    this.keyMoments = [
      '生日快樂', '生日', '恭喜', '畢業', '考試', '面試', '工作', '搬家',
      '旅行', '出遊', '聚餐', '聚會', '節日', '新年', '聖誕', '情人節',
      '求婚', '結婚', '懷孕', '生小孩', '升職', '加薪', '獲獎', '成就'
    ]
    this.positivePatterns = [
      /太棒了|超讚|厲害|amazing|awesome/gi,
      /恭喜|祝賀|慶祝/gi,
      /謝謝|感謝|感恩/gi,
      /愛你|喜歡|想你/gi,
      /加油|支持|相信/gi,
      /哈哈|笑死|太好笑了/gi
    ]
  }

  async initialize() {
    await this.emotionAnalyzer.initialize()
  }

  async extractMemoriesFromZip(zipFile: File): Promise<MemorySnippet[]> {
    try {
      const zip = await JSZip.loadAsync(zipFile)
      const memories: MemorySnippet[] = []

      // 尋找聊天記錄檔案
      const chatFiles = Object.keys(zip.files).filter(name => 
        name.includes('Chat') && name.endsWith('.txt')
      )

      for (const fileName of chatFiles) {
        const file = zip.files[fileName]
        if (file) {
          const content = await file.async('text')
          const extractedMemories = await this.extractMemoriesFromContent(content)
          memories.push(...extractedMemories)
        }
      }

      // 按時間排序並限制數量
      return memories
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20)

    } catch (error) {
      console.error('提取回憶時發生錯誤:', error)
      throw new Error('無法解析聊天記錄檔案')
    }
  }

  private async extractMemoriesFromContent(content: string): Promise<MemorySnippet[]> {
    const lines = content.split('\n')
    const memories: MemorySnippet[] = []
    const messageBuffer: ChatMessage[] = []
    let currentTimestamp = ''
    let currentSender = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (this.isTimestampLine(line)) {
        // 處理之前的訊息緩衝區
        if (messageBuffer.length > 0) {
          const memory = await this.createMemoryFromBuffer(messageBuffer)
          if (memory) {
            memories.push(memory)
          }
        }
        
        // 重置緩衝區
        messageBuffer.length = 0
        const timestampInfo = this.parseTimestampLine(line)
        currentTimestamp = timestampInfo.timestamp
        currentSender = timestampInfo.sender
      } else if (line && !this.isSystemMessage(line)) {
        // 添加訊息到緩衝區
        messageBuffer.push({
          timestamp: currentTimestamp,
          sender: currentSender,
          content: line,
          type: this.detectMessageType(line)
        })
      }
    }

    // 處理最後的訊息緩衝區
    if (messageBuffer.length > 0) {
      const memory = await this.createMemoryFromBuffer(messageBuffer)
      if (memory) {
        memories.push(memory)
      }
    }

    return memories
  }

  private async createMemoryFromBuffer(messages: ChatMessage[]): Promise<MemorySnippet | null> {
    if (messages.length === 0) return null

    // 檢查是否為有意義的對話
    const textMessages = messages
      .filter(msg => msg.type === 'text')
      .map(msg => msg.content)

    if (!this.emotionAnalyzer.isMeaningfulConversation(textMessages)) {
      return null
    }

    // 分析情感
    const content = textMessages.join(' ')
    const emotionResult = this.emotionAnalyzer.analyzeEmotion(content)
    const intensity = this.emotionAnalyzer.analyzeConversationIntensity(textMessages)

    // 生成標籤
    const tags = this.generateTags(content, messages)

    // 提取參與者
    const participants = [...new Set(messages.map(msg => msg.sender))]

    return {
      id: this.generateId(),
      timestamp: this.normalizeTimestamp(messages[0].timestamp),
      content: this.truncateContent(content, 200),
      emotion: emotionResult.emotion,
      tags,
      participants,
      confidence: emotionResult.confidence,
      intensity
    }
  }

  private isTimestampLine(line: string): boolean {
    // LINE 聊天記錄的時間戳格式
    const timestampRegex = /^\d{4}\/\d{1,2}\/\d{1,2}\s+(上午|下午)?\s*\d{1,2}:\d{2}/
    return timestampRegex.test(line)
  }

  private isSystemMessage(line: string): boolean {
    const systemKeywords = [
      '已讀', '收回訊息', '刪除訊息', '加入群組', '離開群組',
      '更改群組名稱', '更改群組圖片', '已通話', '通話結束',
      '已傳送', '傳送失敗', '已下載'
    ]
    return systemKeywords.some(keyword => line.includes(keyword))
  }

  private parseTimestampLine(line: string): { timestamp: string; sender: string } {
    // 解析時間戳和發送者
    const parts = line.split('\t')
    const timestamp = parts[0] || ''
    const sender = parts[1] || '未知'
    
    return { timestamp, sender }
  }

  private detectMessageType(content: string): 'text' | 'image' | 'sticker' | 'file' {
    if (content.includes('[圖片]') || content.includes('[照片]')) {
      return 'image'
    }
    if (content.includes('[貼圖]') || content.includes('[動態貼圖]')) {
      return 'sticker'
    }
    if (content.includes('[檔案]') || content.includes('[影片]') || content.includes('[音訊]')) {
      return 'file'
    }
    return 'text'
  }

  private generateTags(content: string, messages: ChatMessage[]): string[] {
    const tags: string[] = []
    
    // 基於關鍵時刻生成標籤
    this.keyMoments.forEach(moment => {
      if (content.includes(moment)) {
        tags.push(moment)
      }
    })
    
    // 基於情感生成標籤
    const emotionResult = this.emotionAnalyzer.analyzeEmotion(content)
    if (emotionResult.confidence > 0.5) {
      tags.push(emotionResult.emotion)
    }
    
    // 基於內容特徵生成標籤
    if (content.length > 100) {
      tags.push('深度對話')
    }
    
    if (messages.some(msg => msg.type === 'image')) {
      tags.push('圖片分享')
    }
    
    if (messages.some(msg => msg.type === 'sticker')) {
      tags.push('貼圖互動')
    }
    
    if (messages.length > 5) {
      tags.push('熱烈討論')
    }
    
    // 基於時間模式生成標籤
    const hour = new Date(messages[0].timestamp).getHours()
    if (hour >= 22 || hour <= 6) {
      tags.push('深夜聊天')
    }
    
    return tags.slice(0, 5) // 最多 5 個標籤
  }

  private generateId(): string {
    return `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private normalizeTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp)
      return date.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength) + '...'
  }

  // 分析聊天記錄的整體情感趨勢
  async analyzeChatSentiment(messages: ChatMessage[]): Promise<{
    overallSentiment: string
    positiveRatio: number
    emotionalPeaks: MemorySnippet[]
  }> {
    const textMessages = messages
      .filter(msg => msg.type === 'text')
      .map(msg => msg.content)

    let positiveCount = 0
    const emotionalPeaks: MemorySnippet[] = []

    for (const message of textMessages) {
      const emotionResult = this.emotionAnalyzer.analyzeEmotion(message)
      if (emotionResult.confidence > 0.6) {
        positiveCount++
        
        // 記錄情感高峰
        if (emotionResult.confidence > 0.8) {
          emotionalPeaks.push({
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            content: message,
            emotion: emotionResult.emotion,
            tags: emotionResult.keywords,
            participants: ['發送者'],
            confidence: emotionResult.confidence,
            intensity: emotionResult.confidence
          })
        }
      }
    }

    const positiveRatio = textMessages.length > 0 ? positiveCount / textMessages.length : 0
    const overallSentiment = positiveRatio > 0.6 ? 'positive' : 
                           positiveRatio > 0.3 ? 'neutral' : 'negative'

    return {
      overallSentiment,
      positiveRatio,
      emotionalPeaks
    }
  }
}

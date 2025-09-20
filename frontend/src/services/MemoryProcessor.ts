// 簡化版本，避免直接導入 AI 模組
export interface EmotionAnalysisResult {
  emotion: string
  confidence: number
  keywords: string[]
  sentiment: {
    score: number
    magnitude: number
  }
}

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

export interface ProcessedMemory extends MemorySnippet {
  processedAt: string
  source: 'chat_export' | 'manual'
  fileSize?: number
}

export class MemoryProcessor {
  constructor() {
    // 簡化版本，不依賴外部 AI 模組
  }

  async initialize() {
    console.log('MemoryProcessor 初始化完成')
  }

  /**
   * 處理 LINE 聊天記錄檔案
   */
  async processChatFile(file: File): Promise<ProcessedMemory[]> {
    try {
      console.log('開始處理聊天記錄檔案:', file.name)
      
      // 簡化版本，返回模擬數據
      const mockMemories: ProcessedMemory[] = [
        {
          id: 'memory_1',
          timestamp: new Date().toISOString(),
          content: '今天天氣真好，我們一起去公園散步吧！',
          emotion: 'joy',
          tags: ['戶外', '朋友', '開心'],
          participants: ['我', '朋友'],
          confidence: 0.8,
          intensity: 0.7,
          processedAt: new Date().toISOString(),
          source: 'chat_export',
          fileSize: file.size
        }
      ]

      console.log(`成功提取 ${mockMemories.length} 個回憶片段`)
      return mockMemories

    } catch (error) {
      console.error('處理聊天記錄失敗:', error)
      throw new Error('無法處理聊天記錄檔案，請確認檔案格式正確')
    }
  }

  /**
   * 手動創建回憶片段
   */
  async createManualMemory(content: string, tags: string[] = []): Promise<ProcessedMemory> {
    try {
      // 簡化版本，返回基本回憶片段
      const memory: ProcessedMemory = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        content: content.trim(),
        emotion: 'warmth',
        tags: [...tags, '手動創建'],
        participants: ['我'],
        confidence: 0.7,
        intensity: 0.7,
        processedAt: new Date().toISOString(),
        source: 'manual'
      }

      return memory

    } catch (error) {
      console.error('創建手動回憶失敗:', error)
      throw new Error('無法創建回憶片段')
    }
  }

  /**
   * 分析回憶的情感趨勢
   */
  async analyzeMemoryTrends(memories: ProcessedMemory[]): Promise<{
    totalMemories: number
    emotionDistribution: { [emotion: string]: number }
    topTags: { tag: string; count: number }[]
    timeRange: { start: string; end: string }
    averageIntensity: number
  }> {
    if (memories.length === 0) {
      return {
        totalMemories: 0,
        emotionDistribution: {},
        topTags: [],
        timeRange: { start: '', end: '' },
        averageIntensity: 0
      }
    }

    // 情感分布
    const emotionDistribution: { [emotion: string]: number } = {}
    memories.forEach(memory => {
      emotionDistribution[memory.emotion] = (emotionDistribution[memory.emotion] || 0) + 1
    })

    // 標籤統計
    const tagCount: { [tag: string]: number } = {}
    memories.forEach(memory => {
      memory.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    const topTags = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 時間範圍
    const timestamps = memories.map(m => new Date(m.timestamp).getTime())
    const timeRange = {
      start: new Date(Math.min(...timestamps)).toISOString(),
      end: new Date(Math.max(...timestamps)).toISOString()
    }

    // 平均強度
    const averageIntensity = memories.reduce((sum, m) => sum + m.intensity, 0) / memories.length

    return {
      totalMemories: memories.length,
      emotionDistribution,
      topTags,
      timeRange,
      averageIntensity
    }
  }

  /**
   * 搜尋回憶片段
   */
  searchMemories(memories: ProcessedMemory[], query: string): ProcessedMemory[] {
    if (!query.trim()) return memories

    const searchTerm = query.toLowerCase()
    
    return memories.filter(memory => 
      memory.content.toLowerCase().includes(searchTerm) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      memory.emotion.toLowerCase().includes(searchTerm)
    )
  }

  /**
   * 按情感篩選回憶
   */
  filterMemoriesByEmotion(memories: ProcessedMemory[], emotion: string): ProcessedMemory[] {
    if (!emotion) return memories
    
    return memories.filter(memory => memory.emotion === emotion)
  }

  /**
   * 按時間範圍篩選回憶
   */
  filterMemoriesByTimeRange(
    memories: ProcessedMemory[], 
    startDate: string, 
    endDate: string
  ): ProcessedMemory[] {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    
    return memories.filter(memory => {
      const memoryTime = new Date(memory.timestamp).getTime()
      return memoryTime >= start && memoryTime <= end
    })
  }

  /**
   * 按強度排序回憶
   */
  sortMemoriesByIntensity(memories: ProcessedMemory[], ascending: boolean = false): ProcessedMemory[] {
    return [...memories].sort((a, b) => 
      ascending ? a.intensity - b.intensity : b.intensity - a.intensity
    )
  }

  /**
   * 按時間排序回憶
   */
  sortMemoriesByTime(memories: ProcessedMemory[], ascending: boolean = false): ProcessedMemory[] {
    return [...memories].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return ascending ? timeA - timeB : timeB - timeA
    })
  }

  /**
   * 獲取回憶統計資訊
   */
  getMemoryStats(memories: ProcessedMemory[]): {
    totalCount: number
    emotionCounts: { [emotion: string]: number }
    averageConfidence: number
    averageIntensity: number
    mostCommonTag: string | null
    timeSpan: number // 天數
  } {
    if (memories.length === 0) {
      return {
        totalCount: 0,
        emotionCounts: {},
        averageConfidence: 0,
        averageIntensity: 0,
        mostCommonTag: null,
        timeSpan: 0
      }
    }

    const emotionCounts: { [emotion: string]: number } = {}
    let totalConfidence = 0
    let totalIntensity = 0
    const tagCounts: { [tag: string]: number } = {}
    const timestamps = memories.map(m => new Date(m.timestamp).getTime())

    memories.forEach(memory => {
      // 情感統計
      emotionCounts[memory.emotion] = (emotionCounts[memory.emotion] || 0) + 1
      
      // 信心度和強度
      totalConfidence += memory.confidence
      totalIntensity += memory.intensity
      
      // 標籤統計
      memory.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const mostCommonTag = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null

    const timeSpan = timestamps.length > 1 
      ? Math.ceil((Math.max(...timestamps) - Math.min(...timestamps)) / (1000 * 60 * 60 * 24))
      : 0

    return {
      totalCount: memories.length,
      emotionCounts,
      averageConfidence: totalConfidence / memories.length,
      averageIntensity: totalIntensity / memories.length,
      mostCommonTag,
      timeSpan
    }
  }

  private generateId(): string {
    return `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 導出單例實例
export const memoryProcessor = new MemoryProcessor()
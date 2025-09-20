import { EmotionAnalyzer } from './emotionAnalyzer'
import { MemoryExtractor } from './memoryExtractor'

// 導出主要類別
export { EmotionAnalyzer, type EmotionAnalysisResult } from './emotionAnalyzer'
export { MemoryExtractor, type MemorySnippet, type ChatMessage } from './memoryExtractor'

// 創建單例實例
export const emotionAnalyzer = new EmotionAnalyzer()
export const memoryExtractor = new MemoryExtractor()

// 初始化函數
export async function initializeAI() {
  try {
    await emotionAnalyzer.initialize()
    await memoryExtractor.initialize()
    console.log('AI 處理模組初始化完成')
  } catch (error) {
    console.error('AI 處理模組初始化失敗:', error)
    throw error
  }
}

// 主要處理函數
export async function processChatFile(file: File): Promise<any[]> {
  try {
    const memories = await memoryExtractor.extractMemoriesFromZip(file)
    return memories
  } catch (error) {
    console.error('處理聊天檔案失敗:', error)
    throw error
  }
}

export async function analyzeEmotion(text: string) {
  try {
    return emotionAnalyzer.analyzeEmotion(text)
  } catch (error) {
    console.error('情感分析失敗:', error)
    throw error
  }
}

// 如果直接執行此檔案，則初始化
if (require.main === module) {
  initializeAI()
    .then(() => {
      console.log('Re:li AI 處理模組已準備就緒')
    })
    .catch((error) => {
      console.error('Re:li AI 處理模組啟動失敗:', error)
      process.exit(1)
    })
}

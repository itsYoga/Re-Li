import { SentimentAnalyzer } from 'natural'
import { sentiment } from 'sentiment'

export interface EmotionAnalysisResult {
  emotion: string
  confidence: number
  keywords: string[]
  sentiment: {
    score: number
    magnitude: number
  }
}

export class EmotionAnalyzer {
  private sentimentAnalyzer: SentimentAnalyzer
  private emotionKeywords: { [key: string]: string[] }

  constructor() {
    this.sentimentAnalyzer = new SentimentAnalyzer('Chinese')
    this.emotionKeywords = {
      joy: [
        '開心', '快樂', '高興', '興奮', '愉快', '歡樂', '哈哈', '笑死',
        '太好笑了', 'XD', '😂', '😆', '😄', '太棒了', '超讚', '厲害'
      ],
      love: [
        '愛你', '喜歡', '想你', '好想你', '愛', '喜歡你', '❤️', '💕',
        '💖', '💝', '愛你喔', '最愛你', '寶貝', '親愛的'
      ],
      gratitude: [
        '謝謝', '感謝', '感恩', '太感謝了', '🙏', '謝謝你', '多謝',
        '感激', '謝啦', '謝謝你', '非常感謝'
      ],
      excitement: [
        '太棒了', '超讚', '厲害', '恭喜', '🎉', '🎊', '太厲害了',
        '哇', '太酷了', '超酷', 'amazing', 'awesome'
      ],
      warmth: [
        '加油', '支持你', '相信你', '溫暖', '🤗', '💪', '抱抱',
        '辛苦了', '別擔心', '沒事的', '會好的', '陪伴'
      ],
      surprise: [
        '哇', '天啊', '真的嗎', '不敢相信', '😮', '😲', '什麼',
        '真的假的', '太驚訝了', '意外'
      ],
      sadness: [
        '難過', '傷心', '哭', '😢', '😭', '好難過', '不開心',
        '沮喪', '失落', '失望'
      ]
    }
  }

  async initialize() {
    try {
      // 初始化情感分析器
      console.log('情緒分析器初始化完成')
    } catch (error) {
      console.error('情緒分析器初始化失敗:', error)
    }
  }

  analyzeEmotion(text: string): EmotionAnalysisResult {
    // 使用多種方法分析情緒
    const sentimentResult = this.analyzeSentiment(text)
    const keywordEmotion = this.analyzeKeywords(text)
    const finalEmotion = this.combineAnalysis(keywordEmotion, sentimentResult)

    return {
      emotion: finalEmotion.emotion,
      confidence: finalEmotion.confidence,
      keywords: this.extractKeywords(text),
      sentiment: sentimentResult
    }
  }

  private analyzeSentiment(text: string): { score: number; magnitude: number } {
    try {
      // 使用 sentiment 套件分析
      const result = sentiment(text)
      return {
        score: result.score,
        magnitude: Math.abs(result.score)
      }
    } catch (error) {
      console.error('情感分析失敗:', error)
      return { score: 0, magnitude: 0 }
    }
  }

  private analyzeKeywords(text: string): { emotion: string; confidence: number } {
    const textLower = text.toLowerCase()
    const emotionScores: { [key: string]: number } = {}

    // 計算每種情緒的關鍵詞匹配分數
    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      let score = 0
      for (const keyword of keywords) {
        if (textLower.includes(keyword.toLowerCase())) {
          score += 1
        }
      }
      emotionScores[emotion] = score
    }

    // 找出分數最高的情緒
    const maxScore = Math.max(...Object.values(emotionScores))
    const topEmotion = Object.keys(emotionScores).find(
      emotion => emotionScores[emotion] === maxScore
    ) || 'warmth'

    return {
      emotion: topEmotion,
      confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.1
    }
  }

  private combineAnalysis(
    keywordResult: { emotion: string; confidence: number },
    sentimentResult: { score: number; magnitude: number }
  ): { emotion: string; confidence: number } {
    // 結合關鍵詞分析和情感分析結果
    let finalEmotion = keywordResult.emotion
    let confidence = keywordResult.confidence

    // 根據情感分數調整結果
    if (sentimentResult.score > 2) {
      // 非常正面的情感
      if (finalEmotion === 'warmth') {
        finalEmotion = 'joy'
        confidence = Math.min(confidence + 0.3, 1)
      }
    } else if (sentimentResult.score < -2) {
      // 負面情感
      finalEmotion = 'sadness'
      confidence = Math.min(confidence + 0.2, 1)
    }

    return { emotion: finalEmotion, confidence }
  }

  private extractKeywords(text: string): string[] {
    const keywords: string[] = []
    const textLower = text.toLowerCase()

    // 提取所有匹配的關鍵詞
    for (const emotionKeywords of Object.values(this.emotionKeywords)) {
      for (const keyword of emotionKeywords) {
        if (textLower.includes(keyword.toLowerCase())) {
          keywords.push(keyword)
        }
      }
    }

    // 去重並限制數量
    return [...new Set(keywords)].slice(0, 10)
  }

  // 分析對話的情感強度
  analyzeConversationIntensity(messages: string[]): number {
    let totalIntensity = 0
    let validMessages = 0

    for (const message of messages) {
      const result = this.analyzeEmotion(message)
      if (result.confidence > 0.3) {
        totalIntensity += result.confidence
        validMessages++
      }
    }

    return validMessages > 0 ? totalIntensity / validMessages : 0
  }

  // 檢測是否為有意義的對話
  isMeaningfulConversation(messages: string[]): boolean {
    if (messages.length < 2) return false

    const intensity = this.analyzeConversationIntensity(messages)
    const hasEmotion = messages.some(msg => 
      this.analyzeEmotion(msg).confidence > 0.4
    )
    const hasInteraction = messages.length >= 3

    return intensity > 0.3 || hasEmotion || hasInteraction
  }
}

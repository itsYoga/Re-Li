import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Send, Heart, Calendar, User } from 'lucide-react'
import { MemorySnippet } from '../services/MemoryProcessor'

interface CapsuleCreationPageProps {
  userProfile: any
}

interface CapsuleForm {
  selectedMemory: MemorySnippet | null
  newMessage: string
  recipientId: string
  unlockDate: string
  unlockTime: string
  isPublic: boolean
}

const CapsuleCreationPage: React.FC<CapsuleCreationPageProps> = ({ userProfile }) => {
  const navigate = useNavigate()
  const [memories, setMemories] = useState<MemorySnippet[]>([])
  const [form, setForm] = useState<CapsuleForm>({
    selectedMemory: null,
    newMessage: '',
    recipientId: '',
    unlockDate: '',
    unlockTime: '',
    isPublic: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 載入用戶的回憶片段
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      // 這裡應該從 API 載入用戶的回憶片段
      // 暫時使用模擬數據
      const mockMemories: MemorySnippet[] = [
        {
          id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          content: '今天天氣真好，我們一起去公園散步吧！',
          emotion: 'joy',
          tags: ['戶外', '朋友'],
          participants: ['我', '朋友'],
          confidence: 0.8,
          intensity: 0.7
        },
        {
          id: '2',
          timestamp: '2024-01-10T20:15:00Z',
          content: '謝謝你一直以來的支持，真的很感動',
          emotion: 'gratitude',
          tags: ['感謝', '友情'],
          participants: ['我', '朋友'],
          confidence: 0.9,
          intensity: 0.8
        }
      ]
      setMemories(mockMemories)
    } catch (error) {
      console.error('載入回憶失敗:', error)
    }
  }

  const handleMemorySelect = (memory: MemorySnippet) => {
    setForm(prev => ({ ...prev, selectedMemory: memory }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.selectedMemory || !form.newMessage || !form.recipientId || !form.unlockDate) {
      alert('請填寫所有必要欄位')
      return
    }

    setIsLoading(true)
    try {
      // 這裡應該調用 API 創建時空膠囊
      const unlockDateTime = new Date(`${form.unlockDate}T${form.unlockTime}`)
      
      const capsuleData = {
        memorySnippet: form.selectedMemory,
        newMessage: form.newMessage,
        recipientId: form.recipientId,
        unlockTime: unlockDateTime.toISOString(),
        isPublic: form.isPublic,
        senderId: userProfile?.userId
      }

      console.log('創建時空膠囊:', capsuleData)
      
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('時空膠囊創建成功！')
      navigate('/my-capsules')
    } catch (error) {
      console.error('創建時空膠囊失敗:', error)
      alert('創建失敗，請重試')
    } finally {
      setIsLoading(false)
    }
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'from-yellow-400 to-orange-500',
      love: 'from-pink-400 to-red-500',
      gratitude: 'from-green-400 to-emerald-500',
      excitement: 'from-purple-400 to-pink-500',
      warmth: 'from-orange-400 to-yellow-500',
      surprise: 'from-blue-400 to-purple-500',
      sadness: 'from-gray-400 to-blue-500'
    }
    return colors[emotion as keyof typeof colors] || 'from-gray-400 to-gray-500'
  }

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      joy: '😊',
      love: '❤️',
      gratitude: '🙏',
      excitement: '🎉',
      warmth: '🤗',
      surprise: '😮',
      sadness: '😢'
    }
    return icons[emotion as keyof typeof icons] || '💭'
  }

  return (
    <div className="min-h-screen p-4">
      {/* 標題欄 */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">創建時空膠囊</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* 步驟 1: 選擇回憶 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-6 h-6 text-pink-500 mr-2" />
            選擇要封存的回憶
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((memory) => (
              <motion.div
                key={memory.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.selectedMemory?.id === memory.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMemorySelect(memory)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getEmotionColor(memory.emotion)} flex items-center justify-center text-2xl`}>
                    {getEmotionIcon(memory.emotion)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(memory.timestamp).toLocaleDateString('zh-TW')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        memory.emotion === 'joy' ? 'bg-yellow-100 text-yellow-800' :
                        memory.emotion === 'love' ? 'bg-pink-100 text-pink-800' :
                        memory.emotion === 'gratitude' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {memory.emotion}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {memory.content}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 步驟 2: 添加新訊息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Send className="w-6 h-6 text-blue-500 mr-2" />
            添加你的新訊息
          </h2>
          
          <textarea
            value={form.newMessage}
            onChange={(e) => setForm(prev => ({ ...prev, newMessage: e.target.value }))}
            placeholder="寫下你想對未來的他/她說的話..."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {form.newMessage.length}/500
          </div>
        </motion.div>

        {/* 步驟 3: 設定接收者和時間 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-6 h-6 text-green-500 mr-2" />
            設定接收者和解鎖時間
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收者 LINE ID
              </label>
              <input
                type="text"
                value={form.recipientId}
                onChange={(e) => setForm(prev => ({ ...prev, recipientId: e.target.value }))}
                placeholder="輸入接收者的 LINE ID"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                解鎖日期
              </label>
              <input
                type="date"
                value={form.unlockDate}
                onChange={(e) => setForm(prev => ({ ...prev, unlockDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                解鎖時間
              </label>
              <input
                type="time"
                value={form.unlockTime}
                onChange={(e) => setForm(prev => ({ ...prev, unlockTime: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={form.isPublic}
                onChange={(e) => setForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                公開此膠囊（其他人可以看到）
              </label>
            </div>
          </div>
        </motion.div>

        {/* 提交按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={isLoading || !form.selectedMemory || !form.newMessage || !form.recipientId || !form.unlockDate}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center mx-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                創建中...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                封存時空膠囊
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default CapsuleCreationPage

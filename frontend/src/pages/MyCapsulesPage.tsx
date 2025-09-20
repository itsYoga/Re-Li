import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Heart, Send, Eye, Lock, Unlock, Calendar, User } from 'lucide-react'

interface Capsule {
  id: string
  type: 'sent' | 'received'
  memorySnippet: {
    content: string
    emotion: string
    timestamp: string
    tags: string[]
  }
  newMessage: string
  recipient: {
    id: string
    name: string
    avatar?: string
  }
  sender: {
    id: string
    name: string
    avatar?: string
  }
  unlockTime: string
  isUnlocked: boolean
  isPublic: boolean
  createdAt: string
}

interface MyCapsulesPageProps {
  userProfile: any
}

const MyCapsulesPage: React.FC<MyCapsulesPageProps> = ({ userProfile }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')
  const [capsules, setCapsules] = useState<Capsule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCapsules()
  }, [activeTab])

  const loadCapsules = async () => {
    setIsLoading(true)
    try {
      // 這裡應該從 API 載入用戶的膠囊
      // 暫時使用模擬數據
      const mockCapsules: Capsule[] = [
        {
          id: '1',
          type: 'sent',
          memorySnippet: {
            content: '今天天氣真好，我們一起去公園散步吧！',
            emotion: 'joy',
            timestamp: '2024-01-15T10:30:00Z',
            tags: ['戶外', '朋友']
          },
          newMessage: '希望未來的我們還能一起享受這樣美好的時光',
          recipient: {
            id: 'friend1',
            name: '小明',
            avatar: 'https://via.placeholder.com/40'
          },
          sender: {
            id: userProfile?.userId || 'me',
            name: userProfile?.displayName || '我',
            avatar: userProfile?.pictureUrl
          },
          unlockTime: '2024-12-25T00:00:00Z',
          isUnlocked: false,
          isPublic: true,
          createdAt: '2024-01-20T15:30:00Z'
        },
        {
          id: '2',
          type: 'received',
          memorySnippet: {
            content: '謝謝你一直以來的支持，真的很感動',
            emotion: 'gratitude',
            timestamp: '2024-01-10T20:15:00Z',
            tags: ['感謝', '友情']
          },
          newMessage: '我也很感謝有你這樣的朋友，希望我們的友誼長存',
          recipient: {
            id: userProfile?.userId || 'me',
            name: userProfile?.displayName || '我',
            avatar: userProfile?.pictureUrl
          },
          sender: {
            id: 'friend2',
            name: '小華',
            avatar: 'https://via.placeholder.com/40'
          },
          unlockTime: '2024-06-01T12:00:00Z',
          isUnlocked: true,
          isPublic: false,
          createdAt: '2024-01-18T09:15:00Z'
        }
      ]
      
      const filteredCapsules = mockCapsules.filter(capsule => capsule.type === activeTab)
      setCapsules(filteredCapsules)
    } catch (error) {
      console.error('載入膠囊失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlockCapsule = async (capsuleId: string) => {
    try {
      // 這裡應該調用 API 解鎖膠囊
      console.log('解鎖膠囊:', capsuleId)
      // 更新本地狀態
      setCapsules(prev => prev.map(capsule => 
        capsule.id === capsuleId ? { ...capsule, isUnlocked: true } : capsule
      ))
    } catch (error) {
      console.error('解鎖膠囊失敗:', error)
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

  const formatTimeRemaining = (unlockTime: string) => {
    const now = new Date()
    const unlock = new Date(unlockTime)
    const diff = unlock.getTime() - now.getTime()
    
    if (diff <= 0) return '已可解鎖'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `還有 ${days} 天 ${hours} 小時`
    return `還有 ${hours} 小時`
  }

  const sentCapsules = capsules.filter(c => c.type === 'sent')
  const receivedCapsules = capsules.filter(c => c.type === 'received')

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
        <h1 className="text-2xl font-bold text-gray-800">我的時空膠囊</h1>
      </div>

      {/* 標籤頁 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'sent'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Send className="w-4 h-4 inline mr-2" />
          已送出 ({sentCapsules.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'received'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          已收到 ({receivedCapsules.length})
        </button>
      </div>

      {/* 膠囊列表 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">載入中...</p>
        </div>
      ) : capsules.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {activeTab === 'sent' ? '還沒有送出任何膠囊' : '還沒有收到任何膠囊'}
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'sent' 
              ? '去創建你的第一個時空膠囊吧！' 
              : '等待朋友們為你送來時空膠囊'
            }
          </p>
          {activeTab === 'sent' && (
            <button
              onClick={() => navigate('/create-capsule')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              創建時空膠囊
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {capsules.map((capsule, index) => (
            <motion.div
              key={capsule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="memory-card p-6"
            >
              <div className="flex items-start space-x-4">
                {/* 回憶片段 */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getEmotionColor(capsule.memorySnippet.emotion)} flex items-center justify-center text-2xl`}>
                    {getEmotionIcon(capsule.memorySnippet.emotion)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* 標題和狀態 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {capsule.type === 'sent' ? '送給' : '來自'} {capsule.type === 'sent' ? capsule.recipient.name : capsule.sender.name}
                      </h3>
                      {capsule.isPublic && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          公開
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {capsule.isUnlocked ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <Unlock className="w-4 h-4 mr-1" />
                          已解鎖
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-600 text-sm">
                          <Lock className="w-4 h-4 mr-1" />
                          {formatTimeRemaining(capsule.unlockTime)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 回憶內容 */}
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      "{capsule.memorySnippet.content}"
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {capsule.memorySnippet.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 新訊息 */}
                  {capsule.isUnlocked && (
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">你的新訊息：</h4>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {capsule.newMessage}
                      </p>
                    </div>
                  )}

                  {/* 時間資訊 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        創建於 {new Date(capsule.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        解鎖於 {new Date(capsule.unlockTime).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    
                    {!capsule.isUnlocked && capsule.type === 'received' && (
                      <button
                        onClick={() => handleUnlockCapsule(capsule.id)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        解鎖膠囊
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCapsulesPage

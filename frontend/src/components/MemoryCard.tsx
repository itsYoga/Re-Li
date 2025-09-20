import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Heart, Sparkles, ArrowRight } from 'lucide-react'

interface MemorySnippet {
  id: string
  timestamp: string
  content: string
  emotion: string
  tags: string[]
  participants: string[]
}

interface MemoryCardProps {
  memory: MemorySnippet
  onCreateCapsule: () => void
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onCreateCapsule }) => {
  const getEmotionColor = (emotion: string) => {
    const colors = {
      'joy': 'from-yellow-400 to-orange-500',
      'love': 'from-pink-400 to-red-500',
      'gratitude': 'from-green-400 to-emerald-500',
      'excitement': 'from-purple-400 to-pink-500',
      'warmth': 'from-amber-400 to-yellow-500',
      'default': 'from-blue-400 to-purple-500'
    }
    return colors[emotion as keyof typeof colors] || colors.default
  }

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      'joy': '😊',
      'love': '💕',
      'gratitude': '🙏',
      'excitement': '🎉',
      'warmth': '🤗',
      'default': '💫'
    }
    return icons[emotion as keyof typeof icons] || icons.default
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="memory-card p-6 cursor-pointer group"
      onClick={onCreateCapsule}
    >
      {/* 情緒標籤 */}
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getEmotionColor(memory.emotion)} text-white text-sm font-medium`}>
          {getEmotionIcon(memory.emotion)} {memory.emotion}
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
      </div>

      {/* 時間戳 */}
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">
          {new Date(memory.timestamp).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* 內容預覽 */}
      <div className="mb-4">
        <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
          {memory.content}
        </p>
      </div>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {memory.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
        {memory.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{memory.tags.length - 3}
          </span>
        )}
      </div>

      {/* 參與者 */}
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-4 h-4 text-pink-500" />
        <span className="text-sm text-gray-600">
          {memory.participants.join(', ')}
        </span>
      </div>

      {/* 創建膠囊按鈕 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>製作時空膠囊</span>
      </motion.button>
    </motion.div>
  )
}

export default MemoryCard

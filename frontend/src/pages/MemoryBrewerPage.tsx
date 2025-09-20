import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Clock, Heart, ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import { MemoryProcessor } from '../services/MemoryProcessor'
import MemoryCard from '../components/MemoryCard'

interface MemoryBrewerPageProps {
  userProfile: any
}

interface MemorySnippet {
  id: string
  timestamp: string
  content: string
  emotion: string
  tags: string[]
  participants: string[]
}

const MemoryBrewerPage: React.FC<MemoryBrewerPageProps> = ({ userProfile }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [memories, setMemories] = useState<MemorySnippet[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const memoryProcessor = new MemoryProcessor()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      setError('請上傳 LINE 聊天記錄的 .zip 備份檔')
      return
    }

    setIsProcessing(true)
    setError(null)
    setMemories([])

    try {
      const extractedMemories = await memoryProcessor.processChatBackup(file)
      setMemories(extractedMemories)
    } catch (err) {
      setError('處理聊天記錄時發生錯誤，請確認檔案格式正確')
      console.error('Memory processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateCapsule = (memory: MemorySnippet) => {
    // 導航到膠囊創建頁面，並傳遞選中的回憶
    const memoryData = encodeURIComponent(JSON.stringify(memory))
    window.location.href = `/create-capsule?memory=${memoryData}`
  }

  return (
    <div className="min-h-screen p-4">
      {/* 標題區域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">記憶釀酒師</h1>
            <p className="text-gray-600">AI 智慧發掘珍貴回憶片段</p>
          </div>
        </div>
      </motion.div>

      {/* 上傳區域 */}
      {memories.length === 0 && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-effect rounded-2xl p-8 text-center">
            <div className="floating-animation mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              上傳 LINE 聊天記錄
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              請匯出您想要分析的 LINE 聊天記錄備份檔 (.zip)，<br />
              我們將在您的手機上安全地分析這些回憶
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              選擇檔案
            </motion.button>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    隱私保護承諾
                  </p>
                  <p className="text-xs text-amber-700">
                    所有分析都在您的手機上完成，原始聊天記錄不會上傳到任何伺服器
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 處理中狀態 */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="glass-effect rounded-2xl p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI 正在分析您的回憶
            </h3>
            <p className="text-gray-600 text-sm">
              請稍候，我們正在發掘那些珍貴的時刻...
            </p>
          </div>
        </motion.div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto mb-6"
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 回憶列表 */}
      <AnimatePresence>
        {memories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                發現的回憶片段
              </h2>
              <p className="text-gray-600">
                共找到 {memories.length} 個珍貴的回憶片段
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <MemoryCard
                    memory={memory}
                    onCreateCapsule={() => handleCreateCapsule(memory)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MemoryBrewerPage

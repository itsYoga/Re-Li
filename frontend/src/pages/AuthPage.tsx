import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Heart, Clock, Zap, Star, Lock, ArrowRight } from 'lucide-react'

interface AuthPageProps {
  onLogin: () => void
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI 智慧發掘",
      description: "自動識別珍貴回憶片段"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "時空膠囊",
      description: "將心意傳遞給未來"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "隱私保護",
      description: "所有處理都在本地完成"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0">
        {/* 漸層背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50"></div>
        
        {/* 動態圓形 */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* 星星裝飾 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* 主要內容 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full relative z-10"
      >
        <div className="text-center">
          {/* Logo 和標題 */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-8 shadow-2xl relative">
              <Heart className="w-12 h-12 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Re:li
            </h1>
            
            <p className="text-3xl md:text-4xl text-purple-200 font-bold mb-4">
              記憶釀酒師 × 時空膠囊
            </p>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              重新發現與摯友的美好回憶，將珍貴時刻封存成時空膠囊
            </p>
          </motion.div>

          {/* 功能特色 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* 登入按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-md mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-6 px-12 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-4">
                <Zap className="w-6 h-6" />
                <span>開始使用 Re:li</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            {/* 隱私說明 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Lock className="w-6 h-6 text-green-400" />
                <span className="text-green-300 font-bold text-lg">隱私保護</span>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">
                所有 AI 分析都在您的手機上完成，我們不會存取您的聊天記錄，完全保護您的隱私
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage

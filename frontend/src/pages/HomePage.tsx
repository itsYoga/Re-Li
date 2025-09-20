import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Clock, Heart, Upload } from 'lucide-react'

interface HomePageProps {
  userProfile: any
}

const HomePage: React.FC<HomePageProps> = ({ userProfile }) => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: "記憶釀酒師",
      description: "AI 智慧掃描聊天記錄，發掘珍貴回憶片段",
      action: () => navigate('/memories')
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "時空膠囊",
      description: "將回憶封存，在未來特定時刻送達",
      action: () => navigate('/create-capsule')
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "我的膠囊",
      description: "管理已送出和收到的時空膠囊",
      action: () => navigate('/my-capsules')
    }
  ]

  return (
    <div className="min-h-screen p-4">
      {/* 歡迎區域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="floating-animation mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center capsule-glow">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Re:li
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          歡迎回來，{userProfile?.displayName || '朋友'}！
        </p>
        
        <p className="text-gray-500 max-w-md mx-auto">
          重新發現與摯友的美好回憶，將珍貴時刻封存成時空膠囊
        </p>
      </motion.div>

      {/* 功能卡片 */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="memory-card p-6 cursor-pointer"
              onClick={feature.action}
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部說明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mt-16"
      >
        <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            隱私優先設計
          </h3>
          <p className="text-sm text-gray-600">
            所有聊天記錄分析都在您的手機上完成，我們絕不會存取您的原始對話內容
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default HomePage

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// LIFF 初始化
import liff from '@line/liff'

// 頁面組件
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import MemoryBrewerPage from './pages/MemoryBrewerPage'
import CapsuleCreationPage from './pages/CapsuleCreationPage'
import MyCapsulesPage from './pages/MyCapsulesPage'
import LoadingPage from './pages/LoadingPage'
import TestPage from './TestPage'

// 樣式
import './index.css'

// LIFF 配置
const LIFF_ID = import.meta.env.VITE_LIFF_ID || 'your-liff-id'

function App() {
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID })
        setIsLiffReady(true)
        
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true)
          const profile = await liff.getProfile()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('LIFF 初始化失敗:', error)
        setIsLiffReady(true) // 即使失敗也繼續，用於開發模式
      }
    }

    initializeLiff()
  }, [])

  const handleLogin = async () => {
    if (!liff.isLoggedIn()) {
      liff.login()
    }
  }

  if (!isLiffReady) {
    return <LoadingPage />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                !isLoggedIn ? (
                  <AuthPage onLogin={handleLogin} />
                ) : (
                  <HomePage userProfile={userProfile} />
                )
              } 
            />
            <Route 
              path="/memories" 
              element={<MemoryBrewerPage userProfile={userProfile} />} 
            />
            <Route 
              path="/create-capsule" 
              element={<CapsuleCreationPage userProfile={userProfile} />} 
            />
            <Route 
              path="/my-capsules" 
              element={<MyCapsulesPage userProfile={userProfile} />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App

import React from 'react'

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          Re:li 測試頁面
        </h1>
        <p className="text-gray-600 mb-8">
          如果您看到這個頁面，表示 React 和 Tailwind CSS 都正常運作！
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-green-600 font-semibold">
            ✅ 前端服務正常運行
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestPage

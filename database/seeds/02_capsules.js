exports.seed = function(knex) {
  // 刪除現有資料
  return knex('capsules').del()
    .then(function () {
      // 插入種子資料
      return knex('capsules').insert([
        {
          id: '00000000-0000-0000-0000-000000000001',
          sender_id: '00000000-0000-0000-0000-000000000001',
          recipient_id: '00000000-0000-0000-0000-000000000002',
          memory_snippet: JSON.stringify({
            id: 'memory_001',
            timestamp: '2023-12-01T10:30:00Z',
            content: '還記得我們第一次見面的時候嗎？那時候你穿著藍色的襯衫，我們聊了很多關於夢想的話題...',
            emotion: 'warmth',
            tags: ['第一次見面', '夢想', '溫暖'],
            participants: ['測試使用者 1', '測試使用者 2']
          }),
          new_message: '希望這個回憶能帶給你溫暖，就像你一直帶給我的溫暖一樣。',
          unlock_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 小時後
          is_anonymous: false,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          sender_id: '00000000-0000-0000-0000-000000000002',
          recipient_id: '00000000-0000-0000-0000-000000000001',
          memory_snippet: JSON.stringify({
            id: 'memory_002',
            timestamp: '2023-11-15T15:45:00Z',
            content: '生日快樂！謝謝你一直以來的陪伴，希望你的每一天都充滿笑容 😊',
            emotion: 'joy',
            tags: ['生日', '祝福', '陪伴'],
            participants: ['測試使用者 2', '測試使用者 1']
          }),
          new_message: '一年後的今天，我想再次對你說聲生日快樂！',
          unlock_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 天後
          is_anonymous: false,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
    })
}

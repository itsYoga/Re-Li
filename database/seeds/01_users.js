exports.seed = function(knex) {
  // 刪除現有資料
  return knex('users').del()
    .then(function () {
      // 插入種子資料
      return knex('users').insert([
        {
          id: '00000000-0000-0000-0000-000000000001',
          line_user_id: 'U1234567890abcdef1234567890abcdef1',
          display_name: '測試使用者 1',
          picture_url: 'https://example.com/avatar1.jpg',
          status_message: '正在測試 LINE Re:mind',
          is_active: true,
          last_login_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          line_user_id: 'U1234567890abcdef1234567890abcdef2',
          display_name: '測試使用者 2',
          picture_url: 'https://example.com/avatar2.jpg',
          status_message: '期待收到時空膠囊',
          is_active: true,
          last_login_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
    })
}

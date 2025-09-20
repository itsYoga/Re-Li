exports.up = function(knex) {
  return knex.schema.createTable('memories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.string('memory_id').notNullable() // 來自前端處理的記憶 ID
    table.jsonb('memory_data').notNullable() // 完整的記憶資料
    table.string('emotion').notNullable()
    table.jsonb('tags').notNullable() // 標籤陣列
    table.timestamp('memory_timestamp').notNullable()
    table.boolean('is_processed').defaultTo(false)
    table.timestamps(true, true)
    
    // 外鍵約束
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    
    // 索引
    table.index('user_id')
    table.index('memory_id')
    table.index('emotion')
    table.index('memory_timestamp')
    table.index('is_processed')
    
    // 唯一約束：每個使用者的記憶 ID 應該是唯一的
    table.unique(['user_id', 'memory_id'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('memories')
}

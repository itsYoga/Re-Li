exports.up = function(knex) {
  return knex.schema.createTable('capsules', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('sender_id').notNullable()
    table.uuid('recipient_id').notNullable()
    table.jsonb('memory_snippet').notNullable()
    table.text('new_message').notNullable()
    table.timestamp('unlock_time').notNullable()
    table.boolean('is_anonymous').defaultTo(false)
    table.boolean('is_public').defaultTo(false)
    table.enum('status', ['pending', 'unlocked', 'expired', 'cancelled']).defaultTo('pending')
    table.timestamp('unlocked_at')
    table.text('unlock_message') // 解鎖時的額外訊息
    table.integer('view_count').defaultTo(0) // 查看次數
    table.timestamps(true, true)
    
    // 外鍵約束
    table.foreign('sender_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('recipient_id').references('id').inTable('users').onDelete('CASCADE')
    
    // 索引
    table.index('sender_id')
    table.index('recipient_id')
    table.index('unlock_time')
    table.index('status')
    table.index('is_public')
    table.index(['status', 'unlock_time'])
    table.index(['recipient_id', 'status'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('capsules')
}

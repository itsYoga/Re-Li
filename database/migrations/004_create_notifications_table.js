exports.up = function(knex) {
  return knex.schema.createTable('notifications', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('capsule_id')
    table.string('type').notNullable() // 'capsule_unlock', 'capsule_received', etc.
    table.string('title').notNullable()
    table.text('message').notNullable()
    table.jsonb('data') // 額外的通知資料
    table.boolean('is_read').defaultTo(false)
    table.timestamp('sent_at')
    table.timestamps(true, true)
    
    // 外鍵約束
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('capsule_id').references('id').inTable('capsules').onDelete('CASCADE')
    
    // 索引
    table.index('user_id')
    table.index('capsule_id')
    table.index('type')
    table.index('is_read')
    table.index('sent_at')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('notifications')
}

exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('line_user_id').unique().notNullable()
    table.string('display_name').notNullable()
    table.string('picture_url')
    table.string('status_message')
    table.boolean('is_active').defaultTo(true)
    table.timestamp('last_login_at')
    table.timestamps(true, true)
    
    // 索引
    table.index('line_user_id')
    table.index('is_active')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}

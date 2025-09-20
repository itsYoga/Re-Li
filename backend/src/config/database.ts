import knex from 'knex'
import { logger } from '../utils/logger'

const config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'reli_db',
    user: process.env.DB_USER || 'jesse',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './database/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './database/seeds'
  }
}

export const db = knex(config)

export async function initializeDatabase() {
  try {
    // 測試資料庫連接
    await db.raw('SELECT 1')
    
    // 執行遷移
    await db.migrate.latest()
    logger.info('資料庫遷移完成')
    
    // 在開發環境執行種子資料
    if (process.env.NODE_ENV === 'development') {
      await db.seed.run()
      logger.info('種子資料載入完成')
    }
    
    return true
  } catch (error) {
    logger.error('資料庫初始化失敗:', error)
    throw error
  }
}

export async function closeDatabase() {
  try {
    await db.destroy()
    logger.info('資料庫連接已關閉')
  } catch (error) {
    logger.error('關閉資料庫連接時發生錯誤:', error)
  }
}

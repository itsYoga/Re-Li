require('dotenv').config()

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME || 'reli_db',
      user: process.env.DB_USER || process.env.USER,
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432
    },
    migrations: {
      directory: '../database/migrations'
    },
    seeds: {
      directory: '../database/seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || {
      database: process.env.DB_NAME || 'reli_db',
      user: process.env.DB_USER || process.env.USER,
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432
    },
    migrations: {
      directory: '../database/migrations'
    },
    seeds: {
      directory: '../database/seeds'
    }
  }
}

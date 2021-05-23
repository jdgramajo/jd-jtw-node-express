module.exports = {
  schema: process.env.DATABASE_SCHEMA,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connection: {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

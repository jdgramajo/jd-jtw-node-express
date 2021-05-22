module.exports = {
  schema: 'testdb',
  user: 'postgres',
  password: 'psqlion',
  connection: {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

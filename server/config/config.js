module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "port": process.env.DB_PORT,
    "dialect": "postgres"
  },
  "test": {
    "username": "test",
    "password": "null",
    "database": "mobilise_test",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "host": process.env.RDS_HOSTNAME,
    "database": process.env.RDS_DB_NAME,
    "user": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "port" : process.env.RDS_PORT,
    "dialect": "postgres"
  }
}

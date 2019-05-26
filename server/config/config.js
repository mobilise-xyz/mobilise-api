module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": UWFfWA5vsCrScywium,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "port": 5433,
    "dialect": "postgres"
  },
  "test": {
    "username": "test",
    "password": "",
    "port": 5432,
    "database": "mobilise_test",
    "host": "127.0.0.1",
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

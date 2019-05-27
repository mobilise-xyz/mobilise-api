module.exports = {
  "token": {
    "timeout": 9999
  },
  "jwt-secret": process.env.JWT_SECRET
  ,
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
    "password": "",
    "port": 5432,
    "database": "mobilise_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "host": process.env.RDS_HOSTNAME,
    "database": process.env.RDS_DB_NAME,
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "port" : process.env.RDS_PORT,
    "dialect": "postgres"
  }
}

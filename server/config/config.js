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
    "host": process.env.DOC_HOSTNAME,
    "database": process.env.DOC_DB_NAME,
    "username": process.env.DOC_USERNAME,
    "password": process.env.DOC_PASSWORD,
    "port" : process.env.DOC_PORT,
    "dialect": "postgres"
  }
}

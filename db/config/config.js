require('dotenv').config() ;
module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_BASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT 
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "cognatus",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "cognatus",
    "host": "localhost",
    "dialect": "mysql"
  }
}

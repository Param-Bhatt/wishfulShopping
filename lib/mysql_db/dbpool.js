var mysql = require('mysql')
var settings = require('../../settings')
// --------IMPORTANT-------
// we create a pool of connections here and export it
// will prevent us from creating a pool each time database object is called

const pool_users = mysql.createPool({
  connectionLimit: settings.DB_CONNECTION_LIMIT,
  host: settings.DB_HOST,
  user: settings.DB_USER,
  password: settings.DB_MYSQL_PASSWORD,
  database: 'users',
  multipleStatements: true
})/*
const pool_mess = mysql.createPool({
  connectionLimit: settings.DB_CONNECTION_LIMIT,
  host: settings.DB_HOST,
  user: settings.DB_USER,
  password: settings.DB_PASSWORD,
  database: 'mess',
  multipleStatements: true
})
const pool_docs = mysql.createPool({
  connectionLimit: settings.DB_CONNECTION_LIMIT,
  host: settings.DB_HOST,
  user: settings.DB_USER,
  password: settings.DB_PASSWORD,
  database: 'docs',
  multipleStatements: true
})*/

module.exports.users = pool_users
//module.exports.mess = pool_mess
//module.exports.docs = pool_docs

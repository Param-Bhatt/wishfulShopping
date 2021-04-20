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
})
const pool_items = mysql.createPool({
  connectionLimit: settings.DB_CONNECTION_LIMIT,
  host: settings.DB_HOST,
  user: settings.DB_USER,
  password: settings.DB_MYSQL_PASSWORD,
  database: 'items',
  multipleStatements: true
})/*
const pool_docs = mysql.createPool({
  connectionLimit: settings.DB_CONNECTION_LIMIT,
  host: settings.DB_HOST,
  user: settings.DB_USER,
  password: settings.DB_PASSWORD,
  database: 'docs',
  multipleStatements: true
})*/

module.exports.users = pool_users
module.exports.items = pool_items
//module.exports.docs = pool_docs

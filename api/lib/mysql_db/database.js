var mysql = require('mysql')
var settings = require('../../settings')

class Database {
  constructor (dbName) {
    this.dbName = dbName
    if (dbName == 'users') {
      this.pool = require('./dbpool.js').users
    } /*else if (dbName == 'mess') {
      this.pool = require('./dbpool.js').mess
    } else if (dbName == 'docs') {
      this.pool = require('./dbpool.js').docs
    }*/
  }

  call (query, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, params, (err, result, fields) => {
        if (err) {
          err.message = 'Database connection error'
          err.status = 500
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

module.exports = Database

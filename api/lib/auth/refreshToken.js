const path = require('path')
const settings = require('../../settings')
const genToken = require(path.join(settings.PROJECT_LIB, 'crypto', 'token.js'))
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db','database.js'))
const database = new Database('users')

const verify = (email, refresh_token) => {
    var sql = 'SELECT * FROM refresh_tokens WHERE email = ? AND refresh_token = ?'
    var params = [email, refresh_token]
    return new Promise((resolve, reject) => {
      database.call(sql, params)
        .then((result) => {
          if (result.length === 1) {
            resolve(1)
          } else {
            resolve(0)
          }
        }).catch((e) => {
          reject(e)
        })
    })
  }
  
  const revamp = (email) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
      genToken().then((newToken) => {
        sql = 'UPDATE refresh_tokens SET ? WHERE email = ?'
        params = [{
          refresh_token: newToken
        }, email]
        database.call(sql, params)
          .then((res1) => {
            if (res1.affectedRows === 1) {
              resolve(1)
            } else {
              sql = 'INSERT INTO refresh_tokens SET ?'
              params = [{
                email: email,
                refresh_token: newToken
              }]
              database.call(sql, params)
                .then((res2) => {
                  resolve(res2.affectedRows)
                }).catch((e) => {
                  reject(e)
                })
            }
          }).catch((e) => {
            reject(e)
          })
      })
    })
  }
  
  const get = (email) => {
    var sql = 'SELECT * FROM refresh_tokens WHERE email = ?'
    var params = [email]
    return new Promise((resolve, reject) => {
      database.call(sql, params)
        .then((result) => {
          if (result.length === 1) {
            resolve(result[0].refresh_token)
          } else {
            /* Token does not exist or has expired fallback to new token */
            revamp(email).then((revampedToken) => {
              resolve(revampedToken)
            }).catch((err) => {
              reject(err)
            })
          }
        }).catch((e) => {
          reject(e)
        })
    })
  }
  

module.exports = {
    get: get,
    verify: verify,
    revamp: revamp
}
  
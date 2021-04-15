const settings = require('../../settings.js')
const path = require('path')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db','database.js'))
const pwd = require(path.join(settings.PROJECT_LIB, 'crypto', 'password.js'))
const database = new Database('users')

const verifyPassword = (email, password) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT * from users where email = ?'
        params = [email]
        database.call(sql, params)
        .then((result) => {
            pwd.compare(password, result[0].password)
            .then((match) => {
                if(match==1){
                    resolve(1)
                }else{
                    resolve(1)
                }
            }).catch((err) => {
                reject(err)
            })
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports = verifyPassword

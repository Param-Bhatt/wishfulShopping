const { response } = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const users_database = new Database('users')
const item_database = new Database('items')
const sendEmail = require(path.join(settings.PROJECT_LIB, 'mailer','mailer.js'))

var displayOrder = (userEmail) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT * from orders where customerEmail = ?'
        params = [userEmail]
        item_database.call(sql, params)
        .then((result) => {
            if(result.length > 0){
                resolve([1, result])
            }else{
                resolve([0, result])
            }
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports = displayOrder
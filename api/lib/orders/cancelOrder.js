const { response } = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const users_database = new Database('users')
const item_database = new Database('items')
const date = new Date()
const sendEmail = require(path.join(settings.PROJECT_LIB, 'mailer','mailer.js'))

var cancelOrder = (userEmail, orderID) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'DELETE from orders where customerEmail = ? AND orderID = ?'
        params = [userEmail, orderID]
        item_database.call(sql, params)
        .then((result) => {
            if(result.affectedRows === 1){
                resolve(1)
            }else{
                resolve([0, result])
            }
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports = cancelOrder
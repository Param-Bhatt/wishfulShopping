const path = require('path');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('items')
const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))
const users_database = new Database('users')

var removeItem = (name, price) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT userType from userInfo where email = ?'
        params = [email]
        users_database.call(sql, params)
        .then((res) => {
            if(res.userType != 'shopper'){
                sql = 'DELETE from items where name = ? AND price = ? and sellerEmail = ?'
                params = [name, price, res.userType]
                database.call(sql, params)
                .then((result) => {
                    console.log(result)
                    resolve(1)
                }).catch(e => {
                    reject(e);
                })
            }else{
                reject("User is not authorized to add any items")
            }    
        }).catch((e) => {
            reject(e)
        })
        
    })
}

module.exports = removeItem
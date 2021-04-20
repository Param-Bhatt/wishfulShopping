const path = require('path');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('items')
const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))
const users_database = new Database('users')
var addItem = (name, descr, price,email, qut) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT userType from userInfo where email = ?'
        params = [email]
        users_database.call(sql, params)
        .then((res) => {
            if(res.userType != 'shopper'){
                console.log(res)
                sql = 'INSERT into items (name, description, price, sellerEmail, quantity) VALUES (?,?,?,?,?)'
                params = [name, descr, price, email, qut]
                database.call(sql, params)
                .then((result) => {
                    if(result.affectedRows == 1){
                        resolve(1)
                    }else{
                        reject("Error in adding to database")
                    }
                }).catch(e => {
                    reject(e);
                })
            }
            else{
                reject("User is not authorized to add any items")
            }
        }).catch((e) => {
            reject(e)
        })

        
    })
}

module.exports = addItem
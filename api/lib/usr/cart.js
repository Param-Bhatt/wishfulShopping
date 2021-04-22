const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const users_database = new Database('users')
const item_database = new Database('items')
const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))

var getCart = (email) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT itemID, quantity, userEmail from cart where userEmail = ?'
        params = [email]
        users_database.call(sql, params)
        .then((result) => {
            resolve([1, result])
        }).catch((e) => {
            reject(e)
        })
    })
}

var addToCart = (email, item, quantity) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT itemQuantity from items where id = ?'
        params = [item]
        item_database.call(sql, params)
        .then((res) => {
            console.log(res[0].itemQuantity)
            console.log(res.itemQuantity + " " + quantity)
            if(res[0].itemQuantity >= quantity){
            sql = 'SELECT * FROM cart where userEmail = ? AND itemID = ?'
            params = [email, item]
            users_database.call(sql, params)
            .then((res) => {
                if(res.length !== 1){
                    /*Adding to cart*/
                    sql = 'INSERT into cart (itemID, quantity, userEmail) VALUES (?,?,?)'
                    params = [item, quantity, email]
                    users_database.call(sql, params)
                    .then((result) => {
                        if(result.affectedRows === 1){
                            resolve([1, result])
                        }else{
                            resolve([0, result])
                        }
                    }).catch((e) => {
                        reject(e)
                    })
                }else{
                    /*Fallback to updating the cart*/
                    updateCart(email, item, quantity)
                    .then((result) => {
                        resolve(result)
                    }).catch((e) => {
                        reject(e)
                    })
                }
                    
                }).catch(err => {
                    reject(err)
                })
            }else{
                resolve([0, 
                    {err : "true",
                    msg : "Not enough quantity available, please try a lower quantity"
                }])
            }
        }).catch((e) => {
            reject(e)
        })
        
    })
}

var updateCart = (email, item, quantity) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT itemQuantity from items where id = ?'
        params = [item]
        item_database.call(sql, params)
        .then((res) => {
            if(res[0].itemQuantity >= quantity){
                sql = 'UPDATE cart set quantity = ? where itemID = ? AND userEmail = ?'
                params = [quantity, item, email]
                users_database.call(sql, params)
                .then((result) => {
                    if(result.affectedRows === 1){
                        resolve([1, result])
                    }else{
                        resolve([0, result])
                    }
                }).catch((e) => {
                    reject(e)
                })
            }else{
                resolve([0, 
                    {err : "true",
                    msg : "Not enough quantity available, please try a lower quantity"
                }])
            }
        }).catch((e) => {
            reject(e)
        })
        
    })
}
module.exports.get = getCart
module.exports.add = addToCart
module.exports.update = updateCart
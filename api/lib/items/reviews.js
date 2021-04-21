const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('items')

var reviews = (name) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT review, userName from reviews where itemName = ?'
        params = [name]
        database.call(sql, params)
        .then((result) => {
            console.log(result)
            resolve(result)
        }).catch((e) => {
            reject(e)
        })
    })
}

var addReview = (item, review, name) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'INSERT into reviews (itemName, review, userName) VALUES (?,?,?)'
        params = [item, review, name]
        database.call(sql, params)
        .then((result) => {
            if(result.affectedRows == 1){
                resolve(1)
            }else{
                reject("Error in adding database")
            }
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports.get = reviews
module.exports.add = addReview
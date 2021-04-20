const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('items')

var displayItems = () => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = 'SELECT name,category,price from items where quantity > 0'
        params = []
        database.call(sql, params)
        .then((result) => {
            console.log(result)
            resolve(result)
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports = displayItems
const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const items_database = new Database('items')
var itemInfo = (name) => {
    var sql = null
    var params = null
    var data = []
    return new Promise((resolve, reject) => {
        sql = 'SELECT * from items.items a JOIN users.userInfo b on a.sellerEmail = b.email WHERE b.userType != "shopper"'
        params = []
        items_database.call(sql, params)
        .then((result) => {
            if(result.length > 0){
                for (let row of result){
                    var currData = {}
                    currData.name = name
                    currData.sellerEmail = row.sellerEmail
                    currData.price = row.price
                    currData.quantity = row.itemQuantity
                    currData.seller = row.itemName
                    currData.sellerAddress = row.address
                    data.push(currData)
                }
                resolve([1, data])
            }
            else{
                resolve([1, data])
            }
        }).catch((e) => {
            reject(e)
        })
    })
}

module.exports = itemInfo

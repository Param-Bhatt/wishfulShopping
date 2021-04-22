const path = require('path');
const { fileURLToPath } = require('url');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const users_database = new Database('users')
const item_database = new Database('items')
const date = new Date()
const sendEmail = require(path.join(settings.PROJECT_LIB, 'mailer','mailer.js'))
var deliveryDate = () => {
    const timeElapsed = Date.now() + 7 * 24 * 60 *60 * 1000;
    const date = new Date(timeElapsed)
    var d = date.getDate()
    var m = date.getMonth() + 1
    var y = date.getFullYear()
    return y+'-'+m+'-'+d
}
var placeOrder = (email) => {
    var sql = null
    var params = null
    return new Promise((resolve, reject) => {
        sql = `SELECT * from items.items a 
                JOIN users.cart b 
                on a.id = b.itemID
                JOIN users.userInfo c
                on b.userEmail = c.email
                WHERE b.userEmail = ? LIMIT 1`
        params = [email]
        users_database.call(sql, params)
        .then((result) => {
            if(result.length > 0){
                sql = 'SELECT * from userInfo where email = '
                var data = []
                for(let row of result){
                    var currData = {}
                    currData.itemID = row.id
                    currData.itemName = row.itemName
                    currData.itemPrice = row.price
                    currData.itemQuantity = row.quantity
                    currData.totalPrice = row.quantity * row.price
                    currData.shipCharges = 70
                    currData.totalCharges = ((row.quantity * row.price) + 70)
                    currData.sellerEmail = row.sellerEmail
                    currData.customerEmail = row.userEmail
                    currData.customerAddress = row.address
                    currData.deliveryDate = deliveryDate()
                    console.log(currData)
                    sql = 'INSERT into orders (itemID, itemName, itemPrice, itemQuantity, totalPrice, shipCharges, totalCharges, sellerEmail, customerEmail, customerAddress, deliveryDate) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
                    params = [currData.itemID,currData.itemName, currData.itemPrice, currData.itemQuantity, currData.totalPrice, currData.shipCharges, currData.totalCharges, currData.sellerEmail, currData.customerEmail, currData.customerAddress, currData.deliveryDate]
                    item_database.call(sql, params)
                    .then((res1) => {
                        if(res1.affectedRows === 1){
                            sql = 'UPDATE items SET itemQuantity = ? where id = ?'
                            var newQut = row.itemQuantity - currData.itemQuantity
                            params = [newQut, currData.itemID]
                            item_database.call(sql, params)
                            .then((res2) => {
                                if(res2.affectedRows === 1){
                                    sendEmail(currData.customerEmail, 'Order placed successfully', `Your order for the following item has been placed successfully : ${currData.itemName}`)
                                    .then((res3) => {
                                        if(res3 !== 1){
                                            resolve([0, res3])
                                        }else{
                                            data.push(currData)
                                            sql = 'DELETE from cart where itemID = ? AND userEmail = ?'
                                            params = [currData.itemID, currData.customerEmail]
                                            users_database.call(sql, params)
                                            .then((res4) => {
                                                if(res4.affectedRows === 1){
                                                    console.log("HErrrrrr")
                                                    currData.err = "false"
                                                    resolve([1,currData])
                                                }else{
                                                    resolve([0, res4])
                                                }
                                            }).catch((e4) => {
                                                reject(e4)
                                            })
                                            
                                        }
                                    }).catch((e3) => {
                                        reject(e3)
                                    })
                                }else{
                                    resolve([0,res2])
                                }
                            }).catch((e2) => {
                                console.log(e2)
                                reject(e2)
                            })
                        }else{
                            resolve([0, res1])
                        }
                    }).catch((e1) => {
                        console.log(e1)
                        reject(e1)
                    })
                }
                resolve([1, data])
            }else{
                resolve([0, result])
            }
        }).catch((e) => {
            reject(e)
        })        
    })
}

module.exports = placeOrder
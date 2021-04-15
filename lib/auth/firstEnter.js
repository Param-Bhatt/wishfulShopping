const path = require('path');
const settings = require('../../settings')
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('users')

var enterDetails = (email) => {
    return new Promise((resolve, reject) => {
        var inner_sql = "INSERT into userInfo (email, name, userType) VALUES(?, ?, ?)"
        var inner_params = [email, null, null]
        database.call(inner_sql,inner_params)
        .then((result) => {
            if(result){
                console.log(result);
                resolve(1)
            }
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports = enterDetails
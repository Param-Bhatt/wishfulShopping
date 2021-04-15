const path = require('path');
const settings = require('../../settings')
const crypto = require('crypto');
const { resolve } = require('path');
const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const User = require(path.join(settings.PROJECT_LIB, 'models', 'users.js'))
const mongoQuery = require(path.join(settings.PROJECT_LIB, 'database', 'query.js'));
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('users')

var insertLogin = (email, password, otp) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT into users (email, password, otp) VALUES(?,?,?)"
        var params = [email, password, otp]
        database.call(sql, params)
        .then((result) => {
            console.log(result)
            resolve(1)
        }).catch((e) => {
            reject(e);
        })
    })
}

module.exports = insertLogin
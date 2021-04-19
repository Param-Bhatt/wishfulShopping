var settings = require('../../settings.js')
var path = require('path')
const verifyPassword = require('./verifyPassword.js')
var Database = require(path.join(settings.PROJECT_LIB, 'mysql_db','database.js'))
var userToken = require(path.join(settings.PROJECT_LIB, 'auth', 'userToken.js'))
const clientId = settings.MAIL_OAUTH_CLIENT_ID
const clientSecret = settings.MAIL_OAUTH_CLIENT_SECRET
const redirectUrl = settings.MAIL_AUTH_REDIRECT
const {google} = require('googleapis')

var loginUser = (email, password, type = 0) => {
    return new Promise((resolve, reject) => {
        var data = {}
        verifyPassword(email, password)
        .then((result) => {
            if(result == 1){
                userToken.get(email, type)
                .then((token) => {
                    data.token = token
                    var database = new Database('users')
                    var sql = 'SELECT name, userType FROM userInfo WHERE email = ? LIMIT 1;'
                    var params = [email]
                    database.call(sql, params)
                    .then((result) => {
                        if(result.length === 1){
                            data.name = result[0].name
                            data.role = result[0].userType
                            console.log(data)
                            resolve(data)
                        }else{
                            data.name = ' '
                            data.role = ' '
                            resolve(data)
                        }
                    }).catch((e) => {
                        reject(e)
                    })
                }).catch(err => {
                    reject(err)
                })
            }else{
                resolve(0)
            }
        })
    })
}
var googleLogin = (oauth2Client) => {
    return new Promise((resolve, reject) => {
        var data = {}
    
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        gmail.users.getProfile({
            userId : 'me',
        }, (err, res) => {
            if(err){
                reject(err)
            }else{
                var userEmail = res.data.emailAddress
                userToken.get(userEmail)
                .then((token) => {
                    data.token = token
                    var database = new Database('users')
                    var sql = 'SELECT name, userType FROM userInfo WHERE email = ? LIMIT 1;'
                    var params = [userEmail]
                    database.call(sql, params)
                    .then((result) => {
                        if(result.length === 1){
                            data.name = result[0].name
                            data.role = result[0].userType
                            resolve(data)
                        }else{
                            data.name = ' '
                            data.role = ' '
                            resolve(data)
                        }
                    }).catch((e) => {
                        reject(e)
                    })
                }).catch(err => {
                    reject(err)
                })
            }
        })

    })
}
module.exports.loginUser = loginUser
module.exports.googleLogin = googleLogin
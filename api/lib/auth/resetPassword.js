const settings = require('../../settings')
const path = require('path')
const Database = require(path.join(
    settings.PROJECT_LIB,
    'mysql_db',
    'database.js'
))
const genToken = require(path.join(settings.PROJECT_LIB, 'crypto', 'token.js'))
const sendMail = require(path.join(
    settings.PROJECT_LIB,
    'mailer',
    'mailer.js'
))
const pwd = require(path.join(settings.PROJECT_LIB, 'crypto', 'password.js'))
const userToken = require(path.join(
    settings.PROJECT_LIB,
    'auth',
    'userToken.js'
))
const refreshToken = require(path.join(
    settings.PROJECT_LIB,
    'auth',
    'refreshToken.js'
))
const nextResetDelay = 15;
/**
 * 1) Send a reset mail
 * 2) Use the token sent in mail to reset password
 * 3) Don't forget to revamp refresh tokens
 */

var sendResetMail = (email) => {
    var userToken = null
    var sql = null
    var params = null
    const database = new Database('users')
    return new Promise ((resolve, reject) => {
        genToken()
        .then((token) => {
            userToken = token
            sql = 'SELECT * from reset_tokens where email = ? LIMIT 1';
            params = [email, Date.now()]
            database.call(sql, params)
            .then((result) => {
                if(result.length === 1){
                    let expiry = result[0].expiry;
                    if(expiry >= Date.now()){
                        let wait = Math.floor(Math.abs(expiry - Date.now())/(1000 * 60));
                        let err = new Error(`Rate limit in place, request new link in ${wait} min`);
                        err.status = 400;
                        reject(err);
                        return 0;
                    }
                    sql = 'UPDATE reset_tokens SET ? WHERE email = ?'
                    params = [{
                            reset_token: userToken,
                            expiry: Date.now() + nextResetDelay * 60 * 1000
                        },
                        email
                    ]
                } else {
                    sql = 'INSERT INTO reset_tokens SET ?'
                    params = {
                        email: email,
                        reset_token: userToken,
                        expiry: Date.now() + nextResetDelay * 60 * 1000
                    }
                }
                return database.call(sql, params)
            })
            .then((result) => {
                if(result === 0){
                    return;
                }
                const reset_link = settings.HOST_NAME + `/reset-password/?email = ${email}&reset_token=${userToken}`
                if(result.affectedRows === 1){
                    const mailId = email
                    const subject = 'wishfulShopping account password reset request'
                    const body = `Dear user, a password reset was requested for your account. If not done by you,
                    you can safely ignore this mail. To reset your password
                    <a href="${reset_link}"> click here.</a><br>
                    This link is valid for the next 15 minutes.`;
                    sendMail(mailId, subject, body)
                    .then((result) => {
                        resolve(result)
                    })
                    .catch((e) => {
                        e.message = 'Error in sending reset mail';
                        reject(e);
                    })
                }else{
                    const err = new Error('Database error')
                    err.status = 500
                    reject(err)
                }
            }).catch((e) => {
                reject(e);
            })
        }).catch((e) => {
            reject(e);
        })
    })
}

var changePassword = (email, token, password) => {
    var database = new Database('users')
    var sql = 'SELECT * FROM reset_tokens WHERE email = ? AND expiry >= ?'
    var params = [email, Date.now()]
    return new Promise((resolve, reject) => {
        database.call(sql, params)
        .then((result) => {
            if (result.length === 1 && result[0].reset_token === token){
                pwd
                .hash(password)
                .then((hash) => {
                    sql = 'UPDATE users SET ? WHERE email = ?'
                    params = [{
                            password: hash
                        },
                        email
                    ]
                    return database.call(sql, params)
                })
                .then((result) => {
                    if (result.affectedRows === 1) {
                        sql = 'DELETE FROM reset_tokens WHERE email = ?'
                        params = [email]
                    } else {
                        reject('DB ERROR')
                        return
                    }
                    return database.call(sql, params).catch((e) => {
                        const err = new Error('Database error')
                        err.status = 500
                        reject(err)
                    })
                })
                .then((result) => {
                    if (result.affectedRows === 1) {
                        return refreshToken.revamp(email)
                    } else {
                        const err = new Error('Database error')
                        err.status = 500
                        reject(err)
                    }
                })
                .then((refreshed) => {
                    if (refreshed === 1) {
                        return userToken.get(email)
                    } else {
                        resolve(0)
                    }
                })
                .then((new_access_token) => {
                    resolve(new_access_token)
                })
                .catch((e) => {
                    reject(e)
                })
            } else{
                resolve(0)
            }
        })
    })
}

module.exports.sendResetMail = sendResetMail
module.exports.changePassword = changePassword
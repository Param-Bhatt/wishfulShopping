const path = require('path');
const settings = require('../../settings')
const crypto = require('crypto');
const { resolve } = require('path');
const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const User = require(path.join(settings.PROJECT_LIB, 'models', 'users.js'))
const mongoQuery = require(path.join(settings.PROJECT_LIB, 'database', 'query.js'));
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('users')
const insertLogin = require(path.join(settings.PROJECT_LIB, 'auth', 'insertLogin.js'))

var generateOTP = (email, password) => {
    return new Promise((resolve, reject) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    sendMail(email, "OTP for email verification", `Here is your OTP : ${OTP}. Click on this link and enter the OTP : localhost:5000/signup?email=${email}`)
    .then((result) => {
        if(result === 1){
            var res = {
                result : "success",
                email : `${email}`,
                otp : `${OTP}`,
                error : "false"
            }
            console.log("Proceeding to add user now");
            var user = new User();
            user.email = email;
            user.password = password;
            user.OTP = OTP;
            console.log(user);
            /*mongoQuery.insert(user, (err, result, data) => {
                if(err){
                    reject(err) 
                }
                else if(result){
                    console.log("Added successfully");
                    resolve(1);
                }
            })*/
            var outer_sql = "SELECT * from users where email = ? LIMIT 1;"
            var outer_params = [email]
            database.call(outer_sql,outer_params)
            .then((result) => {
                if(result.length != 1){
                    /*First time user, add his details*/
                    insertLogin(email, password, OTP)
                    .then((result) => {
                        if(result){
                            resolve(1)
                        }else{
                            reject(result)
                        }
                    }).catch((e) => {
                        reject(e)
                    })
                }
                else{
                    /*Just update OTP and verify it*/
                    var sql = "UPDATE users SET otp = ? where email = ?"
                    var params = [OTP, email]
                    database.call(sql, params)
                    .then((result) => {
                        console.log("updated OTP successfully")
                        resolve(1)
                    }).catch((e) => {
                        reject(e);
                    })
                    
                }
            })
            
        }else{
            reject(result);
        }
    }).catch((err) => {
        err.message = 'Error in sending mail';
        console.log(err);
        reject(err);
    })
    })
}
module.exports = generateOTP
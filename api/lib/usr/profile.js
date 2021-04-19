const path = require('path');
const settings = require('../../settings')

//const userDetail = require(path.join(settings.PROJECT_LIB, 'models', 'userDetails.js'));
//const tempUser = require(path.join(settings.PROJECT_LIB, 'models', 'users.js'))
//const mongoQuery = require('../database/query');
//const message = require('../utils/enum');
//const encryptDecrypt = require('../../config/encryptionDecryption/encodeDecode');
//const randtoken = require('rand-token');
//const sendEmail = require('../utils/sendEmail');
//const dbconfig = require('../../config/dbconfig');
//const { baseModelName } = require('../models/userDetails');
const generateOTP = require(path.join(settings.PROJECT_LIB, 'auth', 'generateOTP.js'))
const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('users')
var userToken = require(path.join(settings.PROJECT_LIB, 'auth', 'userToken.js'))

var userProfile = (email, name, userType = 0) => {
    return new Promise((resolve, reject) => {
        /*var query = { "email" : email};
        mongoQuery.findOne('users', query, (err, result, data) => {
            if(err){
                reject(err);
            }
            else if(result){
                reject("Email already exists")
            }
            else{
                otp = generateOTP();
                        
                var user = new userDetail();
                user.email = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.password = password;
                if(userType == 0){
                    user.role = "shopper";
                }
                else if(userType == 1){
                    user.role = "retailer";
                }
                else if(userType == 2){
                    user.role = "wholesaler";
                }
                else{
                    user.role = null;
                }
                user.status = "inactive";
                user.OTP = otp;
                sendMail(email, "OTP for email verification", `Here is your OTP : ${otp}`)
                .then((result) => {
                    if (result === 1) {
                        mongoQuery.insert(user, (err, result, data) => {
                            if(err){
                                reject(err) 
                            }
                            else if(result){
                                resolve(1);
                            }
                        })
                    } else {
                      reject(result)
                    }
                  }).catch((err) => {
                    err.message = 'Error in sending mail';
                    console.log(err);
                    reject(err);
                })
                
            }*/
            var role = null;
            if(userType == 0){
                role = "shopper"
            }
            else if(userType == 1){
                role = "retailer";
            }
            else if(userType == 2){
                role = "wholesaler";
            }
            else{
                role = null;
            }
            var sql = "UPDATE userInfo set name = ? ,usertype = ? where email = ?";
            var params = [name, role, email]
            database.call(sql, params)
            .then((result) => {
                //console.log(result)
                if(result.affectedRows === 1){
                    userToken.get(email, userType)
                    .then((token) => {
                        var data = {}
                        data.token = token
                        data.email = email
                        data.role = role
                        console.log(data)
                        resolve(data)
                    }).catch((e) => {
                        reject(e)
                    })
                }else{
                    reject("Error in saving details")
                }
            }).catch(err => {
                reject(err)
            })
    })

}


module.exports = userProfile
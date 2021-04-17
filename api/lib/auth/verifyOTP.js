const path = require('path');
const settings = require('../../settings')
const mongoQuery = require(path.join(settings.PROJECT_LIB, 'database', 'query.js'));
const User = require(path.join(settings.PROJECT_LIB, 'models', 'users.js'))
const Database = require(path.join(settings.PROJECT_LIB, 'mysql_db', 'database.js'))
const database = new Database('users')
const firstEnter = require(path.join(settings.PROJECT_LIB, 'auth','firstEnter.js'))
var verifyOTP = (email, reqOTP) => {
    var sql = null
    var params= null
    return new Promise((resolve, reject) =>{
        sql = "SELECT otp from users where email = ? LIMIT 1;"
        params = [email]
        database.call(sql, params)
        .then((result) => {
            if(result[0].otp == reqOTP){
                console.log("Verified OTP")
                sql = "SELECT * from userInfo where email = ? LIMIT 1;"
                params = [email]
                database.call(sql, params)
                .then((result) => {
                    if(result.length != 1){
                        /*name not present, this is first time signup*/
                        firstEnter(email)
                        .then((result) => {
                            if(result === 1){
                                resolve(1)
                            }else{
                                reject(result)
                            }
                        }).catch((e) => {
                            reject(e)
                        })
                    }
                })
                
            }else{
                reject("OTP does not match, please try again")
            }
        }).catch((err) => {
            reject(err);
        })
        //var query = { "email" : email, "OTP" : reqOTP};
        /*var query = { "email" : email};
        mongoQuery.findOne('userDetails', query, (err, result, data) => {
            console.log(result)
            console.log(data)
            console.log(err)
            console.log("****************")
            if(result){
                console.log("Hello")
                resolve(1)
            }else{
                console.log(err)
                reject(err);
            }
        })/*
        mongoQuery.findOne(User, query, (err, result, data) => {
            if(err){
                reject(err);
            }
            else if(result){
                resolve(1);
            }
            else{
                reject("OTP or email is wrong, please try again")
            }
        })*/
        /*if(genOTP == reqOTP){
            resolve(1)
        }
        else{
            reject("OTP does not match. Please try again");
        }*/
    })
}

module.exports = verifyOTP
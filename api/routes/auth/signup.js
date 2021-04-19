var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');
const generateOTP = require(path.join(settings.PROJECT_LIB, 'auth', 'generateOTP.js'));
const verifyOTP = require(path.join(settings.PROJECT_LIB, 'auth', 'verifyOTP.js'))

const response = require(path.join(
    settings.PROJECT_LIB,
    'response',
    'response.js'
))
router.post('/', (req, res, next) => {
    console.log(req.body)
    generateOTP(req.body.email, req.body.password)
    .then((result) => {
        if(result===1){
            response.created(res, {}, 'Successfully created entry and sent OTP', false)
        }
        else{
            err.message = 'Couldnt send OTP, please retry'
            console.log(err);
            return next(err);
        }
    }).catch((err) => {
        console.log(err);
        return next(err);
      })
})

router.get('/', (req, res, next) => {
    console.log(req.body);
    verifyOTP(req.body.email, req.body.otp)
    .then((result) => {
        if(result){
            response.created(res, {}, 'OTP verified successfully', false)
        }
        else{
            response.error(res)
        }
    }).catch((err) => {
        console.log(err);
        return next(err);
      })
})

module.exports = router

var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const registerUser = require(path.join(settings.PROJECT_LIB, 'auth', 'register.js'))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

router.post('/', (req, res, next) => {
    console.log(req.body)
    registerUser(req.body.email, req.body.name, req.body.userType)
        .then((result) => {
          if(result === 1){
            response.created(res, {}, 'Registered successfully', false)
          }else{
            response.error(res);
          }
        })
        .catch((err) => {
            console.log(err)
            err.message = 'Error in registering';
            return next(err);
        })
})
module.exports = router;
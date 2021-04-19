var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const userProfile = require(path.join(settings.PROJECT_LIB, 'usr', 'profile.js'))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

router.post('/', (req, res, next) => {
    console.log(req.body)
    userProfile(req.body.email, req.body.name, req.body.userType)
        .then((result) => {
          if(result){
            response.created(res, {}, 'Registered successfully', false)
          }else{
            response.error(res);
          }
        })
        .catch((err) => {
            console.log(err)
            err.message = 'Error in saving information';
            return next(err);
        })
})
module.exports = router;
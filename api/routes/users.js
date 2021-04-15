var express = require('express');
var router = express.Router();
const settings = require('../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))

const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

/* GET users listing. */
router.get('/', (req, res, next) => {
  sendMail(settings.MAIL_USER, 'Test', 'Test mail')
  .then((result) => {
    if (result === 1) {
      response.created(res, {}, 'Password reset mail sent', false)
    } else {
      response.error(res)
    }
  }).catch((err) => {
    err.message = 'Error in sending mail';
    console.log(err);
    return next(err);
  })
  //res.send(settings.GMAIL_USER);
  
});

module.exports = router;

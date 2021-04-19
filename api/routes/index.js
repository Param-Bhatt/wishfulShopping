const {
  routes
} = require('../app')
const path = require('path')
const settings = require('../settings')
const {
  check
} = require('express-validator')
var express = require('express');
var router = express.Router();
const { exec } = require('child_process')
const checkAuth = require(path.join(settings.PROJECT_LIB, 'auth', 'userToken.js')).checkAuth
const response = require(path.join(settings.PROJECT_LIB, 'response', 'response.js'))

router.use('/api/auth/', require('./auth'))
/* UNPROTECTED RESOURCES HERE */

/* Place all token protected resources here */
router.use('/', [
  check('uid').trim().escape(),
  check('password').trim().escape()
], checkAuth)
/* TOKEN PROTECTED RESOURCES */
router.use('/api/token/check', (req, res) => {
  response.success(res)
})


module.exports = router;

var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))
const {
  check,
  query,
  validationResult,
  body
} = require('express-validator')

const loginUser = require(path.join(
  settings.PROJECT_LIB,
  'auth',
  'loginUser.js'
))

router.post('/', (req, res, next) => {
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
      response.unprocessable(res)
    }else{
        console.log(req.body)
      loginUser(req.body.email, req.body.password, req.body.type)
      .then((result) => {
        if(result !=0){
          res.set('Access-Control-Expose-Headers', '*')
            // res.cookie('bearer_token', result.token, {secure : true, httpOnly : true});
            res.set('Authorization', `Bearer ${result.token}`)
            response.success(res, {
              name: result.name,
              role: result.role,
            })
        }else {
          response.unauthorized(res, {}, 'Incorrect User ID/password', true)
        }
      }).catch((e) => {
          e.status = 401
          return next(e)
      })
    }
})

module.exports = router
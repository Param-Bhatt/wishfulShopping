var express = require('express')
var router = express.Router()
var path = require('path')
var settings = require('../../settings.js')
const { check, validationResult } = require('express-validator')
const { networkInterfaces } = require('os')
const resetPassword = require(path.join(
  settings.PROJECT_LIB,
  'auth',
  'resetPassword.js'
))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

//GET METHOD TO SEND USER THE RESET PASSWORD LINK
router.get('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      response.unprocessable(res)
    } else {
      resetPassword
        .sendResetMail(req.query.email)
        .then((result) => {
          if (result === 1) {
            response.created(res, {}, 'Password reset mail sent', false)
          } else {
            response.error(res)
          }
        })
        .catch((e) => {
          return next(e)
        })
    }
})

// POST METHOD TO TAKE THE TOKEN AND THE NEW PASSWORD AND CHANGE THE ACTUAL PASSWORD OF THE USER

router.post(
'/',
[
    check('email')
    .not()
    .isEmpty()
    .isLength({
        min: 2
    })
    .trim()
    .escape(),
    check('npassword')
    .not()
    .isEmpty()
    .isLength({
        min: 5
    })
    .trim()
    .escape(),
    check('reset_token').not().isEmpty().trim().escape()
],
(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
    response.unprocessable(res)
    } else {
    resetPassword
        .changePassword(req.body.email, req.body.reset_token, req.body.npassword)
        .then((result) => {
        if (result !== 0) {
            response.created(
            res,
            { token: result },
            'Password changed successfully',
            false
            )
        } else {
            response.bad(res, {}, 'Invalid reset token')
        }
        })
        .catch((e) => {
        return next(e)
        })
    }
}
)

module.exports = router
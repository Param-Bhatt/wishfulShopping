var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');
const {
    body,
    validationResult
} = require('express-validator')
const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const removeItem = require(path.join(settings.PROJECT_LIB, 'items','removeItem.js'))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))
const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))



router.post('/',[
    body('name').not().isEmpty().trim(),
    body('price').not().isEmpty().trim()
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        removeItem(req.body.name, req.body.price, req.body.email)
        .then((result) => {
            if(result === 1){
                response.created(res, {}, 'Item/s deleted successfully', false)
            }else{
                response.error(res)
            }
        }).catch((e) => {
            return next(e)
        })
    }
})
module.exports = router
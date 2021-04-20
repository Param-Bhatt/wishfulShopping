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
const addItem = require(path.join(settings.PROJECT_LIB, 'items','addItem.js'))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))
const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))


router.post('/',[
    body('name').not().isEmpty().trim(),
    body('description').not().isEmpty().trim(),
    body('price').not().isEmpty().trim(),
    body('quantity').not().isEmpty().trim()
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        addItem(req.body.name, req.body.description, req.body.price, req.body.email, req.body.quantity)
        .then((result) => {
            if(result === 1){
                response.created(res, {}, 'Added item successfully', false)
            }else{
                response.error(res)
            }
        }).catch((e) => {
            return next(e)
        })
    }
})
module.exports = router
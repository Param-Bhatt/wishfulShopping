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
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

const extractEmail = require(path.join(settings.PROJECT_LIB, 'auth','extractEmail.js'))
const placeOrder = require(path.join(settings.PROJECT_LIB, 'orders', 'placeOrder.js'))

router.post('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        placeOrder(req.body.email)
        .then((result) => {
            if(result[0] === 1){
                response.created(res, {}, 'Successfully placed order', false)
            }else{
                response.created(res, {}, 'Coudlnt place order', true)
            }   
        }).catch((e) => {
            return next(e)
        })
    }
})

module.exports = router
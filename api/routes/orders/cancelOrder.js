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
const cancelOrder = require(path.join(settings.PROJECT_LIB, 'orders', 'cancelOrder.js'))

router.post('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        cancelOrder(req.body.email, req.body.orderID)
        .then((result) => {
            if(result === 1){
                response.created(res, {}, 'Successfully cancelled order', false)
            }else{
                response.created(res, {}, 'Coudlnt cancelled order', true)
            }   
        }).catch((e) => {
            return next(e)
        })
    }
})

module.exports = router
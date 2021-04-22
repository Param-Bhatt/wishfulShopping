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
const displayOrder = require(path.join(settings.PROJECT_LIB, 'orders', 'displayOrder.js'))

router.post('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        displayOrder(req.body.email)
        .then((result) => {
            if(result[0] === 1){
                response.success(res, result[1])
            }else{
                response.error(res, result[1]);
            }   
        }).catch((e) => {
            return next(e)
        })
    }
})

module.exports = router
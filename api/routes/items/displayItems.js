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
const displayItems = require(path.join(settings.PROJECT_LIB, 'items','displayItems.js'))

router.get('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        displayItems()
        .then((result) => {
            if(result.length > 0){
                response.success(res, result)
            }else{
                response.bad(res,{})
            }
        }).catch((e) => {
            rejects(e)
        })
    }
})

module.exports = router
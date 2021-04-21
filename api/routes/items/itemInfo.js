var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');
const {
    body,
    validationResult
} = require('express-validator');
const itemInfo = require('../../lib/items/itemInfo.js');
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
        //Added email to req body now
        itemInfo(req.query.name)
        .then((result) =>{
            console.log(result[1])
            response.success(res, result)
        }).catch((e) => {
            return next(e)
        })
    }
})

module.exports = router
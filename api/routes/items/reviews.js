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

const reviews = require(path.join(settings.PROJECT_LIB, 'items', 'reviews.js'))
router.get('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        reviews
        .get(req.query.name)
        .then((result) => {
            response.success(res, result)
        }).catch((e) => {
            return next(e)
        })
    }
})

router.post('/', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        reviews
        .add(req.body.item, req.body.review, req.body.name)
        .then((result) => {
            if(result === 1){
                response.created(res, {}, 'Added response successfully', false)
            }else{
                response.error(result)
            }
        }).catch((err) => {
            return next(err)
        })
    }
})

module.exports = router
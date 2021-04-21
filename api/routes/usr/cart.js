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
const cart = require(path.join(settings.PROJECT_LIB, 'usr','cart.js'))

router.get('/display', (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        cart
        .get(req.body.email)
        .then((result) => {
            if(result[0] === 1){
                response.success(res, result)
            }else{
                response.error(result)
            }
        }).catch(e => {
            return next(e)
        })
    }
})

router.post('/add',[
    body('item').not().isEmpty().trim(),
    body('quantity').not().isEmpty().trim()
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        cart
        .add(req.body.email, req.body.item, req.body.quantity)
        .then((result) => {
            if(result[0] === 1){
                response.created(res, {}, 'Successfully added to cart', false)
            }else{
                response.created(res, result[1], 'Coudlnt add to cart', true)
            }
        }).catch(e => {
            return next(e)
        })
    }
})

router.post('/update',[
    body('item').not().isEmpty().trim(),
    body('quantity').not().isEmpty().trim()
], (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors);
        response.unprocessable(res)
    }else{
        extractEmail(req, res)
        //Added email to req body now
        cart
        .update(req.body.email, req.body.item, req.body.quantity)
        .then((result) => {
            console.log(result)
            if(result[0] === 1){
                response.created(res, {}, 'Successfully updated cart', false)
            }else{
                response.created(res, result[1], 'Coudlnt update cart', true)
            }
        }).catch(e => {
            return next(e)
        })
    }
})

module.exports = router
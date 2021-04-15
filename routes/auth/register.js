var express = require('express');
var router = express.Router();
const settings = require('../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const sendMail = require(path.join(settings.PROJECT_LIB, 'mailer', 'mailer.js'))
const registerUser = require(path.join(settings.PROJECT_LIB, 'auth', 'register.js'))
const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))

/*
mongoose.connect(`mongodb+srv://${settings.DB_NAME}:${settings.DB_PASSWORD}@cluster0.rz4zi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true});
mongoose.connection.once('open',function(){
  console.log('Database connected Successfully');
}).on('error',function(err){
  console.log('Error', err);
})
*/
router.get('/', (req, res, next) => {
    /*console.log(req.body)
    registerUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName, req.body.mobile, req.body.userType)
        .then((result) => {
            response.created(result, {}, 'Registered successfully', false)
        })
        .catch((err) => {
            console.log(err)
            err.message = 'Error in registering';
            return next(err);
        })*/
    res.send(settings.GMAIL_USER);
})
module.exports = router;
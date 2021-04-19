var express = require('express');
var router = express.Router();
const settings = require('../../settings.js')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

const response = require(path.join(
  settings.PROJECT_LIB,
  'response',
  'response.js'
))
const {
  check,
  query,
  validationResult,
  body
} = require('express-validator')

const loginUser = require(path.join(
  settings.PROJECT_LIB,
  'auth',
  'loginUser.js'
))


const clientId = settings.MAIL_OAUTH_CLIENT_ID
const clientSecret = settings.MAIL_OAUTH_CLIENT_SECRET
const redirectUrl = settings.MAIL_AUTH_REDIRECT
var userToken = require(path.join(settings.PROJECT_LIB, 'auth', 'userToken.js'))
const {google} = require('googleapis')
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl)
var authorized = false
router.get('/', (req, res, next) => {
    if (!authorized) {
        // Generate an OAuth URL and redirect there
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.email',
                    ' https://www.googleapis.com/auth/gmail.readonly']
        });
        console.log(url)
        res.redirect(url);
    } else {
        loginUser
        .googleLogin(oauth2Client)
        .then((result) => {
            if(result!= 0){
                res.set('Access-Control-Expose-Headers', '*')
                // res.cookie('bearer_token', result.token, {secure : true, httpOnly : true});
                res.set('Authorization', `Bearer ${result.token}`)
                response.success(res, {
                name: result.name,
                role: result.role,
                })
            }else{
                response.error
            }

        }).catch((e) => {
            return next(e)
        })
    }
})


router.get('/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oauth2Client.setCredentials(tokens);
                authorized = true;
                res.redirect('/api/auth/gLogin')
            }
        });
    }
});

module.exports = router
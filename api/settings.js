const path = require('path')
const lib = path.join(__dirname, 'lib')
const dotenv = require('dotenv')
dotenv.config()

var serverSettings = {
    //UPDATE DETAILS HERE AS REQUIRED
    PROJECT_DIR: __dirname,
    PROJECT_LIB: lib,
    PORT : process.env.PORT,
    MAIL_USER : '<emailid@gmail.com>',
    MAIL_PASSWORD : '<emailpassword>',
    MAIL_OAUTH_CLIENT_ID : '<google oauth2 client id>',
    MAIL_OAUTH_CLIENT_SECRET : '<google oauth2 client secret>',
    MAIL_OAUTH_REFRESH_TOKEN : '<google oauth2 refresh token>',
    MAIL_OAUTH_ACCESS_TOKEN : '<google oauth2 access token>',
    DB_NAME : '<mongodb name>',
    DB_PASSWORD : '<mongodb password>',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || '<mysql user>',
    DB_MYSQL_PASSWORD: process.env.DB_PASSWORD || '<mysql password>',
    DB_CONNECTION_LIMIT: 10,
    
}
module.exports = serverSettings

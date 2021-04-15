const path = require('path')
const lib = path.join(__dirname, 'lib')
const dotenv = require('dotenv')
dotenv.config()

var serverSettings = {
    PROJECT_DIR: __dirname,
    PROJECT_LIB: lib,
    PORT : process.env.PORT,
    MAIL_USER : 'padb19122000@gmail.com',
    MAIL_PASSWORD : 'paramforever19',
    MAIL_OAUTH_CLIENT_ID : '493047262649-qbjgnecqikv8dpotldphijf1u0el1hhk.apps.googleusercontent.com',
    MAIL_OAUTH_CLIENT_SECRET : 'JEF6225yBUepYwxZgbfk3y-R',
    MAIL_OAUTH_REFRESH_TOKEN : '1//04f2avedAT99jCgYIARAAGAQSNwF-L9Ir-ofixisUWll6dEvBa8gh94oDuqWqR0MJmY0a4Uu13mrd4wS4azhjzJyaKLoA45WvhGg',
    MAIL_OAUTH_ACCESS_TOKEN : 'ya29.a0AfH6SMAw7V3ftZqjsCw82DQkBhgreSgagFeUaT-FyzKy5-GpX9rZncuuNXjnrHZa-eXy1loDMNSkTNO_aLorl2WYnloHtmRpzXT-Te4F907t1z7L92ke1mIZHFQE_1FQFzWHs04gpHfiu2PM8jtgKmdetIXs',
    DB_NAME : 'pabby',
    DB_PASSWORD : 'paramforever19',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_MYSQL_PASSWORD: process.env.DB_PASSWORD || 'Param@2611',
    DB_CONNECTION_LIMIT: 10,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || 'ItsaNamaZoncLONE!!!!!',
    CRYPTO_KEY: process.env.CRYPTO_KEY,
}
module.exports = serverSettings

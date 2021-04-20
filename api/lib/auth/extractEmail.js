const path = require('path')
const jwt = require('jsonwebtoken')
const settings = require('../../settings')
const response = require(path.join(settings.PROJECT_LIB, 'response', 'response.js'))

const extractEmail = (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, settings.JWT_PRIVATE_KEY, (err, decoded) => {
            if(err){
                reject(err)
            }
            else{
                if(decoded.email.length >= 2){
                    req.body.email = decoded.email
                }else{
                    req.email = ''
                }
            }
        })
    }catch(err){
        response.error(res, {}, 'Unable to extract email from the request')
    }
}

module.exports = extractEmail
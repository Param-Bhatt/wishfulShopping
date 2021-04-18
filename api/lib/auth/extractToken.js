/* Make sure auth header and contains Bearer token before calling this function */
const settings = require('../../settings')
const path = require('path')
const response = require(path.join(settings.PROJECT_LIB, 'response', 'response.js'))

const extract = (req, res) => {
  try {
    const bearer_token = req.headers.authorization.split(' ')[1]
    /* Setting the token in req parameters */
    req.bearer_token = bearer_token
    console.log("Bearer token " + req.bearer_token)
  } catch (err) {
    response.error(res, {}, 'Unable to extract auth token from the request')
  }
}

module.exports = extract;

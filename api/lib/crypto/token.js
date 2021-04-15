var crypto = require('crypto')

// GENERATES A RANDOM TOKEN
var genToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buff) => {
      resolve(buff.toString('hex'))
    })
  })
}
module.exports = genToken

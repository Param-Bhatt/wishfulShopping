var bcrypt = require('bcryptjs')

// FOR HASHING THE PASSWORDS
var hash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err)
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err)
        }
        resolve(hash)
      })
    })
  })
}

// COMPARING THE PLAIN TEXT PASSWORDS AGAINST THE HASHES
var compare = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

module.exports.hash = hash
module.exports.compare = compare

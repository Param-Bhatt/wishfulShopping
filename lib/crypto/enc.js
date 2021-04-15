const path = require('path')
const crypto = require('crypto')
const Base64 = require('js-base64')
const algorithm = 'aes-256-ctr'
const secretKey = 'vOVH6sdmpNWjRRIqCc7gdxs01lwHzfre'
const iv = crypto.randomBytes(16)

const encrypt = (text) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return Base64.encode(JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
    }))
  } catch (e) {

  }
}

const decrypt = (hash) => {
  try {
    hash = Base64.decode(hash)
    hash = JSON.parse(hash)
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
  } catch (e) {
    throw new Error("Error in validating token");
  }
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}
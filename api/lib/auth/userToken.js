const path = require('path')
const Base64 = require('js-base64')
const jwt = require('jsonwebtoken')
const settings = require('../../settings')
const refreshToken = require(path.join(settings.PROJECT_LIB, 'auth', 'refreshToken.js'))
const extractToken = require(path.join(settings.PROJECT_LIB, 'auth', './extractToken'))
const response = require(path.join(settings.PROJECT_LIB, 'response', 'response.js'))

const ACCESS_TOKEN_EXPIRY = 1 * 60 * 60 // one hour(default time limit)

const getUserToken = (email, type = 0, time = ACCESS_TOKEN_EXPIRY) => {
    return new Promise((resolve, reject) => {
        var rtexp = null
		if (parseInt(type) === 1) {
			rtexp = Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60
		} else {
			rtexp = Math.floor(Date.now() / 1000) + 1 * 60 * 60
		}
		refreshToken.get(email)
        .then((refresh_token) => {
            const payload = {
                email : email,
                rt : refresh_token,
                rtexp : rtexp,
                exp : Math.floor(Date.now() / 1000) + time
            }
            jwt.sign(payload, settings.JWT_PRIVATE_KEY, (err, token) => {
                if(err){
                    reject(err)
                    return
                }else{
                    resolve(token)
                }
            })
        }).catch((e) => {
            reject(e)
        })
    })
}

const verifyUserToken = (token) => {
    /* First do verification using access_token, then fallback to refresh_token otherwise send 401 */
    return new Promise ((resolve, reject) => {
		jwt.verify(token, settings.JWT_PRIVATE_KEY, (err, decoded) => {
            if(err){
				/* Falling back to refresh tokens for web and sending 401 for apps */
				console.log(err)
                try {
					var payload = token.split('.')[1]
					payload = Base64.decode(payload)
					payload = JSON.parse(payload)
					payload.email = (payload.email != null && payload.email.length) ? payload.email : ' '
					payload.rt = (payload.rt != null && payload.rt.length) ? payload.rt : ' '
					payload.rtexp = (payload.rtexp != null && parseInt(payload.rtexp) > 0) ? payload.rtexp : 0
					if (payload.rtexp < Math.floor(Date.now() / 1000)) {
						resolve([0])
						return
					}
					console.log(payload)
					refreshToken.verify(payload.email, payload.rt)
						.then((valid) => {
							if (valid === 1) {
								/* User authenticated return access_token with future expiry */
								var new_access_token_payload = {
									email: payload.email,
									rt: payload.rt,
									rtexp: payload.rtexp,
									exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY
								}
								jwt.sign(new_access_token_payload, settings.JWT_PRIVATE_KEY, (err, new_access_token) => {
									if (err) {
										reject(err)
										return
									}
									resolve([2, payload.email, new_access_token])
								})
							} else {
								/* Refresh token is not valid or expired user needs to login again */
								resolve([0])
							}
						}).catch((e) => {
							e.message = 'Error refreshing access token'
							reject(e)
						})
				} catch (e) {
					reject(e)
				}
				return
            }
            /* No need to check expiry it is done automatically by .verify() method */
			if (decoded.email.length >= 2) {
				resolve([1, decoded.email])
			} else {
				resolve([0])
			}
        })
    })
}

const checkAuth = (req, res, next) => {
    var email = null
    var password = null
    if(req.method == "POST"){
		console.log(req.body)
        email = req.body.email
		password = req.body.password
    }else{
        email = req.query.email
        password = req.query.password
    }
	email = (email != null && email.length >= 2) ? email : ' '
    password = (password != null && password.length >= 5) ? password : ' '
	console.log("Email : " + email.length + "  " + password.length)
	if (password.length >= 5 && email.length >= 2) {
		req.email = email
        next()    
	} else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		extractToken(req, res)
		/* Token now present in req.token */
		verifyUserToken(req.bearer_token)
			.then((verify) => {
				if (verify[0] === 1) {
					req.email = verify[1]
					req.email = verify[1]
					next()
				} else if (verify[0] === 2) {
					req.email = verify[1]
					/* New access_token available */
					res.set('Access-Control-Expose-Headers', '*')
					res.set('Authorization', `Bearer ${verify[2]}`)
					next()
				} else {
					response.unauthorized(res)
				}
			}).catch((e) => {
				const err = new Error('Invalid jwt supplied')
				err.status = 400
				return next(err)
			})
	} else {
		response.bad(res, {}, 'Token not found in auth header')
	}
}


module.exports.get = getUserToken
module.exports.verify = verifyUserToken
module.exports.checkAuth = checkAuth
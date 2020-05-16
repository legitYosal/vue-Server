const jwt = require('jsonwebtoken')
const jwtSecret = require('../../etc/config/env.config.js').jwt_secret
const crypto = require('crypto')

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        console.log('refresh_token field OK')
        return next()
    } else {
        return res.status(400).send({errors: ['need to pass refresh token field']})
    }
}

exports.validRefreshNeeded = (req, res, next) => {
    let b = new Buffer.from(req.body.refresh_token, 'base64')
    let refresh_token = b.toString()
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey)
        .update(req.jwt.userId + jwtSecret)
        .digest('base64')
    if (hash === refresh_token) {
        req.body = req.jwt
        console.log('REFRESH_TOKEN valid OK')
        return next()
    } else {
        return res.status(400).send({error: 'Invalid refresh token'})
    }
}

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ')
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({errors: ['token not in the correct format']})
            } else {
                req.jwt = jwt.verify(authorization[1], jwtSecret)
                console.log('JWT valid OK')
                return next()                
            }
        } catch (err) {
            return res.status(403).send({errors: ['token not valid error']})
        }
    } else {
        return res.status(401).send({errors: ['authorization required']})
    }
}
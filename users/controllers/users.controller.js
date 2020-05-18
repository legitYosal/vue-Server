const UserModel = require('../models/users.model')
const crypto = require('crypto')

exports.insert = (req, res) => {
    console.log('POST TO USERS')
    console.log(req.body.name)
    let salt = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', salt)
        .update(req.body.password)
        .digest('base64')
    req.body.password = salt + '$' + hash
    req.body.permissionLevel = 1
    UserModel.createUser(req.body)
        .then((result) => {
            console.log(result)
            res.status(201).send({id: result._id})
        })
}

exports.getById = (req, res) => {
    console.log(req.params)
    UserModel.findById(req.params.userId).then((result) => {
        if (result)
            res.status(200).send(result)
        else 
            res.status(403).send()
    })
}

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64')
        let hash = crypto.createHmac('sha512', salt)
            .update(req.body.password)
            .digest('base64')
        req.body.password = salt + '$' + hash
    }
    UserModel.patchUser(req.params.userId, req.body).then((result) => {
        res.status(204).send({})
    })
}

exports.list = (req, res) => {
    console.log('GET ON USERS BY LIST')
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10
    let page = 0
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page)
            page = Number.isInteger(req.query.page) ? req.query.page : 0
        }
    }
    UserModel.list(limit, page).then((result) => {
        let result_rvrs = []
        let len = result.length
        for (let i in result) {
            result_rvrs.push(result[len - i - 1])
        }
        // console.log(result_rvrs)
        res.status(200).send(result_rvrs)
    })
}

exports.removeById = (req, res) => {
    console.log('DELETE REQUEST')
    UserModel.removeById(req.params.userId).then(() => {
        res.status(200).send({})
    }).catch((err) => {
        res.status(404).send({errors: ['not found user']})
    })
}
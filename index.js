
const config = require('./etc/config/env.config.js')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const UsersRouter = require('./users/routes.config')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
    res.header('Access-Control-Expose-Headers', 'Content-Length')
    res.header('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type,X-Requested-With,Range')
    if (req.method === 'OPTIONS')
        return res.send(200)
    else
        return next()
})

app.use(bodyParser.json())

UsersRouter.routesConfig(app)

app.listen(config.port, () => {
    console.log('App Started Listening on port %s', config.port)
})
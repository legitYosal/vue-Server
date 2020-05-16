const VerifyUserMiddleware = require('./middlewares/verify.user.middleware')
const AuthController = require('./controllers/auth.controller')
const AuthValidationMidlleware = require('./middlewares/auth.validation.middleware')


exports.routesConfig = (app) => {
    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.authenticateMatch,
        AuthController.login
    ])
    app.post('/auth/refresh', [
        AuthValidationMidlleware.validJWTNeeded,
        AuthValidationMidlleware.verifyRefreshBodyField,
        AuthValidationMidlleware.validRefreshNeeded,
        AuthController.login
    ])
}

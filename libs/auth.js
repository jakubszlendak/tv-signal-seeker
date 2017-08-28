const APIError = require('./APIError')

module.exports = {
    /**
     * Creates middleware which checks user scope and responds with 403 if scope is invalid
     */
    guardScope: function(scope) {
        if(!scope) throw new Error('Invalid scope value: cannot be empty!')
        return function(req, res, next) {
            if(req.user && req.user.scope === scope) {
                return next()
            } else return next(new APIError('Forbidden', 'You are not allowed to access this resource', 403))

        }
    }
}
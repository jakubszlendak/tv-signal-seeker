function APIError(error, message, code) {
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.code = code || 500
    this.error = error
}

APIError.prototype.toResponse = function () {
    return {
        name: this.name,
        error: this.error,
        message: this.message
    }
}

require('util').inherits(APIError, Error)

module.exports = APIError
module.exports = function APIError(error, message, code) {
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.code = code || 500
    this.error = error
  }
  
  require('util').inherits(module.exports, Error)
  
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const jwt = require('express-jwt')

const query = require('./routes/query')

const config = require('./config')
const APIError = require('./libs/APIError')
const logger = require('./libs/utils').logger

const app = express()


logger.info('Starting in', app.get('env'), 'mode.')
logger.info(`Connecting to ${config.MongoURI} ...`)
mongo.connect(config.MongoURI, config.MongoConfig, function (err, DB) {
  if (err) {
    logger.error('err', err)
    throw err
  }

  logger.info('Connected to DB.')


  // view engine setup
  // app.set('views', path.join(__dirname, 'views'))
  // app.set('view engine', 'jade')

  app.use(morgan('common'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  // app.use(cookieParser())
  // app.use(express.static(path.join(__dirname, 'public')))
  app.use(function (req, res, next) {
    req.DB = DB
    return next()
  })

  app.use(jwt({
    secret: config.auth.jwtSecret
  }))

  app.use('/query', query)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    let err = new APIError('Not Found', 'Resource not found', 404)
    next(err)
  })
  
  
  // error handler
  app.use(function (err, req, res, next) {
    // handle API error
    if(err instanceof APIError) {
      res.status(err.code || 500)
      return res.json(err.toResponse())
    }
    // handle Authorization error
    if(err.name === 'UnauthorizedError') {
      res.status(401)
      return res.json({
        name: err.name,
        error: 'Unauthorized',
        message: 'Invalid authorization token'
      })
    }

    // handle any other error, hide stack trace if not in dev 
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    })
  })
})

process.on('unhandledRejection', function(err) {
  logger.error('Unhandled promise rejection: ', err)
  throw err
})

module.exports = app
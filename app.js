const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongo = require('mongodb')

const index = require('./routes/index')
const users = require('./routes/users')
const query = require('./routes/query')

const config = require('./config')
const APIError = require('./libs/APIError')
const logger = require('./libs/utils').logger

const app = express()


logger.info('Starting in', app.get('env'), 'mode.')
logger.info(`Connecting to ${config.MongoURI} ...`)
mongo.connect(config.MongoURI, config.MongoConf, function (err, DB) {
  if (err) {
    logger.error('err', err)
    throw err
  }

  logger.info('Connected to DB.')


  // view engine setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')

  app.use(morgan('common'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(function (req, res, next) {
    req.DB = DB
    return next()
  })

  // app.use('/', index)
  // app.use('/users', users)
  app.use('/query', query)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    let err = new APIError('Not Found', 'Resource not found', 404)
    next(err)
  })

  // error handler
  app.use(function (err, req, res, next) {

    if(err instanceof APIError) {
      res.status(err.code || 500)
      return res.json(err)
    }

    // render the error page
    res.status(err.status || 500)
    // res.render('error')
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
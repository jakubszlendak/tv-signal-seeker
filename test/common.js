global.assert = require('assert')
global.chai = require('chai')
global.should = require('chai').should()
global.expect = require('chai').expect
global.chai = require('chai')
global.Mongo = require('mongodb')
global.sinon = require('sinon')

process.on('unhandledRejection', function(err) {
    throw err
})
var React = require('react')
var bridge = require('./osx-bridge')
var EventEmitter = require('events').EventEmitter

// main emitter
var emitter = new EventEmitter();

// react views
var UploadForm = require('../views/UploadForm.jsx')

var uploadFormNode = document.getElementById('upload-form')

var registerHandler = function(name) {
  b.registerHandler(name, function(data, callback) {
    emitter.emit(name, data)
  }
}

bridge(function(b){
  registerHandler('openFile')
})

var props = {
  emitter: emitter
}

// set up our views
React.render(<UploadForm {...props}/>, uploadFormNode)

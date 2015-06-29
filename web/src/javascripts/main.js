var React = require('react')
var bridge = require('./osx-bridge')
var EventEmitter = require('eventemitter2').EventEmitter2

// main emitter
var emitter = new EventEmitter({
  wildcard: true
})

// main react view
var App = require('../views/App.jsx')

var registerHandler = function(name) {
  b.registerHandler(name, function(data, callback) {
    emitter.emit(name, data)
  }
}

bridge(function(b){
  registerHandler('openFile')

  emitter.on('*', function() {
    var args = Array.protptype.slice.call(arguments)
    args.unshift(this.event)
    b.send.apply(b, args)
  })
})

var props = {
  emitter: emitter
}

// set up our views
React.render(<App {...props}/>, document.getElementById('main-mount'))

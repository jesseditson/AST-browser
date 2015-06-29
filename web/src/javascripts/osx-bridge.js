
module.exports = getBridge

var preflight = []
var initialized

var getBridge = function(callback){
  var bridge = window.WebViewJavascriptBridge
  if(bridge) {
    callback(bridge)
  } else {
    preflight.push(callback)
  }
  var self = this
  if(!initialized){
    initialized = true
    var ready = function(e){
      preflight.forEach(function(cb){
        cb(e.bridge)
      })
      e.bridge.init(function(){
        self.handlers.forEach(function(cb){
          cb(e.bridge)
        })
      })
      preflight = []
    }
    document.addEventListener('WebViewJavascriptBridgeReady',ready, false)
  }
}

getBridge.prototype.handlers = []

module.exports = getBridge

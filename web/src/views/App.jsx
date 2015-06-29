var React = require('react')
var EventEmitter = require('eventemitter2').EventEmitter2

var Browser = require('./Browser.jsx')

var App = React.createClass({
  propTypes: {
    emitter: React.PropTypes.instanceOf(EventEmitter).isRequired
  },
  getInitialState: function() {
    return {
      fileData: null
    }
  },
  componentDidMount: function() {
    var self = this
    this.props.emitter.on('openFile', function(data) {
      self.setState({fileData: data})
    })
  },
  clickedUpload : function(e){
    this.props.emitter.emit('upload')
  },
  render: function() {
    if (this.state.fileData) {
      return <Browser {...this.state}/>
    } else {
      return <div className="empty-message">
        <div className="upload-holder">
          <div onClick={this.clickedUpload} className="upload-button">
            Open File...
          </div>
        </div>
      </div>
    }
  }
});

module.exports = App;

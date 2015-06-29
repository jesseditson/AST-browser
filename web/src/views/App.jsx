var React = require('react')
var EventEmitter = require('eventemitter2').EventEmitter2

var App = React.createClass({
  propTypes: {
    emitter: React.PropTypes.instanceOf(EventEmitter).isRequired
  },
  getInitialState: {
    fileData: null
  },
  componentDidMount: function() {
    var self = this
    emitter.on('openFile', function(data) {
      self.setState({fileData: data})
    })
  },
  clickedUpload : function(e){
    this.props.emitter.emit('upload')
  },
  render: function() {
    if (this.state.fileData) {
      
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

module.exports = UploadForm;

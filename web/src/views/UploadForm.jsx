var React = require('react');
var bridge = require('../javascripts/osx-bridge');

var UploadForm = React.createClass({
  clickedUpload : function(e){
    bridge(function(b){
      b.send('upload');
    });
  },
  render: function() {
    return (
      <div className="empty-message">
        <div className="upload-holder">
          <div onClick={this.clickedUpload} className="upload-button">
            Open File...
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UploadForm;

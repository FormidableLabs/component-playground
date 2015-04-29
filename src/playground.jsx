/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

import React from 'react/addons';

import Editor from "./editor.jsx";
import Preview from "./preview.jsx";

const ReactPlayground = React.createClass({
  propTypes: {
    codeText: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      code: this.props.codeText
    };
  },

  _handleCodeChange(code) {
    this.setState({ code });
  },

  render() {
    return <div className="playground">
      <div className="playgroundCode">
        <Editor
          onChange={this._handleCodeChange}
          className="playgroundStage"
          codeText={this.state.code} />
      </div>
      <div className="playgroundPreview">
        <Preview
          code={this.state.code}
          scope={this.props.scope}/>
      </div>
    </div>;
  },
});

export default ReactPlayground;
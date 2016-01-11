/* eslint new-cap:0, no-unused-vars:0, no-invalid-this:0, no-undef:0 */
"use strict";

import React, {Component, PropTypes} from "react";

export default class Editor extends Component {

  static propTypes = {
    theme: PropTypes.string,
    readOnly: PropTypes.bool,
    external: PropTypes.bool,
    codeText: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  };

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.refs.editor, {
      mode: "javascript",
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme: this.props.theme,
      readOnly: this.props.readOnly
    });
    this.editor.on("change", this._handleChange);
  }

  componentDidUpdate() {
    if (this.props.readOnly || this.props.external) {
      this.editor.setValue(this.props.codeText);
    }
  }

  _handleChange = () => {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  };

  render() {
    return (
      <div style={this.props.style} className={this.props.className}>
        <textarea ref="editor" defaultValue={this.props.codeText}/>
      </div>
    );
  }
}

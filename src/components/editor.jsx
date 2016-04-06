/* eslint new-cap:0 no-unused-vars:0 */
import React from "react";
import CodeMirror from "codemirror";

require("codemirror/mode/javascript/javascript");

const Editor = React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    external: React.PropTypes.bool,
    codeText: React.PropTypes.string,
    selection: React.PropTypes.shape({
      startLine: React.PropTypes.number,
      endLine: React.PropTypes.number
    }),
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string
  },
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.refs.editor, {
      mode: "javascript",
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme: this.props.theme,
      readOnly: this.props.readOnly,
      styleSelectedText: this.props.selection ? true : false
    });

    if (this.props.selection && this.props.selection.startLine <= this.props.selection.endLine) {
      for (let i = this.props.selection.startLine; i <= this.props.selection.endLine; i++) {
        this.editor.addLineClass(i, "wrap", "CodeMirror-activeline-background");
      }
    }

    this.editor.on("change", this._handleChange);
  },

  componentDidUpdate() {
    if (this.props.readOnly || this.props.external) {
      this.editor.setValue(this.props.codeText);
    }
  },

  _handleChange() {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(this.editor.getValue());
    }
  },

  render() {
    const editor = <textarea ref="editor" defaultValue={this.props.codeText} />;

    return (
      <div style={this.props.style} className={this.props.className}>
        {editor}
      </div>
    );
  }
});

export default Editor;

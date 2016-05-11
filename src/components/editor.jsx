/* eslint new-cap:0 no-unused-vars:0 */
import React from "react";
import CodeMirror from "codemirror";

require("codemirror/mode/jsx/jsx");

const Editor = React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    external: React.PropTypes.bool,
    codeText: React.PropTypes.string,
    selectedLines: React.PropTypes.array,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string
  },
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.refs.editor, {
      mode: "jsx",
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme: this.props.theme,
      readOnly: this.props.readOnly
    });

    if (Array.isArray(this.props.selectedLines)) {
      this.props.selectedLines.forEach((lineNumber) => {
        this.editor.addLineClass(lineNumber, "wrap", "CodeMirror-activeline-background");
      });
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

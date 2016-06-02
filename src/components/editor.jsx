/* eslint new-cap:0 no-unused-vars:0 */
import React from "react";
import Codemirror from "react-codemirror";

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
    const editor = this.refs.editor.getCodeMirror();
    this.highlightSelectedLines(editor, this.props.selectedLines);
  },

  highlightSelectedLines(editor, selectedLines) {
    if (Array.isArray(selectedLines)) {
      selectedLines.forEach((lineNumber) => {
        editor.addLineClass(lineNumber, "wrap", "CodeMirror-activeline-background");
      });
    }
  },

  updateCode(code) {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(code);
    }
  },

  render() {
    const options = {
      mode: "jsx",
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme: this.props.theme,
      readOnly: this.props.readOnly
    };

    return (
      <Codemirror
        className={this.props.className}
        external={this.props.external}
        onChange={this.updateCode}
        options={options}
        ref="editor"
        style={this.props.style}
        value={this.props.codeText}
      />
    );
  }
});

export default Editor;

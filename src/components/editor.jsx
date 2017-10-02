/* eslint new-cap:0 no-unused-vars:0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Codemirror from "react-codemirror2";

if (typeof window !== "undefined") {
  require("codemirror/mode/jsx/jsx");
}

class Editor extends Component {

  static propTypes = {
    className: PropTypes.string,
    codeText: PropTypes.string,
    external: PropTypes.bool,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    selectedLines: PropTypes.array,
    style: PropTypes.object,
    theme: PropTypes.string
  };

  componentDidMount = () => {
    const editor = this.editor.editor;
    this.highlightSelectedLines(editor, this.props.selectedLines);
  };

  highlightSelectedLines = (editor, selectedLines) => {
    if (Array.isArray(selectedLines)) {
      selectedLines.forEach((lineNumber) =>
        editor.addLineClass(lineNumber, "wrap", "CodeMirror-activeline-background"));
    }
  };

  updateCode = (editor, meta, code) => {
    if (!this.props.readOnly && this.props.onChange) {
      this.props.onChange(code);
    }
  };

  render() {
    const {
      className,
      external,
      style,
      codeText,
      theme,
      readOnly
    } = this.props;

    const options = {
      mode: "jsx",
      lineNumbers: false,
      lineWrapping: true,
      smartIndent: false,
      matchBrackets: true,
      theme,
      readOnly
    };

    return (
      <Codemirror
        ref={(c) => { this.editor = c; }}
        className={className}
        external={external}
        options={options}
        style={style}
        value={codeText}
        onChange={this.updateCode}
      />
    );
  }

}

export default Editor;

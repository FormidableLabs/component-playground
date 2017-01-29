/* eslint new-cap:0 no-unused-vars:0 */
import React, { Component, PropTypes } from "react";
import Codemirror from "react-codemirror";

if (typeof window !== "undefined") {
  require("codemirror/mode/jsx/jsx");
}

class Editor extends Component {

  static propTypes = {
    theme: PropTypes.string,
    readOnly: PropTypes.bool,
    external: PropTypes.bool,
    lineNumbers: PropTypes.bool,
    smartIndent: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    tabSize: PropTypes.number,
    codeText: PropTypes.string,
    selectedLines: PropTypes.array,
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  };

  componentDidMount = () => {
    const editor = this.refs.editor.getCodeMirror();
    this.highlightSelectedLines(editor, this.props.selectedLines);
  };

  highlightSelectedLines = (editor, selectedLines) => {
    if (Array.isArray(selectedLines)) {
      selectedLines.forEach(lineNumber =>
        editor.addLineClass(lineNumber, "wrap", "CodeMirror-activeline-background"));
    }
  };

  updateCode = (code) => {
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
      lineNumbers,
      smartIndent,
      lineWrapping,
      tabSize,
      readOnly
    } = this.props;

    const options = {
      mode: "jsx",
      matchBrackets: true,
      lineWrapping,
      smartIndent,
      lineNumbers,
      tabSize,
      theme,
      readOnly
    };

    return (
      <Codemirror
        ref="editor"
        className={className}
        external={external}
        options={options}
        style={style}
        value={codeText}
        onChange={this.updateCode} />
    );
  }

}

export default Editor;

/* eslint no-unused-vars:0 */
import "babel-polyfill";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Editor from "./editor";
import Preview from "./preview";
import EsPreview from "./es6-preview";
import Doc from "./doc";

// TODO: refactor to remove componentWillReceiveProps
// eslint-disable-next-line react/no-deprecated
class ReactPlayground extends Component {

  static defaultProps = {
    theme: "monokai",
    noRender: true,
    context: {},
    initiallyExpanded: false,
    onChange: () => {}
  };

  static propTypes = {
    codeText: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    collapsableCode: PropTypes.bool,
    docClass: PropTypes.func,
    propDescriptionMap: PropTypes.object,
    theme: PropTypes.string,
    selectedLines: PropTypes.array,
    noRender: PropTypes.bool,
    es6Console: PropTypes.bool,
    context: PropTypes.object,
    initiallyExpanded: PropTypes.bool,
    previewComponent: PropTypes.node,
    onChange: PropTypes.func
  };

  state = {
    code: this.props.codeText,
    expandedCode: this.props.initiallyExpanded,
    external: true
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      code: nextProps.codeText,
      external: true
    });
  };

  _handleCodeChange = (code) => {
    const { onChange } = this.props;

    this.setState({
      code,
      external: false
    }, () => onChange(code));
  };

  _toggleCode = () => {
    this.setState({
      expandedCode: !this.state.expandedCode
    });
  };

  render() {
    const { code, external, expandedCode } = this.state;
    const {
      codeText,
      collapsableCode,
      context,
      docClass,
      es6Console,
      noRender,
      previewComponent,
      propDescriptionMap,
      scope,
      selectedLines,
      theme } = this.props;

    return (
      <div className={`playground${collapsableCode ? " collapsableCode" : ""}`}>
        {
          docClass ?
            <Doc
              componentClass={docClass}
              propDescriptionMap={propDescriptionMap}
            /> : null
        }
        <div className={`playgroundCode${expandedCode ? " expandedCode" : ""}`}>
          <Editor
            className="playgroundStage"
            codeText={codeText}
            external={external}
            onChange={this._handleCodeChange}
            selectedLines={selectedLines}
            theme={theme}
          />
        </div>
        {
          collapsableCode ?
            <div className="playgroundToggleCodeBar">
              <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
                {expandedCode ? "collapse" : "expand"}
              </span>
            </div> : null
        }
        <div className="playgroundPreview">
          {
            es6Console ?
              <EsPreview
                code={code}
                scope={scope}
              /> :
              <Preview
                context={context}
                code={code}
                scope={scope}
                noRender={noRender}
                previewComponent={previewComponent}
              />
          }
        </div>
      </div>
    );
  }

}

export default ReactPlayground;

/* eslint no-unused-vars:0 */
import "babel-polyfill";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Editor from "./editor";
import Preview from "./preview";
import EsPreview from "./es6-preview";
import Doc from "./doc";
import { getHyphenatedClassNames } from '../utils/string';

// TODO: refactor to remove componentWillReceiveProps
// eslint-disable-next-line react/no-deprecated
class ReactPlayground extends Component {

  static defaultProps = {
    theme: "monokai",
    noRender: true,
    context: {},
    initiallyExpanded: false
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
    hyphenatedClassNames: PropTypes.node
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
    this.setState({
      code,
      external: false
    });
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
      theme,
      hyphenatedClassNames = false
    } = this.props;

    return (
      <div className={collapsableCode ? getHyphenatedClassNames("playground collapsableCode", hyphenatedClassNames) : "playground"}>
        {
          docClass ?
            <Doc
              componentClass={docClass}
              propDescriptionMap={propDescriptionMap}
              hyphenatedClassNames={hyphenatedClassNames}
            /> : null
        }
        <div className={expandedCode ? getHyphenatedClassNames("playgroundCode expandedCode", hyphenatedClassNames) : getHyphenatedClassNames("playgroundCode", hyphenatedClassNames)}>
          <Editor
            className={getHyphenatedClassNames("playgroundStage", hyphenatedClassNames)}
            codeText={codeText}
            external={external}
            onChange={this._handleCodeChange}
            selectedLines={selectedLines}
            theme={theme}
          />
        </div>
        {
          collapsableCode ?
            <div className={getHyphenatedClassNames("playgroundToggleCodeBar", hyphenatedClassNames)}>
              <span className={getHyphenatedClassNames("playgroundToggleCodeLink", hyphenatedClassNames)} onClick={this._toggleCode}>
                {expandedCode ? "collapse" : "expand"}
              </span>
            </div> : null
        }
        <div className={getHyphenatedClassNames("playgroundPreview", hyphenatedClassNames)}>
          {
            es6Console ?
              <EsPreview
                code={code}
                scope={scope}
                hyphenatedClassNames={hyphenatedClassNames}
              /> :
              <Preview
                context={context}
                code={code}
                scope={scope}
                noRender={noRender}
                previewComponent={previewComponent}
                hyphenatedClassNames={hyphenatedClassNames}
              />
          }
        </div>
      </div>
    );
  }

}

export default ReactPlayground;

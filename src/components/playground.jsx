/* eslint no-unused-vars:0, no-console:0, no-undef:0, no-invalid-this:0 */
"use strict";

import React, {Component} from "react";

import Editor from "./editor";
import Preview from "./preview";
import EsPreview from "./es6-preview";
import Doc from "./doc";

export default class ReactPlayground extends Component {
  static propTypes = {
    codeText: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired,
    collapsableCode: React.PropTypes.bool,
    docClass: React.PropTypes.func,
    propDescriptionMap: React.PropTypes.object,
    theme: React.PropTypes.string,
    noRender: React.PropTypes.bool,
    es6Console: React.PropTypes.bool,
    context: React.PropTypes.object,
    initiallyExpanded: React.PropTypes.bool,
    previewComponent: React.PropTypes.node,
    expandTxt: React.PropTypes.string,
    collapseTxt: React.PropTypes.string
  };


  static defaultProps = {
    theme: "monokai",
    noRender: true,
    context: {},
    expandTxt: "expand",
    collapseTxt: "collapse",
    initiallyExpanded: false
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {
      code: this.props.codeText,
      expandedCode: this.props.initiallyExpanded,
      external: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: nextProps.codeText,
      external: true
    });
  }

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
    const {noRender, collapsableCode, propDescriptionMap, docClass} = this.props;
    if (noRender === false) {
      console.warn(`
        Deprecation warning: noRender is being deprecated in favor of wrapped
        components and will be removed in the 1.x release.
        https://github.com/FormidableLabs/component-playground/issues/19 for details.
      `);
    }

    return (
      <div className={`playground ${collapsableCode ? "collapsableCode" : ""}`}>
        {docClass ? <Doc componentClass={docClass} propDescriptionMap={propDescriptionMap}/> : null}
        <div className={`playgroundCode ${this.state.expandedCode ? " expandedCode" : ""}`}>
          <Editor
            onChange={this._handleCodeChange}
            className="playgroundStage"
            codeText={this.state.code}
            external={this.state.external}
            theme={this.props.theme}
          />
        </div>
        {collapsableCode ?
        <div className="playgroundToggleCodeBar">
            <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
              {this.state.expandedCode ? this.props.collapseTxt : this.props.expandTxt}
            </span>
        </div> : null
          }
        <div className="playgroundPreview">
          {this.props.es6Console ?
          <EsPreview
            code={this.state.code}
            scope={this.props.scope}
          />
            :
          <Preview
            context={this.props.context}
            code={this.state.code}
            scope={this.props.scope}
            noRender={this.props.noRender}
            previewComponent={this.props.previewComponent}
          />
            }
        </div>
      </div>
    );
  }
}

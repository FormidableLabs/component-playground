/* no-unused-vars:0 */
"use strict";

import polyfill from "babel/polyfill";
import React from "react/addons";

import Editor from "./editor.jsx";
import Preview from "./preview.jsx";
import EsPreview from "./es6-preview.jsx";
import Doc from "./doc.jsx";

const ReactPlayground = React.createClass({
  propTypes: {
    codeText: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired,
    collapsableCode: React.PropTypes.bool,
    docClass: React.PropTypes.renderable,
    propDescriptionMap: React.PropTypes.string,
    theme: React.PropTypes.string,
    noRender: React.PropTypes.bool,
    es6Console: React.PropTypes.bool,
    context: React.PropTypes.object,
    lineNumbers: React.PropTypes.bool,
    previewFirst: React.PropTypes.bool,
    mode: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      theme: "monokai",
      noRender: true,
      context: {}
    };
  },

  getInitialState() {
    return {
      code: this.props.codeText,
      expandedCode: false
    };
  },

  _handleCodeChange(code) {
    this.setState({code});
  },

  _toggleCode() {
    this.setState({
      expandedCode: !this.state.expandedCode
    });
  },

  render() {
    if (this.props.noRender === false) {
      console.warn(`
        Deprecation warning: noRender is being deprecated in favor of wrapped components and will be removed in the 1.x release.
        https://github.com/FormidableLabs/component-playground/issues/19 for details.
      `);
    }

    var doc;
    if (this.props.docClass) {
      doc = <Doc
        componentClass={this.props.docClass}
        propDescriptionMap={this.props.propDescriptionMap}/>;
    }

    var toggleBar;
    if (this.props.collapsableCode) {
      toggleBar = (
        <div className="playgroundToggleCodeBar">
            <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
              {this.state.expandedCode ? "collapse" : "expand"}
            </span>
        </div>
      );
    }

    var preview = this.props.es6Console ?
      <div className="playgroundPreview">
        <EsPreview
          code={this.state.code}
          lineNumbers={this.props.lineNumbers}
          scope={this.props.scope}/>
      </div> :
      <div className="playgroundPreview">
        <Preview
          context={this.props.context}
          code={this.state.code}
          scope={this.props.scope}
          lineNumbers={this.props.lineNumbers}
          noRender={this.props.noRender}/>
      </div>;

    var editor = (
      <div className={"playgroundCode" + (this.state.expandedCode ? " expandedCode" : "")}>
        <Editor
          onChange={this._handleCodeChange}
          className="playgroundStage"
          lineNumbers={this.props.lineNumbers}
          mode={this.props.mode}
          codeText={this.state.code}
          theme={this.props.theme}/>
      </div>
    );

    var className = 'playground';
    if (this.props.collapsableCode) {
      className += ' collapsableCode';
    }

    return this.props.previewFirst ?
      <div className={className}>
        {doc}
        {preview}
        {toggleBar}
        {editor}
      </div> :
      <div className={className}>
        {doc}
        {editor}
        {toggleBar}
        {preview}
      </div>;
  }
});

export default ReactPlayground;

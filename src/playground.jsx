/* no-unused-vars:0 */
"use strict";

import React from "react/addons";

import Editor from "./editor";
import Preview from "./preview";
import EsPreview from "./es6-preview";
import Doc from "./doc";

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
    context: React.PropTypes.object
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
    this.setState({ code });
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

    return (
      <div className={"playground" + (this.props.collapsableCode ? " collapsableCode" : "")}>
        {this.props.docClass ?
          <Doc
            componentClass={this.props.docClass}
            propDescriptionMap={this.props.propDescriptionMap} />
          : ""
        }
        <div className={"playgroundCode" + (this.state.expandedCode ? " expandedCode" : "")}>
          <Editor
            onChange={this._handleCodeChange}
            className="playgroundStage"
            codeText={this.state.code}
            theme={this.props.theme} />
        </div>
        {this.props.collapsableCode ?
          <div className="playgroundToggleCodeBar">
            <span className="playgroundToggleCodeLink" onClick={this._toggleCode}>
              {this.state.expandedCode ? "collapse" : "expand"}
            </span>
          </div>
          : ""
        }
        <div className="playgroundPreview">
          {this.props.es6Console ?
            <EsPreview
              code={this.state.code}
              scope={this.props.scope} />
          :
          <Preview
            context={this.props.context}
            code={this.state.code}
            scope={this.props.scope}
            noRender={this.props.noRender} />
          }
        </div>
      </div>
    );
  }
});

export default ReactPlayground;

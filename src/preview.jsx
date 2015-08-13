"use strict";

import React from "react/addons";
import babel from "babel-core/browser";
import {transform, getScope} from "./compiler";

const Preview = React.createClass({
  propTypes: {
    code: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      error: null
    };
  },

  componentDidMount() {
    this._executeCode();
  },

  componentDidUpdate(prevProps) {
    clearTimeout(this.timeoutID);
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  },

  _compileCode() {
    return transform(this.props.code, this.props.scope, this.props.context, this.props.noRender);
  },

  _setTimeout() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout.apply(null, arguments);
  },

  _executeCode() {
    const mountNode = this.refs.mount.getDOMNode();

    try {
      const scope = getScope();

      for (const s in this.props.scope) {
        if (this.props.scope.hasOwnProperty(s)) {
          scope.push(this.props.scope[s]);
        }
      }

      scope.push(mountNode);

      const compiledCode = this._compileCode();

      if (this.props.noRender) {
        const Component = React.createElement(
          eval(compiledCode).apply(null, scope)
        );
        React.render(Component, mountNode);
      } else {
        eval(compiledCode).apply(null, scope);
      }

      this.setState({
        error: null
      });
    } catch (err) {
      const self = this;
      this._setTimeout(function () {
        self.setState({
          error: err.toString()
        });
      }, 500);
    }
  },

  render() {
    return (
      <div>
        {this.state.error !== null ?
          <div className="playgroundError">{this.state.error}</div> :
          null}
        <div ref="mount" className="previewArea"/>
      </div>
    );
  }
});

export default Preview;

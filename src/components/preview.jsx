/* eslint  no-invalid-this:0, no-new-func:0, no-unused-vars:0 */
"use strict";

import React, {Component, PropTypes} from "react";
import ReactDom from "react-dom";
import {transform} from "babel-standalone";

const babelrc = {presets: ["es2015", "react", "stage-0"]};
const values = (v) => Object.keys(v).map((k) => v[k]);

const wrapFunc = (scope, content) => {

  const keys = Object.keys(scope);
  const fn = new Function(keys.concat("mountNode", "$$context", "exports"), content);

  return (current, context, mountNode) => {
    const exports = {};
    const args = keys.map((k) => current[k]).concat(mountNode, context, exports);
    fn(...args);
    return exports.default;
  };
};

export default class Preview extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    previewComponent: PropTypes.node,
    noRender: PropTypes.bool,
    context: PropTypes.object
  };

  static defaultProps = {
    previewComponent: "div"
  };

  constructor(...rest) {
    super(...rest);
    this.state = {
      error: null
    };
  }


  componentDidMount() {
    this._executeCode();
  }

  _compileCode() {
    if (this.props.noRender) {
      const generateContextTypes = (context) => {
        const keys = Object.keys(context)
          .map((val) => `${JSON.stringify(val)}: React.PropTypes.any.isRequired`);
        return `{ ${keys.join(", ")} }`;
      };
      let ctxStr = "";
      if (this.props.context) {
        ctxStr = `
        childContextTypes: ${generateContextTypes(this.props.context)},
        getChildContext: function () { return $$context },
        `;
      }
      return wrapFunc(this.props.scope, transform(`
            exports.default =  React.createClass({
              ${ctxStr}
              render: function () {
                return (
                  ${this.props.code}
                );
              }
            });
        `, babelrc).code);
    } else {
      return wrapFunc(this.props.scope, transform(`
            ${this.props.code}
        `, babelrc).code);
    }
  }

  _setTimeout(...args) {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(...args);
  }

  _executeCode() {
    const mountNode = this.refs.mount;

    try {

      const compiledCode = this._compileCode();
      if (this.props.noRender) {
        const EvalComponent = compiledCode(this.props.scope, this.props.context, mountNode);
        ReactDom.render(React.createElement(EvalComponent, {}), mountNode);
      } else {
        const EvalComponent = compiledCode(this.props.scope, mountNode);
        ReactDom.render(React.createElement(EvalComponent, {}), mountNode);
      }

      this.setState({
        error: null
      });
    } catch (err) {
      this._setTimeout(() => {
        this.setState({
          error: err.toString()
        });
      }, 500);
    }
  }

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
}

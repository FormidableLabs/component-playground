"use strict";

import React from "react";
import ReactDom from "react-dom";
import ReactDOMServer from "react-dom/server";
import { transform } from "babel-standalone";

const Preview = React.createClass({
    propTypes: {
      code: React.PropTypes.string.isRequired,
      scope: React.PropTypes.object.isRequired,
      previewComponent: React.PropTypes.node
    },

    getInitialState() {
      return {
        error: null
      };
    },

    getDefaultProps() {
      return {
        previewComponent: 'div'
      }
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
      if (this.props.noRender) {
        const generateContextTypes = function (context) {
          const keys = Object.keys(context).map(val => `${val}: React.PropTypes.any.isRequired`);
          return `{ ${keys.join(", ")} }`;
        };

        return transform(`
          (function (${Object.keys(this.props.scope).join(", ")}, mountNode) {
            return React.createClass({
              // childContextTypes: { test: React.PropTypes.string },
              childContextTypes: ${generateContextTypes(this.props.context)},
              getChildContext: function () { return ${JSON.stringify(this.props.context)}; },
              render: function () {
                return (
                  ${this.props.code}
                );
              }
            });
          });
        `, { presets: ["es2015", "react", "stage-1"] } ).code;
      } else {
        return transform(`
          (function (${Object.keys(this.props.scope).join(",")}, mountNode) {
            ${this.props.code}
          });
        `, { presets: ["es2015", "react", "stage-1"] }).code;
      }
    },

    _setTimeout() {
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout.apply(null, arguments);
    },

    _executeCode() {
      var mountNode = this.refs.mount;

      try {

        var scope = [];

        for (var s in this.props.scope) {
          if (this.props.scope.hasOwnProperty(s)) {
            scope.push(this.props.scope[s]);
          }
        }

        scope.push(mountNode);

        var compiledCode = this._compileCode();
        if (this.props.noRender) {
          var Component = React.createElement(
            eval(compiledCode).apply(null, scope)
          );
          ReactDOMServer.renderToString(React.createElement(this.props.previewComponent, {}, Component));
          ReactDom.render(
            React.createElement(this.props.previewComponent, {}, Component),
            mountNode
          );
        } else {
          eval(compiledCode).apply(null, scope);
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

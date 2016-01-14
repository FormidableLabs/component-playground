/* eslint no-unused-vars:0, no-use-before-define:0,  no-console:0,no-eval:0 */
"use strict";

import React, {Component, PropTypes} from "react";
import ReactDom from "react-dom";
import {transform} from "babel-standalone";
import "babel-polyfill";

const babelrc = {presets: ["es2015", "react", "stage-0"]};

const values = (v) => Object.keys(v).map((k) => v[k]);

const wrapMap = {
  wrapnumber(num) {
    return (<span style={{color: "#6170d5"}}>{num}</span>);
  },
  wrapstring(str) {
    str = `'${str}'`;
    return (<span style={{color: "#F2777A"}}>{str}</span>);
  },

  wrapboolean(bool) {
    return (<span style={{color: "#48A1CF"}}>{bool ? "true" : "false"}</span>);
  },

  wraparray(arr) {
    return (<span>
      {"["}
      {arr.map((entry, i) =>
      <span key={i}>
        {getType(entry)}
        {i !== arr.length - 1 ? ", " : ""}
      </span>)}
      {"]"}
    </span>);
  },

  wrapobject(obj) {
    const pairs = [];
    let first = true;

    for (const key in obj) {
      pairs.push(
        <span key={key}>
          <span style={{color: "#8A6BA1"}}>
            {(first ? "" : ", ") + key}
          </span>
          {": "}
          {getType(obj[key])}
        </span>
      );

      first = false;
    }

    return (<i>{"Object {"}{pairs}{"}"}</i>);
  },

  wrapfunction() {
    return (<i style={{color: "#48A1CF"}}>{"function"}</i>);
  },

  wrapnull() {
    return (<span style={{color: "#777"}}>{"null"}</span>);
  },

  wrapundefined() {
    return (<span style={{color: "#777"}}>{"undefined"}</span>);
  }
};

const getType = function (el) {
  let t = typeof el;

  if (Array.isArray(el)) {
    t = "array";
  } else if (el === null) {
    t = "null";
  }

  return wrapMap[`wrap${t}`](el);
};

export default class Preview extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    clearTimeout(this.timeoutID);
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  }

  _compileCode() {
    return transform(`
      (function(${Object.keys(this.props.scope).join(",")}) {
        var list = [];
        var console = { log(...x) {
          list.push({val: x, multipleArgs: x.length !== 1})
        }};
        ${this.props.code}
        return list;
      });
    `, babelrc).code;
  }

  _setTimeout = (...args) => {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(...args);
  };

  _executeCode() {
    const mountNode = this.refs.mount;

    try {
      ReactDom.unmountComponentAtNode(mountNode);
    } catch (e) {
      console.error(e);
    }

    try {
      const scope = values(this.props.scope);
      scope.push(mountNode);
      const compiledCode = this._compileCode();
      const CompiledComponent = React.createElement(
        React.createClass({
          _createConsoleLine(x, multipleArgs) {
            return (
              <span style={{marginRight: "20px"}}>
                {multipleArgs ?
                  x.map((y) => { return this._createConsoleLine([y], false); }) :
                  getType(x[0])}
              </span>
            );
          },

          render() {
            return (
              <div style={{padding: 15, fontFamily: "Consolas, Courier, monospace"}}>
                {eval(compiledCode)(...scope).map((x, i) => {
                  return (
                  <div key={i} style={{borderBottom: "1px solid #ccc", padding: "4px 0"}}>
                    {this._createConsoleLine(x.val, x.multipleArgs)}
                  </div>
                    );
                })}
              </div>
            );
          }
        })
      );
      ReactDom.render(CompiledComponent, mountNode);
    } catch (err) {
      this._setTimeout(() => {
        ReactDom.render(
          <div className="playgroundError">{err.toString()}</div>,
          mountNode
        );
      }, 500);
    }
  }

  render() {
    return <div ref="mount"/>;
  }
}

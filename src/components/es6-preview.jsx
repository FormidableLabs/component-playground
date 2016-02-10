/* eslint new-cap:0 no-unused-vars:0 */
"use strict";

import React from "react";
import ReactDom from "react-dom";
import { transform } from "babel-standalone";

const getType = function (el) {
  let t = typeof el;

  if (Array.isArray(el)) {
    t = "array";
  } else if (el === null) {
    t = "null";
  }

  return t;
};

const wrapMap = {
  wrapnumber(num) {
    return (<span style={{color: "#6170d5"}}>{num}</span>);
  },

  wrapstring(str) {
    return (<span style={{color: "#F2777A"}}>{"'" + str + "'"}</span>);
  },

  wrapboolean(bool) {
    return (<span style={{color: "#48A1CF"}}>{bool ? "true" : "false"}</span>);
  },

  wraparray(arr) {
    return (
      <span>
        {"["}
        {arr.map((entry, i) => {
          return (
            <span key={i}>
              {wrapMap["wrap" + getType(entry)](entry)}
              {i !== arr.length - 1 ? ", " : ""}
            </span>
          );
        })}
        {"]"}
      </span>
    );
  },

  wrapobject(obj) {
    let pairs = [];
    let first = true;

    for (let key in obj) {
      pairs.push(
        <span key={key}>
          <span style={{color: "#8A6BA1"}}>
            {(first ? "" : ", ") + key}
          </span>
          {": "}
          {wrapMap["wrap" + getType(obj[key])](obj[key])}
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

const Preview = React.createClass({
  propTypes: {
    code: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired
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
    return transform(`
      (function(${Object.keys(this.props.scope).join(",")}) {
        var list = [];
        var console = { log(...x) {
          list.push({val: x, multipleArgs: x.length !== 1})
        }};
        ${this.props.code}
        return list;
      });
    `, { presets: ["es2015", "react", "stage-1"] }).code;
  },

  _setTimeout() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout.apply(null, arguments);
  },

  _executeCode() {
    var mountNode = this.refs.mount;

    try {
      ReactDom.unmountComponentAtNode(mountNode);
    } catch (e) {
      console.error(e);
    }

    try {
      var scope = [];
      for (var s in this.props.scope) {
        if (this.props.scope.hasOwnProperty(s)) {
          scope.push(this.props.scope[s]);
        }
      }
      scope.push(mountNode);
      var compiledCode = this._compileCode();
      var Component = React.createElement(
        React.createClass({
          _createConsoleLine(x, multipleArgs) {
            return (
              <span style={{marginRight: "20px"}}>
                {multipleArgs ?
                  x.map((y) => { return this._createConsoleLine([y], false); }) :
                  wrapMap["wrap" + getType(x[0])](x[0])}
              </span>
            );
          },

          render() {
            return (
              <div style={{padding: 15, fontFamily: "Consolas, Courier, monospace"}}>
                {eval(compiledCode).apply(null, scope).map( (x, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "4px 0"
                      }}>
                      {this._createConsoleLine(x.val, x.multipleArgs)}
                    </div>
                  );
                })}
              </div>
            );
          }
        })
      );
      ReactDom.render(Component, mountNode);
    } catch (err) {
      this._setTimeout(function () {
        ReactDom.render(
          <div className="playgroundError">{err.toString()}</div>,
          mountNode
        );
      }, 500);
    }
  },

  render() {
    return <div ref="mount" />;
  }
});

export default Preview;

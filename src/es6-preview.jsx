/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

import React from 'react/addons';
import babel from 'babel-core/browser';

const getType = function (el) {
  let t = typeof el;

  if (Array.isArray(el)) {
    t = "array";
  } else if (el === null) {
    t = "null"
  }

  return t;
}

const wrapMap = {
  wrapnumber(num) {
    return <span style={{color: "#6170d5"}}>{num}</span>
  },

  wrapstring(str) {
    return <span style={{color: "#F2777A"}}>{'"' + str + '"'}</span>
  },

  wraparray(arr) {
    return (
      <span>
        {"["}
        {arr.map((entry, i) => {
          return (
            <span>
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
        <span>
          <span style={{color: "#8A6BA1"}}>
            {(first ? "" : ", ")  + key}
          </span>
          {': '}
          {wrapMap["wrap" + getType(obj[key])](obj[key])}
        </span>
      );

      first = false;
    }

    return <i>{"Object {"}{pairs}{"}"}</i>
  },

  wrapfunction() {
    return <i style={{color: "#48A1CF"}}>{"function"}</i>
  },

  wrapnull() {
    return <span style={{color: "#777"}}>{"null"}</span>
  },

  wrapundefined() {
    return <span style={{color: "#777"}}>{"undefined"}</span>
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
      return babel.transform(
        '(function(' + Object.keys(this.props.scope).join(',') + ') {' +
          'var list = []; \n' +
          'var console = { log(x) {' +
            'list.push(x)' +
          '} }; \n' +
          this.props.code +
          ' \n return list;' +
        '\n});',

      { stage: 1 }
      ).code;
    },

    _setTimeout() {
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout.apply(null, arguments);
    },

    _executeCode() {
      var mountNode = this.refs.mount.getDOMNode();

      try {
        React.unmountComponentAtNode(mountNode);
      } catch (e) { }

      try {
        var scope = [];
        for(var s in this.props.scope) {
          if(this.props.scope.hasOwnProperty(s)){
            scope.push(this.props.scope[s]);
          }
        }
        scope.push(mountNode)
        var compiledCode = this._compileCode();
        var Component = React.createElement(
          React.createClass({
            render() {
              return (
                <div style={{padding: 15, fontFamily: "Consolas, Courier, monospace"}}>
                  {eval(compiledCode).apply(null, scope).map((x) => {
                    return (
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "4px 0"
                        }}>
                        {wrapMap["wrap" + getType(x)](x)}
                      </div>
                    );
                  })}
                </div>
              );
            }
          })
        );
        React.render(Component, mountNode);
      } catch (err) {
        this._setTimeout(function() {
          React.render(
            <div className="playgroundError">{err.toString()}</div>,
            mountNode
          );
        }, 500);
      }
    },

    render() {
        return <div ref="mount" />;
    },
});

export default Preview;

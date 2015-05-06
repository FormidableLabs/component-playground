/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

import React from 'react/addons';
import babel from 'babel-core/browser';

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
          'var console = { log(x) { list.push(x) } }; \n' +
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
                <div style={{padding: 15}}>
                  {eval(compiledCode).apply(null, scope).map((x) => {
                    return (
                      <div
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "4px 0"
                        }}>
                        {x}
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

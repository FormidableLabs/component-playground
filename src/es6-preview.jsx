/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

import React from 'react/addons';
import babel from 'babel-core/browser';
import { format } from 'util'

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
        `(function(format, ${Object.keys(this.props.scope).join(',')}, mountNode) {
          return React.createClass({
            getInitialState(){ return { log: [] }},

            componentDidMount(){
              var console = {
                log: (...args) => this.setState(state => ({log: state.log.concat(format(...args))}) )
              };

              ;(function(){
                ${this.props.code}
              })()
            },

            render() {
              return (
                <div style={{padding: 15}}>
                  {this.state.log.map((x, idx) => {
                    return (
                      <div key={idx}
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "4px 0"
                        }}>
                        {x}
                      </div>
                    );
                  })}
                </div>
              )
            }
          });
        });`,

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
        var scope = [format];
        for(var s in this.props.scope) {
          if(this.props.scope.hasOwnProperty(s)){
            scope.push(this.props.scope[s]);
          }
        }
        scope.push(mountNode)
        var compiledCode = this._compileCode();

        var Component = React.createElement(
            eval(compiledCode).apply(null, scope)
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

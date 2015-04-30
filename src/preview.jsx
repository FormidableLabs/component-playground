/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

import React from 'react/addons';
import JSXTransform from 'react-tools';
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
      if (this.props.noRender) {
        return babel.transform(
            '(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' +
              'return React.createClass({' +
                'render: function(){' +
                  'return (' +
                    this.props.code +
                  ')' +
                '}' +
              '});' +
            '\n});',
        { stage: 1 }
        ).code;
      } else {
        return babel.transform(
            '(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' +
              this.props.code +
            '\n});',
        { stage: 1 }
        ).code;
      }
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
        if (this.props.noRender) {
          var Component = React.createElement(
            eval(compiledCode).apply(null, scope)
          );
          React.render(Component, mountNode);
        } else {
          eval(compiledCode).apply(null, scope)
        }
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
/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

var React = require('react/addons');
var Playground = require('playground');
var Button = require('./components/button');

require('./styles/syntax.css');
require('./styles/codemirror.css');
require('./styles/demo.css');

var componentExample = require("raw!./examples/component.example");
var es6Example = require("raw!./examples/es6.example");

var Index = React.createClass({
  render() {
    return (
      <div className="component-documentation">
        <Playground codeText={componentExample} scope={{React: React, Button: Button}}/>
        <Playground codeText={componentExample} scope={{React: React, Button: Button}} collapsableCode={true}/>
        <Playground
          codeText={componentExample}
          scope={{React: React, Button: Button}}
          propDescriptionMap={{
            buttonStyle: "style object for inline styles"
          }}
          docClass={Button}
          collapsableCode={true} />
        <Playground codeText={es6Example} es6Console={true} scope={{React: React, Button: Button}} />
      </div>
    );
  }
});

React.render(<Index/>, document.getElementById('root'));
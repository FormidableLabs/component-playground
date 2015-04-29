/* eslint new-cap:0 no-unused-vars:0 */
'use strict';

var React = require('react/addons');
var Playground = require('playground');
var Button = require('./components/button');

require('./styles/syntax.css');
require('./styles/codemirror.css');
require('./styles/demo.css');

var componentExample = require("raw!./examples/component.example");

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
      </div>
    );
  }
});

React.render(<Index/>, document.getElementById('root'));
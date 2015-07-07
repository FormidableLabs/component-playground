/* eslint new-cap:0 no-unused-lets:0 */
"use strict";

import React from "react/addons";
import Playground from "playground";

require("./styles/syntax.css");
require("./styles/codemirror.css");
require("./styles/demo.css");

const Button = require("./components/button");
const componentExample = require("raw!./examples/component.example");

const DebugInfo = require("./components/debug-info");
const contextExample = require("raw!./examples/context.example");

const es6Example = require("raw!./examples/es6.example");

const Index = React.createClass({
  render() {
    return (
      <div className="component-documentation">
        <Playground
          codeText={componentExample}
          scope={{React, Button}}/>
        <Playground
          codeText={componentExample}
          scope={{React, Button}}
          collapsableCode={true}/>
        <Playground
          codeText={componentExample}
          scope={{React, Button}}
          propDescriptionMap={{
            buttonStyle: "style object for inline styles"
          }}
          docClass={Button}
          collapsableCode={true}/>
        <Playground
          context={{environment: "staging"}}
          codeText={contextExample}
          scope={{React, DebugInfo}}/>
        <Playground
          codeText={es6Example}
          es6Console={true}
          scope={{React, Button}}/>
      </div>
    );
  }
});

React.render(<Index/>, document.getElementById("root"));

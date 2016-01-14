/* eslint new-cap:0, no-unused-vars:0, no-undef:0 */
"use strict";

import React, {Component} from "react";
import ReactDom, {render} from "react-dom";
import Playground from "../src/index";
import Button from "./components/button";
import DebugInfo from "./components/debug-info.jsx";
//examples
import contextExample from "raw!./examples/context.example";
import es6Example from "raw!./examples/es6.example";
import componentExample from "raw!./examples/component.example";

require("./styles/syntax.css");
require("./styles/codemirror.css");
require("./styles/demo.css");


class Index extends Component {
  render() {
    return (
      <div className="component-documentation">
        <h2>Default</h2>

        <Playground
          codeText={componentExample}
          scope={{React, Button}}
        />

        <h2>Collapsable Code</h2>

        <Playground
          codeText={componentExample}
          scope={{React, Button}}
          collapsableCode
        />

        <h2>Collapsable Code (Expanded by Default)</h2>

        <Playground
          codeText={componentExample}
          scope={{React, Button}}
          collapsableCode
          initiallyExpanded
        />

        <h2>Prop Descriptions</h2>

        <Playground
          codeText={componentExample}
          scope={{React, Button}}
          propDescriptionMap={{
            buttonStyle: "style object for inline styles"
          }}
          docClass={Button}
          collapsableCode
        />

        <h2>With Context</h2>

        <Playground
          context={{environment: "staging"}}
          codeText={contextExample}
          scope={{React, DebugInfo}}
        />

        <h2>ES6 Console</h2>

        <Playground
          codeText={es6Example}
          es6Console
          scope={{React, Button}}
        />
      </div>
    );
  }
}

ReactDom.render(<Index/>, document.getElementById("content"));

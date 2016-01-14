/* eslint max-nested-callbacks:0 */
/**
 * Client tests
 */
import React from "react";
import {renderIntoDocument, findRenderedDOMComponentWithClass, createRenderer,
  scryRenderedComponentsWithType as withType} from "react-addons-test-utils";
import Playground from "src/components/playground";
import Preview from "src/components/preview";
import ES6Preview from "src/components/es6-preview";

import {render} from "react-dom";

import componentExample from "!!raw!demo/examples/component.example";
import contextExample from "!!raw!demo/examples/context.example";
import es6Example from "!!raw!demo/examples/es6.example";
import Button from "demo/components/button";
import DebugInfo from "demo/components/debug-info";

const into = (node, debug) => {
  if (debug === true) {
    debug = document.createElement("div");
    document.body.appendChild(debug);
    return render(node, debug);
  }
  return renderIntoDocument(node);
};

describe("components/playground", function () {

  it("has expected content with deep render", function () {
    // This is a "deep" render that renders children + all into an actual
    // browser DOM node.
    //
    // https://facebook.github.io/react/docs/test-utils.html#renderintodocument
    const rendered = renderIntoDocument(<Playground />);

    // This is a real DOM node to assert on.
    const divNode = findRenderedDOMComponentWithClass(rendered, "playgroundCode");
    expect(divNode).to.not.be.undefined;
  });

  it("has expected content with shallow render", function () {
    // This is a "shallow" render that renders only the current component
    // without using the actual DOM.
    //
    // https://facebook.github.io/react/docs/test-utils.html#shallow-rendering
    const renderer = createRenderer();
    renderer.render(<Playground />);
    const output = renderer.getRenderOutput();
    expect(output.type).to.equal("div");
  });

  describe("component", function () {
    it("should render as a component", function (done) {
      const node = into(<Playground codeText={componentExample} scope={{React, Button}}/>);
      const preview = withType(node, Preview)[0];
      expect(preview).to.exist;
      setTimeout(function () {
        const {innerHTML} = preview.refs.mount;
        expect(innerHTML).to.match(/^<button/);
        expect(innerHTML).to.match(/My Button/);
        done();
      }, 1000);
    });
  });

  describe("context", function () {
    it("should render as with context", function (done) {
      const node = into(<Playground codeText={contextExample} scope={{React, DebugInfo}}/>);
      const preview = withType(node, Preview)[0];
      expect(preview).to.exist;
      setTimeout(function () {
        const {innerHTML} = preview.refs.mount;
        expect(innerHTML).to.match(/development/);
        done();
      }, 1000);
    });
  });

  describe("es6", function () {
    it("should render with es6 console", function (done) {
      const node = into(<Playground codeText={es6Example} es6Console scope={{React, DebugInfo}}/>);
      const es6preview = withType(node, ES6Preview)[0];
      expect(es6preview).to.exist;
      setTimeout(() => {
        expect(es6preview.refs.mount).to.exist;
        done();
      }, 1000);
    });
  });

});

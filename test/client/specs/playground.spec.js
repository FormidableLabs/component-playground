/**
 * Client tests
 */
import React from "react";
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass
} from "react-dom/test-utils";
import ShallowRenderer from "react-test-renderer/shallow";
import Component from "../../../src/components/playground";

describe("components/playground", () => {

  it("has expected content with deep render", () => {
    // This is a "deep" render that renders children + all into an actual
    // browser DOM node.
    //
    // https://facebook.github.io/react/docs/test-utils.html#renderintodocument
    const rendered = renderIntoDocument(<Component />);

    // This is a real DOM node to assert on.
    const divNode = findRenderedDOMComponentWithClass(rendered, "playgroundCode");
    expect(divNode).to.not.be.undefined; //eslint-disable-line no-unused-expressions
  });

  it("has expected content with shallow render", () => {
    // This is a "shallow" render that renders only the current component
    // without using the actual DOM.
    //
    // https://facebook.github.io/react/docs/test-utils.html#shallow-rendering
    const renderer = new ShallowRenderer();
    renderer.render(<Component />);
    const output = renderer.getRenderOutput();
    expect(output.type).to.equal("div");
  });
});

/* eslint-disable max-statements */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import ReactDOMServer from "react-dom/server";
import { transform } from "babel-standalone";

class Preview extends Component {

  static defaultProps = {
    previewComponent: "div"
  };

  static propTypes = {
    code: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
    previewComponent: PropTypes.node,
    noRender: PropTypes.bool,
    context: PropTypes.object
  };

  state = {
    error: null
  };

  _compileCode = () => {
    const { code, context, noRender, scope } = this.props;
    const generateContextTypes = (c) => {
      return `{ ${Object.keys(c).map((val) =>
        `${val}: PropTypes.any.isRequired`).join(", ")} }`;
    };

    const scopeWithProps = { ...scope, PropTypes };

    if (noRender) {
      return transform(`
        ((${Object.keys(scopeWithProps).join(", ")}, mountNode) => {
          class Comp extends React.Component {

            getChildContext() {
              return ${JSON.stringify(context)};
            }

            render() {
              return (
                ${code}
              );
            }
          }

          Comp.childContextTypes = ${generateContextTypes(context)};

          return Comp;
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    } else {
      return transform(`
        ((${Object.keys(scopeWithProps).join(",")}, mountNode) => {
          ${code}
        });
      `, { presets: ["es2015", "react", "stage-1"] }).code;
    }

  };

  _executeCode = () => {
    const mountNode = this.mount;
    const { scope, noRender, previewComponent } = this.props;

    const scopeWithProps = { ...scope, PropTypes };

    const tempScope = [];

    try {
      Object.keys(scopeWithProps).forEach((s) => tempScope.push(scopeWithProps[s]));
      tempScope.push(mountNode);
      const compiledCode = this._compileCode();
      if (noRender) {
        /* eslint-disable no-eval, max-len */
        const Comp = React.createElement(
          eval(compiledCode)(...tempScope)
        );
        ReactDOMServer.renderToString(React.createElement(previewComponent, {}, Comp));
        render(
          React.createElement(previewComponent, {}, Comp),
          mountNode
        );
      } else {
        eval(compiledCode)(...tempScope);
      }
      /* eslint-enable no-eval, max-len */
      clearTimeout(this.timeoutID);
      this.setState({ error: null });
    } catch (err) {
      const error = err.toString();
      clearTimeout(this.timeoutID); //eslint-disable-line no-undef
      this.timeoutID = setTimeout(() => {
        this.setState({ error });
      }, 500);
    }
  };

  componentDidMount = () => {
    this._executeCode();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.code !== prevProps.code) {
      this._executeCode();
    }
  };

  render() {
    const { error } = this.state;
    return (
      <div>
        {error !== null ?
          <div className="playgroundError">{error}</div> :
          null}
        <div ref={(c) => { this.mount = c; }} className="previewArea"/>
      </div>
    );
  }

}

export default Preview;

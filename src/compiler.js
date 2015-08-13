import babel from "babel-core/browser";

// Force injection of babel runtime
import _core from "babel-runtime/core-js";
import _regeneratorRuntime from "babel-runtime/regenerator";
import playground from '../babel-plugin-playground';

function _getKeys(scope) {
  return Object.keys({_core, _regeneratorRuntime, ...scope}).join(",");
}

export function transform(srcCode, scope, context, noRender) {
  if (noRender) {
    const generateContextTypes = function (context) {
      const keys = Object.keys(context).map(val => `${val}: React.PropTypes.any.isRequired`);
      return `{ ${keys.join(", ")} }`;
    };

    return babel.transform(`
      (function (${_getKeys(scope)}, mountNode) {
        return React.createClass({
          // childContextTypes: { test: React.PropTypes.string },
          childContextTypes: ${generateContextTypes(context)},
          getChildContext: function () { return ${JSON.stringify(context)}; },
          render: function () {
            return (
              ${srcCode}
            );
          }
        });
      });
    `, { plugins: [{transformer: playground, position: 'after'}], stage: 1 }).code;
  } else {
    return babel.transform(`
      (function (${_getKeys(scope)}, mountNode) {
        ${srcCode}
      });
    `, { plugins: [{transformer: playground, position: 'after'}], stage: 1 }).code;
  }
}

export function tranformWithConsole(srcCode, scope) {
  return babel.transform(`
            (function(${_getKeys(scope)}) {
              var list = [];
              var console = { log(...x) {
                list.push({val: x, multipleArgs: x.length !== 1})
              }};
              ${srcCode}
              return list;
            });
          `, { plugins: [{transformer: playground, position: 'after'}], stage: 1}).code;
}

export function getScope() {
  return [_core, _regeneratorRuntime];
}

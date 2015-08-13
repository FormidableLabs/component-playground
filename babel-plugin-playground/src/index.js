import definitions from "./definitions.json";

export default function ({ Plugin, types: t }) {
  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  return new Plugin("playground", {
    visitor: {
      ReferencedIdentifier(node, parent, scope, file) {
        if (node.name === "regeneratorRuntime") {
          return t.identifier('_regeneratorRuntime');
        }

        if (t.isMemberExpression(parent)) return;
        if (!has(definitions.builtins, node.name)) return;
        if (scope.getBindingIdentifier(node.name)) return;

        // Symbol() -> _core.Symbol(); new Promise -> new _core.Promise
        return t.identifier(`_core.${node.name}`);
      },

      CallExpression(node, parent, scope, file) {
        // arr[Symbol.iterator]() -> _core.$for.getIterator(arr)

        if (node.arguments.length) return;

        var callee = node.callee;
        if (!t.isMemberExpression(callee)) return;
        if (!callee.computed) return;
        if (!this.get("callee.property").matchesPattern("Symbol.iterator")) return;

        return t.callExpression(t.identifier('_core.getIterator'), [callee.object]);
      },

      BinaryExpression(node, parent, scope, file) {
        // Symbol.iterator in arr -> core.$for.isIterable(arr)

        if (node.operator !== "in") return;
        if (!this.get("left").matchesPattern("Symbol.iterator")) return;

        return t.callExpression(t.identifier('_core.isIterable'), [node.right]);
      },

      MemberExpression: {
        enter(node, parent, scope, file) {
          // Array.from -> _core.Array.from

          if (!this.isReferenced()) return;

          var obj = node.object;
          var prop = node.property;

          if (!t.isReferenced(obj, node)) return;

          if (node.computed) return;

          if (!has(definitions.methods, obj.name)) return;

          var methods = definitions.methods[obj.name];
          if (!has(methods, prop.name)) return;

          // doesn't reference the global
          if (scope.getBindingIdentifier(obj.name)) return;

          // special case Object.defineProperty to not use core-js when using string keys
          if (obj.name === "Object" && prop.name === "defineProperty" && this.parentPath.isCallExpression()) {
            var call = this.parentPath.node;
            if (call.arguments.length === 3 && t.isLiteral(call.arguments[1])) return;
          }

          return t.identifier(`_core.${obj.name}.${prop.name}`);
        },
        exit(node, parent, scope, file) {
          if (!this.isReferenced()) return;

          var prop = node.property;
          var obj  = node.object;

          if (!has(definitions.builtins, obj.name)) return;
          if (scope.getBindingIdentifier(obj.name)) return;

          var modulePath = definitions.builtins[obj.name];
          return t.memberExpression(
            t.identifier(`_core.${obj.name}`),
            prop
          );
        }
      }
    }
  });
}

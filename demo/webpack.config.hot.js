"use strict";

const cloneDeep = require("lodash/cloneDeep");
const merge = require("lodash/merge");
const omit = require("lodash/omit");
const base = require("./webpack.config.dev");

// Update our own module version.
const mod = cloneDeep(base.module);
// First loader needs react hot.
mod.loaders[0].loaders = ["react-hot"].concat(mod.loaders[0].loaders);

module.exports = merge({}, omit(base, "entry", "module"), {
  entry: {
    app: ["webpack/hot/dev-server", "./demo/app.jsx"]
  },

  module: mod
});

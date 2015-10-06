"use strict";

var webpack = require("webpack");
var config = require("./webpack.config");

// **WARNING**: Mutates base configuration.
// We do this because lodash isn't available in `production` mode.
config.output.filename = "curved-carousel.js";
config.plugins = [
  new webpack.SourceMapDevToolPlugin("[file].map")
];

// Export mutated base.
module.exports = config;

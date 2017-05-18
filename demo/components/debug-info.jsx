/* eslint new-cap:0 no-unused-vars:0 */
"use strict";
import React from "react";
import PropTypes from "prop-types";

const DebugInfo = (props, context) => (
  <h1>ENV: {context.environment || "development"}</h1>
);

DebugInfo.contextTypes = {
  environment: PropTypes.string
};

export default DebugInfo;

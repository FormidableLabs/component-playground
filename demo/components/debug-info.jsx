/* eslint new-cap:0 no-unused-vars:0 */
"use strict";

import React from "react";
import PropTypes from "prop-types";

const Button = React.createClass({
  contextTypes: {
    environment: PropTypes.string
  },

  render() {
    return (
      <h1>ENV: {this.context.environment || "development"}</h1>
    );
  }
});

export default Button;

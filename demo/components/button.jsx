/* eslint new-cap:0 no-unused-vars:0 */
"use strict";
import React from "react";
import PropTypes from "prop-types";

const Button = () => (
  <button type="button" onClick={this.props.onClick} style={this.props.buttonStyle}>
    {this.props.children}
  </button>
);

Button.propTypes = {
  buttonStyle: React.PropTypes.object,
  onClick: React.PropTypes.func,
}

export default Button;

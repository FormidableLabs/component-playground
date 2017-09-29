/* eslint new-cap:0 no-unused-vars:0 */
"use strict";
import React from "react";
import PropTypes from "prop-types";

const Button = (props) => (
  <button
    type="button"
    onClick={props.onClick}
    style={props.buttonStyle}
  >
    {props.children}
  </button>
);

Button.propTypes = {
  buttonStyle: PropTypes.object,
  onClick: PropTypes.func,
}

export default Button;

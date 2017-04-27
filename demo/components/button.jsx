/* eslint new-cap:0 no-unused-vars:0 */
"use strict";

import React from "react";
import PropTypes from "prop-types";

const Button = React.createClass({
  propTypes: {
    buttonStyle: PropTypes.object,
    onClick: PropTypes.func
  },

  getDefaultProps() {
    return {
      darkMode: false
    };
  },

  render() {
    return (
      <button type="button" onClick={this.props.onClick} style={this.props.buttonStyle}>
        {this.props.children}
      </button>
    );
  }
});

export default Button;

/* eslint new-cap:0 no-unused-vars:0 */
"use strict";

import React, {Component} from "react";

export default class Button extends Component {

  static propTypes = {
    buttonStyle: React.PropTypes.object,
    onClick: React.PropTypes.func
  };

  static defaultProps = {
    darkMode: false
  };

  render() {
    return (
      <button type="button" onClick={this.props.onClick} style={this.props.buttonStyle}>
        {this.props.children}
      </button>
    );
  }
}

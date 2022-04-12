import React, { Component } from "react";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
/**
 * props
 * label      : string    (required)
 * callback   : void    (required)
 * options    : array   (required)
 * isRequired : boolean (optional)
 */

class ButtonActionCommon extends Component {
  render() {
    return (
      <UncontrolledButtonDropdown direction="down">
        <DropdownToggle caret/>
        <DropdownMenu positionFixed={true}>
          {this.props.action.map((res, index) => {
            return (
              <DropdownItem
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  this.props.callback(index);
                }}
              >
                {res.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    );
  }
}

export default ButtonActionCommon;

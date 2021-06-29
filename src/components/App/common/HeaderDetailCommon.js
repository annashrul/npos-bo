import React, { Component } from "react";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
/**
 * props
 * label      : string    (required)
 * callback   : void    (required)
 * options    : array   (required)
 * isRequired : boolean (optional)
 */

class HeaderDetailCommon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row mb-2">
        {this.props.data.map((val, key) => {
          return (
            <div className="col-md-6" key={key}>
              <div className="row">
                <div className="col-md-6">{val.title}</div>
                <div className="col-md-6">: {val.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HeaderDetailCommon;

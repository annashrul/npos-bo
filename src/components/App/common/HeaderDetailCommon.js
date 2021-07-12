import React, { Component } from "react";
import { CapitalizeEachWord, lengthBrg } from "../../../helper";

class HeaderDetailCommon extends Component {
  render() {
    return (
      <div className="row mb-2">
        {this.props.data.map((val, key) => {
          let desc = val.desc;
          // if (desc.length > 19) {
          //   desc = desc.substr(0, 19) + " ..";
          // }
          return (
            <div className={this.props.md ? this.props.md : `col-md-6`} key={key}>
              <div className="row">
                <div className={this.props.md ? `col-md-4` : `col-md-6`}>{val.title}</div>
                <div className={this.props.md ? `col-md-8` : `col-md-6`}>: {CapitalizeEachWord(desc.toLowerCase())}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HeaderDetailCommon;

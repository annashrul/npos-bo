import React, { Component } from "react";
import { CapitalizeEachWord, lengthBrg } from "../../../helper";

class HeaderDetailCommon extends Component {
  render() {
    return (
      <div className="row mb-2">
        {this.props.data.map((val, key) => {
          let desc = val.desc;
          return (
            <div
              className={`col-12 col-xs-12 ${
                this.props.md ? this.props.md : `col-md-6`
              }`}
              key={key}
            >
              <div className="row">
                <div
                  className={`col-4 col-xs-6 ${
                    this.props.md ? `col-md-4` : `col-md-6`
                  }`}
                >
                  {val.title}
                </div>
                <div
                  className={`col-8 col-xs-6 ${
                    this.props.md ? `col-md-8` : `col-md-6`
                  }`}
                >
                  : {val.desc ? desc : "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HeaderDetailCommon;

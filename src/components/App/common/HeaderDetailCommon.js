import React, { Component } from "react";

class HeaderDetailCommon extends Component {
  render() {
    return (
      <div className="row mb-2">
        {this.props.data.map((val, key) => {
          let md = this.props.md !== undefined;
          return (
            <div className={md ? this.props.md : `col-md-6`} key={key}>
              <div className="row">
                <div className={md ? `col-md-4` : `col-md-6`}>{val.title}</div>
                <div className={md ? `col-md-8` : `col-md-6`}>: {val.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HeaderDetailCommon;

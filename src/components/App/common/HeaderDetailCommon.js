import React, { Component } from "react";

class HeaderDetailCommon extends Component {
  render() {
    return (
      <div className="row mb-2">
        {this.props.data.map((val, key) => {
          return (
            <div className={this.props.md ? this.props.md : `col-md-6`} key={key}>
              <div className="row">
                <div className={this.props.md ? `col-md-3` : `col-md-6`}>{val.title}</div>
                <div className={this.props.md ? `col-md-9` : `col-md-6`}>: {val.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HeaderDetailCommon;

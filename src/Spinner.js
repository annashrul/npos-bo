import React, { Component } from 'react';
export default class Spinner extends Component {
  render() {
    return (
      <div className="card" style={{display:"table",width: "100%",height: "-webkit-fill-available"}}>
        <div className="animate__animated animate__bounceIn" style={{textAlign: "center",display: "table-cell",verticalAlign:"middle"}}>
          <div className="spinner-border text-primary" role="status"></div>
          {
            (
              this.props.spinnerLabel!==''?
              <div><p/><i>{this.props.spinnerLabel}</i></div> : ''
            )
          }
        </div>
      </div>
    )
  }
};

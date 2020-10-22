import React, { Component } from 'react';
export default class MyProgressbar extends Component {
  render() {
    return (
      <div className="card mt-3 mb-3" style={{display:"table",width: "100%",...{/*height: "-webkit-fill-available" */}}}>
        <div className="animate__animated animate__bounceIn" style={{textAlign: "center",display: "table-cell",verticalAlign:"middle"}}>
        <div className="progress h-4 ml-3 mr-3">
          <div className="progress-bar bg-danger progress-bar-animated progress-bar-striped" style={{width: this.props.myprogressbarPersen!==''?this.props.myprogressbarPersen:0}} role="progressbar" />
        </div>

          {
            (
              this.props.myprogressbarLabel!==''?
              <div><p/><i>{this.props.myprogressbarLabel}</i></div> : ''
            )
          }
        </div>
      </div>
    )
  }
};

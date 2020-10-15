import React, { Component } from 'react';
export default class Spinner extends Component {
  render() {
    return (
      <div className="card" style={{textAlign: "center",height: "100%",display: "inline-block",width: "100%",paddingTop:"45%"}}>
          <div className="spinner-border text-primary" role="status"></div>
          {/* <p/>
          <i>Memuat data . . .</i> */}
      </div>
    )
  }
};

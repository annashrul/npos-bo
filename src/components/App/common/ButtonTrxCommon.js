import React, { Component } from "react";

class ButtonTrxCommon extends Component {
  render() {
    return (
      <div>
        <button
          className="btn btn-primary mr-1"
          disabled={this.props.disabled}
          onClick={(e) => {
            e.preventDefault();
            this.props.callback(e, "simpan");
          }}
        >
          Simpan
        </button>
        <button
          className="btn btn-warning"
          disabled={this.props.disabled}
          onClick={(e) => {
            this.props.callback(e, "batal");
          }}
        >
          Batal
        </button>
      </div>
    );
  }
}

export default ButtonTrxCommon;

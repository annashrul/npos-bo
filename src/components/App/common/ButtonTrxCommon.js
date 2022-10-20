import React, { Component } from "react";

class ButtonTrxCommon extends Component {
  render() {
    return (
      <div>
        <button
          className="btn btn-warning mr-1"
          disabled={this.props.disabled}
          onClick={(e) => {
            this.props.callback(e, "batal");
          }}
        >
          Batal
        </button>
        <button
          className="btn btn-primary"
          disabled={this.props.disabled}
          onClick={(e) => {
            e.preventDefault();
            this.props.callback(e, "simpan");
          }}
        >
          Simpan
        </button>
      </div>
    );
  }
}

export default ButtonTrxCommon;

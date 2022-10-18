import React, { Component } from "react";
class ButtonActionForm extends Component {
  render() {
    return (
      <div className="form-group" style={{ textAlign: "right" }}>
        <button type="button" className="btn btn-warning mr-2" onClick={(e) => this.props.callback(e)}>
          <i className="ti-close" /> Batal
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="ti-save" /> Simpan
        </button>
      </div>
    );
  }
}

export default ButtonActionForm;

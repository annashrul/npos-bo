import React, { Component } from "react";
import { ModalToggle } from "../../../redux/actions/modal.action";

class ButtonActionForm extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle = (e) => {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
    this.props.callback();
  };

  render() {
    return (
      <div className="form-group" style={{ textAlign: "right" }}>
        <button
          type="button"
          className="btn btn-warning mr-2"
          onClick={this.toggle}
        >
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

import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { get } from "components/model/app.model";

import KeyboardEventHandler from "react-keyboard-event-handler";
import {
  getStorage,
  onHandleKeyboard,
  setFocus,
  swallOption,
} from "../../../../helper";
// const onEscape = function (action) {
//   window &&
//     window.addEventListener("keydown", (e) => {
//       if (e.keyCode === 9) {
//         action();
//       }
//     });
// };
// const onEnter = function (action) {
//   window &&
//     window.addEventListener("keydown", (e) => {
//       if (e.keyCode === 13) {
//         action();
//       }
//     });
// };
class ListHoldBill extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      data: [],
      idx: 1,
    };
    onHandleKeyboard(18, (e) => {
      let x = this.state.idx;
      if (this.state.data.length > 0) {
        if (x < this.state.data.length) {
          console.log("if", x);
          setFocus(this, `nama-${x}`);
          x += 1;
          this.setState({ idx: x });
          return;
        } else {
          setFocus(this, `nama-0`);
          this.setState({ idx: 1 });
          return;
        }

        // if (x === this.state.data.length) {
        //   console.log("else", x);
        // setFocus(this, `nama-0`);
        // this.setState({ idx: 1 });
        // }
      }
      return false;
    });

    onHandleKeyboard(13, (e) => {
      this.handleSave(this.state.data[this.state.idx]);
    });
  }
  getProps(props) {
    setFocus(this, `nama-${0}`);
    const table = "hold";
    const data = get(table);
    data.then((res) => {
      let dataArray = [];
      res.map((val) => {
        dataArray.push({
          id: val.id,
          nama: val.nama,
          master: JSON.parse(val.master),
          detail: JSON.parse(val.detail),
        });
      });
      this.setState({ data: dataArray });
    });
  }

  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  toggle = (e) => {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
    this.props.callback("close");
  };
  handleSubmit(e, val) {
    e.preventDefault();
    this.handleSave(val);
  }

  handleSave(val) {
    const dataSale = get("sale");
    dataSale.then((res) => {
      if (res.length > 0) {
        swallOption(
          "transaksi yang sudah ada akan ditimpa oleh transaksi dengan a/n " +
            val.nama,
          () => {
            this.props.callback(val);
          }
        );
      } else {
        this.props.callback(val);
      }
    });
    this.props.dispatch(ModalToggle(false));
  }

  render() {
    console.log("state", this.state.idx);
    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "listHoldBill"}
          size="md"
        >
          <ModalHeader toggle={this.toggle}>List Hold Bill</ModalHeader>
          <ModalBody>
            {this.state.data.length > 0
              ? this.state.data.map((val, key) => {
                  return (
                    <input
                      key={key}
                      value={val.nama}
                      className="form-control input-custom mb-1"
                      type="text"
                      ref={(input) => {
                        if (input !== null) {
                          this[`nama-${key}`] = input;
                        }
                      }}
                      readOnly={true}
                      onClick={(e) => this.handleSubmit(e, val)}
                      // onFocus={(e) => this.handleSubmit(e, val)}
                    />
                    // <button
                    //   key={key}
                    //   className="btn btn-block btn-outline-info text-left"
                    //   onClick={(e) => this.handleSubmit(e, val)}
                    // >
                    //   {val.nama}{" "}
                    //   <span style={{ float: "right" }}>
                    //     {val.detail.length} item
                    //   </span>
                    // </button>
                  );
                })
              : ""}
          </ModalBody>
        </WrapperModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default withRouter(connect(mapStateToProps)(ListHoldBill));

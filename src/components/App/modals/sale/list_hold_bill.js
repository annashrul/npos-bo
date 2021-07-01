import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { get, del } from "components/model/app.model";
import { onHandleKeyboard, setFocus, swallOption, swalWithCallback } from "../../../../helper";
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
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      data: [],
      idx: 0,
    };
    onHandleKeyboard(18, (e) => {
      e.preventDefault();
      let x = this.state.idx;
      if (this.state.data.length > 0) {
        if (x < this.state.data.length) {
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
      if (this.props.type === "listHoldBill") {
        if (this.state.data.length > 0) {
          this.handleSave(this.state.data[this.state.idx]);
        }
      }
    });
  }
  getProps(props) {
    const table = "hold";
    if (this.state.data.length > 0) {
      setFocus(this, `nama-${0}`);
    }
    const data = get(table);
    data.then((res) => {
      let dataArray = [];
      res.map((val) =>
        dataArray.push({
          id: val.id,
          nama: val.nama,
          master: JSON.parse(val.master),
          detail: JSON.parse(val.detail),
        })
      );
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
  getData() {
    get("hold").then((res) => {
      let data = [];
      res.map((val) => data.push(val));
      this.setState({ data: data });
    });
  }

  handleSave(val) {
    if (this.state.data.length > 0) {
      const dataSale = get("sale");
      dataSale.then((res) => {
        if (res.length > 0) {
          swallOption("transaksi yang sudah ada akan ditimpa oleh transaksi dengan a/n " + val.nama, () => {
            this.setState({ data: [] });
            this.props.callback(val);
            this.props.dispatch(ModalToggle(false));
          });
        } else {
          this.setState({ data: [] });
          this.props.callback(val);
          this.props.dispatch(ModalToggle(false));
        }
      });
    }
  }

  handleDelete(e, val) {
    e.preventDefault();
    swalWithCallback("anda yakin akan menghapus transaksi ini ??", () => {
      if (this.props.objectHoldBill.id === val.id) {
        swalWithCallback("transaksi atas nama ini sedang berlangsung. jika anda menghapusnya sistem otomatis akan mereset transaksi ini", () => {
          del("hold", val.id).then((res) => {
            this.getData();
          });
          this.props.callback("delete");
        });
      } else {
        del("hold", val.id).then((res) => {
          this.getData();
        });
      }
    });
  }

  render() {
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "listHoldBill"} size="md">
          <ModalHeader toggle={this.toggle}>List Hold Bill</ModalHeader>
          <ModalBody>
            {this.state.data.length > 0
              ? this.state.data.map((val, key) => {
                  return (
                    <div key={key} className="input-group input-group-sm">
                      <input
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
                      />
                      <span className="input-group-append">
                        <button type="button" className="btn btn-primary" onClick={(event) => this.handleDelete(event, val)}>
                          <i className="fa fa-trash" />
                        </button>
                      </span>
                    </div>
                  );
                })
              : "tidak ada list hold bill"}
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

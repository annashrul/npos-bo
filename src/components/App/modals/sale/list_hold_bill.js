import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
import Preloader from "../../../../Preloader";
import { storeSale } from "../../../../redux/actions/sale/sale.action";
import { ToastQ, toCurrency, rmComma } from "helper";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import { swallOption, swalWithCallback } from "../../../../helper";
import { ModalType } from "../../../../redux/actions/modal.action";
class ListHoldBill extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      data: [],
    };
  }
  getProps(props) {
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
    this.setState({});
  };
  handleSubmit(e, val) {
    e.preventDefault();
    this.props.callback(val);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "listHoldBill"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>List Hold Bill</ModalHeader>
        <ModalBody>
          {this.state.data.length > 0
            ? this.state.data.map((val, key) => {
                return (
                  <button
                    key={key}
                    className="btn btn-block btn-outline-info text-left"
                    onClick={(e) => this.handleSubmit(e, val)}
                  >
                    {val.nama}
                  </button>
                );
              })
            : ""}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    bank: state.bankReducer.data,
    isLoading: state.bankReducer.isLoading,
    isLoadingSale: state.saleReducer.isLoading,
  };
};
export default withRouter(connect(mapStateToProps)(ListHoldBill));

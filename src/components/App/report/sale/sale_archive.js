import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import TabCommon from "../../common/TabCommon";
import SaleArchiveManual from "./sale_archive_manual";
import SaleArchiveSystem from "./sale_archive_system";

class SaleArchive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleActive(res) {
    console.log(res);
  }

  render() {
    return (
      <TabCommon
        path="laporan penjualan"
        tabHead={["Sistem", "Manual"]}
        tabBody={[<SaleArchiveSystem />, <SaleArchiveManual />]}
        callbackActive={(res) => {
          this.handleActive(res);
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(SaleArchive);

import React, { Component } from "react";
import Layout from "components/App/Layout";
import {
  FetchScanResiReport,
  FetchReportDetailScanResi,
  deleteScanResi
} from "redux/actions/sale/scan_resi_laporan.action";
import connect from "react-redux/es/connect/connect";
import { float, generateNo, getFetchWhere, getPeriode, noData, parseToRp, toDate } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import DetailScanresi from "../../modals/report/sale/detail_scan_resi";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";

class ScanResiReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      periode: "",
      detail: {},
      isModalDetail: false,
      column_data: [
        { value: "no_resi", label: "Nomor Resi" },
        { value: "kd_kasir", label: "Operator" },
      ],
    };
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
    });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleService(res, page = 1) {
    this.setState({ isFirstHit: true });
    if (res !== undefined && this.state.isFirstHit) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchScanResiReport(where));
    }
  }

  handleFetchModal(page) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(page));
  }

  handleDelete(obj) {
    Object.assign(obj);
    this.props.dispatch(deleteScanResi(obj));
  }

  handleModal(page, param) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let state = { where_data: where };
    if (page === "detail") {
      this.setState({ isModalDetail: true, detail: param }, () => {
        this.handleFetchModal("detailScanresi");
      });
      return;
    }
    this.setState(state);
  }
  handleSearch(e) {
    e.preventDefault();
    this.handleService();
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.data;
    const { periode, column_data, isModalReport,isModalDetail,detail } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", width: "1%" },
      { label: "Nomor Resi", width: "50%" },
      { label: "Tanggal", width: "5%" },
      { label: "Operator", width: "5%" },
    ];
    let totalNilaiReturPerHalaman = 0;
    let totalDiskonPerHalaman = 0;
    return (
      <Layout page="Laporan scan resi">
        <HeaderReportCommon
          pathName="ReportScanResi"
          // isLocation={true}
          isColumn={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.toggleModal(last_page * per_page, per_page)}
          excelData={this.props.download}
        />

        <TableCommon
          head={head}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((val, key) => {
                  let btnAction = [
                    { label: "#" },
                    { label: "Hapus" },
                  ];
                  return (
                    <tr key={key}>
                      <td className="middle nowrap">{generateNo(key, current_page)}</td>
                      <td className="middle nowrap text-center">
                        <ButtonActionCommon
                          action={btnAction}
                          callback={(e) => {
                            if (e === 0) this.handleModal("#", val);
                            if (e === 1) this.handleDelete(val);
                          }}
                        />
                      </td>
                      <td className="middle nowrap">{val.no_resi}</td>
                      <td className="middle nowrap">{toDate(val.tgl)}</td>
                      <td className="middle nowrap">{val.kd_kasir}</td>
                      {/* <td className="middle nowrap">{val.caatatan}</td> */}
                    </tr>
                  );
                })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {this.props.isOpen && isModalDetail ? (
          <DetailScanresi detail={detail} />
        ) : null}
        {/* {this.props.isOpen && isModalReport ? <SaleReturReportExcel startDate={startDate} endDate={endDate} /> : null} */}
      </Layout>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.scanResiLaporanReducer.data,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ScanResiReport);

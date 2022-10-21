import React, { Component } from "react";
import Layout from "components/App/Layout";
import { 
  FetchScanResiReport, 
  FetchScanResiExport,
  FetchReportDetailScanResi 
} from "redux/actions/sale/scan_resi_laporan.action";
import connect from "react-redux/es/connect/connect";
// import SaleReturReportExcel from "components/App/modals/report/sale/form_scan_resi_excel";
import { float, generateNo, getFetchWhere, getPeriode, noData, parseToRp, toDate } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";


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
      isModalReport: false,
      column_data: [
        { value: "no_resi", label: "Nomor Resi" },
        { value: "kd_kasir", label: "Operator" },
      ],
    };
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

  handleModal(param = "detail", index, total = 0) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let state = { periode: periode, where_data: where };
    if (param === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchScanResiExport(where, total));
    } else {
      let props = this.props.data.data[index];
      Object.assign(props, { where: where });
      Object.assign(state, { isModalDetail: true, detail: props });
      this.props.dispatch(FetchReportDetailScanResi(props.no_resi, where));
    }

    this.setState(state);
  }

  handleSearch(e) {
    e.preventDefault();
    this.handleService();
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.data;
    const { periode, column_data, isModalReport } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", width: "1%" },
      { label: "Nomor Resi" },
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
                    totalNilaiReturPerHalaman += float(val.nilai_retur);
                    totalDiskonPerHalaman += float(val.diskon_item);
                    return (
                      <tr key={key}>
                        <td className="middle nowrap">{generateNo(key, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }]}
                            callback={(e) => this.handleModal("detail", key)}
                          />
                        </td>
                        <td className="middle nowrap">{val.no_resi}</td>
                        <td className="middle nowrap">{toDate(val.tgl)}</td>
                        <td className="middle nowrap">{val.kd_kasir}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />
        {/* {this.props.isOpen && isModalReport ? <SaleReturReportExcel startDate={startDate} endDate={endDate} /> : null} */}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.scanResiLaporanReducer.data,
    dataExport: state.scanResiLaporanReducer.dataExport,
    download: state.scanResiLaporanReducer.download,
    dataDetail: state.scanResiLaporanReducer.detail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ScanResiReport);

import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { deleteAdjustment, FetchAdjustment, FetchAdjustmentDetail } from "redux/actions/adjustment/adjustment.action";
import DetailAdjustment from "components/App/modals/report/inventory/adjustment_report/detail_adjustment_report";
import { HEADERS } from "redux/actions/_constants";
import { FetchAdjustmentExcel } from "redux/actions/adjustment/adjustment.action";
import AdjustmentReportExcel from "components/App/modals/report/inventory/adjustment_report/form_adjustment_excel";
import { CURRENT_DATE, getFetchWhere, getPeriode, getStorage, isEmptyOrUndefined } from "../../../../../helper";

import TableCommon from "../../../common/TableCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";

class AdjustmentReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "kd_trx", label: "Kode adjusment" },
        { value: "tgl", label: "Tanggal" },
        { value: "username", label: "Username" },
      ],
      isModalExcel: false,
      isModalDetail: false,
      location: "",
    };
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      let lokasi = getStorage("locationStorageReportAdjusment");
      if (isEmptyOrUndefined(lokasi)) {
        Object.assign(state, { location: lokasi });
      }
      this.setState(state);
      this.props.dispatch(FetchAdjustment(where));
    }
  }

  componentWillUnmount() {
    this.setState({ isModalExcel: false, isModalDetail: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(state, { isModalExcel: true });
      this.props.dispatch(FetchAdjustmentExcel(where, obj.total));
    } else {
      Object.assign(state, { isModalDetail: true });
      this.props.dispatch(FetchAdjustmentDetail(obj.kd_trx, where, true));
    }
    this.setState(state);
  }

  handleDelete(obj) {
    Object.assign(obj, { where: this.state.where_data });
    this.props.dispatch(deleteAdjustment(obj));
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.adjustmentReport;
    const { startDate, endDate, location, column_data, isModalExcel, isModalDetail } = this.state;

    return (
      <Layout page="Laporan Adjusment">
        <HeaderReportCommon
          col="col-md-2"
          pathName="ReportAdjusment"
          isLocation={true}
          isColumn={true}
          isSort={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.download}
        />
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Kode Adjusment", width: "1%" },
            { label: "Operator", width: "1%" },
            { label: "Lokasi", width: "1%" },
            { label: "Keterangan" },
            { label: "Tanggal", width: "1%" },
          ]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          body={typeof data === "object" && data}
          label={[{ label: "kd_trx" }, { label: "username" }, { label: "lokasi_nama" }, { label: "keterangan" }, { label: "tgl", date: true }]}
          action={[{ label: "Detail" }, { label: "Nota" }, { label: "3ply" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.handleModal("detail", data[index]);
            if (e === 1) this.props.history.push(`${HEADERS.URL}reports/adjust/${data[index].kd_trx}.pdf`);
            if (e === 2) this.props.history.push(`/adjust3ply/${data[index].kd_trx}`);
            if (e === 3) this.handleDelete(data[index]);
          }}
        />
        {this.props.isOpen && isModalExcel ? <AdjustmentReportExcel startDate={startDate} endDate={endDate} location={location} /> : null}
        {this.props.isOpen && isModalDetail ? <DetailAdjustment /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    adjustmentReport: state.adjustmentReducer.data,
    adjustmentReportExcel: state.adjustmentReducer.dataExcel,
    total: state.adjustmentReducer.total,
    download: state.adjustmentReducer.download,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};

export default connect(mapStateToProps)(AdjustmentReport);

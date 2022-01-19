import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { fetchPoReport, fetchPoReportExcel, deleteReportPo } from "redux/actions/purchase/purchase_order/po.action";
import { ModalType } from "redux/actions/modal.action";
import { poReportDetail } from "redux/actions/purchase/purchase_order/po.action";
import DetailPoReport from "components/App/modals/report/purchase/purchase_order/detail_po_report";
import PoReportExcel from "components/App/modals/report/purchase/purchase_order/form_po_excel";
import { CURRENT_DATE, generateNo, getFetchWhere, getPeriode, noData, swallOption, toDate } from "../../../../../helper";
import { STATUS_PURCHASE_ORDER, statusPurchaseOrder } from "../../../../../helperStatus";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import { rePrintFakturPo } from "../../../../../redux/actions/purchase/purchase_order/po.action";
import OtorisasiModal from "../../../modals/otorisasi.modal";
import { ModalToggle } from "../../../../../redux/actions/modal.action";

class PoReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handlePrintFaktur = this.handlePrintFaktur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onDone = this.onDone.bind(this);
    this.state = {
      master: {},
      where_data: "",
      dateFrom: CURRENT_DATE,
      dateTo: CURRENT_DATE,
      column_data: [
        { value: "no_po", label: "No. PO" },
        { value: "tgl_po", label: "Tanggal PO" },
        { value: "tglkirim", label: "Tanggal Kirim" },
        { value: "nama_supplier", label: "Nama Supplier" },
        { value: "status", label: "Status" },
        { value: "kode_supplier", label: "Kode Supplier" },
      ],
      isModalDetail: false,
      isModalExport: false,
      isModalOtorisasi: false,
      id_trx: "",
    };
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(fetchPoReport(where));
    }
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let setState = { dateFrom: getDate[0], dateTo: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(setState, { isModalExport: true });
      this.props.dispatch(fetchPoReportExcel(where, obj.total));
      this.props.dispatch(ModalType("formPoExcel"));
    } else {
      Object.assign(obj, { where: where, lokasi: obj.lokasi_nama });
      this.props.dispatch(poReportDetail(obj.no_po, where, true));
      Object.assign(setState, { isModalDetail: true, master: obj });
      this.props.dispatch(ModalType("poReportDetail"));
    }
    this.setState(setState);
  }
  handlePrintFaktur(nota) {
    this.props.dispatch(rePrintFakturPo(nota));
  }
  handleDelete(id) {
    this.setState({ id_trx: id });
    swallOption("Data yang telah dihapus tidak bisa dikembalikan.", () => {
      this.setState({ isModalOtorisasi: true });
      this.props.dispatch(ModalToggle(true));
      this.props.dispatch(ModalType("modalOtorisasi"));
    });
  }
  onDone(id, id_trx) {
    console.log(id, id_trx);
    this.props.dispatch(deleteReportPo(id_trx));
    this.setState({
      id_trx: "",
    });
  }
  render() {
    const { total, last_page, per_page, current_page, data } = this.props.poReport;
    const { column_data, dateFrom, dateTo, isModalDetail, isModalExport, master } = this.state;

    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "No.Po", width: "1%" },
      { label: "Tanggal Po", width: "1%" },
      { label: "Tanggal kirim", width: "1%" },
      { label: "Nama Supplier" },
      { label: "Lokasi", width: "1%" },
      { label: "Jenis", width: "1%" },
      { label: "Operator" },
      { label: "Status", width: "1%" },
    ];

    return (
      <Layout page="Laporan Purchase Order">
        <HeaderReportCommon
          pathName="ReportPurchaseOrder"
          isAll={true}
          statusData={STATUS_PURCHASE_ORDER}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.isLoading}
        />
        <TableCommon
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }, { label: "3ply" }, { label: "Nota" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.history.push(`/po3plyId/${v.no_po}`);
                              if (e === 2) this.handlePrintFaktur(v.no_po);
                              if (e === 3) this.handleDelete(v.no_po);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_po}</td>
                        <td className="middle nowrap">{toDate(v.tgl_po)} </td>
                        <td className="middle nowrap">{toDate(v.tglkirim)} </td>
                        <td className="middle nowrap">{v.nama_supplier}</td>
                        <td className="middle nowrap">{v.lokasi_nama}</td>
                        <td className="middle nowrap">{v.jenis}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap">{statusPurchaseOrder(v.status, true)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        {this.props.isOpen && isModalDetail ? <DetailPoReport master={master} poReportDetail={this.props.dataReportDetail} /> : null}

        {this.props.isOpen && isModalExport ? <PoReportExcel startDate={dateFrom} endDate={dateTo} /> : null}
        {this.props.isOpen && this.state.isModalOtorisasi ? (
          <OtorisasiModal
            datum={{
              module: "purchase order",
              aksi: "delete",
              id_trx: this.state.id_trx,
            }}
            onDone={this.onDone}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    poReport: state.poReducer.data,
    poReportExcel: state.poReducer.report_excel,
    dataReportDetail: state.poReducer.dataReportDetail,
    isLoading: state.poReducer.isLoading,
    isLoadingDetail: state.poReducer.isLoadingDetail,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(PoReport);

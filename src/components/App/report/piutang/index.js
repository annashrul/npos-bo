import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchPiutangReport, FetchPiutangReportExcel, DeletePiutangReport } from "redux/actions/piutang/piutang.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import PiutangReportExcel from "components/App/modals/piutang/form_piutang_excel";
import Swal from "sweetalert2";
import { CURRENT_DATE, DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, parseToRp, swallOption, toDate } from "../../../../helper";
import OtorisasiModal from "../../modals/otorisasi.modal";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import TableCommon from "../../common/TableCommon";
class PiutangReport extends Component {
  constructor(props) {
    super(props);
    this.handlePaymentSlip = this.handlePaymentSlip.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.onDone = this.onDone.bind(this);

    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "no_faktur_beli", label: "Faktur Beli" },
        { value: "no_nota", label: "Nota" },
        { value: "nama", label: "Customer" },
      ],
      id_trx: "",
      isModalExport: false,
      isModalOtorisasi: false,
    };
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchPiutangReport(where));
    }
  }
  handlePageChange(page) {
    this.handleService(this.state.where_data, page);
  }
  handleDelete(kode) {
    this.setState({ id_trx: kode });
    swallOption("Anda yakin akan menghapus data ini ?", () => {
      this.setState({ isModalOtorisasi: true });
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
      this.props.dispatch(ModalType("modalOtorisasi"));
    });
  }
  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { startDate: getDate[0], endDate: getDate[1], where_data: where };
    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchPiutangReportExcel(where, obj.total));
    }
    this.setState(state);
  }
  handlePaymentSlip(img) {
    Swal.fire({
      title: "Bukti Transfer",
      imageUrl: img,
      imageAlt: "image not available",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
  }

  onDone(id, id_trx) {
    this.props.dispatch(DeletePiutangReport(id_trx));
    // this.props.dispatch(deleteReportSale(id, id_trx));
    this.setState({
      id_trx: "",
    });
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.piutangReport;
    let totPerpage = 0;
    const { startDate, endDate, column_data, isModalExport, isModalOtorisasi, id_trx } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "Faktur", width: "1%" },
      { rowSpan: 2, label: "Customer" },
      { rowSpan: 2, label: "Operator", width: "1%" },
      { rowSpan: 2, label: "Bank", width: "1%" },
      { rowSpan: 2, label: "Jumlah", width: "1%" },
      { colSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [{ label: "Jual" }, { label: "Nota" }, { label: "Bayar" }, { label: "Jatuh tempo" }];

    return (
      <Layout page="Laporan Piutang">
        <HeaderReportCommon
          col="col-md-3"
          pathName="LaporaPiutang"
          isLocation={true}
          isColumn={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.download}
          sortNotColumn={false}
        />
        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    totPerpage = totPerpage + parseInt(v.jumlah, 10);
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="text-center middle nowrap">
                          <ButtonActionCommon
                            action={[{ label: "Bukti transfer" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handlePaymentSlip(v.payment_slip);
                              if (e === 1) this.handleDelete(v.no_nota);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.fak_jual}</td>
                        <td className="middle nowrap">{v.no_nota}</td>
                        <td className="middle nowrap">{v.nama}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap">{v.nm_bank}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.jumlah)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_byr)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_jatuh_tempo)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 7, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totPerpage) },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />

        {this.props.isOpen && isModalExport ? <PiutangReportExcel startDate={startDate} endDate={endDate} /> : null}
        {this.props.isOpen && isModalOtorisasi ? (
          <OtorisasiModal
            datum={{
              module: "report piutang",
              aksi: "delete",
              id_trx: id_trx,
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
    download: state.piutangReducer.download,
    piutangReport: state.piutangReducer.data_report,
    auth: state.auth,
    piutangReportExcel: state.piutangReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PiutangReport);

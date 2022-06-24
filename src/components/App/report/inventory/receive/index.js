import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import DetailReceiveReport from "../../../modals/report/purchase/receive/detail_receive_report";
import ReceiveReportExcel from "../../../modals/report/purchase/receive/form_receive_excel";
import {
  deleteReceiveReport,
  FetchReceiveData,
  FetchReportExcel,
  FetchReportDetail,
} from "redux/actions/purchase/receive/receive.action";
import FormReturReceive from "../../../modals/report/purchase/receive/form_retur_receive";
import {
  CURRENT_DATE,
  DEFAULT_WHERE,
  float,
  generateNo,
  getFetchWhere,
  getPeriode,
  getStorage,
  isEmptyOrUndefined,
  noData,
  parseToRp,
  setStorage,
  toDate,
} from "../../../../../helper";
import { STATUS_ARSIP_PENJUALAN } from "../../../../../helperStatus";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import { rePrintFaktur } from "../../../../../redux/actions/purchase/receive/receive.action";
import { linkReceivePembelian } from "../../../../../helperLink";

class ReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.handleService = this.handleService.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: DEFAULT_WHERE,
      detail: {},
      dateFrom: CURRENT_DATE,
      dateTo: CURRENT_DATE,
      location: "",
      type_data: [
        { value: "", label: "Semua" },
        { value: "Tunai", label: "Tunai" },
        { value: "Kredit", label: "Kredit" },
      ],
      column_data: [
        { value: "no_faktur_beli", label: "No. Faktur" },
        { value: "nama_penerima", label: "Penerima" },
        { value: "supplier", label: "Supplier" },
      ],
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    });
  }

  handleService(res, page = 1) {
    console.log(res);
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      let getLocation = getStorage("locationStorageReportReceivePembelian");
      if (isEmptyOrUndefined(getLocation)) {
        console.log(getLocation);
        Object.assign(state, { location: getLocation });
      }
      this.setState(state);
      this.props.dispatch(FetchReport(where));
    }
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }
  handleDelete(kode) {
    this.props.dispatch(
      deleteReceiveReport({ id: kode, where: this.state.where_data })
    );
  }

  handleEdit(obj) {
    setStorage("kode_edit", obj.no_faktur_beli);
    setStorage("lokasi_edit", obj.lokasi);
    setStorage("catatan_edit", "-");
    setStorage("kode_supplier_edit", obj.kode_supplier);
    setStorage("nama_penerima_edit", obj.nama_penerima);
    setStorage("nonota_edit", obj.nonota);
    setStorage("type_edit", obj.type);
    this.props.history.push(`${linkReceivePembelian}/${obj.no_faktur_beli}`);
  }

  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { dateFrom: getDate[0], dateTo: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchReportExcel(where, obj.total));
    } else if (type === "detail") {
      Object.assign(obj, { where: where });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchReportDetail(obj.no_faktur_beli, where, true));
    } else {
      Object.assign(state, { isModalForm: true });
      this.props.dispatch(FetchReceiveData(obj.no_faktur_beli, true));
    }
    this.setState(state);
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.data;
    const {
      detail,
      dateFrom,
      dateTo,
      location,
      column_data,
      type_data,
      isModalDetail,
      isModalExport,
      isModalForm,
    } = this.state;
    let totalDiskonPerHalaman = 0;
    let totalPpnPerHalaman = 0;
    let totalSisaPembayaranPerHalaman = 0;
    let totalQtyBeliPerHalaman = 0;
    let totalJumlahBeliPerHalaman = 0;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "No faktur beli" },
      { label: "Tanggal" },
      { label: "Penerima" },
      { label: "Tipe" },
      { label: "Pelunasan" },
      { label: "Diskon (%)" },
      { label: "Ppn (%)" },
      { label: "Supplier" },
      { label: "Operator" },
      { label: "Lokasi" },
      { label: "Pembayaran-ke" },
      { label: "Sisa pembayaran" },
      { label: "Qty beli" },
      { label: "Total beli" },
    ];
    return (
      <Layout page="Laporan receive pembelian">
        <HeaderReportCommon
          pathName="ReportReceivePembelian"
          col="col-md-3"
          isAll={true}
          isOther={true}
          columnData={column_data}
          otherData={type_data}
          statusData={STATUS_ARSIP_PENJUALAN}
          otherName="Jenis"
          otherState="type"
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() =>
            this.handleModal("excel", { total: last_page * per_page })
          }
          excelData={this.props.download}
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
                    let sisa =
                      `${v.pelunasan}`.toUpperCase() === "LUNAS"
                        ? parseToRp(0)
                        : parseToRp(
                            parseFloat(v.total_beli) -
                              parseFloat(v.jumlah_bayar)
                          );
                    totalDiskonPerHalaman += float(v.disc);
                    totalPpnPerHalaman += float(v.ppn);
                    totalSisaPembayaranPerHalaman += float(sisa);
                    totalQtyBeliPerHalaman += float(v.qty_beli);
                    totalJumlahBeliPerHalaman += parseInt(v.total_beli, 10);
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="text-center middle nowrap">
                          <ButtonActionCommon
                            action={[
                              { label: "Detail" },
                              { label: "Retur" },
                              { label: "Hapus" },
                              { label: "Edit" },
                              { label: "Nota" },
                              { label: "3ply" },
                            ]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleModal("retur", v);
                              if (e === 2) this.handleDelete(v.no_faktur_beli);
                              if (e === 3) this.handleEdit(v);
                              if (e === 4) this.handleRePrint(v.no_faktur_beli);
                              if (e === 5)
                                this.props.history.push(
                                  `/receive3plyId/${v.no_faktur_beli}`
                                );
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_faktur_beli}</td>
                        <td className="middle nowrap">{toDate(v.tgl_beli)}</td>
                        <td className="middle nowrap">{v.nama_penerima}</td>
                        <td className="middle nowrap">{v.type}</td>
                        <td className="middle nowrap">{v.pelunasan}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.disc)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.ppn)}
                        </td>
                        <td className="middle nowrap">{v.supplier}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap text-right">
                          {v.jumlah_pembayaran}
                        </td>
                        <td className="middle nowrap text-right">{sisa}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.qty_beli)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.total_beli)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 7,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                { colSpan: 1, label: parseToRp(totalPpnPerHalaman) },
                { colSpan: 4, label: "" },
                { colSpan: 1, label: parseToRp(totalSisaPembayaranPerHalaman) },
                { colSpan: 1, label: parseToRp(totalQtyBeliPerHalaman) },
                { colSpan: 1, label: parseToRp(totalJumlahBeliPerHalaman) },
              ],
            },
          ]}
        />

        {this.props.isOpen && isModalDetail ? (
          <DetailReceiveReport
            receiveReportDetail={this.props.receiveReportDetail}
            where={this.state.where_data}
          />
        ) : null}
        {this.props.isOpen && isModalForm ? (
          <FormReturReceive
            history={this.props.history}
            dataRetur={this.props.dataRetur}
          />
        ) : null}
        {this.props.isOpen && isModalExport ? (
          <ReceiveReportExcel
            startDate={dateFrom}
            endDate={dateTo}
            location={location}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.receiveReducer.data,
    download: state.receiveReducer.download,
    receiveReportDetail: state.receiveReducer.dataReceiveReportDetail,
    dataRetur: state.receiveReducer.receive_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReceiveReport);

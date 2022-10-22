import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { FetchReportSaleExcel } from "redux/actions/sale/sale.action";
import Otorisasi from "../../modals/otorisasi.modal";
import {
  generateNo,
  getFetchWhere,
  noData,
  parseToRp,
  swallOption,
  isEmptyOrUndefined,
  setStorage,
} from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import { linkTransaksiManual } from "../../../../helperLink";
import {
  deleteManualSaleAction,
  getManualSaleDetailReportAction,
  getManualSaleReportAction,
} from "../../../../redux/actions/sale/sale_manual.action";
import moment from "moment";
import DetailSaleReportManual from "../../modals/report/sale/detail_sale_report_manual";
import { withRouter } from "react-router-dom";

class SaleArchiveManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      type_data: [
        { value: "", label: "Semua" },
        { value: "0", label: "Tunai" },
        { value: "1", label: "Transfer" },
      ],
      isModalDetail: false,
      isModalOtorisasi: false,
      detail: {},
      periode: "",
      kd_trx: "",
      otorisasiType: "edit",
      gt: 0,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.onDone = this.onDone.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  onDone(id, id_trx) {
    if (this.state.otorisasiType === "edit") {
      this.props.history.push(`${linkTransaksiManual}/${btoa(id_trx)}`);
      this.setState({ isModalOtorisasi: false }, () => {
        this.props.dispatch(ModalToggle(false));
      });
    } else {
      this.props.dispatch(deleteManualSaleAction(id_trx, this.state.gt));
    }
  }

  componentWillUnmount() {
    this.setState({
      //   isModalDetail: false,
      //   isModalExcel: false,
      //   isModalOtorisasi: false,
    });
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(getManualSaleReportAction(where));
    }
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleFetchModal(page) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(page));
  }

  handleModal(page, param) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let state = { where_data: where };
    if (page === "detail") {
      Object.assign(state, { isModalDetail: true, detail: param });
      this.props.dispatch(
        getManualSaleDetailReportAction(`kd_trx=${param.kd_trx}`)
      );
    } else {
      Object.assign(state, { isModalExcel: true, totalExcel: param.total });
      this.props.dispatch(FetchReportSaleExcel(where, param.total));
    }

    this.setState(state);
  }

  handleDelete(param) {
    swallOption("Data yang telah dihapus tidak bisa dikembalikan.", () => {
      this.setState(
        {
          gt: param.gt,
          otorisasiType: "delete",
          kd_trx: param.kd_trx,
          isModalOtorisasi: true,
        },
        () => {
          this.handleFetchModal("modalOtorisasi");
        }
      );
    });
  }
  //   andleEdit(obj) {
  //     setStorage("kode_edit", obj.no_faktur_beli);
  //     setStorage("lokasi_edit", obj.lokasi);
  //     setStorage("catatan_edit", "-");
  //     setStorage("kode_supplier_edit", obj.kode_supplier);
  //     setStorage("nama_penerima_edit", obj.nama_penerima);
  //     setStorage("nonota_edit", obj.nonota);
  //     setStorage("type_edit", obj.type);
  //     this.props.history.push(`${linkReceivePembelian}/${obj.no_faktur_beli}`);
  //   }

  handleEdit(obj) {
    // this.props.history.push(`${linkTransaksiManual}/${obj.kd_trx}`);
    setStorage("masterTrxManual", JSON.stringify(obj));
    this.setState({
      otorisasiType: "edit",
      kd_trx: obj.kd_trx,
      objEdit: obj,
    });

    swallOption("Anda Yakin Akan Mengubah Data Penjualan Ini.", () => {
      this.setState({ isModalOtorisasi: true });
      this.handleFetchModal("modalOtorisasi");
    });

    // setStorage("kode_edit", obj.no_faktur_beli);
    // setStorage("lokasi_edit", obj.lokasi);
    // setStorage("catatan_edit", "-");
    // setStorage("kode_supplier_edit", obj.kode_supplier);
    // setStorage("nama_penerima_edit", obj.nama_penerima);
    // setStorage("nonota_edit", obj.nonota);
    // setStorage("type_edit", obj.type);
    // this.props.history.push(`${linkTransaksiBarang}/${obj.kd_trx}`);
  }

  render() {
    const {
      type_data,
      isModalDetail,
      detail,
      kd_trx,
      otorisasiType,
      isModalOtorisasi,
    } = this.state;
    const { total, last_page, per_page, current_page, data, totalData } =
      this.props.data;

    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "Kode transaksi" },
      { rowSpan: "2", label: "Tanggal" },
      { rowSpan: "2", label: "Jumlah" },
      { colSpan: "3", label: "Penerima" },
      { colSpan: "3", label: "Pengirim" },
      { rowSpan: "2", label: "Jenis" },
      { rowSpan: "2", label: "Bank" },
      { rowSpan: "2", label: "Catatan" },
    ];
    const rowSpan = [
      { label: "Nama" },
      { label: "Telepon" },
      { label: "Alamat" },
      { label: "Nama" },
      { label: "Telepon" },
      { label: "Alamat" },
    ];
    let totalPerHalaman = 0;
    return (
      <div>
        <HeaderReportCommon
          pathName="ReportSale"
          col="col-md-3"
          isOther={true}
          otherName="Jenis"
          otherState="type"
          otherData={this.state.type_data}
          callbackWhere={(res) => this.handleService(res)}
        />

        <TableCommon
          head={head}
          rowSpan={rowSpan}
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
                    let arrPenerima = v.penerima.split("|");
                    let arrPengirim = v.penerima.split("|");

                    let namaPenerima = arrPenerima[0],
                      teleponPenerima = arrPenerima[1],
                      alamatPenerima = arrPenerima[2];
                    let namaPengirim = arrPengirim[0],
                      teleponPengirim = arrPengirim[1],
                      alamatPengirim = arrPengirim[2];
                    let btnAction = [
                      { label: "Detail" },
                      { label: "Edit" },
                      { label: "Hapus" },
                    ];
                    totalPerHalaman += Number(v.gt);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={btnAction}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleEdit(v);
                              //   if (e === 1) this.handleEdit(v); // window.location.href = `${linkTransaksiManual}/${v.kd_trx}`;

                              //   if (e === 2)
                              //     this.props.history.push(
                              //       `${linkReportArsipPenjualan}/nota3ply/${v.kd_trx}`
                              //     );
                              if (e === 2) this.handleDelete(v);
                              //   if (e === 4) this.handleEdit(v);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">
                          {moment(v.created_at).format("LLL")}
                        </td>
                        <td className="middle nowrap text-right">
                          Rp. {parseToRp(Number(v.gt))},-
                        </td>
                        <td className="middle nowrap">{namaPenerima}</td>
                        <td className="middle nowrap">{teleponPenerima}</td>
                        <td className="middle nowrap">{alamatPenerima}</td>
                        <td className="middle nowrap">{namaPengirim}</td>
                        <td className="middle nowrap">{teleponPengirim}</td>
                        <td className="middle nowrap">{alamatPengirim}</td>

                        <td className="middle nowrap">
                          {v.tipe === 0 ? "Tunai" : "Transfer"}
                        </td>
                        <td className="middle nowrap">{v.bank}</td>
                        <td className="middle nowrap">{v.catatan}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 4,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: `Rp. ${parseToRp(totalPerHalaman)},-`,
                  className: "text-right",
                },
                {
                  colSpan: 9,
                  label: "",
                  className: "text-left",
                },
              ],
            },
            {
              data: [
                {
                  colSpan: 4,
                  label: "Total keseluruhan",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: `Rp. ${parseToRp(
                    isEmptyOrUndefined(totalData) ? totalData.gt : 0
                  )},-`,
                  className: "text-right",
                },
                {
                  colSpan: 9,
                  label: "",
                  className: "text-left",
                },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? (
          <DetailSaleReportManual detail={detail} />
        ) : null}
        {this.props.isOpen && isModalOtorisasi ? (
          <Otorisasi
            datum={{
              module: "arsip penjualan manual",
              aksi: otorisasiType,
              id_trx: kd_trx,
            }}
            onDone={this.onDone}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToPropsCreateItem = (state) => {
  return {
    data: state.saleManualReducer.dataGetReport,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};
export default withRouter(
  connect(mapStateToPropsCreateItem)(SaleArchiveManual)
);

// export default connect(mapStateToProps)(SaleArchiveManual);

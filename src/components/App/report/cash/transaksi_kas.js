import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {
  FetchCashReportExcel,
  FetchCashReport,
  setUpdate,
  deleteCashTransaksi,
} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import {
  float,
  generateNo,
  getFetchWhere,
  getPeriode,
  getStorage,
  isEmptyOrUndefined,
  kassa,
  noData,
  parseToRp,
  setStorage,
  swallOption,
  toDate,
  toRp,
} from "../../../../helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import CashReportExcel from "components/App/modals/report/cash/form_cash_excel";
import Updates from "components/App/modals/report/cash/update";
import Otorisasi from "../../modals/otorisasi.modal";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import SelectCommon from "../../common/SelectCommon";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import CompareLocationCommon from "../../common/CompareLocationCommon";

const kassStorage = "kassaReportKas";
const typeStorage = "typeReportKas";

class ReportTransactionCash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      type_data: [
        { value: "", label: "Semua Tipe" },
        { value: "masuk", label: "Kas Masuk" },
        { value: "keluar", label: "Kas Keluar" },
      ],
      type: "",
      kassa_data: kassa(),
      kassa: "",
      id_trx: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      isModalExport: false,
      isModalUpdate: false,
      isModalOtorisasi: false,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onDone = this.onDone.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handleModal = this.handleModal.bind(this);
  }
  componentWillUnmount() {
    this.setState({
      isModalExport: false,
      isModalUpdate: false,
      isModalOtorisasi: false,
    });
  }
  onDone(id, id_trx) {
    this.props.dispatch(deleteCashTransaksi(id, id_trx));
    setTimeout(() => {
      this.checkingParameter(1);
    }, 1500);
    this.setState({
      id_trx: "",
    });
  }

  componentDidMount() {
    console.log("storage", getStorage("locationStorageReportKas"));
  }

  handleUpdate(data) {
    Object.assign(data, { where: this.state.where_data });
    this.setState({ isModalUpdate: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(setUpdate(data));
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formUpdateKasTrx"));
  }
  handleDelete(id) {
    this.setState({ id_trx: id });
    swallOption("Data yang dihapus tidak akan bisa dikembalikan", () => {
      this.setState({ isModalOtorisasi: true });
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
      this.props.dispatch(ModalType("modalOtorisasi"));
    });
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = {};
      let newWhere = "";
      let getKassa = getStorage(kassStorage);
      let getType = getStorage(typeStorage);
      if (isEmptyOrUndefined(getKassa)) {
        Object.assign(state, { kassa: getKassa });
        newWhere += `&kassa=${getKassa}`;
      }
      if (isEmptyOrUndefined(getType)) {
        Object.assign(state, { type: getType });
        newWhere += `&type_kas=${getType}`;
      }
      Object.assign(state, { where_data: where });
      this.setState(state, () => {
        this.props.dispatch(FetchCashReport(where + newWhere));
      });
    }
  }

  handleSelect(state, res) {
    let where = this.state.where_data;
    this.setState({ [state]: res.value });
    if (state === "kassa") {
      setStorage(kassStorage, res.value);
    }
    if (state === "type") {
      setStorage(typeStorage, res.value);
    }

    this.handleService(where);
  }

  handleModal(type, obj) {
    if (type === "excel") {
      let whereState = this.state.where_data;
      let where = getFetchWhere(whereState);
      let periode = getPeriode(where.split("&"));
      let getDate = periode.split("-");
      console.log(getDate[1]);
      let setState = {
        isModalExport: true,
        startDate: getDate[0],
        endDate: getDate[1],
      };
      const { kassa, type } = this.state;
      if (isEmptyOrUndefined(kassa)) {
        where += `&kassa=${kassa}`;
      }
      if (isEmptyOrUndefined(type)) {
        where += `&type_kas=${type}`;
      }
      this.setState(setState);
      this.props.dispatch(ModalType("formCashExcel"));
      this.props.dispatch(FetchCashReportExcel(where, obj.total));
    }
  }
  render() {
    const { last_page, total, per_page, current_page, total_kas, data } =
      this.props.cashReport;
    let total_perpage = 0;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Kode transaksi", width: "1%" },
      { label: "Tipe", width: "1%" },
      { label: "Jenis", width: "1%" },
      { label: "Lokasi", width: "1%" },
      { label: "Kasir", width: "1%" },
      { label: "Jumlah", width: "1%" },
      { label: "Keterangan" },
      { label: "Tanggal", width: "1%" },
    ];
    return (
      <div>
        <HeaderReportCommon
          pathName="ReportKas"
          callbackWhere={(res) => {
            this.handleService(res);
          }}
          callbackExcel={() =>
            this.handleModal("excel", { total: last_page * per_page })
          }
          excelData={this.props.isLoading}
          isLocation={true}
          renderRow={
            <div className="col-md-4">
              <div className="row">
                <div className="col-6 col-xs-6 col-md-6">
                  <SelectCommon
                    label="kassa"
                    options={this.state.kassa_data}
                    callback={(res) => this.handleSelect("kassa", res)}
                    dataEdit={this.state.kassa}
                  />
                </div>
                <div className="col-6 col-xs-6 col-md-6">
                  <SelectCommon
                    label="tipe"
                    options={this.state.type_data}
                    callback={(res) => this.handleSelect("type", res)}
                    dataEdit={this.state.type}
                  />
                </div>
              </div>
            </div>
          }
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
                    total_perpage += float(v.jumlah);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Edit" }, { label: "Hapis" }]}
                            callback={(e) => {
                              if (e === 1) {
                                this.handleDelete(v.kd_trx);
                              }
                              if (e === 0) {
                                this.handleUpdate({
                                  kd_trx: v.kd_trx,
                                  jumlah: v.jumlah,
                                  keterangan: v.keterangan,
                                  tgl: v.tgl,
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">{v.type}</td>
                        <td className="middle nowrap">{v.jenis}</td>
                        <td className="middle nowrap">
                          <CompareLocationCommon lokasi={v.lokasi} /> &nbsp;(
                          {v.kassa})
                        </td>
                        <td className="middle nowrap">{v.kasir}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.jumlah)}
                        </td>
                        <td className="middle nowrap">{v.keterangan}</td>
                        <td className="middle nowrap">{toDate(v.tgl)}</td>
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
                { colSpan: 1, label: parseToRp(total_perpage) },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && this.state.isModalExport ? (
          <CashReportExcel
            tipe={this.state.type}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            kassa={this.state.kassa}
          />
        ) : null}

        {this.props.isOpen && this.state.isModalUpdate ? <Updates /> : null}
        {this.props.isOpen && this.state.isModalOtorisasi ? (
          <Otorisasi
            datum={{
              module: "transaksi kas",
              aksi: "delete",
              id_trx: this.state.id_trx,
            }}
            onDone={this.onDone}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cashReport: state.cashReducer.dataReport,
    cashReportExcel: state.cashReducer.dataExcel,
    isLoadingReport: state.cashReducer.isLoadingReport,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(ReportTransactionCash);

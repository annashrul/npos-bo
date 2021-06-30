import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchMutation, FetchMutationExcel, FetchMutationData, rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import DetailMutation from "components/App/modals/report/inventory/mutation_report/detail_mutation";
import MutationReportExcel from "components/App/modals/report/inventory/mutation_report/form_mutation_excel";
import { statusQ, dateRange, handleDataSelect } from "helper";
import { generateNo, getStorage, isEmptyOrUndefined, isProgress, noData, setStorage, toDate, toRp } from "../../../../../helper";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import TableCommon from "../../../common/TableCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";

const dateFromStorage = "dateFromReportMutasi";
const dateToStorage = "dateToReportMutasi";
const statusStorage = "statusReportMutasi";
const locationStorage = "locationReportMutasi";
const columnStorage = "columnReportMutasi";
const sortStorage = "sortReportMutasi";
const anyStorage = "anyReportMutasi";

class MutationReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      sort: "",
      column: "",
      column_data: [
        { kode: "no_faktur_mutasi", value: "Kode Mutasi" },
        { kode: "tgl_mutasi", value: "Tanggal" },
        { kode: "status", value: "Status" },
      ],
      status: "",
      status_data: [
        { kode: "", value: "Semua" },
        { kode: "0", value: "Dikirim" },
        { kode: "1", value: "Diterima" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
    let getColumn = getStorage(columnStorage);
    let getSort = getStorage(sortStorage);
    let getStatus = getStorage(statusStorage);
    let getAny = getStorage(anyStorage);

    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation });
    }
    if (isEmptyOrUndefined(getStatus)) {
      where += `&status=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (isEmptyOrUndefined(getColumn) && isEmptyOrUndefined(getSort)) {
      where += `&sort=${getColumn}|${getSort}`;
      Object.assign(state, { column: getColumn, sort: getSort });
    }
    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchMutation(where));
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalExport: false,
    });
  }

  componentWillMount() {
    this.handleService();
  }
  componentDidMount() {
    this.handleService();
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  toggle(code, barcode, name) {
    this.setState({ isModalDetail: true });
    this.props.dispatch(ModalType("detailMutation"));
    this.props.dispatch(FetchMutationData(code, "page=1"));
  }

  handleSearch(e) {
    e.preventDefault();
    let any = this.state.any;
    setStorage(anyStorage, any);
    this.handleService();
  }

  handleSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 500);
  }

  toggleModal(e, total) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.setState({ isModalExport: true });
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formMutationExcel"));
    this.props.dispatch(FetchMutationExcel(1, this.state.where_data, total));
  }
  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.mutationReport;
    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { colSpan: "2", label: "Faktur", width: "1%" },
      { colSpan: "2", label: "Lokasi", width: "1%" },
      { rowSpan: "2", label: "qty", width: "1%" },
      { rowSpan: "2", label: "Status", width: "1%" },
      { rowSpan: "2", label: "Keterangan" },
      { rowSpan: "2", label: "Tanggal mutasi", width: "1%" },
    ];
    let totQtyPer = 0;

    return (
      <Layout page="Laporan Mutasi">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-3">
            {dateRange((first, last) => {
              setStorage(dateFromStorage, first);
              setStorage(dateToStorage, last);
              setTimeout(() => this.handleService(), 300);
            }, `${toDate(this.state.startDate)} - ${toDate(this.state.endDate)}`)}
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} isAll={true} dataEdit={this.state.location} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Status" options={handleDataSelect(this.state.status_data, "kode", "value")} callback={(res) => this.handleSelect("status", res)} dataEdit={this.state.status} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Kolom" options={handleDataSelect(this.state.column_data, "kode", "value")} callback={(res) => this.handleSelect("column", res)} dataEdit={this.state.status} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectSortCommon callback={(res) => this.handleSelect("sort", res)} dataEdit={this.state.sort} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <div className="form-group">
              <label>Cari</label>
              <div className="input-group">
                <input
                  type="search"
                  name="any"
                  className="form-control"
                  placeholder="tulis sesuatu disini"
                  value={this.state.any}
                  onChange={(e) => this.setState({ any: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") this.handleSearch(e);
                  }}
                />
                <span className="input-group-append">
                  <button type="button" className="btn btn-primary" onClick={this.handleSearch}>
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div className="col-6 col-xs-6 col-md-1">
            <div className="form-group">
              <button style={{ marginTop: "28px" }} className="btn btn-primary" onClick={(e) => this.toggleModal(e, last_page * per_page, per_page)}>
                {isProgress(this.props.download)}
              </button>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          rowSpan={[{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }]}
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
                    let action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }, { label: "Edit" }];
                    if (v.status !== "0") {
                      action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }];
                    }
                    totQtyPer = totQtyPer + parseInt(v.total_qty);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              console.log(e);
                              if (e === 0) this.toggle(v.no_faktur_mutasi, "", "");
                              if (e === 1) this.handleRePrint(v.no_faktur_mutasi);
                              if (e === 2) this.props.history.push(`../alokasi3ply/${v.no_faktur_mutasi}`);
                              if (v.status === "0") {
                                if (e === 3) this.props.history.push(`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`);
                              }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_faktur_mutasi}</td>
                        <td className="middle nowrap">{v.no_faktur_beli === "" ? "-" : v.no_faktur_beli}</td>
                        <td className="middle nowrap">{v.lokasi_asal}</td>
                        <td className="middle nowrap">{v.lokasi_tujuan}</td>
                        <td className="middle nowrap text-right">{v.total_qty}</td>
                        <td className="middle nowrap">{v.status === "0" ? statusQ("warning", "Dikirim") : v.status === "1" ? statusQ("success", "Diterima") : ""}</td>
                        <td className="middle nowrap">{v.keterangan}</td>
                        <td className="middle nowrap">{toDate(v.tgl_mutasi)}</td>
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
                  colSpan: 6,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: toRp(parseFloat(totQtyPer)) },
                { colSpan: 4, label: "" },
              ],
            },
          ]}
        />

        {this.props.isOpen && this.state.isModalDetail ? <DetailMutation /> : null}

        {this.props.isOpen && this.state.isModalExport ? <MutationReportExcel startDate={this.state.startDate} endDate={this.state.endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mutationReport: state.mutationReducer.report,
    download: state.mutationReducer.download,
    mutationReportExcel: state.mutationReducer.report_excel,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(MutationReport);

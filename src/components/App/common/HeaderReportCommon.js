import React, { Component } from "react";
import { CURRENT_DATE, dateRange, getStorage, isEmptyOrUndefined, isProgress, rmStorage, setStorage, toDate } from "../../../helper";
import LokasiCommon from "./LokasiCommon";
import SelectCommon from "./SelectCommon";
import SelectSortCommon from "./SelectSortCommon";

class HeaderReportCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: CURRENT_DATE,
      dateTo: CURRENT_DATE,
      location: "",
      status: "",
      column: "",
      sort: "",
      any: "",
      status_data: [],
      column_data: [],
      sort_data: [],
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getProps(props) {
    let state = {};
    if (props.columnData !== undefined && props.columnData.length > 0) {
      Object.assign(state, { column_data: props.columnData });
    }
    if (props.statusData !== undefined && props.statusData.length > 0) {
      Object.assign(state, { status_data: props.statusData });
    }
    if (props.sortData !== undefined && props.sortData.length > 0) {
      Object.assign(state, { sort_data: props.sortData });
    }
    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
    this.handleService();
  }
  componentDidMount() {
    this.getProps(this.props);
    this.handleService();
  }

  handleService() {
    let props = this.props;
    let path = props.pathName;
    let getDateFrom = getStorage(`dateFromStorage${path}`);
    let getDateTo = getStorage(`dateToStorage${path}`);
    let getLocation = getStorage(`locationStorage${path}`);
    let getStatus = getStorage(`statusStorage${path}`);
    let getColumn = getStorage(`columnStorage${path}`);
    let getSort = getStorage(`sortStorage${path}`);
    let getAny = getStorage(`anyStorage${path}`);
    let where = `page=1`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { dateFrom: getDateFrom, dateTo: getDateTo });
    } else {
      where += `&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation });
    }

    if (isEmptyOrUndefined(getStatus)) {
      where += `&status=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (props.sortNotColumn) {
      if (isEmptyOrUndefined(getSort)) {
        where += `&sort=${getSort}`;
        Object.assign(state, { sort: getSort });
      }
    } else {
      if (isEmptyOrUndefined(getColumn)) {
        where += `&sort=${getColumn}`;
        Object.assign(state, { column: getColumn });
        if (isEmptyOrUndefined(getSort)) {
          where += `|${getSort}`;
          Object.assign(state, { sort: getSort });
        }
      }
    }

    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    this.setState(state);
    this.props.callbackWhere(where);
  }

  handleSelect(state, res) {
    this.setState({ [state]: res.value });
    if (state === "location") setStorage(`locationStorage${this.props.pathName}`, res.value);
    if (state === "status") setStorage(`statusStorage${this.props.pathName}`, res.value);
    if (state === "column") setStorage(`columnStorage${this.props.pathName}`, res.value);
    if (state === "sort") setStorage(`sortStorage${this.props.pathName}`, res.value);
    this.handleService();
  }

  handleSearch(e) {
    e.preventDefault();
    setStorage(`anyStorage${this.props.pathName}`, this.state.any);
    this.handleService();
  }
  handleChange(e) {
    let val = e.target.value;
    if (val === "") {
      rmStorage(`anyStorage${this.props.pathName}`);
      this.handleService();
    }
    this.setState({ any: e.target.value });
  }

  render() {
    const { dateFrom, dateTo, location, status, column, sort, any, status_data, column_data, sort_data } = this.state;
    return (
      <div className="row">
        <div className="col-6 col-xs-6 col-md-3">
          {dateRange(
            (first, last, isActive) => {
              setStorage(`activeDateRangePickerStorage${this.props.pathName}`, isActive);
              setStorage(`dateFromStorage${this.props.pathName}`, first);
              setStorage(`dateToStorage${this.props.pathName}`, last);
              this.handleService();
            },
            `${toDate(dateFrom)} - ${toDate(dateTo)}`,
            getStorage(`activeDateRangePickerStorage${this.props.pathName}`)
          )}
        </div>

        {this.props.isAll || this.props.isLocation ? (
          <div className="col-6 col-xs-6 col-md-3">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={true} />
          </div>
        ) : null}
        {this.props.isAll || this.props.isStatus ? (
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Status" options={status_data} callback={(res) => this.handleSelect("status", res)} dataEdit={status} />
          </div>
        ) : null}
        {this.props.isAll || this.props.isColumn ? (
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Kolom" options={column_data} callback={(res) => this.handleSelect("column", res)} dataEdit={column} />
          </div>
        ) : null}

        {this.props.isAll || this.props.isSort || this.props.sortData ? (
          <div className="col-6 col-xs-6 col-md-3">
            {this.props.sortData !== undefined ? (
              <SelectCommon label="Sort" options={sort_data} callback={(res) => this.handleSelect("sort", res)} dataEdit={sort} />
            ) : (
              <SelectSortCommon callback={(res) => this.handleSelect("sort", res)} dataEdit={sort} />
            )}
          </div>
        ) : null}

        <div className="col-6 col-xs-6 col-md-3">
          <label>Cari</label>
          <div className="input-group">
            <input
              type="search"
              name="any"
              className="form-control"
              placeholder="tulis sesuatu disini"
              value={any}
              onChange={this.handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") this.handleSearch(e);
              }}
            />
            <span className="input-group-append">
              <button type="button" className="btn btn-primary" onClick={this.handleSearch}>
                <i className="fa fa-search" />
              </button>
              {isProgress(this.props.excelData, () => this.props.callbackExcel())}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderReportCommon;
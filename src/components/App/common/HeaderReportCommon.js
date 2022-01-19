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
      other: "",
      status_data: [],
      column_data: [],
      sort_data: [],
      other_data: [],
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getProps(props) {
    let state = {};
    if(props.isSelectedLocationFirstIndex){
      Object.assign(state, { location: "LK/0001" });
      setStorage(`locationStorage${this.props.pathName}`, "LK/0001");
      // LK/001
    }
    if (props.columnData !== undefined && props.columnData.length > 0) {
      Object.assign(state, { column_data: props.columnData });
      setStorage(`columnStorage${this.props.pathName}`, props.columnData[0].value);

      // this.handleSelect("column", props.columnData[0]);
    }
    if (props.statusData !== undefined && props.statusData.length > 0) {
      Object.assign(state, { status_data: props.statusData });
      // this.handleSelect("status", props.statusData[0]);
    }
    if (props.sortData !== undefined && props.sortData.length > 0) {
      Object.assign(state, { sort_data: props.sortData });
      // setStorage(`sortStorage${this.props.pathName}`, props.sortData[0].value);
      // this.handleSelect("sort", props.sortData[0]);
    }
    if (props.otherData !== undefined && props.otherData.length > 0) {
      Object.assign(state, { other_data: props.otherData });
      // this.handleSelect("other_data", props.otherData[0]);
    }
    this.handleService();
    this.setState(state);
  }

  componentWillMount() {
    this.getProps(this.props);
  }
  componentDidMount() {
    // this.getProps(this.props);
    // this.handleService();
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
    let getOther = props.isOther ? getStorage(`${props.otherState}Storage${path}`) : "";
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
    if (this.props.isOther) {
      if (isEmptyOrUndefined(getOther)) {
        where += `&${props.otherState}=${getOther}`;
        Object.assign(state, { other: getOther });
      }
    }
    if (isEmptyOrUndefined(getStatus)) {
      where += `&${props.otherStatus ? props.otherStatus : "status"}=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (isEmptyOrUndefined(getColumn)) {
      where += `&${props.otherColumn ? props.otherColumn : "searchby"}=${getColumn}`;
      Object.assign(state, { searchby: getColumn });
    }
    if (props.sortNotColumn) {
      if (isEmptyOrUndefined(getSort)) {
        where += `&sort=${getSort}`;
        Object.assign(state, { sort: getSort });
      }
    } else {
      if (isEmptyOrUndefined(getSort)) {
        where += `&${props.otherColumn ? props.otherColumn : "sort"}=${getColumn}`;
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
    console.log("handleSelect",res)
    this.setState({ [state]: res.value });
    if (this.props.isOther) {
      if (state === this.props.otherState) setStorage(`${state}Storage${this.props.pathName}`, res.value);
      this.setState({ other: res.value });
    }
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
    const { dateFrom, dateTo, location, status, column, sort, any, status_data, column_data, sort_data, other, other_data } = this.state;
    let col = "col-md-2";
    if (this.props.col) {
      col = this.props.col;
    }
    
    return (
      <div className="row">
        {
          this.props.isPeriode===undefined?<div className={`col-6 col-xs-6 ${col}`}>
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
          </div> : null
        }

        {this.props.isAll || this.props.isLocation ? (
          <div className={`col-6 col-xs-6 ${col}`}>
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={this.props.isSelectedLocationFirstIndex===undefined?true:false} isSelectedFirstIndex={this.props.isSelectedLocationFirstIndex?true:false} />
          </div>
        ) : null}
        {this.props.renderRow && this.props.renderRow}
        {this.props.isOther && (
          <div className={`col-6 col-xs-6 ${col}`}>
            <SelectCommon label={this.props.otherName} options={other_data} callback={(res) => this.handleSelect(this.props.otherState, res)} dataEdit={other} />
          </div>
        )}
        {this.props.isAll || this.props.isStatus ? (
          <div className={`col-6 col-xs-6 ${col}`}>
            <SelectCommon label="Status" options={status_data} callback={(res) => this.handleSelect("status", res)} dataEdit={status} />
          </div>
        ) : null}
        {this.props.isAll || this.props.isColumn ? (
          <div className={`col-6 col-xs-6 ${col}`}>
            <SelectCommon label="Kolom" options={column_data} callback={(res) => this.handleSelect("column", res)} dataEdit={column} />
          </div>
        ) : null}

        {this.props.isAll || this.props.isSort || this.props.sortData ? (
          <div className={`col-6 col-xs-6 ${col}`}>
            {this.props.sortData !== undefined ? (
              <SelectCommon label="Urutan" options={sort_data} callback={(res) => this.handleSelect("sort", res)} dataEdit={sort} />
            ) : (
              <SelectSortCommon callback={(res) => this.handleSelect("sort", res)} dataEdit={sort} />
            )}
          </div>
        ) : null}

        {this.props.isNotSearch == undefined && (
          <div className={`col-6 col-xs-6 ${col}`}>
            <label>Cari</label>
            <div className="input-group">
              <input
                type="search"
                name="any"
                className="form-control"
                placeholder={this.props.placeholder?this.props.placeholder:"tulis & enter"}
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
                {this.props.callbackExcel && isProgress(this.props.excelData, () => this.props.callbackExcel())}
              </span>
            </div>
          </div>
        )}

        {this.props.renderHeader && this.props.renderHeader}
      </div>
    );
  }
}

export default HeaderReportCommon;

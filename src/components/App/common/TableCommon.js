import React, { Component } from "react";
import Paginationq, { generateNo, isImage, noData, toDate, toRp } from "../../../helper";
import ButtonActionCommon from "./ButtonActionCommon";

/**
 * props
 * label      : string    (required)
 * callback   : void    (required)
 * options    : array   (required)
 * isRequired : boolean (optional)
 */

class TableCommon extends Component {
  statusGeneral(val) {
    if (parseInt(val, 10) === 0) {
      return (
        <button className="btn btn-danger btn-sm " style={{ fontSize: "10px" }}>
          Tidak aktif
        </button>
      );
    }
    if (parseInt(val, 10) === 1) {
      return (
        <button className="btn btn-success btn-sm" style={{ fontSize: "10px" }}>
          Aktif
        </button>
      );
    }
  }

  checkTypeLabel(res, val) {
    if (val.isStatus) return this.statusGeneral(res);
    if (val.isCurrency) return toRp(parseFloat(res));
    if (val.isImage) return isImage(res);
    if (val.date) return toDate(res);
    return res;
  }

  render() {
    return (
      <div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                {this.props.head.map((res, index) => {
                  return (
                    <th
                      key={index}
                      className={`text-black middle nowrap ${res.className && res.className}`}
                      width={res.width ? res.width : ""}
                      rowSpan={res.rowSpan ? res.rowSpan : ""}
                      colSpan={res.colSpan ? res.colSpan : ""}
                    >
                      {res.label}
                    </th>
                  );
                })}
              </tr>
              <tr>
                {this.props.rowSpan &&
                  this.props.rowSpan.map((res, index) => {
                    return (
                      <th className={`text-black middle nowrap ${res.className && res.className}`} key={index}>
                        {res.label}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {this.props.renderRow === undefined
                ? typeof this.props.body
                  ? this.props.body.length > 0
                    ? this.props.body.map((res, index) => {
                        return (
                          <tr key={index}>
                            <td className={`text-center middle nowrap`}>{generateNo(index, this.props.meta.current_page)}</td>
                            {this.props.action && (
                              <td className={`text-center middle nowrap`}>
                                <ButtonActionCommon action={this.props.action} callback={(e) => this.props.callback(e, index)} />
                              </td>
                            )}
                            {this.props.label.map((val, key) => {
                              return (
                                <td key={key} className={`middle nowrap ${val.className && val.className}`}>
                                  {this.checkTypeLabel(res[val.label], val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    : noData(this.props.head.length)
                  : noData(this.props.head.length)
                : this.props.renderRow}
            </tbody>
            {this.props.footer && (
              <tfoot style={{ border: "1px solid black" }}>
                {this.props.footer.map((val, key) => {
                  return (
                    <tr key={key} style={{ backgroundColor: "#EEEEEE" }}>
                      {val.data.map((res, index) => {
                        return (
                          <th key={index} colSpan={res.colSpan ? res.colSpan : ""} className={`text-black ${res.className ? res.className : "text-right"}`}>
                            {res.label}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </tfoot>
            )}
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq current_page={this.props.meta.current_page} per_page={this.props.meta.per_page} total={this.props.meta.total} callback={(page) => this.props.callbackPage(page)} />
        </div>
      </div>
    );
  }
}

export default TableCommon;

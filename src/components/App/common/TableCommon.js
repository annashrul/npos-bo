import React, { Component } from "react";
import Select from "react-select";
import Paginationq, { generateNo, noData } from "../../../helper";
import ButtonActionCommon from "./ButtonActionCommon";

/**
 * props
 * label      : string    (required)
 * callback   : void    (required)
 * options    : array   (required)
 * isRequired : boolean (optional)
 */

class TableCommon extends Component {
  constructor(props) {
    super(props);
  }

  isButton(val) {
    if (parseInt(val, 10) === 0) {
      return <button className="btn btn-danger btn-sm">Tidak aktif</button>;
    }
    if (parseInt(val, 10) === 1) {
      return <button className="btn btn-success btn-sm">Aktif</button>;
    }
  }

  render() {
    return (
      <div>
        <div style={{ overflowX: "auto", zoom: "90%" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                {this.props.head.map((res, index) => {
                  return (
                    <th
                      key={index}
                      className={`text-black middle nowrap ${
                        res.className === undefined ? "" : res.className
                      }`}
                      width={res.width === undefined ? "" : res.width}
                      rowSpan={res.rowSpan !== undefined ? res.rowSpan : ""}
                      colSpan={res.colSpan !== undefined ? res.colSpan : ""}
                    >
                      {res.label}
                    </th>
                  );
                })}
              </tr>
              <tr>
                {this.props.isRowSpan &&
                  this.props.rowSpan.map((res, index) => {
                    return (
                      <th
                        className={`text-black middle nowrap ${res.className}`}
                        key={index}
                      >
                        {res.label}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {typeof this.props.body
                ? this.props.body.length > 0
                  ? this.props.body.map((res, index) => {
                      return (
                        <tr key={index}>
                          {this.props.isNo && this.props.isNo !== undefined ? (
                            <td className={`text-center middle nowrap`}>
                              {generateNo(index, this.props.meta.current_page)}
                            </td>
                          ) : (
                            ""
                          )}
                          {this.props.isAction &&
                          this.props.isAction !== undefined ? (
                            <td className={`text-center middle nowrap`}>
                              <ButtonActionCommon
                                action={this.props.action}
                                callback={(e) => this.props.callback(e, index)}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                          {this.props.label.map((val, key) => {
                            return (
                              <td key={key} className={`middle nowrap`}>
                                {val.isButton && val.isButton !== undefined
                                  ? this.isButton(res[val.label])
                                  : res[val.label]}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  : noData(this.props.head.length)
                : noData(this.props.head.length)}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={this.props.meta.current_page}
            per_page={this.props.meta.per_page}
            total={this.props.meta.total}
            callback={(page) => this.props.callbackPage(page)}
          />
        </div>
      </div>
    );
  }
}

export default TableCommon;

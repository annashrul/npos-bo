import React, { Component } from "react";
import Paginationq, {
  generateNo,
  isEmptyOrUndefined,
  isImage,
  noData,
  parseToRp,
  rmSpaceToStrip,
  toDate,
} from "../../../helper";
import { statusGeneral } from "../../../helperStatus";
import ButtonActionCommon from "./ButtonActionCommon";

class TableCommon extends Component {
  checkTypeLabel(res, val) {
    if (val.isStatus) return statusGeneral(res, true);
    if (val.isCurrency) return parseToRp(res !== undefined ? res : 0);
    if (val.isImage) return isImage(res);
    if (val.isSubstring)
      return rmSpaceToStrip(res).length > 30
        ? `${res}`.substr(0, 30) + " .."
        : "-";
    if (val.date) return toDate(res);
    return rmSpaceToStrip(res !== undefined ? res : "");
  }

  render() {
    let props = this.props;
    return (
      <div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                {props.head.map((res, index) => {
                  return (
                    <th
                      style={{
                        backgroundColor:
                          res.colSpan > 1 ? "#EEEEEE" : "transparent",
                      }}
                      key={index}
                      className={`${
                        res.colSpan > 1 && "text-center"
                      } text-black middle nowrap ${
                        res.className ? res.className : ""
                      }`}
                      width={res.width ? res.width : "auto"}
                      rowSpan={res.rowSpan ? res.rowSpan : "1"}
                      colSpan={res.colSpan ? res.colSpan : "1"}
                    >
                      <span>{res.label}</span>
                      {res.checkbox && (
                        <input
                          type="checkbox"
                          style={{ float: "right", alignContent: "center" }}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
              {props.rowSpan && (
                <tr>
                  {props.rowSpan.map((res, index) => {
                    return (
                      <th
                        className={`middle nowrap ${
                          res.className ? res.className : ""
                        }`}
                        key={index}
                      >
                        {res.label}
                      </th>
                    );
                  })}
                </tr>
              )}
            </thead>
            <tbody>
              {props.renderRow === undefined
                ? typeof props.body
                  ? props.body.length > 0
                    ? props.body.map((res, index) => {
                        return (
                          <tr key={index}>
                            {props.meta !== undefined && (
                              <td className={`text-center middle nowrap`}>
                                {generateNo(index, props.meta.current_page)}
                              </td>
                            )}
                            {props.action && (
                              <td className={`text-center middle nowrap`}>
                                <ButtonActionCommon
                                  action={props.action}
                                  callback={(e) => props.callback(e, index)}
                                />
                              </td>
                            )}
                            {props.label.map((val, key) => {
                              return (
                                <td
                                  key={key}
                                  className={`${
                                    val.isCurrency !== undefined && "text-right"
                                  } middle nowrap ${
                                    val.className && val.className
                                  }`}
                                >
                                  {this.checkTypeLabel(res[val.label], val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    : noData(props.head.length)
                  : noData(props.head.length)
                : props.renderRow}
            </tbody>
            {props.footer && (
              <tfoot style={{ border: "1px solid black" }}>
                {props.footer.map((val, key) => {
                  return (
                    <tr
                      key={key}
                      style={{
                        backgroundColor: key === 0 ? "#EEEEEE" : "#b0bec5",
                      }}
                    >
                      {val.data.map((res, index) => {
                        return (
                          <th
                            key={index}
                            colSpan={res.colSpan ? res.colSpan : ""}
                            className={`middle nowrap text-black ${
                              res.className ? res.className : "text-right"
                            }`}
                          >
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

        {props.meta !== undefined && (
          <div style={{ marginTop: "20px", float: "right" }}>
            <Paginationq
              current_page={props.meta.current_page}
              per_page={props.meta.per_page}
              total={props.meta.total}
              callback={(page) => props.callbackPage(page)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TableCommon;

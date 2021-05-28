import { CLOSING, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { to_pdf, toRp } from "../../../../helper";
import moment from "moment";
import { ModalToggle } from "../../modal.action";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
export function setLoading(load) {
  return {
    type: CLOSING.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: CLOSING.LOADING_DETAIL,
    load,
  };
}
export function setCLOSING(data = []) {
  return {
    type: CLOSING.SUCCESS,
    data,
  };
}
export function setClosingPdf(data = []) {
  return {
    type: CLOSING.CLOSING_PDF,
    data,
  };
}

export function setCLOSINGData(data = []) {
  return {
    type: CLOSING.CLOSING_DATA,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: CLOSING.REPORT_SUCCESS,
    data,
  };
}
export function setCode(data = []) {
  return {
    type: CLOSING.SUCCESS_CODE,
    data,
  };
}
export function setPOFailed(data = []) {
  return {
    type: CLOSING.FAILED,
    data,
  };
}

// export function setClosing(data=[]){
//     return {type:CLOSING.SUCCESS,data}
// }
export function setClosingDetail(data = []) {
  return { type: CLOSING.DETAIL, data };
}

export const storeClosing = (data) => {
  return (dispatch) => {
    dispatch(setLoading(true));

    const url = HEADERS.URL + `alokasi`;
    axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          text: `Disimpan dengan nota: ${data.result.insertId}`,
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#ff9800",
          cancelButtonColor: "#2196F3",
          confirmButtonText: "Print Nota?",
          cancelButtonText: "Oke!",
        }).then((result) => {
          if (result.value) {
            const win = window.open("http://google.com", "_blank");
            if (win != null) {
              win.focus();
            }
          }
          destroy("alokasi");
          localStorage.removeItem("lk2");
          localStorage.removeItem("lk");
          localStorage.removeItem("ambil_data");
          localStorage.removeItem("nota");
          localStorage.removeItem("catatan");
          window.location.reload(false);
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};
export const reClosing = (data) => {
  return (dispatch) => {
    const url = HEADERS.URL + `pos/reclosing`;
    axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        dispatch(FetchClosing(1, ""));
        if (data.status === "success") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Success",
            type: "success",
            text: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
      })
      .catch(function (error) {
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });
        if (error.response) {
        }
      });
  };
};
export const postClosing = (data, dataUser) => async (dispatch) => {
  Swal.fire({
    allowOutsideClick: false,
    title: "Please Wait.",
    html: "Checking your account.",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    onClose: () => {},
  });
  axios
    .post(HEADERS.URL + "pos/closing", data)
    .then((res) => {
      setTimeout(function () {
        Swal.close();
        const response = res.data;
        
        if (response.status === "success") {
          dispatch(ModalToggle(false));
          Swal.fire({
            allowOutsideClick: false,
            title: "Transaksi berhasil.",
            text: `Closing berhasil dilakukan`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#ff9800",
            cancelButtonColor: "#2196F3",
            confirmButtonText: "Print Nota?",
            cancelButtonText: "Oke!",
          }).then((result) => {
            if (result.value) {
              
              dispatch(
                FetchClosingPdf(1, `&q=${btoa(response.result.id_setoran)}`)
              );
            }
            // window.location.reload(false);
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
      }, 800);
    })
    .catch(function (error) {
      Swal.fire({
        allowOutsideClick: false,
        title: "failed",
        type: "error",
        text: error.response === undefined ? "error!" : error.response.data.msg,
      });
      if (error.response) {
      }
    });
};

export const FetchClosing = (page = 1, where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Nprogress.start();
    let url = `report/closing?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }
    
    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;
        Nprogress.done();

        dispatch(setCLOSING(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};
export const FetchClosingPdf = (page = 1, where = "") => {
  return (dispatch) => {
    let url = `report/closing?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }
    
    axios
      .get(HEADERS.URL + url)
      .then(function (res) {
        const item = res.data.result.data[0];
        let stringHtml = "";
        stringHtml += `<h3 align="center">${item.kasir} - ${item.nama_toko} ( ${item.kassa} )</h3>`;
        stringHtml += `<h3 align="center">${moment(item.tanggal)
          .locale("id")
          .format("LLLL")}</h3>`;
        const headers = [];
        const body = [
          [``, "", ``, "", "", "", "", "", "", "", ""],
          [
            "Total Sales",
            ":",
            `${toRp(parseInt(item.gross_sales, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Discount Item",
            ":",
            `${toRp(parseInt(item.disc, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Discount Total",
            ":",
            `${toRp(parseInt(item.disc_tr, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Net Omset",
            ":",
            `${toRp(parseInt(item.net_omset, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Tax",
            ":",
            `${toRp(parseInt(item.tax, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Service",
            ":",
            `${toRp(parseInt(item.serv, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Rounding",
            ":",
            `${toRp(parseInt(item.rounding, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Omset",
            ":",
            `${toRp(parseInt(item.net_omset, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "----------------------------------------------------",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Cash",
            ":",
            `${toRp(
              parseInt(item.net_omset, 10) - parseInt(item.setoran_card, 10)
            )}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Piutang",
            ":",
            `${toRp(parseInt(item.piutang, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "EDC Seatle",
            ":",
            `${toRp(parseInt(item.setoran_card, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Debit",
            ":",
            `${toRp(parseInt(item.total_debit, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Kredit",
            ":",
            `${toRp(parseInt(item.total_kredit, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Compliment",
            ":",
            `${toRp(parseInt(item.setoran_compliment, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Point",
            ":",
            `${toRp(parseInt(item.setoran_poin, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "----------------------------------------------------",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "Receive Amount",
            ":",
            `${toRp(parseInt(item.income, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Other Income",
            ":",
            `${toRp(parseInt("0", 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Income",
            ":",
            `${toRp(parseInt(item.income, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "----------------------------------------------------",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "Cash In Hand",
            ":",
            `${toRp(
              parseInt(item.net_omset, 10) -
                parseInt(item.setoran_card, 10) +
                parseInt(item.income, 10)
            )}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "----------------------------------------------------",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],

          [
            "Return",
            ":",
            `${toRp(parseInt(item.total_retur, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Tax",
            ":",
            `${toRp(parseInt(item.tax_retur, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Service",
            ":",
            `${toRp(parseInt(item.service_retur, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Discount",
            ":",
            `${toRp(parseInt(item.disc_retur, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Paid Out",
            ":",
            `${toRp(parseInt(item.kas_keluar, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Outcome",
            ":",
            `${toRp(parseInt(item.outcome, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "----------------------------------------------------",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Total Cash Sales",
            ":",
            `${toRp(parseInt(item.total_cash_sales, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          [
            "Cashier Cash",
            ":",
            `${toRp(parseInt(item.cashier_cash, 10))}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
          ["Status", ":", item.status, "", "", "", "", "", "", "", ""],
          [
            "Note",
            ":",
            item.keterangan ? item.keterangan : "-",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ],
        ];
        
        const footer = [];

        to_pdf("closing", stringHtml, headers, body, footer, false);

        // dispatch(setClosingPdf(re));
      })
      .catch(function (error) {});
  };
};
export const FetchClosingDetail = (
  page = 1,
  code,
  dateFrom = "",
  dateTo = "",
  location = ""
) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let que = "";
    if (dateFrom === "" && dateTo === "" && location === "") {
      que = `report/${code}?page=${page}`;
    }
    if (dateFrom !== "" && dateTo !== "" && location === "") {
      que = `report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
    }
    if (dateFrom !== "" && dateTo !== "" && location !== "") {
      que = `report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
    }
    if (location !== "") {
      que = `report/${code}?page=${page}&lokasi=${location}`;
    }
    axios
      .get(HEADERS.URL + `${que}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setCLOSINGData(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

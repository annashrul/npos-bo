import { SALE, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import moment from "moment";
import { handleDelete, handleGet, handlePost, handlePut } from "../handleHttp";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchCustomerAll } from "redux/actions/masterdata/customer/customer.action";
import { FetchSalesAll } from "redux/actions/masterdata/sales/sales.action";
import {ToastQ} from '../../../helper'

export function setLoading(load) {
  return {
    type: SALE.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: SALE.LOADING_DETAIL,
    load,
  };
}
export function setSale(data = []) {
  return {
    type: SALE.SUCCESS,
    data,
  };
}

export function setSaleData(data = []) {
  return {
    type: SALE.SALE_DATA,
    data,
  };
}
export function setSaleReportData(data = []) {
  return {
    type: SALE.REPORT_DETAIL_SUCCESS,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: SALE.SUCCESS_CODE,
    data,
  };
}

export function setSaleFailed(data = []) {
  return {
    type: SALE.FAILED,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: SALE.REPORT_SUCCESS,
    data,
  };
}
export function setReportExcel(data = []) {
  return {
    type: SALE.REPORT_SUCCESS_EXCEL,
    data,
  };
}
export function setReportFailed(data = []) {
  return {
    type: SALE.REPORT_FAILED,
    data,
  };
}
export function setLoadingReport(load) {
  return {
    type: SALE.REPORT_LOADING,
    load,
  };
}

export function setSaleReturReport(data = []) {
  return { type: SALE.SUCCESS_SALE_RETUR, data };
}

export function setSaleReturReportExcel(data = []) {
  return { type: SALE.SUCCESS_SALE_RETUR_EXCEL, data };
}

export const FetchNotaSale = (lokasi) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `pos/getcode?lokasi=${lokasi}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setCode(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchNotaReceipt = (kd_trx) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Swal.fire({
      title: "Silahkan tunggu.",
      html: "Sedang memproses faktur..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    axios
      .get(HEADERS.URL + `report/penjualan/nota/${kd_trx}`)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        if (data.status === "success") {
          // window.open(data.result.nota, '_blank');
          const win = window.open(data.result.nota, "_blank");
          if (win != null) {
            win.focus();
          }
        } else {
          Swal.fire({
            title: "failed",
            type: "error",
            text: "Gagal mengambil faktur.",
          });
        }
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};
export const storeSale = (data, param) => {
  return (dispatch) => {
    dispatch(setLoading(true));

    Swal.fire({
      allowOutsideClick: false,
      title: "Please Wait.",
      html: "Sending request..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    // const rawdata=data;
    const url = HEADERS.URL + `pos/checkout`;
    axios
      .post(url, data.parsedata)
      .then(function (response) {
        Swal.close();
        const datum = response.data;
        const goSwal=()=>{
          Swal.fire({
            allowOutsideClick: false,
            title: "Transaksi berhasil.",
            type: "info",
            html:
              "<br>" +
              '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>     ' +
              '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>     ' +
              '<button type="button" role="button" tabindex="0" id="btnReprint" class="btn btn-warning">Re-Print</button>'
  
              ,
            showCancelButton: true,
            cancelButtonText: 'Selesai',
            showConfirmButton: false,
          }).then((result) => {
            destroy("sale");
            if (result.dismiss === "cancel") {
              dispatch(ModalToggle(false))
              dispatch(FetchNotaSale(datum.result.lokasi))
              dispatch(FetchCustomerAll(datum.result.lokasi))
              dispatch(FetchSalesAll(datum.result.lokasi))
            }
          });
          document.getElementById("btnReprint").addEventListener("click", () => {
              handlePost(
                "pos/reprint/" + btoa(datum.result.kode),
                [],
                (res,msg,status) => {
                  const data = res.data;
                  ToastQ.fire({
                    icon: "success",
                    title: msg
                  });
                  goSwal();
                }
              );
          });
          document.getElementById("btnNotaPdf").addEventListener("click", () => {
            const win = window.open(datum.result.nota, "_blank");
            if (win != null) {
              win.focus();
            }
          });
          document.getElementById("btnNota3ply").addEventListener("click", () => {
  
            const win = window.open(`/print3ply/${datum.result.kode}`, "_blank");
            if (win != null) {
              win.focus();
            }
            return false;
          });
          
        }
        goSwal();

        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.close();

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

export const FetchReportSale = (page = 1, where = "") => {
  return (dispatch) => {
    let url = `report/arsip_penjualan?page=${page}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setReport(data));
      },
      true
    );
  };
};

export const FetchReportSaleExcel = (where = "", perpage = "") => {
  return (dispatch) => {
    let url = `report/arsip_penjualan?page=1&perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setReportExcel(data));
      },
      true
    );
  };
};

export const FetchReportDetailSale = (kd_trx) => {
  return (dispatch) => {
    handleGet(
      `report/arsip_penjualan/${kd_trx}`,
      (res) => {
        const data = res.data;
        dispatch(setSaleReportData(data));
      },
      true
    );
  };
};

export const deleteReportSale = (id, id_trx) => {
  const kd_trx = btoa(id + "|" + id_trx);
  return (dispatch) => {
    handleDelete(`pos/remove_penjualan/${kd_trx}`, () => {
      let dateFrom = localStorage.getItem("date_from_sale_report");
      let dateTo = localStorage.getItem("date_to_sale_report");
      let where = "";
      if (dateFrom !== undefined && dateFrom !== null) {
        if (where !== "") {
          where += "&";
        }
        where += `datefrom=${dateFrom}&dateto=${dateTo}`;
      } else {
        if (where !== "") {
          where += "&";
        }
        where += `datefrom=${moment(new Date()).format(
          "yyyy-MM-DD"
        )}&dateto=${moment(new Date()).format("yyyy-MM-DD")}`;
      }
      dispatch(FetchReportSale(1, where));
    });
  };
};

export const FetchSaleReturReport = (page = 1, where = "") => {
  return (dispatch) => {
    let url = `report/penjualan/retur?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setSaleReturReport(data));
      },
      true
    );
  };
};

export const FetchSaleReturReportExcel = (
  page = 1,
  where = "",
  perpage = 99999
) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Nprogress.start();
    // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
    let que = `report/penjualan/retur?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      que += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${que}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setSaleReturReportExcel(data));
        dispatch(setLoading(false));
        Nprogress.done();
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};

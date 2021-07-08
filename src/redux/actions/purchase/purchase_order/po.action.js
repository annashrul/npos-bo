import { PO, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleGet, handleGetExport } from "../../handleHttp";
import { ModalToggle } from "../../modal.action";

export function setLoading(load) {
  return {
    type: PO.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: PO.LOADING_DETAIL,
    load,
  };
}
export function setPO(data = []) {
  return {
    type: PO.SUCCESS,
    data,
  };
}

export function setPoData(data = []) {
  return {
    type: PO.PO_DATA,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: PO.SUCCESS_CODE,
    data,
  };
}
export function setNewest(dataNew = []) {
  return {
    type: PO.SUCCESS_NEWEST,
    dataNew,
  };
}

export function setPOFailed(data = []) {
  return {
    type: PO.FAILED,
    data,
  };
}

export function setPoReport(data = []) {
  return { type: PO.SUCCESS, data };
}
export function setPoReportExcel(data = []) {
  return { type: PO.SUCCESS_EXCEL, data };
}
export function setPBSupplierReport(data = []) {
  return { type: PO.SUCCESS_BY_SUPPLIER, data };
}
export function setPBSupplierReportExcel(data = []) {
  return { type: PO.SUCCESS_BY_SUPPLIER_EXCEL, data };
}
export function setPoReportDetail(data = []) {
  return { type: PO.PO_REPORT_DETAIL, data };
}

export const FetchPoReport = (where = "") => {
  return (dispatch) => {
    let url = "purchaseorder/report?status=0";
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        let data = res.data;
        dispatch(setPoReport(data));
      },
      true
    );
  };
};

export const FetchPoData = (nota) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `purchaseorder/ambil_data/${nota}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setPoData(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchNota = (lokasi) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `purchaseorder/getcode?prefix=PO&lokasi=${lokasi}`)
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

export const storePo = (data, param) => {
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
    let rawdata = data;
    const url = HEADERS.URL + `purchaseorder`;
    axios
      .post(url, data.detail)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
            `Disimpan dengan nota: ${data.result.insertId}` +
            "<br><br>" +
            '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          // if (result.value) {
          //     const win = window.open(data.result.nota,'_blank');

          //     if (win != null) {
          //         win.focus();
          //     }
          // }
          destroy("purchase_order");
          localStorage.removeItem("sp");
          localStorage.removeItem("lk");
          if (result.dismiss === "cancel") {
            window.location.reload(false);
          }
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
          const win = window.open(data.result.nota, "_blank");
          if (win != null) {
            win.focus();
          }
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          param({
            pathname: "/po3ply",
            state: {
              data: rawdata,
              nota: data.result.kode,
            },
          });
          //Swal.closeModal();==
          return false;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text: error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};
export const fetchPoReport = (where = "") => {
  return (dispatch) => {
    let url = `purchaseorder/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => dispatch(setPoReport(res.data)), true);
  };
};

export const fetchPoReportExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `purchaseorder/report?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setPoReportExcel(res.data));
        dispatch(ModalToggle(true));
      },
      (percent) => dispatch(setLoading(percent))
      // (percent) => callback(percent)
    );
  };
};

export const poReportDetail = (code, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `purchaseorder/report/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setPoReportDetail(res.data));
        if (isModal) dispatch(ModalToggle(true));
      },
      true
    );
  };
};

export const FetchPurchaseBySupplierReport = (where = "") => {
  return (dispatch) => {
    let url = "report/pembelian/by_supplier";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setPBSupplierReport(res.data)), true);
  };
};

export const FetchPurchaseBySupplierReportExcel = (page = 1, where = "", perpage = 99999) => {
  return (dispatch) => {
    let que = `report/pembelian/by_supplier?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      que += `${where}`;
    }
    handleGet(
      que,
      (res) => {
        let data = res.data;
        dispatch(setPBSupplierReportExcel(data));
      },
      true
    );
  };
};

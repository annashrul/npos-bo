import { PO, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleDelete, handleGet, handleGetExport } from "../../handleHttp";
import { ModalToggle, ModalType } from "../../modal.action";
import { linkPurchaseOrder } from "../../../../helperLink";

export function setDownloadPoSupplier(load) {
  return {
    type: PO.DOWNLOAD_PO_SUPPLIER,
    load,
  };
}
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
        console.log("po code", data);

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
          cancelButtonText: "Selesai",
        }).then((result) => {
          destroy("purchase_order");
          localStorage.removeItem("sp");
          localStorage.removeItem("lk");
          if (result.dismiss === "cancel") {
            param({
              pathname: linkPurchaseOrder,
            });
            // this.props.history.push({ pathname: "/purchase_order" });
            // window.location.reload(false);
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
          Swal.closeModal();
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
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
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

export const poAmbilData = (code) => {
  return (dispatch) => {
    let url = `purchaseorder/ambil_data/${code}`;
    handleGet(
      url,
      (res) => {
        dispatch(setPoReportDetail(res.data));
      },
      true
    );
  };
};

export const FetchPurchaseBySupplierReport = (where = "") => {
  return (dispatch) => {
    let url = `report/pembelian/by_supplier?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setPBSupplierReport(res.data)), true);
  };
};

export const FetchPurchaseBySupplierReportExcel = (
  where = "",
  perpage = 99999
) => {
  return (dispatch) => {
    let url = `report/pembelian/by_supplier?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setPBSupplierReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formPurchaseBySupplierExcel"));
      },
      (res) => dispatch(setDownloadPoSupplier(res))
      // (percent) => callback(percent)
    );
    // handleGet(
    //   url,
    //   (res) => {
    // dispatch(setPBSupplierReportExcel(res.data));
    // dispatch(ModalToggle(true));
    // dispatch(ModalType("formPurchaseBySupplierExcel"));
    //   },
    //   true
    // );
  };
};

export const rePrintFakturPo = (id) => {
  return (dispatch) => {
    Swal.fire({
      title: "Silahkan tunggu.",
      html: "Sedang memproses faktur..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    let url = `purchaseorder/reprint/${btoa(id)}`;

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        if (data.status === "success") {
          console.log(data);
          window.open(data.result.nota, "_blank");
          Swal.fire({
            allowOutsideClick: false,
            title: "Transaksi berhasil.",
            type: "info",
            html:
              `Disimpan dengan nota: ${id}` +
              "<br><br>" +
              '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ',
            showCancelButton: true,
            showConfirmButton: false,
          }).then((result) => {
            if (result.dismiss === "cancel") {
              Swal.close();
            }
          });
          document
            .getElementById("btnNotaPdf")
            .addEventListener("click", () => {
              dispatch(rePrintFakturPo(id));
            });
        } else {
          Swal.fire({
            title: "failed",
            type: "error",
            text: "Gagal mengambil faktur.",
          });
        }
      })
      .catch(function (error) {
        Swal.close();
      });
  };
};

export const deleteReportPo = (kdTrx) => {
  return (dispatch) => {
    handleDelete(`purchaseorder/${kdTrx}`, () => {
      dispatch(fetchPoReport("page=1"));
    });
    // handleDelete()
  };
};

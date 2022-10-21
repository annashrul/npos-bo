import { SCAN_RESI_REPORT, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setSuccess(data = []) {
  return {
      type: SCAN_RESI_REPORT.SUCCESS,
      data,
  };
}

export function setExport(data = []) {
  return {
      type: SCAN_RESI_REPORT.EXPORT,
      data,
  };
}
export function setDetail(data = []) {
  return {
      type: SCAN_RESI_REPORT.DETAIL,
      data,
  };
}

export function setDownload(load) {
  return {
      type: SCAN_RESI_REPORT.DOWNLOAD,
      load,
  };
}
export const FetchScanResiReport = (where="") => {
  return (dispatch) => {
      let url = `scanresi/report`;
      if(where!=="")url+=`?${where}`;
      handleGet(url, (res) => {
          let data = res.data;
          dispatch(setSuccess(data));
      });
  };
};

export const FetchReportDetailScanResi = (kelBrg='',where="",isModal=true) => {
  return (dispatch) => {
      let url = `scanresi/detail`;
      if(where!=="")url+=`?${where}`;
      handleGet(url, (res) => {
          if(isModal){
              dispatch(ModalType("detailSaleByGroupProductReport"));
              dispatch(ModalToggle(true));
          }

          let data = res.data;
          dispatch(setDetail(data));
      });
  };
};

export const FetchScanResiExport = (data, param) => {
  return (dispatch) => {
    // dispatch(setLoading(true));
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
    const url = HEADERS.URL + `scanresi`;
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
              pathname: "/purchase_order",
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
        // dispatch(setLoading(false));
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

// export const deleteReportPo = (kdTrx) => {
//   return (dispatch) => {
//     handleDelete(`purchaseorder/${kdTrx}`, () => {
//       dispatch(fetchPoReport("page=1"));
//     });
//     // handleDelete()
//   };
// };

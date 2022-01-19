import { RETUR_TANPA_NOTA, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { ModalToggle, ModalType } from "../../modal.action";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import { handleGet } from "../../handleHttp";
import { linkReportReceive, linkReturTanpaNota } from "../../../../helperLink";

export function setLoading(load) {
  return {
    type: RETUR_TANPA_NOTA.LOADING,
    load,
  };
}
export function setCode(data = []) {
  return {
    type: RETUR_TANPA_NOTA.SUCCESS_CODE,
    data,
  };
}
export function setDataReport(data = []) {
  return {
    type: RETUR_TANPA_NOTA.GET_REPORT,
    data,
  };
}
export function setDataReportDetail(data = []) {
  return {
    type: RETUR_TANPA_NOTA.GET_REPORT_DETAIL,
    data,
  };
}

export const FetchReportRetur = (where = "") => {
  return (dispatch) => {
    let url = `retur/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        let data = res.data;
        dispatch(setDataReport(data));
      },
      true
    );
  };
};
export const FetchReportDetailRetur = (code, where = "") => {
  return (dispatch) => {
    let url = `retur/report/${code}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        let data = res.data;
        dispatch(setDataReportDetail(data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailReportRetur"));
      },
      true
    );
  };
};

export const storeReturTanpaNota = (data, otherData, param, isModal = false) => {
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
    let rawdata = otherData;
    const url = HEADERS.URL + `retur`;
    axios
      .post(url, data.detail)
      .then(function (response) {
        if (isModal) dispatch(ModalToggle(false));
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
          destroy("retur_tanpa_nota");
          localStorage.removeItem("grand_total");
          localStorage.removeItem("sp");
          localStorage.removeItem("lk");
          if (result.dismiss === "cancel") {
            console.log(isModal);
            if (isModal) {
              dispatch(FetchReport("page=1"));
              param({ pathname: linkReportReceive });
            } else {
              param({ pathname: linkReturTanpaNota });
            }
          }
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
          const win = window.open(data.result.nota, "_blank");
          if (win != null) {
            win.focus();
          }
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          console.log(rawdata);
          param({
            pathname: "/retur3ply",
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
        dispatch(setLoading(false));

        Swal.fire({ allowOutsideClick: false, title: "Failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });

        if (error.response) {
        }
      });
  };
};

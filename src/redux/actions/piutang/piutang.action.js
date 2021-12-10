import { PIUTANG, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
export function setDownload(load) {
  return {
    type: PIUTANG.DOWNLOAD,
    load,
  };
}
export function setLoading(load) {
  return {
    type: PIUTANG.LOADING,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: PIUTANG.LOADING,
    load,
  };
}
export function setPiutang(data = []) {
  return {
    type: PIUTANG.SUCCESS,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: PIUTANG.SUCCESS_CODE,
    data,
  };
}
export function setFailed(data = []) {
  return {
    type: PIUTANG.FAILED,
    data,
  };
}

export function setPiutangReport(data = []) {
  return { type: PIUTANG.SUCCESS_REPORT, data };
}
export function setPiutangReportDetail(data = []) {
  return { type: PIUTANG.SUCCESS_REPORT_DETAIL, data };
}
export function setKartuPiutang(data = []) {
  return { type: PIUTANG.SUCCESS_KARTU_PIUTANG, data };
}

export function setPiutangReportExcel(data = []) {
  return { type: PIUTANG.SUCCESS_EXCEL, data };
}

export const FetchPiutang = (nota) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `piutang/get?nota=${nota}`)
      .then(function (response) {
        const data = response.data;

        dispatch(FetchNotaPiutang(data.result.lokasi));
        dispatch(setPiutang(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error

        dispatch(setLoading(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text: error.response === undefined ? "error!" : error.response.data.msg,
        });
      });
  };
};

export const FetchNotaPiutang = (lokasi) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `piutang/getcode?lokasi=${lokasi}`)
      // axios.get(HEADERS.URL + `piutang/getcode?lokasi=LK/0001`)
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

export const storePiutang = (data, param) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    const url = HEADERS.URL + `piutang/bayar`;
    axios
      .post(url, data)
      .then(function (response) {
        // const data = (response.data);

        dispatch(setLoadingPost(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
            `Data telah disimpan!` +
            "<br><br>" +
            // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          localStorage.removeItem("nota_pembelian_piutang");
          localStorage.removeItem("jenis_trx_piutang");
          if (result.dismiss === "cancel") {
            window.location.reload(false);
          }
        });
        // document.getElementById("btnNotaPdf").addEventListener("click", () => {
        //     const win = window.open(data.result.nota, '_blank');
        //     if (win != null) {
        //         win.focus();
        //     }
        // });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          // param({
          //     pathname: `/bayar_piutang3ply/${response.data.result.insertId}|${data.nota_jual}`,
          // })
          const win = window.open(`/bayar_piutang3ply/${response.data.result.insertId}|${data.nota_jual}`, "_blank");
          if (win != null) {
            win.focus();
          }
          //Swal.closeModal();==
          return false;
        });

        // dispatch(setLoadingPost(false));
        // Swal.fire({allowOutsideClick: false,
        //     title: 'Success',
        //     type: 'success',
        //     text:"Transaksi Berhasil",
        // }).then((result)=>{
        //     localStorage.removeItem("nota_pembelian_piutang");
        //     localStorage.removeItem("jenis_trx_piutang");
        //     window.location.reload();
        // });
      })
      .catch(function (error) {
        dispatch(setLoadingPost(false));
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

//FILTER PIUTANG REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchPiutangReport = (where = "") => {
  return (dispatch) => {
    let url = `piutang/report/detail`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      let data = res.data;
      dispatch(setPiutangReport(data));
    });
  };
};
export const FetchPiutangReportDetail = (page = 1, where = "", id = null) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `piutang/report/${id}?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setPiutangReportDetail(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

//FILTER PIUTANG REPORT EXCEL//
export const FetchPiutangReportExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `piutang/report/detail?perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(setPiutangReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formPiutangExcel"));
      },
      (percent) => dispatch(setDownload(percent))
    );
  };
};

//DELETE PIUTANG REPORT EXCEL//
export const DeletePiutangReport = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `piutang/${id}`;

    axios
      .delete(url)
      .then(function (response) {
        const data = response.data;
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
        dispatch(setLoading(false));
        dispatch(FetchPiutangReport(localStorage.getItem("page_piutang_report") ? localStorage.getItem("page_piutang_report") : 1, localStorage.getItem("where_piutang_report")));
      })
      .catch(function (error) {
        dispatch(setLoading(false));

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
};

export const FetchKartuPiutang = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `piutang/kartu_piutang`;
    if (where !== "") {
      url += `?${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setKartuPiutang(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

import { PRODUKSI, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { setLoadingbrg } from "../masterdata/product/product.action";
import { handleGet, handleGetExport, handlePost } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
import { parseToRp, swal } from "../../../helper";

export function setDownload(load) {
  return { type: PRODUKSI.DOWNLOAD, load };
}
export function setLoading(load) {
  return { type: PRODUKSI.LOADING, load };
}

export function setProduksiPaket(data = []) {
  return { type: PRODUKSI.SUCCESS_PAKET, data };
}
export function setProduksiBahan(data = []) {
  return { type: PRODUKSI.SUCCESS_BAHAN, data };
}

export function setProduksiFailed(data = []) {
  return { type: PRODUKSI.FAILED, data };
}

export function setCodeProduksi(data = []) {
  return { type: PRODUKSI.GET_CODE, data };
}

export function setProduction(data = []) {
  return { type: PRODUKSI.SUCCESS, data };
}

export function setProductionExcel(data = []) {
  return { type: PRODUKSI.SUCCESS_EXCEL, data };
}

export function setProductionData(data = []) {
  return { type: PRODUKSI.SUCCESS_DATA, data };
}

export const FetchCodeProduksi = (lokasi) => {
  return (dispatch) => {
    handleGet(
      `production/getcode?lokasi=${lokasi}`,
      (res) => {
        const data = res.data;
        dispatch(setCodeProduksi(data));
      },
      true
    );
  };
};

export const FetchBrgProduksiBahan = (page = 1, by = "barcode", q = "", lokasi = null, db, perpage = "") => {
  return (dispatch) => {
    let url = `barang/get?isbo=true&page=${page}&kategori=4`;
    if (q !== "") url += `&q=${q}&searchby=${by}`;
    if (lokasi !== null) url += `&lokasi=${lokasi}`;
    if (perpage !== "") url += `&perpage=${perpage}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        if (data.result.data.length === 1) {
          const barang = data.result.data;
          const cek = db(barang[0].kd_brg, barang);
          cek.then((re) => {
            console.log(re);
            dispatch(setProduksiBahan(data));
            dispatch(setLoading(false));
          });
        } else {
          dispatch(setProduksiBahan(data));
          dispatch(setLoading(false));
        }
      },
      true
    );
    // dispatch(setLoading(true));

    // axios
    //   .get(HEADERS.URL + `${url}`)
    //   .then(function (response) {
    //     const data = response.data;
    //     if (data.result.data.length === 1) {
    //       const barang = data.result.data;
    //       console.log(barang);
    //       const cek = db(barang[0].kd_brg, barang);
    //       cek.then((re) => {
    //         dispatch(setProduksiBahan(data));
    //         dispatch(setLoading(false));
    //       });
    //     } else {
    //       dispatch(setProduksiBahan(data));
    //       dispatch(setLoading(false));
    //     }
    //   })
    //   .catch(function (error) {
    //     dispatch(setLoading(false));

    //     Swal.fire({
    //       allowOutsideClick: false,
    //       title: "failed",
    //       type: "error",
    //       // text: error.response === undefined?'error!':error.response.data.msg,
    //     });
    //   });
  };
};
export const FetchBrgProduksiPaket = (page = 1, by = "barcode", q = "", lokasi = null) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `barang/get?isbo=true&page=${page}&kategori=2`;
    if (q !== "") url += `&q=${q}&searchby=${by}`;
    if (lokasi !== null) url += `&lokasi=${lokasi}`;

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setProduksiPaket(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoadingbrg(false));

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          // text: error.response === undefined?'error!':error.response.data.msg,
        });
      });
  };
};

export const storeProduksi = (data, callback) => {
  return (dispatch) => {
    Swal.fire({
      allowOutsideClick: false,
      title: "Please Wait.",
      html: "Sending request..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    dispatch(setLoading(true));
    const url = HEADERS.URL + `production`;
    axios
      .post(url, data)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        destroy("production");
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          html: `<table class="table table-bordered table-hover"><thead><tr><th>Total Hpp</th><th>Qty Estimasi</th><th>Hpp Peritem</th></tr></thead><tbody><tr><td>${parseToRp(
            parseInt(data.result.total_hpp, 10)
          )}</td><td>${parseToRp(data.result.qty_estimasi)}</td><td>${parseToRp(parseInt(data.result.hpp_peritem, 10))}</td></tr></tbody></table>`,
          icon: "success",
          showCancelButton: false,
          cancelButtonColor: "#2196F3",
          cancelButtonText: "Oke!",
        }).then((result) => {
          callback();
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

export const storeApproval = (data, where = "") => {
  return (dispatch) => {
    handlePost(`production/approve`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchProduction(where));
      }
    });
  };
};

export const FetchProduction = (where = "") => {
  return (dispatch) => {
    let url = `production/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setProduction(res.data)), true);
  };
};

export const FetchProductionExcel = (where = "", perpage = 999) => {
  return (dispatch) => {
    let url = `production/report?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setProductionExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formProductionExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};
export const FetchProductionData = (code, where = "", isModal = false) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `production/report/${code}`;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setProductionData(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailProduction"));
        }
      },
      true
    );
  };
};

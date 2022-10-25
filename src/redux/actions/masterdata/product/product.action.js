import { PRODUCT, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { ModalToggle } from "../../modal.action";
import { swal } from "../../../../helper";

export function setLoadingbrg(load) {
  return { type: PRODUCT.LOADING_BRG, load };
}
export function setLoadingDataTrx(load) {
  return { type: PRODUCT.LOADING_DATA_PRODUCT_TRX, load };
}
export function setLoadingbrgAll(load) {
  return { type: PRODUCT.LOADING_BRG_ALL, load };
}
export function setLoadingBrgSale(load) {
  return { type: PRODUCT.LOADING_BRG_SALE, load };
}
export function setProductDetail(data = []) {
  return { type: PRODUCT.DETAIL, data };
}
export function setDataTrx(data = []) {
  return { type: PRODUCT.DATA_PRODUCT_TRX, data };
}
export function setProductbrg(data = []) {
  return { type: PRODUCT.SUCCESS_BRG, data };
}
export function setProductbrgAll(data = []) {
  return { type: PRODUCT.SUCCESS_BRG_ALL, data };
}
export function setProductbrgSale(data = []) {
  return { type: PRODUCT.SUCCESS_BRG_SALE, data };
}
export function setProductEdit(data = []) {
  return { type: PRODUCT.EDIT_PRODUCT, data };
}
export function setProductCode(data = []) {
  return { type: PRODUCT.CODE_PRODUCT, data };
}
export function setLoading(load) {
  return { type: PRODUCT.LOADING, load };
}

export function setProduct(data = []) {
  return { type: PRODUCT.SUCCESS, data };
}

export function setProductFailed(data = []) {
  return { type: PRODUCT.FAILED, data };
}
export function setPersen(data = []) {
  return {
    type: PRODUCT.SUCCESS_PERSEN,
    data,
  };
}
export const FetchProduct = (page = 1, where = "", param = "", db = null) => {
  return (dispatch) => {
    let url = ``;
    if (param === "") {
      if (where !== "") {
        url = `barang?page=${page}&isbo=true&${where}`;
      } else {
        url = `barang?page=${page}&isbo=true`;
      }
    }
    if (param === "sale") {
      if (where !== "") {
        url = `barang?page=${page}&${where}`;
      }
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        if (db !== null) {
          const barang = data.result.data;
          const cek = db(barang[0].kd_brg, barang);
          cek.then((re) => {
            dispatch(setProductbrg(data));
            dispatch(setLoadingbrg(false));
          });
        } else {
          dispatch(setProduct(data));
          dispatch(setLoading(false));
        }
      },
      true
    );
    // Nprogress.start();
    // dispatch(setLoading(true));

    // configure().then(async (api) => {
    //   const response = await api.get(url)
    //   const data = response.data;
    // if (db !== null) {
    //   const barang = data.result.data;
    //   const cek = db(barang[0].kd_brg, barang);
    //   cek.then((re) => {
    //     dispatch(setProductbrg(data));
    //     dispatch(setLoadingbrg(false));
    //   });
    // } else {
    //   dispatch(setProduct(data));
    //   dispatch(setLoading(false));
    // }
    //   Nprogress.done();
    // }).catch(function (error) {
    //   Nprogress.done();
    //   dispatch(setLoading(false));
    //   Swal.fire({
    //     allowOutsideClick: false,
    //     title: "failed",
    //     type: "error",
    //     text:
    //       error.response === undefined ? "error!" : error.response.data.msg,
    //   });
    // });
  };
};

export const createProduct = (data, callback) => {
  return (dispatch) => {
    handlePost("barang", data, (res, msg, status) => {
      swal(msg);
      callback(status);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchProduct(1, "", ""));
      } else {
        dispatch(ModalToggle(true));
      }
    });
    // dispatch(setLoading(true));
    // const url = HEADERS.URL + `barang`;
    // axios
    //   .post(url, data)
    //   .then(function (response) {
    //     const data = response.data;

    //     if (data.status === "success") {
    //       Swal.fire({
    //         allowOutsideClick: false,
    //         title: "Success",
    //         icon: "success",
    //         text: data.msg,
    //       });
    //     } else {
    //       Swal.fire({
    //         allowOutsideClick: false,
    //         title: "failed",
    //         icon: "error",
    //         text: data.msg,
    //       });
    //     }
    //     dispatch(setLoading(false));
    //     dispatch(FetchProduct(1, "", ""));
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     dispatch(setLoading(false));

    //     Swal.fire({
    //       allowOutsideClick: false,
    //       title: "failed",
    //       icon: "error",
    //       text:
    //         error.response === undefined ? "error!" : error.response.data.msg,
    //     });
    //     if (error.response) {
    //     }
    //   });
  };
};

export const deleteProduct = (id) => {
  return (dispatch) => {
    handleDelete(`barang/${btoa(id)}`, () => {
      dispatch(FetchProduct(1, ""));
    });
  };
};

export const FetchBrg = (
  page = 1,
  by = "barcode",
  q = "",
  lokasi = null,
  supplier = null,
  db,
  perpage = ""
) => {
  return (dispatch) => {
    dispatch(setLoadingbrg(true));
    let url = `barang/get?isbo=true&page=${page}`;
    if (q !== "") url += `&q=${btoa(q)}&searchby=${by}`;
    if (lokasi !== null) url += `&lokasi=${lokasi}`;
    if (supplier !== null) url += `&supplier=${supplier}`;
    // if(supplier!==null) url+=`&supplier=${supplier}`;
    if (perpage !== "") url += `&perpage=${perpage}`;

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        if (data.result.data.length === 1) {
          const barang = data.result.data;
          const cek = db(barang[0].kd_brg, barang);
          cek.then((res) => {
            dispatch(setProductbrg(data));
            dispatch(setLoadingbrg(false));
          });
        } else {
          dispatch(setProductbrg(data));
          dispatch(setLoadingbrg(false));
        }
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
export const FetchBrgAll = (lokasi) => {
  return (dispatch) => {
    Swal.fire({
      allowOutsideClick: false,
      title: "Mengambil data barang.",
      html: "Lamanya proses bergantung pada banyaknya data barang, jangan tutup halaman hingga proses selesai.",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    dispatch(setLoadingbrgAll(true));
    let url = `barang/getAll`;
    if (lokasi !== null) url += `?lokasi=${lokasi}`;

    axios
      .get(HEADERS.URL + `${url}`, {
        onDownloadProgress: (progressEvent) => {
          const total = parseFloat(progressEvent.total);
          const current = parseFloat(progressEvent.loaded);
          let percentCompleted = Math.floor((current / total) * 100);
          dispatch(setPersen(percentCompleted));
        },
      })
      .then(function (response) {
        const data = response.data;
        dispatch(setProductbrgAll(data));
        dispatch(setLoadingbrgAll(false));
        dispatch(setPersen(0));
        if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: data.msg,
          });
        } else {
          Toast.fire({
            icon: "error",
            title: data.msg,
          });
        }
        // Swal.close()
      })
      .catch(function (error) {
        dispatch(setLoadingbrgAll(false));
        Swal.close();

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          // text: error.response === undefined?'error!':error.response.data.msg,
        });
      });
  };
};

export const FetchBrgSame = (
  page = 1,
  by = "barcode",
  q = "",
  lokasi = null,
  supplier = null,
  db,
  perpage
) => {
  return (dispatch) => {
    dispatch(setLoadingbrg(true));
    let url = `barang?page=${page}`;
    if (lokasi !== null) url += `&lokasi=${lokasi}`;

    if (perpage !== undefined) {
    }
    if (perpage !== undefined) url += `&perpage=${perpage}`;
    // if(perpage!==null||perpage!==''||perpage!==undefined||perpage!=='undefined'||isNaN(perpage)) url+=`&perpage=${perpage}`;
    if (q !== "") url += `&q=${btoa(q)}&searchby=${by}`;
    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        if (data.result.data.length === 1) {
          const barang = data.result.data;
          const cek = db(barang[0].kd_brg, barang);
          cek.then((re) => {
            dispatch(setProductbrg(data));
            dispatch(setLoadingbrg(false));
          });
        } else {
          dispatch(setProductbrg(data));
          dispatch(setLoadingbrg(false));
        }
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

export const FetchProductEdit = (kode) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `barang/update/${btoa(kode)}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setProductEdit(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text: error.msg,
        });
      });
  };
};

export const updateProduct = (id, data, callback) => {
  return (dispatch) => {
    handlePut(`barang/${btoa(id)}`, data, (res, msg, status) => {
      swal(msg);
      console.log("status", status);
      // callback(status);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchProduct(1, "", ""));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

export const FetchProductDetail = (kode) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `barang/${btoa(kode)}?isbo=true`)
      .then(function (response) {
        const data = response.data;

        dispatch(setProductDetail(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });
      });
  };
};

// export const FetchProductCode = ()=>{
//     return (dispatch) => {
//         // dispatch(setLoading(true));
//         axios.get(HEADERS.URL+`barang/code`)
//             .then(function(response){
//                 const data = response.data;
//                 dispatch(setProductCode(data));
//                 // dispatch(setLoading(false));
//             }).catch(function(error){

//             dispatch(setLoading(false));

//         })
//     }
// }

export const FetchProductSale = (page = 1, where, param = "", db) => {
  return (dispatch) => {
    dispatch(setLoadingBrgSale(true));
    let url = ``;
    if (param === "sale") {
      if (where !== "") {
        url = `barang?page=${page}&${where}`;
      } else {
        url = `barang?page=${page}`;
      }
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        if (data.result.data.length === 1) {
          const barang = data.result.data;
          const cek = db(barang[0].kd_brg, barang);

          cek.then((re) => {
            dispatch(setProductbrgSale(data));
            dispatch(setLoadingBrgSale(false));
          });
        } else {
          dispatch(setProductbrgSale(data));
          dispatch(setLoadingBrgSale(false));
        }
      })
      .catch(function (error) {
        dispatch(setLoadingBrgSale(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });
      });
  };
};

export const readProductTrx = (where = "", callback) => {
  let url = `barang/get?isbo=true`;
  if (where !== "") url += `&${where}`;

  return (dispatch) => {
    dispatch(setLoadingDataTrx(true));
    handleGet(
      url,
      (res) => {
        const data = res.data;
        if (data.result.data.length === 1) {
          const barang = data.result.data;
          callback(barang);
          dispatch(setDataTrx(data));
        } else {
          dispatch(setDataTrx(data));
        }
        dispatch(setLoadingDataTrx(false));
      },
      true
    );
  };
};

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

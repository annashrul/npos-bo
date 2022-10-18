import { PROMO } from "../../_constants";

import { handleGet, handlePost, handlePut, handleDelete } from "../../handleHttp";
import { swal } from "../../../../helper";

import { ModalToggle } from "../../modal.action";

export function setLoading(load) {
  return { type: PROMO.LOADING, load };
}
export function setPromo(data = []) {
  return { type: PROMO.SUCCESS, data };
}
export function setPromoBrg1(data = []) {
  return { type: PROMO.SUCCESS_BRG1, data };
}
export function setPromoBrg2(data = []) {
  return { type: PROMO.SUCCESS_BRG2, data };
}
export function setPromoKategori(data = []) {
  return { type: PROMO.SUCCESS_KATEGORI, data };
}
export function setPromoDetail(data = []) {
  return { type: PROMO.DETAIL, data };
}
export function setPromoFailed(data = []) {
  return { type: PROMO.FAILED, data };
}
const baseUrl = "promo";
export const FetchPromo = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setPromo(res.data)), true);
  };
};
export const FetchPromoDetail = (id) => {
  return (dispatch) => {
    let url = `${baseUrl}/${id}`;
    handleGet(
      url,
      (res) => {
        dispatch(setPromoDetail(res.data));
        dispatch(ModalToggle(true));
      },
      true
    );
  };
};
export const FetchPromoKategori = () => {
  return (dispatch) => {
    let url = `${baseUrl}/category`;
    handleGet(url, (res) => dispatch(setPromoKategori(res.data)), true);
  };
};
export const createPromo = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchPromo("page=1"));
      }
    });
  };
};
export const updatePromo = (id, data) => {
  return (dispatch) => {
    handlePut(`${baseUrl}/${id}`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchPromo("page=1"));
      }
    });
  };
};
export const deletePromo = (id) => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${id}`, () => {
      dispatch(FetchPromo("page=1"));
    });
  };
};

export const FetchBrg1 = (page = 1, perpage = 10, where = "") => {
  return (dispatch) => {
    let url = `barang?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGet(url, (res) => dispatch(setPromoBrg1(res.data)), true);
  };
};
export const FetchBrg2 = (page = 1, perpage = 10, where = "") => {
  return (dispatch) => {
    let url = `barang?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGet(url, (res) => dispatch(setPromoBrg2(res.data)), true);
  };
};

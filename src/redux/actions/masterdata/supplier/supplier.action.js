import { SUPPLIER } from "../../_constants";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";
const baseUrl = "supplier";
export function setLoading(load) {
  return { type: SUPPLIER.LOADING, load };
}

export function setSupplier(data = []) {
  return { type: SUPPLIER.SUCCESS, data };
}
export function setSupplierAll(data = []) {
  return { type: SUPPLIER.ALL, data };
}
export function setSupplierFailed(data = []) {
  return { type: SUPPLIER.FAILED, data };
}

export const FetchSupplier = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setSupplier(data));
      },
      true
    );
  };
};
export const FetchSupplierAll = () => {
  return (dispatch) => {
    handleGet(
      baseUrl + "?page=1&perpage=9999999",
      (res) => {
        const data = res.data;
        dispatch(setSupplierAll(data));
      },
      true
    );
  };
};

export const createSupplier = (data, fastAdd = false, where = "") => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (fastAdd) dispatch(FetchSupplierAll());
      dispatch(FetchSupplier(where));
    });
  };
};

export const updateSupplier = (id, data, where = "") => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      dispatch(FetchSupplier(where));
    });
  };
};

export const deleteSupplier = (id, where) => {
  return (dispatch) => {
    handleDelete(baseUrl + "/" + id, () => {
      if (where.total === 1) dispatch(FetchSupplier("page=1"));
      dispatch(FetchSupplier(where.where));
    });
  };
};

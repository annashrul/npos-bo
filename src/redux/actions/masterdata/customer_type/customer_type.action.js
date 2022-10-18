import { CUSTOMER_TYPE } from "../../_constants";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { ModalToggle } from "../../modal.action";
import { swal } from "../../../../helper";

const baseUrl = "customerType";

export function setLoading(load) {
  return { type: CUSTOMER_TYPE.LOADING, load };
}

export function setCustomerType(data = []) {
  return { type: CUSTOMER_TYPE.SUCCESS, data };
}
export function setCustomerTypeAll(data = []) {
  return { type: CUSTOMER_TYPE.ALL, data };
}
export function setCustomerTypeFailed(data = []) {
  return { type: CUSTOMER_TYPE.FAILED, data };
}

export const FetchCustomerType = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCustomerType(data));
      },
      true
    );
  };
};

export const FetchCustomerTypeAll = () => {
  return (dispatch) => {
    let url = baseUrl + "?page=1&perpage=100";
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCustomerTypeAll(data));
      },
      true
    );
  };
};

export const createCustomerType = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCustomerType("page=1"));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};
export const updateCustomerType = (id, data, where = "page=1") => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCustomerType(where));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};
export const deleteCustomerType = (id, detail) => {
  return (dispatch) => {
    handleDelete(baseUrl + "/" + id, () => {
      if (detail.total === 1) {
        dispatch(FetchCustomerType("page=1"));
      } else {
        dispatch(FetchCustomerType(detail.where));
      }
    });
  };
};

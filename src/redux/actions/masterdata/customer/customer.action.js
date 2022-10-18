import { CUSTOMER } from "../../_constants";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { swal, ToastQ } from "../../../../helper";
import { ModalToggle } from "../../modal.action";

const baseUrl = "customer";

export function setLoading(load) {
  return { type: CUSTOMER.LOADING, load };
}
export function setCustomerEdit(data = []) {
  return { type: CUSTOMER.EDIT, data };
}
export function setCustomer(data = []) {
  return { type: CUSTOMER.SUCCESS, data };
}
export function setCustomerAll(data = []) {
  return { type: CUSTOMER.ALL, data };
}
export function setCustomerPrice(data = []) {
  return { type: CUSTOMER.LIST_PRICE, data };
}
export function setCustomerFailed(data = []) {
  return { type: CUSTOMER.FAILED, data };
}

export const FetchCustomer = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCustomer(data));
      },
      true
    );
  };
};
export const FetchCustomerAll = (lok) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let w = "";
    if (lok !== "") {
      w += `&lokasi=${lok}`;
    }
    handleGet(
      `customer?page=1&perpage=999${w}`,
      (res) => {
        const data = res.data;
        dispatch(setCustomerAll(data));
      },
      true
    );
  };
};

export const FetchCustomerEdit = (id) => {
  return (dispatch) => {
    handleGet(
      `${baseUrl}/${id}`,
      (res) => {
        const data = res.data;
        dispatch(setCustomerEdit(data));
      },
      true
    );
  };
};

export const createCustomer = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCustomer("page=1"));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

export const updateCustomer = (id, data) => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCustomer("page=1"));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};
export const deleteCustomer = (id, detail) => {
  return (dispatch) => {
    handleDelete(baseUrl + "/" + id, () => {
      if (detail.total === 1) {
        dispatch(FetchCustomer("page=1"));
      } else {
        dispatch(FetchCustomer(detail.where));
      }
    });
  };
};

export const FetchCustomerPrice = (kode, page = 1, q = "") => {
  return (dispatch) => {
    let url = "";
    if (q === "") {
      url = `customer/harga/${kode}?page=${page}`;
    } else {
      url = `customer/harga/${kode}?page=${page}&q=${q}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCustomerPrice(data));
      },
      true
    );
  };
};

export const saveCustomerPrice = (data) => {
  return (dispatch) => {
    handlePost(baseUrl + "/harga", data, (res, msg, status) => {
      if (status) {
        ToastQ.fire({
          icon: "success",
          title: msg,
        });
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

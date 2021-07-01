import { BANK } from "../../_constants";
import { handleGet, handlePost, handlePut, handleDelete } from "../../handleHttp";
import { swal } from "../../../../helper";

import { ModalToggle } from "../../modal.action";

export function setLoading(load) {
  return { type: BANK.LOADING, load };
}

export function setBank(data = []) {
  return { type: BANK.SUCCESS, data };
}
export function setBankFailed(data = []) {
  return { type: BANK.FAILED, data };
}
const baseUrl = "bank";
export const FetchBank = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setBank(res.data));
      },
      true
    );
  };
};

export const createBank = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchBank("page=1"));
      }
    });
  };
};
export const updateBank = (id, data) => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchBank("page=1"));
      }
    });
  };
};

export const deleteBank = (id) => {
  return (dispatch) => {
    handleDelete(baseUrl + "/" + id, () => {
      dispatch(FetchBank("page=1"));
    });
  };
};

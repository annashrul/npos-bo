import { RAK } from "../../_constants";
import { handleGet, handlePost, handlePut, handleDelete } from "../../handleHttp";
import { swal } from "../../../../helper";

import { ModalToggle } from "../../modal.action";

export function setLoading(load) {
  return { type: RAK.LOADING, load };
}

export function setRak(data = []) {
  return { type: RAK.SUCCESS, data };
}
export function setRakFailed(data = []) {
  return { type: RAK.FAILED, data };
}
const baseUrl = "rak";
export const FetchRak = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setRak(res.data));
      },
      true
    );
  };
};

export const createRak = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        // dispatch(ModalToggle(false));
        dispatch(FetchRak("page=1"));
      }
    });
  };
};
export const updateRak = (id, data) => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchRak("page=1"));
      }
    });
  };
};

export const deleteRak = (id) => {
  return (dispatch) => {
    handleDelete(baseUrl + "/" + id, () => {
      dispatch(FetchRak("page=1"));
    });
  };
};

import { USER_LEVEL } from "../../_constants";
import { ModalToggle } from "../../modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";

export function setLoading(load) {
  return { type: USER_LEVEL.LOADING, load };
}

export function setUserLevel(data = []) {
  return { type: USER_LEVEL.SUCCESS, data };
}
export function setUserLevelFailed(data = []) {
  return { type: USER_LEVEL.FAILED, data };
}
export const getUserLevel = (where = "") => {
  return (dispatch) => {
    let url = `userLevel`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setUserLevel(res.data)));
  };
};

export const createUserLevel = (data, callback) => {
  return (dispatch) => {
    handlePost("userLevel", data, (res, msg, status) => {
      swal(msg);
      let showModal = false;
      if (status) {
        dispatch(getUserLevel("page=1"));
      } else {
        showModal = true;
      }
      dispatch(ModalToggle(showModal));
      callback(showModal);
    });
  };
};

export const updateUserLevel = (id, data, callback) => {
  return (dispatch) => {
    handlePut(`userLevel/${id}`, data, (res, msg, status) => {
      swal(msg);
      let showModal = false;
      if (status) {
        dispatch(getUserLevel("page=1"));
      } else {
        showModal = true;
      }
      dispatch(ModalToggle(showModal));
      callback(showModal);
    });
  };
};

export const deleteUserLevel = (id) => {
  return (dispatch) => {
    handleDelete(`userLevel/${id}`, () => {
      dispatch(getUserLevel("page=1"));
    });
  };
};

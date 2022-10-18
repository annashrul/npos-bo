import { USER_LIST } from "../../_constants";
import { ModalToggle, ModalType } from "../../modal.action";
import { handleDelete, handleGet, handlePut, handlePost } from "../../handleHttp";
import { swal } from "../../../../helper";

export function setLoading(load) {
  return {
    type: USER_LIST.LOADING,
    load,
  };
}

export function setUserList(data = []) {
  return {
    type: USER_LIST.SUCCESS,
    data,
  };
}

export function setUserListEdit(data = []) {
  return {
    type: USER_LIST.EDIT,
    data,
  };
}
export function setUserListDetail(data = []) {
  return {
    type: USER_LIST.DETAIL,
    data,
  };
}

export function setUserListFailed(data = []) {
  return {
    type: USER_LIST.FAILED,
    data,
  };
}

export const getUserList = (where = "") => {
  return (dispatch) => {
    let url = `user`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setUserList(res.data)));
  };
};

export const sendUserList = (data) => {
  return (dispatch) => {
    handlePost("user", data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(getUserList("page=1"));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

export const updateUserList = (id, data) => {
  return (dispatch) => {
    handlePut(`user/${id}`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(getUserList("page=1"));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

export const deleteUserList = (id) => {
  return (dispatch) => {
    handleDelete(`user/${id}`, () => {
      dispatch(getUserList("page=1"));
    });
  };
};

export const FetchUserListEdit = (id) => {
  return (dispatch) => {
    let url = `user/${id}`;
    handleGet(url, (res) => {
      dispatch(ModalToggle(true));
      dispatch(ModalType("formUserList"));
      dispatch(setUserListEdit(res.data));
    });
  };
};

export const FetchUserListDetail = (id) => {
  return (dispatch) => {
    let url = `user/${id}`;
    handleGet(url, (res) => {
      dispatch(ModalToggle(true));
      dispatch(ModalType("detailUserList"));
      dispatch(setUserListDetail(res.data));
    });
  };
};

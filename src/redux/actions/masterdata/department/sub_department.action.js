import { SUB_DEPT } from "../../_constants";

import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";
import { ModalToggle } from "../../modal.action";

const baseUrl = "group2";

export function setLoading(load) {
  return { type: SUB_DEPT.LOADING, load };
}

export function setSubDepartment(data = []) {
  return { type: SUB_DEPT.SUCCESS, data };
}
export function setSubDepartmentAll(data = []) {
  return { type: SUB_DEPT.ALL, data };
}
export function setSubDepartmentFailed(data = []) {
  return { type: SUB_DEPT.FAILED, data };
}
export const FetchSubDepartment = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setSubDepartment(res.data)), true);
  };
};

export const FetchSubDepartmentAll = () => {
  return (dispatch) => {
    let url = `${baseUrl}?page=1&perpage=999999`;
    handleGet(
      url,
      (res) => {
        dispatch(setSubDepartmentAll(res.data));
        dispatch(ModalToggle(true));
      },
      true
    );
  };
};

export const createSubDepartment = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchSubDepartment("page=1"));
      }
    });
  };
};

export const updateSubDepartment = (id, data) => {
  const newData = data;
  delete newData.where;
  return (dispatch) => {
    handlePut(`${baseUrl}/${id}`, newData, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchSubDepartment(data.where));
      }
    });
  };
};

export const deleteSubDepartment = (data) => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${data.kode}`, () => {
      dispatch(FetchSubDepartment(data.where));
    });
  };
};

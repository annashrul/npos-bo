import { DEPT } from "../../_constants";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";
import { ModalToggle } from "../../modal.action";

const baseUrl = "departement";

export function setLoading(load) {
  return { type: DEPT.LOADING, load };
}

export function setDepartment(data = []) {
  return { type: DEPT.SUCCESS, data };
}
export function setAllDepartment(data = []) {
  return { type: DEPT.ALL, data };
}
export function setDepartmentFailed(data = []) {
  return { type: DEPT.FAILED, data };
}

export const FetchDepartment = (where = "", clearCache=false) => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        console.log("FetchDepartment",data);

        dispatch(setDepartment(data));
      },
      true,
      clearCache
    );
  };
};

export const createDepartment = (data) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchDepartment("page=1", true));
      }
    });
  };
};

export const updateDepartment = (id, data) => {
  const newData = data;
  delete newData.where;
  return (dispatch) => {
    handlePut(`${baseUrl}/${id}`, newData, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchDepartment(data.where,true));
      }
    });
  };
};

export const deleteDepartment = (data) => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${data.id}`, () => {
      dispatch(FetchDepartment(data.where));
    });
  };
};

export const FetchAllDepartment = () => {
  return (dispatch) => {
    handleGet(
      `${baseUrl}?page=1&perpage=10000`,
      (res) => {
        dispatch(setAllDepartment(res.data));
        dispatch(ModalToggle(true));
      },
      true
    );
  };
};

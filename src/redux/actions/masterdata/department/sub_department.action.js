import { SUB_DEPT, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
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
    Nprogress.start();
    dispatch(setLoading(true));
    let url = "group2";
    if (where !== "") {
      url += `?${where}`;
    }
    // if(q===''){
    //     url = `group2?page=${page}`;
    // }else{
    //     url = `group2?page=${page}&q=${q}`;
    // }
    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          dispatch(setSubDepartment(data));
        }

        dispatch(setLoading(false));
        Nprogress.done();
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};

export const FetchSubDepartmentAll = () => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `group2?page=1&perpage=999999`)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          dispatch(setSubDepartmentAll(data));
        }

        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const createSubDepartment = (data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `group2`;

    axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;

        if (data.status === "success") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Success",
            type: "success",
            text: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
        dispatch(setLoading(false));
        dispatch(FetchSubDepartment(1, ""));
      })
      .catch(function (error) {
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};

export const updateSubDepartment = (id, data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `group2/${id}`;

    axios
      .put(url, data)
      .then(function (response) {
        const data = response.data;

        if (data.status === "success") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Success",
            type: "success",
            text: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
        dispatch(setLoading(false));
        dispatch(FetchSubDepartment(1, ""));
      })
      .catch(function (error) {
        // handle error
        dispatch(setLoading(false));

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });
        if (error.response) {
        }
      });
  };
};

export const deleteSubDepartment = (id, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `group2/${id}`;

    axios
      .delete(url)
      .then(function (response) {
        const data = response.data;

        if (data.status === "success") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Success",
            type: "success",
            text: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
        dispatch(setLoading(false));
        dispatch(FetchSubDepartment(1, ""));
      })
      .catch(function (error) {
        dispatch(setLoading(false));

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });
        if (error.response) {
        }
      });
  };
};

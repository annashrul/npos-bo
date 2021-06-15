import { GROUP_PRODUCT, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";

export function setLoading(load) {
  return { type: GROUP_PRODUCT.LOADING, load };
}

export function setGroupProduct(data = []) {
  return { type: GROUP_PRODUCT.SUCCESS, data };
}
export function setGroupProductFailed(data = []) {
  return { type: GROUP_PRODUCT.FAILED, data };
}
export const FetchGroupProduct = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = "kelompokBrg";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setGroupProduct(data));
      },
      true
    );
  };
};

export const createGroupProduct = (data, fastAdd = false) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `kelompokBrg`;
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
        if (fastAdd) {
          dispatch(FetchGroupProduct(1, "", 9999));
        } else {
          dispatch(
            FetchGroupProduct(
              localStorage.getItem("page_group_product")
                ? localStorage.getItem("page_group_product")
                : 1,
              ""
            )
          );
        }
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
export const updateGroupProduct = (id, data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `kelompokBrg/${id}`;
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
        dispatch(
          FetchGroupProduct(
            localStorage.getItem("page_group_product")
              ? localStorage.getItem("page_group_product")
              : 1,
            ""
          )
        );
      })
      .catch(function (error) {
        // handle error
        dispatch(setLoading(false));

        // Swal.fire({allowOutsideClick: false,
        //     title: 'failed',
        //     type: 'error',
        //     text: error.response === undefined?'error!':error.response.data.msg,
        // });
        if (error.response) {
        }
      });
  };
};
export const deleteGroupProduct = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `kelompokBrg/${id}`;
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
        dispatch(
          FetchGroupProduct(
            localStorage.getItem("page_group_product")
              ? localStorage.getItem("page_group_product")
              : 1,
            ""
          )
        );
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

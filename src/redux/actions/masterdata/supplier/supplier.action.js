import { SUPPLIER, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
export function setLoading(load) {
  return { type: SUPPLIER.LOADING, load };
}

export function setSupplier(data = []) {
  return { type: SUPPLIER.SUCCESS, data };
}
export function setSupplierAll(data = []) {
  return { type: SUPPLIER.ALL, data };
}
export function setSupplierFailed(data = []) {
  return { type: SUPPLIER.FAILED, data };
}

export const FetchSupplier = (page = 1, q = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Nprogress.start();

    let url = "";
    if (q === "") {
      url = `supplier?page=${page}`;
    } else {
      url = `supplier?page=${page}&q=${q}`;
    }

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;

        dispatch(setSupplier(data));
        dispatch(setLoading(false));
        Nprogress.done();
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};
export const FetchSupplierAll = () => {
  return (dispatch) => {
    dispatch(setLoading(true));

    axios
      .get(HEADERS.URL + `supplier?page=1&perpage=9999999`)
      .then(function (response) {
        const data = response.data;

        dispatch(setSupplierAll(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const createSupplier = (data, token, fastAdd=false) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `supplier`;

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
          dispatch(FetchSupplierAll());
        } else {
          dispatch(
            FetchSupplier(
              localStorage.getItem("page_supplier")
                ? localStorage.getItem("page_supplier")
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
export const updateSupplier = (id, data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `supplier/${id}`;

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
          FetchSupplier(
            localStorage.getItem("page_supplier")
              ? localStorage.getItem("page_supplier")
              : 1,
            ""
          )
        );
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
export const deleteSupplier = (id, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `supplier/${id}`;

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
          FetchSupplier(
            localStorage.getItem("page_supplier")
              ? localStorage.getItem("page_supplier")
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

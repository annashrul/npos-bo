import { SALES, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
export function setLoading(load) {
  return { type: SALES.LOADING, load };
}

export function setSales(data = []) {
  return { type: SALES.SUCCESS, data };
}
export function setSalesAll(data = []) {
  return { type: SALES.ALL, data };
}
export function setSalesFailed(data = []) {
  return { type: SALES.FAILED, data };
}

export const FetchSales = (page = 1, q = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Nprogress.start();
    let url = "";
    if (q === "") {
      url = `sales?page=${page}`;
    } else {
      url = `sales?page=${page}&q=${q}`;
    }

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;

        dispatch(setSales(data));
        dispatch(setLoading(false));
        Nprogress.done();
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};
export const FetchSalesAll = (lok) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let w = "";
    if (lok !== "") {
      w += `&lokasi=${lok}`;
    }

    axios
      .get(HEADERS.URL + `sales?page=1&perpage=1000${w}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setSalesAll(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const createSales = (data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `sales`;

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
        dispatch(
          FetchSales(
            localStorage.getItem("page_sales")
              ? localStorage.getItem("page_sales")
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
export const updateSales = (id, data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `sales/${id}`;

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
          FetchSales(
            localStorage.getItem("page_sales")
              ? localStorage.getItem("page_sales")
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
export const deleteSales = (id, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `sales/${id}`;

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
          FetchSales(
            localStorage.getItem("page_sales")
              ? localStorage.getItem("page_sales")
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

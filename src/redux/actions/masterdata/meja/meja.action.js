import { MEJA, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { ModalToggle } from "redux/actions/modal.action";

export function setLoading(load) {
  return { type: MEJA.LOADING, load };
}

export function setMeja(data = []) {
  return { type: MEJA.SUCCESS, data };
}
export function setMejaAll(data = []) {
  return { type: MEJA.ALL, data };
}
export function setMejaFailed(data = []) {
  return { type: MEJA.FAILED, data };
}

export const FetchMeja = (page = 1, q = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));

    let url = "";
    if (q === "") {
      url = `meja?page=${page}`;
    } else {
      url = `meja?page=${page}&q=${q}`;
    }

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;

        dispatch(setMeja(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};
export const FetchMejaAll = () => {
  return (dispatch) => {
    dispatch(setLoading(true));

    axios
      .get(HEADERS.URL + `meja?page=1&perpage=100`)
      .then(function (response) {
        const data = response.data;

        dispatch(setMejaAll(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const createMeja = (data) => {
  return (dispatch) => {
    console.log(data);
    dispatch(setLoading(true));
    const url = HEADERS.URL + `meja`;

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
          dispatch(ModalToggle(false));
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
          dispatch(ModalToggle(true));
        }
        dispatch(setLoading(false));
        dispatch(
          FetchMeja(
            localStorage.getItem("page_meja")
              ? localStorage.getItem("page_meja")
              : 1,
            ""
          )
        );
      })
      .catch(function (error) {
        dispatch(ModalToggle(true));
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
export const updateMeja = (id, data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `meja/${id}`;

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
          FetchMeja(
            localStorage.getItem("page_meja")
              ? localStorage.getItem("page_meja")
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
export const deleteMeja = (id, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `meja/${id}`;

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
          FetchMeja(
            localStorage.getItem("page_meja")
              ? localStorage.getItem("page_meja")
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

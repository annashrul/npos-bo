import { MEJA, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { ModalToggle } from "redux/actions/modal.action";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { swal } from "../../../../helper";

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
    let url = "";
    if (q === "") {
      url = `meja?page=${page}`;
    } else {
      url = `meja?page=${page}&q=${q}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setMeja(data));
      },
      true
    );
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
    const url = `meja`;
    handlePost(url, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
      } else {
        dispatch(ModalToggle(true));
      }
      dispatch(
        FetchMeja(
          localStorage.getItem("page_meja")
            ? localStorage.getItem("page_meja")
            : 1,
          ""
        )
      );
    });
  };
};
export const updateMeja = (id, data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `meja/${id}`;
    handlePut(url, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(
          FetchMeja(
            localStorage.getItem("page_meja")
              ? localStorage.getItem("page_meja")
              : 1,
            ""
          )
        );
      }
    });
  };
};
export const deleteMeja = (id) => {
  return (dispatch) => {
    const url = `meja/${id}`;
    handleDelete(url, () => {
      dispatch(
        FetchMeja(
          localStorage.getItem("page_meja")
            ? localStorage.getItem("page_meja")
            : 1,
          ""
        )
      );
    });
  };
};

export const clearAllMeja = (idArea) => {
  return (dispatch) => {
    const url = `area/clear/meja/${idArea}`;
    handlePost(url, {}, (data, msg) => {
      console.log(data);
      console.log(msg);
      swal(msg);
    });
  };
};

import { MEJA, HEADERS } from "../../_constants";
import axios from "axios";
import { ModalToggle } from "redux/actions/modal.action";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
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

export const FetchMeja = (where = "") => {
  return (dispatch) => {
    let url = "meja";
    if (where !== "") {
      url += `?${where}`;
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
      dispatch(FetchMeja("page=1"));
    });
  };
};
export const updateMeja = (id, data, where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = `meja/${id}`;
    handlePut(url, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchMeja(where));
      }
    });
  };
};
export const deleteMeja = (id, where = "") => {
  return (dispatch) => {
    const url = `meja/${id}`;
    handleDelete(url, () => {
      dispatch(FetchMeja(where));
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

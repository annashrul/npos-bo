import { AREA, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { swal } from "../../../../helper";
import { ModalToggle } from "redux/actions/modal.action";

export function setLoading(load) {
  return { type: AREA.LOADING, load };
}

export function setArea(data = []) {
  return { type: AREA.SUCCESS, data };
}
export function setAreaAll(data = []) {
  return { type: AREA.ALL, data };
}
export function setAreaFailed(data = []) {
  return { type: AREA.FAILED, data };
}

export const FetchArea = (page = 1, q = "") => {
  return (dispatch) => {
    let url = "";
    if (q === "") {
      url = `area?page=${page}`;
    } else {
      url = `area?page=${page}&q=${q}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setArea(data));
      },
      true
    );
  };
};
export const FetchAreaAll = () => {
  return (dispatch) => {
    handleGet(
      `area?page=1&perpage=999`,
      (res) => {
        const data = res.data;
        dispatch(setAreaAll(data));
      },
      false
    );
  };
};

export const createArea = (data, token) => {
  return (dispatch) => {
    handlePost("area", data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
      } else {
        dispatch(ModalToggle(true));
      }
      dispatch(
        FetchArea(
          localStorage.getItem("page_area")
            ? localStorage.getItem("page_area")
            : 1,
          ""
        )
      );
    });
  };
};
export const updateArea = (id, data) => {
  return (dispatch) => {
    handlePut(`area/${id}`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
      } else {
        dispatch(ModalToggle(true));
      }
      dispatch(
        FetchArea(
          localStorage.getItem("page_area")
            ? localStorage.getItem("page_area")
            : 1,
          ""
        )
      );
    });
  };
};
export const deleteArea = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `area/${id}`;
    handleDelete(`area/${id}`, () => {
      dispatch(
        FetchArea(
          localStorage.getItem("page_area")
            ? localStorage.getItem("page_area")
            : 1,
          ""
        )
      );
    });
  };
};

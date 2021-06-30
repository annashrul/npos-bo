import { AREA } from "../../_constants";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
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

export const FetchArea = (where = "") => {
  return (dispatch) => {
    let url = "area";
    if (where !== "") {
      url += `?${where}`;
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
      dispatch(FetchArea(localStorage.getItem("page_area") ? localStorage.getItem("page_area") : 1, ""));
    });
  };
};
export const updateArea = (id, data, where = "") => {
  return (dispatch) => {
    handlePut(`area/${id}`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
      } else {
        dispatch(ModalToggle(true));
      }
      dispatch(FetchArea(where !== "" ? where : "page=1"));
    });
  };
};
export const deleteArea = (id, where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleDelete(`area/${id}`, () => {
      dispatch(FetchArea(where !== "" ? where : "page=1"));
    });
  };
};

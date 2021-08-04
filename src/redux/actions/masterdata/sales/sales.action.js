import { SALES, HEADERS } from "../../_constants";
import axios from "axios";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";
import { ModalToggle } from "redux/actions/modal.action";

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

export const FetchSales = (where = "") => {
  return (dispatch) => {
    let url = "sales";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setSales(res.data)), true);
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

export const createSales = (data) => {
  return (dispatch) => {
    handlePost("sales", data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchSales("page=1"));
      }
    });
  };
};
export const updateSales = (id, data, token) => {
  return (dispatch) => {
    handlePut("sales/" + id, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchSales("page=1"));
      }
    });
  };
};
export const deleteSales = (id) => {
  return (dispatch) => {
    handleDelete(`sales/${id}`, () => {
      dispatch(FetchSales("page=1"));
    });
  };
};

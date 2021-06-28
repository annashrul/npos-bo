import { PRICE_PRODUCT, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { swal } from "../../../../helper";
import { ModalToggle } from "../../modal.action";

export function setLoading(load) {
  return { type: PRICE_PRODUCT.LOADING, load };
}

export function setPriceProduct(data = []) {
  return { type: PRICE_PRODUCT.SUCCESS, data };
}
export function setPriceProductFailed(data = []) {
  return { type: PRICE_PRODUCT.FAILED, data };
}
export const FetchPriceProduct = (where = "") => {
  return (dispatch) => {
    let url = "barangHarga";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setPriceProduct(data));
      },
      true
    );
  };
};

export const updatePriceProduct = (id, data, where) => {
  return (dispatch) => {
    handlePut(`barangHarga/${id}`, data, (data, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(true));
        dispatch(FetchPriceProduct(where));
      }
    });
  };
};

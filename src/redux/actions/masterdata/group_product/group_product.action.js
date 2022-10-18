import { GROUP_PRODUCT } from "../../_constants";
import { handleDelete, handleGet, handlePost, handlePut } from "../../handleHttp";
import { swal } from "../../../../helper";
const baseUrl = "kelompokBrg";
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
    let url = baseUrl;
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
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (fastAdd) {
        dispatch(FetchGroupProduct("page=1&perpage=9999"));
      } else {
        dispatch(FetchGroupProduct("page=1"));
      }
    });
  };
};
export const updateGroupProduct = (id, data, where = "") => {
  return (dispatch) => {
    handlePut(baseUrl + "/" + id, data, (res, msg, status) => {
      swal(msg);
      dispatch(FetchGroupProduct(where !== "" ? where : "page=1"));
    });
  };
};

export const deleteGroupProduct = (id, where) => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${id}`, () => {
      dispatch(FetchGroupProduct(where));
    });
  };
};

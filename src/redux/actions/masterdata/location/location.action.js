import { LOCATION, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { store, get, update, destroy, cekData, del } from "components/model/app.model";
import { handleGet } from "../../handleHttp";

export function setLoading(load) {
  return { type: LOCATION.LOADING, load };
}
export function setDetailLocation(data = []) {
  return { type: LOCATION.DETAIL, data };
}
export function setEditLocation(data = []) {
  return { type: LOCATION.EDIT, data };
}
export function setAllLocation(data = []) {
  return { type: LOCATION.ALL, data };
}
export function setLocation(data = []) {
  return { type: LOCATION.SUCCESS, data };
}
export function setLocationFailed(data = []) {
  return { type: LOCATION.FAILED, data };
}

export const getLocation = (where = "") => {
  return (dispatch) => {
    let url = "lokasi";
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setLocation(res.data)));
  };
};

// const newNumCode = (stringNum) => {
//   let numberPart = stringNum.split("LK/")[1];
//   let lastChar = stringNum[stringNum.length - 1];
//   console.log(numberPart);
//   return Number(numberPart) != NaN || Number(numberPart) <= 9999 ? Number(numberPart) + 1 : 1111;
// };

export const FetchLocation = (page = 1, q = "") => {
  return (dispatch) => {
    // get("lokasi").then((res) => {
    //   const lastItem = res.slice(-1).pop();
    //   let newKode = newNumCode(lastItem.kode);
    //   // let newKode = `${`LK/`}${newNumCode(lastItem.kode)}`;
    //   console.log(`${newKode}`);
    // });
    dispatch(setLoading(true));
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    let url = "";
    if (q === "") {
      url = `lokasi?page=${page}`;
    } else {
      url = `lokasi?page=${page}&q=${q}`;
    }

    axios
      .get(HEADERS.URL + `${url}`, headers)
      .then(function (response) {
        const data = response.data;
        dispatch(setLocation(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const FetchAllLocation = (page = 1) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    axios
      .get(HEADERS.URL + `lokasi?page=${page}&perpage=50`, headers)
      .then(function (response) {
        const data = response.data;
        const getLocalLocation = get("lokasi");
        getLocalLocation.then((resLokasiLocal) => {
          if (resLokasiLocal.length < data.result.total) {
            for (let i = 0; i < data.result.data.length; i++) {
              console.log("####################### INSERT LOCATION TO LOCAL DB ###########################");
              if (resLokasiLocal.length === parseInt(data.result.total, 10)) {
                console.log("####################### BREAK ###########################");
                break;
              }
              store("lokasi", data.result.data[i]);
            }
          }
        });

        dispatch(setAllLocation(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};
export const FetchDetailLocation = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    axios
      .get(HEADERS.URL + `lokasi/${id}`, headers)
      .then(function (response) {
        const data = response.data;
        dispatch(setDetailLocation(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};
export const FetchEditLocation = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };
    axios
      .get(HEADERS.URL + `lokasi/${id}`, headers)
      .then(function (response) {
        const data = response.data;
        dispatch(setEditLocation(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const createLocation = (datas) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `lokasi`;
    axios
      .post(url, datas)
      .then(function (response) {
        store("lokasi", { nama: datas.nama, nama_toko: datas.nama_toko });
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: data.msg });
        } else {
          Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: data.msg });
        }
        dispatch(setLoading(false));
        dispatch(FetchLocation(1, ""));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });

        if (error.response) {
        }
      });
  };
};

export const updateLocation = (id, datas) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `lokasi/${id}`;

    axios
      .put(url, datas)
      .then(function (response) {
        // get("lokasi").then((res) => {
        //   let field = datas;
        //   const getByKode = res.filter((val) => val.kode === id);
        //   Object.assign(field, { id: getByKode[0].id, kode: id });
        //   update("lokasi", field);
        //   // console.log("##############BERHASIL UPDATE LOKASI ##################");
        // });
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: data.msg });
        } else {
          Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: data.msg });
        }
        dispatch(setLoading(false));
        dispatch(FetchLocation(1, ""));
      })
      .catch(function (error) {
        // handle error
        dispatch(setLoading(false));

        Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });
        if (error.response) {
        }
      });
  };
};
export const deleteLocation = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `lokasi/${id}`;

    axios
      .delete(url)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: data.msg });
        } else {
          Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: data.msg });
        }
        dispatch(setLoading(false));
        dispatch(FetchLocation(localStorage.getItem("pageLocation") ? localStorage.getItem("pageLocation") : 1, ""));
      })
      .catch(function (error) {
        dispatch(setLoading(false));

        Swal.fire({ allowOutsideClick: false, title: "failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });
        if (error.response) {
        }
      });
  };
};

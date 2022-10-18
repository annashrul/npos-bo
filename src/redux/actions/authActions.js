import { AUTH } from "./_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { store, destroy } from "components/model/app.model";
import setAuthToken from "../../utils/setAuthToken";
import { HEADERS } from "./_constants";
import Cookies from "js-cookie";
import { handlePost } from "./handleHttp";
// Login user -- get token
export const loginUser =
  (userData, expire = 1) =>
  async (dispatch) => {
    destroy("sess");
    Swal.fire({
      allowOutsideClick: false,
      title: "Please Wait.",
      html: "Checking your account.",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });

    axios
      .post(HEADERS.URL + "auth/bo", userData, {
        headers: { username: atob(Cookies.get("tnt=")) },
      })
      .then((res) => {
        setTimeout(function () {
          Swal.close();
          const token = res.data.result.token;
          const dataHarga = Object.entries(res.data.result.nama_harga).map(
            ([keys, value]) => ({ [keys]: value })
          );
          store("sess", {
            id: res.data.result.id,
            username: res.data.result.username,
            lokasi: res.data.result.lokasi,
            lvl: res.data.result.lvl,
            access: res.data.result.access,
            password_otorisasi: res.data.result.password_otorisasi,
            nama: res.data.result.nama,
            alamat: res.data.result.alamat,
            foto: res.data.result.foto,
            logo: res.data.result.logo,
            fav_icon: res.data.result.fav_icon,
            nama_harga: dataHarga,
            set_harga: res.data.result.set_harga,
            site_title: res.data.result.title,
            use_supplier: res.data.result.use_supplier,
            is_public: res.data.result.is_public,
            is_resto: res.data.result.is_resto,
          });

          // Set token to Auth Header
          setAuthToken(token);
          // decode token to set user data
          dispatch(setCurrentUser(res.data.result));
          dispatch(setLoggedin(true));

          // set Cookie
          Cookies.set("datum_exp", btoa(token), {
            expires: expire,
          });
          Cookies.set("datum_np", btoa(res.data.result.id), {
            expires: expire,
          });
        }, 800);
      })
      .catch((err) => {
        Swal.close();
        if (err.message === "Network Error") {
          Swal.fire(
            "Server tidak tersambung!.",
            "Periksa koneksi internet anda.",
            "error"
          );
        } else {
          if (err.response.data.message === "No access.") {
            Swal.fire(
              "No access.",
              "You cannot access this page. Please call customer service for more info.",
              "error"
            );
          } else {
            Swal.fire(err.response.data.msg, "", "error");
          }
          dispatch({ type: AUTH.GET_ERRORS, payload: err.response.data.msg });
        }
      });
  };
// / set user data
export const setOtorisasiId = (decoded) => {
  return {
    type: AUTH.SET_OTORISASI_ID,
    payload: decoded,
  };
};

export const checkOtorisasi = (userData, callback) => async (dispatch) => {
  handlePost(
    "auth/otorisasi",
    userData,
    (data, msg, status) => {
      if (callback !== undefined) callback(status, data);
      dispatch(setOtorisasiId(data.result.id_log));
    },
    "Mem-verifikasi data akun anda.."
  );
};
// set user data
export const setCurrentUser = (decoded) => {
  return {
    type: AUTH.SET_CURRENT_USER,
    payload: decoded,
  };
};

//set loggedin
export const setLoggedin = (decoded) => {
  return {
    type: AUTH.SET_LOGGED_USER,
    payload: decoded,
  };
};
// set logout user
export const logoutUser = () => (dispatch) => {
  // remove jwtToken from localStorage
  destroy("sess");
  destroy("receive");
  destroy("sale");
  destroy("hold");
  dispatch(setLoggedin(false));
  localStorage.clear();
  Cookies.remove("datum_exp");
  Cookies.remove("datum_np");

  // remove auth header for future request
  setAuthToken(false);
  // Set current user to {} and isAuthenticated to false
  dispatch(setCurrentUser({}));
};

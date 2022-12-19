import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BgAuth from "../../../../assets/logo.png";
import "./login.css";
import { loginUser } from "redux/actions/authActions";
import Swal from "sweetalert2";
import { HEADERS } from "redux/actions/_constants";
import Cookies from "js-cookie";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberme: false,
      errors: {},
      logo: "-",
      width: "-",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRemember = this.handleRemember.bind(this);
  }
  getFaviconEl() {
    return document.getElementById("favicon");
  }

  getSubdomain() {
     let host = window.location.host;
     let parts = host.split(".");
     const subdomains = btoa(parts[0]);
    // const subdomains = btoa(document.getElementById("coolyeah").value);
    // const subdomains = btoa("miski");
    // const subdomains = btoa("npos");
    // const subdomains = btoa("morph-apparel");
    //let host = window.location.host;
    // let parts = host.split(".");
    // const subdomains = btoa(parts[0]);
    // const subdomains = btoa(document.getElementById("coolyeah").value);
    // const subdomains = btoa("miski");
    //  const subdomains = btoa("npos");
    const subdomains = btoa("morph-apparel");
    // const subdomains = btoa("npos");
    // const subdomains = btoa("cff");
    // const subdomains = btoa("rb");
    // const subdomains = btoa("kairo");
    Cookies.set("tnt=", btoa(subdomains), {
      expires: 365,
    });
    return subdomains;
  }

  componentDidMount() {
    this.getSubdomain();
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    this.initFetch(false);
  }

  initFetch(check) {
    fetch(HEADERS.URL + `site/logo`, {
      method: "GET",
      headers: {
        username: this.getSubdomain(),
      },
    })
      .then((res) => res.json())
      .then(
        (data) => {
          if (data.message !== undefined) {
            Swal.fire({
              allowOutsideClick: false,
              title: "An error occured.",
              text: `You cannot access N-pos. Call customer service for more info.`,
              icon: "info",
              showCancelButton: false,
              confirmButtonColor: "#ff9800",
              confirmButtonText: "Ok.",
            }).then((result) => {});
          } else {
            if (parseInt(data.result.day, 10) <= 7) {
              if (check) this.checkPembayaran();
              else {
                Swal.fire({
                  allowOutsideClick: false,
                  title: "Warning!",
                  html: `<h6>Aplikasi ${
                    parseInt(data.result.day, 10) <= 0 ? "telah" : "mendekati"
                  } kedaluarsa.</h6><br/>
                                    <p>Silahkan lakukan pembayaran<br> melalui rekening berikut ini,</p>
                                    <b>Jumlah:</b><br/>
                                    ${data.result.server_price}<br/>
                                    <b>No. rekening:</b><br/>
                                    ${data.result.acc_number}<br/>
                                    <b>Atas nama:</b><br/>
                                    ${data.result.acc_name}<br/>`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#ff9800",
                  cancelButtonColor: "#2196F3",
                  confirmButtonText: "Konfirmasi Pembayaran",
                  cancelButtonText: "Lain kali.",
                }).then((result) => {
                  if (result.value) {
                    // window.location.reload();
                    if (!check) {
                      fetch(HEADERS.URL + `site/confirm`, {
                        method: "GET",
                        headers: {
                          username: this.getSubdomain(),
                        },
                      })
                        .then((res) => res.json())
                        .then((item) => {
                          if (item.status === "success") {
                            let timerInterval;
                            Swal.fire({
                              allowOutsideClick: false,
                              title: "Silahkan tunggu konfirmasi dari admin!",
                              html: "",
                              timer: 10000,
                              timerProgressBar: true,
                              onBeforeOpen: () => {
                                Swal.showLoading();
                              },
                              onClose: () => {
                                clearInterval(timerInterval);
                              },
                            }).then((result) => {
                              this.checkPembayaran();
                              /* Read more about handling dismissals below */
                              if (result.dismiss === Swal.DismissReason.timer) {
                              }
                            });
                          }
                        });
                    }
                  }
                });
              }
            } else {
              if (check) {
                Swal.fire({
                  allowOutsideClick: false,
                  title: "Pembayaran Berhasil diterima.",
                  text: `Silahkan login untuk melanjutkan.`,
                  icon: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#ff9800",
                  confirmButtonText: "Oke",
                }).then((result) => {});
              }
            }
            localStorage.setItem("logos", data.result.logo);
            localStorage.setItem("site_title", data.result.title);

            document.title = `${data.result.title}`;
            this.setState({
              logo: data.result.logo,
              width: data.result.width,
            });
            const favicon = this.getFaviconEl(); // Accessing favicon element
            favicon.href = data.result.fav_icon;
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  checkPembayaran() {
    Swal.fire({
      allowOutsideClick: false,
      title: "Cek pembayaran.",
      text: `Silahkan tekan tombol cek status pembayaran untuk mengetahui status pembayaran anda.`,
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#ff9800",
      confirmButtonText: "Cek Status Pembayaran.",
    }).then((result) => {
      this.initFetch(true);
    });
  }

  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  componentWillMount() {
    this.getProps(this.props);
  }
  getProps(param) {
    if (param.auth.isAuthenticated) {
      param.history.push("/");
    } else {
      if (param.errors) {
        this.setState({ errors: param.errors });
      }
    }
  }

  submitHandelar = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    if (email !== "" && password !== "") {
      const user = {
        username: email,
        password: password,
      };
      const expires = this.state.rememberme ? 30 : 1;
      this.props.loginUser(user, expires);
    } else {
      Swal.fire(
        "Isi Username dan Password Terlebih Dahulu! ",
        "Lengkapi form untuk melanjutkan.",
        "error"
      );
    }
  };

  handleInputChange = (event) => {
    event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleRemember = (event) => {
    this.setState({
      rememberme: !this.state.rememberme,
    });
  };

  render() {
    const { email, password, errors, disableButton } = this.state;
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="row">
            <div className={"col-md-12"}>
              <div className="wrap-login100 p-b-160 p-t-50">
                <form className="login100-form validate-form" action="#">
                  <span className="login100-form-title p-b-43 mb-5">
                    <img
                      alt="logos"
                      src={this.state.logo === "-" ? BgAuth : this.state.logo}
                      className="img-responsive"
                      width={
                        this.state.width === "-" ? "200px" : this.state.width
                      }
                      style={{
                        textAlign: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                      }}
                    />
                  </span>
                  <div
                    className="wrap-input100 rs1 validate-input"
                    data-validate="Username is required"
                  >
                    <input
                      type="text"
                      readOnly={disableButton}
                      className={email !== "" ? "input100 has-val" : "input100"}
                      placeholder="Username"
                      name="email"
                      value={email}
                      onChange={this.handleInputChange}
                    />
                    <span className="label-input100">Username</span>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div
                    className="wrap-input100 rs2 validate-input"
                    data-validate="Password is required"
                  >
                    <input
                      readOnly={disableButton}
                      type="password"
                      className={
                        password !== "" ? "input100 has-val" : "input100"
                      }
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={this.handleInputChange}
                    />
                    <span className="label-input100">Password</span>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="container-login100-form-btn">
                    <button
                      className="login100-form-btn"
                      type="submit"
                      onClick={this.submitHandelar}
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="text-center w-full p-t-23">
                    <a href="about:blank" className="txt1">
                      {/* Login ke backoffice. */}
                    </a>
                  </div>
                  <div
                    style={{
                      color: "white",
                      width: "100%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        name="rememberme"
                        class="form-check-input"
                        id="inlineCheckbox1"
                        onChange={this.handleRemember}
                        checked={this.state.rememberme}
                      />

                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox1"
                      >
                        Biarkan saya tetap login.
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
  errors: PropTypes.object,
};

const mapStateToProps = ({ auth, errors }) => {
  return {
    auth: auth,
    errors: errors.errors,
  };
};

export default connect(mapStateToProps, { loginUser })(Login);

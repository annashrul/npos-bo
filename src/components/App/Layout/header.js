import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import {
  setEcaps,
  handleNotifAction,
  handleUpdateNotifAction,
} from "redux/actions/site.action";
import { setMobileEcaps } from "redux/actions/site.action";
import { Link } from "react-router-dom";
import isMobile from "react-device-detect";
import moment from "moment";
import Swal from "sweetalert2";
import { noData, toDate, toRp } from "../../../helper";
import { HEADERS } from "redux/actions/_constants";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Default from "assets/default.png";
import Cookies from "js-cookie";

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleEcaps = this.handleEcaps.bind(this);
    this.handleMobileEcaps = this.handleMobileEcaps.bind(this);
    this.handleToggleMobileNav = this.handleToggleMobileNav.bind(this);
    this.handleNotif = this.handleNotif.bind(this);
    this.handleNotifUpdate = this.handleNotifUpdate.bind(this);
    this.handleToggleNotif = this.handleToggleNotif.bind(this);
    this.state = {
      toggleMobileNav: false,
      isShowNotif: false,
      isDay: 7,
      tanggal_tempo: "",
      server_price: "",
      acc_name: "",
      acc_number: "",
      isToggleNotif: false,
      isFirstShow: false,
    };
  }

  handleToggleNotif = (e) => {
    console.log("handleToggleNotif");
    e.preventDefault();
    e.isPropagationStopped();
    if (!this.state.isFirstShow) {
      this.setState({
        isToggleNotif: true,
        isFirstShow: !this.state.isFirstShow,
      });
    } else {
      this.setState({
        isToggleNotif: true,
        isFirstShow: false,
      });
    }
  };

  handleNotifUpdate = (i) => {
    console.log(this.props.notif.result[i].id);
    this.props.handleUpdateNotifAction(this.props.notif.result[i].id);
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  handleEcaps = () => {
    const bool = !this.props.triggerEcaps;
    this.props.setEcaps(bool);
  };
  handleMobileEcaps = () => {
    const bool = !this.props.triggerMobileEcaps;
    this.props.setMobileEcaps(bool);
  };
  handleToggleMobileNav = () => {
    this.setState({
      toggleMobileNav: !this.state.toggleMobileNav,
    });
  };
  componentWillMount() {
    this.props.handleNotifAction();
    fetch(HEADERS.URL + `site/logo`, {
      method: "GET",
      headers: {
        username: atob(Cookies.get("tnt=")),
      },
    })
      .then((res) => res.json())
      .then(
        (data) => {
          if (
            parseInt(data.result.day, 10) === 0 ||
            parseInt(data.result.day, 10) < 0
          ) {
            Swal.fire({
              allowOutsideClick: false,
              title: "Warning!",
              html: `<h6>Aplikasi telah kedaluarsa.</h6><br/>
                            <p>Silahkan lakukan pembayaran<br> melalui rekening berikut ini,</p>
                            <b>Jumlah:</b><br/>
                            ${data.result.server_price}<br/>
                            <b>No. rekening:</b><br/>
                            ${data.result.acc_number}<br/>
                            <b>Atas nama:</b><br/>
                            ${data.result.acc_name}`,
              icon: "warning",
              confirmButtonColor: "#ff9800",
              confirmButtonText: "Oke",
            }).then((result) => {});
            this.props.logoutUser();
          }
          localStorage.setItem("site_title", data.result.title);

          this.setState({
            isShowNotif: parseInt(data.result.day, 10) <= 7 ? true : false,
            isDay: data.result.day,
            tanggal_tempo: moment(data.result.tgl_tempo).format("yyyy-MM-DD"),
            server_price: data.result.server_price,
            acc_name: data.result.acc_name,
            acc_number: data.result.acc_number,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  handleNotif(e) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Informasi Pembayaran.",
      html: `<div class="card"><div class="card-header"><h6 class="text-left">Silahkan lakukan pembayaran ke akun dibawah ini</h6></div><div class="card-body"><table class="table table-bordered table-hover"><thead><tr><th>Harga Server</th><th>No. Rekening</th><th>Atas Nama</th></tr></thead><tbody><tr><td>${toRp(
        parseInt(this.state.server_price, 10)
      )}</td><td>${this.state.acc_number}</td><td>${
        this.state.acc_name
      }</td></tr></tbody></table></div></div>`,
      icon: "info",
      confirmButtonColor: "#ff9800",
      confirmButtonText: "Oke",
    }).then((result) => {});
  }
  render() {
    const { isShowNotif, isDay, isToggleNotif, isFirstShow } = this.state;
    console.log("NOTIF CLIENT", typeof this.props.notif);
    return (
      // <!-- Top Header Area -->
      <header
        className="top-header-area d-flex align-items-center justify-content-between"
        style={{ backgroundColor: !isMobile ? "" : "#242939" }}
      >
        <div className="left-side-content-area d-flex align-items-center">
          {/* Mobile Logo */}
          <div className="mobile-logo mr-3 mr-sm-4">
            <Link to={"./"}>
              <img
                src="/favicon.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${Default}`;
                }}
                alt="Mobile Logo"
              />
            </Link>
          </div>
          {/* <!-- Triggers --> */}
          <div className="ecaps-triggers mr-1 mr-sm-3">
            <div
              className="menu-collasped"
              id="menuCollasped"
              onClick={(e) => {
                e.preventDefault();
                this.handleEcaps();
              }}
            >
              <i className="zmdi zmdi-menu" />
            </div>
            <div
              className="mobile-menu-open"
              id="mobileMenuOpen"
              onClick={(e) => {
                e.preventDefault();
                this.handleMobileEcaps();
              }}
            >
              <i className="zmdi zmdi-menu" />
            </div>
          </div>

          {/* <!-- Left Side Nav --> */}
          <ul className="left-side-navbar d-flex align-items-center">
            {isShowNotif ? (
              <li
                className={`full-screen-mode ml-1 animate__animated animate__bounceInRight`}
                style={{ marginTop: "14px", cursor: "pointer" }}
                onClick={this.handleNotif}
              >
                <div
                  className="alert alert-warning"
                  style={{ backgroundColor: "#ffeb3b", border: "none" }}
                  role="alert"
                >
                  <p style={{ marginBottom: "0" }}>
                    <i className="fa fa-warning" /> Aplikasi kedaluarsa {isDay}{" "}
                    hari lagi.{" "}
                  </p>
                </div>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>

        <div className="right-side-navbar d-flex align-items-center justify-content-end">
          {/* <!-- Mobile AREAAAAAA --> */}
          <div
            className="right-side-trigger"
            style={{ width: "unset", height: "unset", marginRight: "unset" }}
          >
            <div
              className="nav-item dropdown"
              style={{ listStyleType: "none" }}
            >
              <UncontrolledButtonDropdown nav>
                <DropdownToggle caret className="nohover">
                  <img
                    src={this.props.auth.user.foto}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${Default}`;
                    }}
                    alt=""
                  />
                </DropdownToggle>
                <DropdownMenu right>
                  <div className="user-profile-area">
                    <div className="user-profile-heading">
                      <div className="profile-img">
                        <img
                          className="chat-img mr-2"
                          src={this.props.auth.user.foto}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${Default}`;
                          }}
                          alt=""
                        />
                      </div>
                      <div className="profile-text">
                        <h6>{this.props.auth.user.username}</h6>
                        <span>{this.props.auth.user.lvl}</span>
                      </div>
                    </div>
                    <DropdownItem onClick={this.handleLogout}>
                      <i
                        className="fa fa-chain-broken profile-icon bg-warning"
                        aria-hidden="true"
                      />{" "}
                      Sign-out
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </div>
          {/* <!-- END Mobile AREAAAAAA --> */}

          {/* <!-- Top Bar Nav --> */}
          <ul
            className={
              "right-side-content d-flex align-items-center " +
              (this.state.toggleMobileNav === true ? "active" : "")
            }
          >
            <div className="nav-item dropdown">
              <UncontrolledButtonDropdown>
                <DropdownToggle caret className="nohover">
                  <img
                    src={this.props.auth.user.foto}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${Default}`;
                    }}
                    alt=""
                  />
                  <div className="user-name">
                    <table>
                      <thead>
                        <tr>
                          <td className="fs1">
                            <p>{this.props.auth.user.username}</p>
                            <span>{this.props.auth.user.lvl}</span>
                          </td>
                          <td className="fs1" style={{ paddingLeft: "10px" }}>
                            <p>
                              <i className="fa fa-angle-down lnr"></i>
                            </p>
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </DropdownToggle>
                <DropdownMenu right>
                  <div className="user-profile-area">
                    <div className="user-profile-heading">
                      <div className="profile-img">
                        <img
                          className="chat-img mr-2"
                          src={this.props.auth.user.foto}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${Default}`;
                          }}
                          alt=""
                        />
                      </div>
                      <div className="profile-text">
                        <h6>{this.props.auth.user.username}</h6>
                        <span>{this.props.auth.user.lvl}</span>
                      </div>
                    </div>
                    <DropdownItem onClick={this.handleLogout}>
                      <i
                        className="fa fa-chain-broken profile-icon bg-warning"
                        aria-hidden="true"
                      />{" "}
                      Sign-out
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
            <div className="nav-item dropdown">
              <UncontrolledButtonDropdown>
                <DropdownToggle caret className="nohover">
                  {this.props.notif !== undefined &&
                  this.props.notif.result !== undefined &&
                  this.props.notif.result.length > 0 ? (
                    <i className="fa fa-bell-o"></i>
                  ) : (
                    <i className="fa fa-bell-slash-o"></i>
                  )}

                  <span
                    style={{
                      borderRadius: "100%",
                      padding: "5px",
                      backgroundColor:
                        this.props.notif !== undefined &&
                        this.props.notif.result !== undefined &&
                        this.props.notif.result.length > 0
                          ? "red"
                          : "transparent",
                      fontSize: "12px",
                      marginTop: "-5px",
                      marginLeft: "-5px",
                      position: "absolute",
                      color: "white",
                    }}
                  ></span>
                </DropdownToggle>
                <DropdownMenu
                  style={{
                    zIndex: "99",
                    overflowY: "auto",
                    maxHeight: "400px",
                    width: "400px",
                    padding: "0px",
                  }}
                  right
                >
                  <div className="user-profile-area" style={{ padding: "0" }}>
                    <div style={{ padding: "10px", fontSize: "14px" }}>
                      notifikasi transaksi
                    </div>
                    <DropdownItem style={{ padding: "0px" }} toggle={false}>
                      {this.props.notif !== undefined &&
                      this.props.notif.result !== undefined &&
                      this.props.notif.result.length > 0 ? (
                        this.props.notif.result.map((row, i) => {
                          return (
                            <p
                              onClick={(e) => {
                                e.isPropagationStopped();
                                if (row.status !== 1) {
                                  this.handleNotifUpdate(i);
                                }
                              }}
                              key={i}
                              style={{
                                cursor:
                                  row.status === 1 ? "not-allowed" : "pointer",
                                borderBottom: "1px solid #EEEEEE",
                                background:
                                  row.status !== 1 ? "white" : "#EEEEEE",
                                padding: "10px",
                                marginBottom: "0px",
                              }}
                            >
                              <a>{row.pesan}</a>
                              <br />
                              <span style={{ color: "grey", fontSize: "10px" }}>
                                <i className="fa fa-clock-o"></i>
                                {moment(row.created_at).format("llll")}
                              </span>
                            </p>
                          );
                        })
                      ) : (
                        <center>tidak ada pesan yang masuk</center>
                      )}
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </ul>
        </div>
      </header>
    );
  }
}
Header.propTypes = {
  handleUpdateNotifAction: PropTypes.func.isRequired,
  handleNotifAction: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setEcaps: PropTypes.func.isRequired,
  setMobileEcaps: PropTypes.func.isRequired,
  auth: PropTypes.object,
  notif: PropTypes.any,
  triggerEcaps: PropTypes.bool,
  triggerMobileEcaps: PropTypes.bool,
};

const mapStateToProps = ({ auth, siteReducer }) => {
  return {
    auth: auth,
    notif: siteReducer.dataNotif,
    triggerEcaps: siteReducer.triggerEcaps,
    triggerMobileEcaps: siteReducer.triggerMobileEcaps,
  };
};
export default connect(mapStateToProps, {
  handleUpdateNotifAction,
  handleNotifAction,
  logoutUser,
  setEcaps,
  setMobileEcaps,
})(Header);

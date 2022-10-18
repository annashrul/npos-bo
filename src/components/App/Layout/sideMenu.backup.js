import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import MenuTemp from "../common/menuTemp";
import MenuTreeviewTemp from "../common/menuTreeviewTemp";
import MenuTreeviewSubTemp from "../common/menuTreeviewSubTemp";
import Preloader from "../../../Preloader";
import { groupByArray } from "../../../helper";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //################################## START PARENT MENU ###############################
      isMasterdata: false,
      isInventory: false,
      isReceive: false,
      isSale: false,
      isPaid: false,
      isReport: false,
      isSetting: false,
      //################################## END PARENT MENU ###############################
      //################################## START CHILD MENU ###############################
      isReportPenjualan: false,
      isReportInventory: false,
      isReportPembelian: false,
      isReportPembayaran: false,
      isReportLog: false,

      //################################## END CHILD MENU ###############################
      //################################## START STATE DISPLAY MENU ACCESS ###############################
      isMasterdataDisplay: false,
      isProductionDisplay: false,
      isInventoryDisplay: false,
      isReceiveDisplay: false,
      isSaleDisplay: false,
      isPaidDisplay: false,
      isReportDisplay: false,
      isSettingDisplay: false,
      isBarcodeDisplay: false,

      isReportInventoryDisplay: false,
      isReportPembelianDisplay: false,
      isReportPenjualanDisplay: false,
      isReportPembayaranDisplay: false,
      isReportLogDisplay: false,

      //################################## END STATE DISPLAY MENU ACCESS ###############################
      aksesUser: [],
      arrState: [
        {
          temp: 1,
          parent: 1,
          range1: 0,
          range2: 10,
          label: "masterdata",
          display: "isMasterdataDisplay",
          state: "isMasterdata",
        },
        {
          temp: 1,
          parent: 2,
          range1: 10,
          range2: 20,
          label: "inventory",
          display: "isInventoryDisplay",
          state: "isInventory",
        },
        {
          temp: 0,
          parent: 7,
          range1: 30,
          range2: 40,
          label: "produksi",
          display: "isProductionDisplay",
          state: "isProduction",
        },
        {
          temp: 1,
          parent: 3,
          range1: 40,
          range2: 50,
          label: "pembelian",
          display: "isReceiveDisplay",
          state: "isReceive",
        },
        {
          temp: 1,
          parent: 4,
          range1: 50,
          range2: 60,
          label: "transaksi",
          display: "isSaleDisplay",
          state: "isSale",
        },
        {
          temp: 1,
          parent: 5,
          range1: 60,
          range2: 70,
          label: "pembayaran",
          display: "isPaidDisplay",
          state: "isPaid",
        },
        {
          temp: 2,
          parent: 6,
          range1: 70,
          range2: 100,
          label: "laporan",
          display: "isReportDisplay",
          state: "isReport",
          data: [
            { label: "closing", activeChild: "" },
            { label: "kas", activeChild: "" },
            { label: "laba_rugi", activeChild: "" },
            { label: "produksi", activeChild: "" },
            {
              label: "penjualan",
              activeChild: "isReportPenjualan",
              display: "isReportPenjualanDisplay",
            },
            {
              label: "inventory",
              activeChild: "isReportInventory",
              display: "isReportInventoryDisplay",
            },
            {
              label: "pembelian",
              activeChild: "isReportPembelian",
              display: "isReportPembelianDisplay",
            },
            {
              label: "pembayaran",
              activeChild: "isReportPembayaran",
              display: "isReportPembayaranDisplay",
            },
            {
              label: "log",
              activeChild: "isReportLog",
              display: "isReportLogDisplay",
            },
          ],
        },
        {
          temp: 0,
          parent: 8,
          range1: 100,
          range2: 110,
          label: "cetak_barcode",
          display: "isBarcodeDisplay",
          state: "isBarcode",
        },
        {
          temp: 1,
          parent: 0,
          range1: 1100,
          range2: 120,
          label: "setting",
          display: "isSettingDisplay",
          state: "isSetting",
        },
      ],
      isLoading: true,
      path: this.props.location.pathname,
    };
    this.menuChange = this.menuChange.bind(this);
  }

  menuChange(argument) {
    this.setState({ path: "" });
    if (argument.parent !== "" && argument.child === "") {
      this.setState({
        [argument.parent]: !this.state[argument.parent],
        [argument.child]: false,
      });
      this.forceUpdate();
    }
    if (argument.child !== "") {
      this.setState({ [argument.child]: !this.state[argument.child] });
      this.forceUpdate();
    }
    if (argument.parent !== "" && argument.child !== "") {
      this.setState({
        [argument.parent]: true,
        [argument.child]: !this.state[argument.child],
      });
      this.forceUpdate();
    }
    // this.forceUpdate();
  }
  handleMenuActive(param, state) {
    const path = this.props.location.pathname;
    for (let i = 0; i < param.length; i++) {
      let val = param[i];
      if (val.label !== "") {
        let labelReport = val.label
          .replaceAll(" ", "_")
          .replaceAll("Laporan_", "")
          .toLowerCase();
        let label = `/${val.label.replaceAll(" ", "_").toLowerCase()}`;
        if (val.menu === "") {
          if (path === label) {
            this.setState({ [state["state"]]: true });
            break;
          }
        } else {
          if (state["data"] !== undefined) {
            let childState = state["data"];
            for (let x = 0; x < childState.length; x++) {
              if (
                `/report/${labelReport}` === path &&
                val.menu === childState[x]["label"]
              ) {
                this.setState({
                  isReport: true,
                  [childState[x]["activeChild"]]: true,
                });
                break;
              }
            }
          }
        }
        continue;
      }
      break;
    }
  }
  handleMenuDisplay(props, state) {
    let group = groupByArray(props, (menu) => menu["parent"]);
    let data = group.get(state["parent"]);
    for (let i = 0; i < data.length; i++) {
      if (data[i].label !== "") {
        if (data[i].value === "1") {
          this.setState({ [state["display"]]: true });
        }
        if (state["data"] !== undefined) {
          for (let x = 0; x < state["data"].length; x++) {
            let childState = state["data"][x];
            if (childState["display"] !== "") {
              if (data[i].value === "1") {
                this.setState({
                  [childState["display"]]: true,
                });
              } else {
                this.setState({
                  [childState["display"]]: false,
                });
              }

              // break;
            }
            // break;
          }
          // continue;
        }
        break;
      }
      break;
    }
  }
  getProps(param) {
    this.setState({ isLoading: true });
    if (param.auth.user) {
      let akses = param.auth.user.access;
      if (akses !== undefined && akses !== null) {
        let toArray = [];
        this.state.arrState.forEach((val, i) => {
          this.handleMenuActive(akses.slice(val.range1, val.range2), val);
          this.handleMenuDisplay(akses.slice(val.range1, val.range2), val);
        });

        if (akses.length > 0) {
          akses.forEach((parent, i) => {
            toArray.push(parent);
          });
          this.setState({ aksesUser: toArray, isLoading: false });
        }
      }
    }
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Apakah anda yakin akan logout aplikasi?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya!",
    }).then((result) => {
      if (result.value) {
        this.props.logoutUser();
      }
    });
  };
  render() {
    // const path = this.props.location.pathname;
    const { path, arrState, aksesUser } = this.state;

    return (
      <nav>
        {this.state.isLoading ? (
          <Preloader />
        ) : (
          <ul className="sidebar-menu" data-widget="tree">
            {/* ########################################## DASHBOARD MODUL START ########################################## */}
            <MenuTemp
              display={"1"}
              isActive={path === "/" ? "active" : ""}
              path={"/"}
              icon={"fa fa-dashboard"}
              label={"Dashboard"}
            />
            {/* ########################################## DASHBOARD MODUL END ########################################## */}
            {(() => {
              let child = [];
              arrState.map((val) => {
                if (aksesUser.length > 0) {
                  let group = groupByArray(aksesUser, (key) => key["parent"]);
                  let menu = group.get(val.parent);
                  if (val.temp === 0) {
                    child.push(
                      <MenuTemp
                        display={"1"}
                        isActive={path === `/${val.label}` ? "active" : ""}
                        path={`/${val.label}`}
                        icon={"fa fa-dashboard"}
                        label={val.label.replaceAll("_", " ")}
                      />
                    );
                  } else if (val.temp === 1) {
                    child.push(
                      <MenuTreeviewTemp
                        changeMenu={this.menuChange.bind(this)}
                        isActive={this.state[val.state]}
                        isDisplay={this.state[val.display]}
                        arg1={val.state}
                        arg2={""}
                        icon={"zmdi zmdi-receipt"}
                        label={val.label}
                        path={path}
                        data={(() => {
                          let subChild = [];
                          menu.map((menuVal) => {
                            if (menuVal.label !== "") {
                              subChild.push({
                                path: `${menuVal.label
                                  .replaceAll(" ", "_")
                                  .toLowerCase()}`,
                                display: menuVal.value === "1",
                                label: menuVal.label,
                              });
                            }
                            return null;
                          });
                          return subChild;
                        })()}
                      />
                    );
                  } else {
                    child.push(
                      <MenuTreeviewSubTemp
                        changeMenu={this.menuChange.bind(this)}
                        changeSubMenu={this.menuChange.bind(this)}
                        isActive={this.state[val.state]}
                        isDisplay={this.state[val.display]}
                        arg1={val.state}
                        arg2={""}
                        label={val.label}
                        path={path}
                        data={(() => {
                          let child = [];
                          let group = groupByArray(
                            aksesUser,
                            (menu) => menu["menu"]
                          );
                          val.data.map((valKey) => {
                            let dataGroup = group.get(valKey.label);
                            child.push({
                              isActive:
                                this.state[val.state] &&
                                this.state[valKey.activeChild],
                              isDisplay:
                                this.state[val.state] &&
                                this.state[valKey.display],
                              arg1: valKey.activeChild,
                              label: valKey.label
                                .replaceAll("_", " ")
                                .toLowerCase(),
                              path: `/report/${valKey.label}`,
                              data: (() => {
                                let data = [];
                                dataGroup.map((val, x) => {
                                  let label = val["label"]
                                    .replaceAll("Laporan ", "")
                                    .toLowerCase();
                                  data.push({
                                    isDisplay: val["value"] === "1",
                                    label: label,
                                    path:
                                      "/report/" +
                                      label.replaceAll(" ", "_").toLowerCase(),
                                  });
                                  return null;
                                });
                                return valKey.activeChild === ""
                                  ? undefined
                                  : data;
                              })(),
                            });
                            return null;
                          });

                          return child;
                        })()}
                      />
                    );
                  }
                }
                return null;
              });
              return child;
            })()}
            {/* ########################################## LOGOUT MODUL START ########################################## */}
            <li>
              <a
                href={null}
                style={{ cursor: "pointer", color: "#a6b6d0" }}
                onClick={(event) => this.handleLogout(event)}
              >
                {" "}
                <i className="fa fa-chain-broken" />
                <span> Logout</span>
              </a>
            </li>
            {/* ########################################## LOGOUT MODUL END ########################################## */}
          </ul>
        )}
      </nav>
    );
  }
}
SideMenu.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default withRouter(connect(mapStateToProps, { logoutUser })(SideMenu));

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../Layout/header";
import SideMenu from "../Layout/sideMenu";
import { connect } from "react-redux";
import FreeScrollbar from "react-free-scrollbar";
import Default from "assets/default.png";
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import { handleNotifAction } from "../../../redux/actions/site.action";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.mouseEnterHandle = this.mouseEnterHandle.bind(this);
    this.mouseOutHandle = this.mouseOutHandle.bind(this);
    this.state = {
      sideHover: "deactive",
    };
  }

  componentWillMount() {}
  handleLogout = () => {
    this.props.logoutUser();
  };
  getFaviconEl() {
    return document.getElementById("favicon");
  }
  getTimeout() {
    return document.getElementById("coolyeah").value;
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      const favicon = this.getFaviconEl(); // Accessing favicon element
      favicon.href = nextProps.auth.user.fav_icon;

      if (nextProps.auth.user.site_title !== undefined) {
        localStorage.setItem("site_title", nextProps.auth.user.site_title);
        document.title = `${nextProps.auth.user.site_title} - ${this.props.page}`;
      } else
        document.title = `${localStorage.getItem("site_title")} - ${
          this.props.page
        }`;
    }
  };

  mouseEnterHandle() {
    this.setState({
      sideHover: "active",
    });
  }
  mouseOutHandle() {
    this.setState({
      sideHover: "deactive",
    });
  }

  render() {
    // const rawtime = parseInt(this.getTimeout(), 10);
    // const timedout = rawtime === 0 ? 86400000 * 2 : rawtime;
    return (
      // <Idle
      //     timeout={timedout}
      //     render={({ idle }) =>
      //     <div>
      //         {idle &&rawtime!==0
      //         ? this.handleLogout()
      //         : (
      <div
        className={
          this.props.triggerEcaps
            ? "ecaps-page-wrapper sidemenu-hover-" +
              this.state.sideHover +
              " menu-collasped-active"
            : "ecaps-page-wrapper " +
              (this.props.triggerMobileEcaps ? "mobile-menu-active" : "")
        }
      >
        {/* Side Menu */}
        <div
          className="ecaps-sidemenu-area"
          onMouseEnter={this.mouseEnterHandle}
          onMouseLeave={this.mouseOutHandle}
        >
          {/* Desktop Logo */}
          <div className="ecaps-logo">
            <Link to="/" style={{ backgroundColor: "#242939" }}>
              <img
                className="desktop-logo"
                src={this.props.auth.user.logo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${Default}`;
                }}
                alt="Desktop Logo"
                style={{ maxHeight: "50px" }}
              />{" "}
              <img
                className="small-logo"
                src={this.props.auth.user.fav_icon}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${Default}`;
                }}
                alt="Mobile Logo"
              />
            </Link>
          </div>
          {/* Side Nav */}
          <div
            className="slimScrollDiv"
            style={{ position: "relative", width: "auto", height: "100%" }}
          >
            <div
              className="ecaps-sidenav"
              id="ecapsSideNav"
              style={{ overflowY: "unset", width: "auto", height: "100%" }}
            >
              <FreeScrollbar>
                {/* Side Menu Area */}
                <div
                  className="side-menu-area"
                  style={{ paddingRight: "8px", marginTop: "unset" }}
                >
                  {/* Sidebar Menu */}
                  <SideMenu />
                </div>
              </FreeScrollbar>
            </div>
          </div>
        </div>

        {/* Page Content */}

        <div className="ecaps-page-content">
          {/* Top Header Area */}
          <Header />
          {/* Main Content Area */}
          <div className="main-content" style={{ zoom: "90%" }}>
            <div className="container-fluid">
              {/* content */}
              {this.props.children}
            </div>
          </div>
          {/* Page Footer*/}
          {/* <Footer/>        */}
        </div>
      </div>

      // )
      //     }
      // </div>
      // }
      // />
    );
  }
}
Layout.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, siteReducer }) => {
  return {
    auth: auth,
    triggerEcaps: siteReducer.triggerEcaps,
    triggerMobileEcaps: siteReducer.triggerMobileEcaps,
  };
};
export default connect(mapStateToProps, { logoutUser })(Layout);

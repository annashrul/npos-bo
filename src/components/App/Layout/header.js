import React, { Component } from 'react'
import {connect} from 'react-redux'
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    return (
      <header className="top-header-area d-flex align-items-center justify-content-between">
        <div className="left-side-content-area d-flex align-items-center">
          {/* Mobile Logo */}
          <div className="mobile-logo mr-3 mr-sm-4">
            <a href="index.html">
              <img src="img/core-img/small-logo.png" alt="Mobile Logo" />
            </a>
          </div>
          {/* Triggers */}
          <div className="ecaps-triggers mr-1 mr-sm-3">
            <div className="menu-collasped" id="menuCollasped">
              <i className="zmdi zmdi-menu" />
            </div>
            <div className="mobile-menu-open" id="mobileMenuOpen">
              <i className="zmdi zmdi-menu" />
            </div>
          </div>
          {/* Left Side Nav */}
          <ul className="left-side-navbar d-flex align-items-center">
            <li className="hide-phone app-search">
              <form className="input-group" role="search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Projects.."
                  aria-label="search"
                />
              </form>
            </li>
            <li>
              <a href="#" className="nav-link" onClick={this.handleLogout}>Logout</a>

            </li>
          </ul>
        </div>
      </header>
    );
  }
};
Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
};

const mapStateToProps = ({auth}) =>{
     return{
       auth: auth
     }
}
export default connect(mapStateToProps,{logoutUser})(Header);
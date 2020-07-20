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
      // <!-- Top Header Area -->
      <header className="top-header-area d-flex align-items-center justify-content-between">
          <div className="left-side-content-area d-flex align-items-center">
              {/* <!-- Mobile Logo --> */}
              <div className="mobile-logo mr-3 mr-sm-4">
                  <a href="index.html"><img src="img/core-img/small-logo.png" alt="Mobile Logo"></img></a>
              </div>

              {/* <!-- Triggers --> */}
              <div className="ecaps-triggers mr-1 mr-sm-3">
                  <div className="menu-collasped" id="menuCollasped">
                      <i className="zmdi zmdi-menu"></i>
                  </div>
                  <div className="mobile-menu-open" id="mobileMenuOpen">
                      <i className="zmdi zmdi-menu"></i>
                  </div>
              </div>

              {/* <!-- Left Side Nav --> */}
              <ul className="left-side-navbar d-flex align-items-center">
              </ul>
          </div>

          <div className="right-side-navbar d-flex align-items-center justify-content-end">
              {/* <!-- Mobile Trigger --> */}
              <div className="right-side-trigger" id="rightSideTrigger">
                  <i className="ti-align-left"></i>
              </div>

              {/* <!-- Top Bar Nav --> */}
              <ul className="right-side-content d-flex align-items-center">
                  {/* <!-- Full Screen Mode --> */}
                  <li className="full-screen-mode ml-1">
                      <a href="javascript:" id="fullScreenMode" ><i className="zmdi zmdi-fullscreen" style={{'font-size': 'xx-large'}}></i></a>
                  </li>
                  <li className="nav-item dropdown">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="zmdi zmdi-account-circle" style={{'font-size': 'xx-large'}} aria-hidden="true"></i> <span className="active-status"></span></button>
                      <div className="dropdown-menu dropdown-menu-right">
                          {/* <!-- Top Notifications Area --> */}
                          <div className="user-profile-area">
                              <div className="user-profile-heading">
                                  {/* <!-- Thumb --> */}
                                  <div className="profile-img">
                                      <img className="chat-img mr-2" src="img/member-img/3.png" alt=""></img>
                                  </div>
                                  {/* <!-- Profile Text --> */}
                                  <div className="profile-text">
                                      <h6>User</h6>
                                      <span>Administrator</span>
                                  </div>
                              </div>
                              <a href="#" className="dropdown-item"><i className="zmdi zmdi-account profile-icon bg-primary" aria-hidden="true"></i> My profile</a>
                              <a onClick={this.handleLogout} className="dropdown-item"><i className="ti-unlink profile-icon bg-warning" aria-hidden="true"></i> Sign-out</a>
                          </div>
                      {/* </div> */}
                      </div>
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
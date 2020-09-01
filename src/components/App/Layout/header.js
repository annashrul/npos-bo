import React, { Component } from 'react'
import {connect} from 'react-redux'
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import {setEcaps} from 'redux/actions/site.action'
import {setMobileEcaps} from 'redux/actions/site.action'
import { Link } from 'react-router-dom';
import isMobile from 'react-device-detect';
import moment from "moment";
import Swal from "sweetalert2";
import {toRp} from "../../../helper";
import {HEADERS} from "redux/actions/_constants"
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleEcaps=this.handleEcaps.bind(this)
    this.handleMobileEcaps=this.handleMobileEcaps.bind(this)
    this.handleToggleMobileNav=this.handleToggleMobileNav.bind(this)
    this.handleNotif=this.handleNotif.bind(this)
    this.state = {
        toggleMobileNav:false,
        isShowNotif:false,
        isDay:7,
        tanggal_tempo:"",
        server_price:"",
        acc_name:"",
        acc_number:"",
    }
  }
  
  handleLogout = () => {
    this.props.logoutUser();
  };

  handleEcaps=()=>{
      const bool = !this.props.triggerEcaps;
      this.props.setEcaps(bool);
  }
  handleMobileEcaps=()=>{
      const bool = !this.props.triggerMobileEcaps;
      this.props.setMobileEcaps(bool);
  }
  handleToggleMobileNav=()=>{
      this.setState({
          toggleMobileNav:!this.state.toggleMobileNav
      })
  }
  componentWillMount(){
    fetch(HEADERS.URL + `site/logo`)
        .then(res => res.json())
        .then(
            (data) => {
                if (parseInt(data.result.day)===0){
                    Swal.fire({
                        title: 'Warning!',
                        html: `<h6>Aplikasi telah kedaluarsa.</h6><br/>
                            <p>Silahkan lakukan pembayaran<br> melalui rekening berikut ini,</p>
                            <b>Jumlah:</b><br/>
                            ${data.result.server_price}<br/>
                            <b>No. rekening:</b><br/>
                            ${data.result.acc_number}<br/>
                            <b>Atas nama:</b><br/>
                            ${data.result.acc_name}`,
                        icon: 'warning',
                        confirmButtonColor: '#ff9800',
                        confirmButtonText: 'Oke',
                    }).then((result) => {

                    })
                    this.props.logoutUser();
                }
                localStorage.setItem("site_title", data.result.title);
                this.setState({
                    isShowNotif: parseInt(data.result.day) <= 7 ? true : false,
                    isDay: data.result.day,
                    tanggal_tempo: moment(data.result.tgl_tempo).format("yyyy-MM-DD"),
                    server_price: data.result.server_price,
                    acc_name: data.result.acc_name,
                    acc_number: data.result.acc_number
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )

  }



  handleNotif(e){
      e.preventDefault();
      Swal.fire({
          title: 'Informasi Pembayaran.',
          html:`<div class="card"><div class="card-header"><h6 class="text-left">Silahkan lakukan pembayaran ke akun dibawah ini</h6></div><div class="card-body"><table class="table table-bordered table-hover"><thead><tr><th>Harga Server</th><th>No. Rekening</th><th>Atas Nama</th></tr></thead><tbody><tr><td>${toRp(parseInt(this.state.server_price))}</td><td>${this.state.acc_number}</td><td>${this.state.acc_name}</td></tr></tbody></table></div></div>`,
          icon: 'info',
          confirmButtonColor: '#ff9800',
          confirmButtonText: 'Oke',
      }).then((result) => {

      })
  }
  render() {

      const {isShowNotif,isDay} = this.state;
    return (
      // <!-- Top Header Area -->
      <header className="top-header-area d-flex align-items-center justify-content-between" style={{backgroundColor:(!isMobile?'':'#242939')}} >
          <div className="left-side-content-area d-flex align-items-center">
              {/* Mobile Logo */}
                <div className="mobile-logo mr-3 mr-sm-4">
                    <Link to={'./'} ><img src="/favicon.png" alt="Mobile Logo"/></Link>
                </div>
              {/* <!-- Triggers --> */}
              <div className="ecaps-triggers mr-1 mr-sm-3">
                  <div className="menu-collasped" id="menuCollasped" onClick={(e)=>{e.preventDefault();this.handleEcaps();}}>
                      <i className="zmdi zmdi-menu"/>
                  </div>
                  <div className="mobile-menu-open" id="mobileMenuOpen" onClick={(e)=>{e.preventDefault();this.handleMobileEcaps();}}>
                      <i className="zmdi zmdi-menu"/>
                  </div>
              </div>

              {/* <!-- Left Side Nav --> */}
              <ul className="left-side-navbar d-flex align-items-center">
                  
                {
                    isShowNotif?(
                        <li className={`full-screen-mode ml-1 animate__animated animate__bounceInRight`} style={{marginTop:"14px",cursor:"pointer"}} onClick={this.handleNotif}>
                            <div className="alert alert-warning" style={{backgroundColor:"#ffeb3b",border:'none'}} role="alert">
                                <p><i className="fa fa-warning"/> Aplikasi kedaluarsa {isDay} hari lagi. </p>
                            </div>
                        </li>
                    ):""
                }
              </ul>
          </div>

          <div className="right-side-navbar d-flex align-items-center justify-content-end">
              {/* <!-- Mobile AREAAAAAA --> */}
              <div className="right-side-trigger" style={{width:'unset',height:'unset',marginRight:'unset'}} >
                <li className="nav-item dropdown" style={{listStyleType:'none'}}>
                    <UncontrolledButtonDropdown nav inNavbar>
                                <DropdownToggle caret inNavbar className="nohover">
                                    <img src={this.props.auth.user.foto} alt=""/>
                                </DropdownToggle>
                            <DropdownMenu right>
                                <div className="user-profile-area">
                                    <div className="user-profile-heading">
                                        <div className="profile-img">
                                            <img className="chat-img mr-2" src={this.props.auth.user.foto} alt=""/>
                                        </div>
                                        <div className="profile-text">
                                            <h6>{this.props.auth.user.username}</h6>
                                            <span>{this.props.auth.user.lvl}</span>
                                        </div>
                                    </div>
                                    <DropdownItem  onClick={this.handleLogout}>
                                    <i className="fa fa-chain-broken profile-icon bg-warning" aria-hidden="true"/> Sign-out
                                    </DropdownItem>
                                </div>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                </li>
              </div>
              {/* <!-- END Mobile AREAAAAAA --> */}

              {/* <!-- Top Bar Nav --> */}
              <ul className={"right-side-content d-flex align-items-center " + (this.state.toggleMobileNav === true? "active":"")}>
               

                  <li className="nav-item dropdown">
                        <UncontrolledButtonDropdown nav inNavbar>
                                <DropdownToggle caret inNavbar className="nohover">
                                    <img src={this.props.auth.user.foto} alt=""/>
                                </DropdownToggle>
                            <DropdownMenu right>
                                <div className="user-profile-area">
                                    <div className="user-profile-heading">
                                        <div className="profile-img">
                                            <img className="chat-img mr-2" src={this.props.auth.user.foto} alt=""/>
                                        </div>
                                        <div className="profile-text">
                                            <h6>{this.props.auth.user.username}</h6>
                                            <span>{this.props.auth.user.lvl}</span>
                                        </div>
                                    </div>
                                    <DropdownItem  onClick={this.handleLogout}>
                                    <i className="fa fa-chain-broken profile-icon bg-warning" aria-hidden="true"/> Sign-out
                                    </DropdownItem>
                                </div>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                  </li>

                </ul>
          </div>
      </header>
      );
  }
};
Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  setEcaps: PropTypes.func.isRequired,
  setMobileEcaps: PropTypes.func.isRequired,
  auth: PropTypes.object,
  triggerEcaps: PropTypes.bool,
  triggerMobileEcaps: PropTypes.bool,
};

const mapStateToProps = ({auth,siteReducer}) =>{
     return{
       auth: auth,
        triggerEcaps: siteReducer.triggerEcaps,
        triggerMobileEcaps: siteReducer.triggerMobileEcaps

     }
}
export default connect(mapStateToProps,{logoutUser,setEcaps,setMobileEcaps})(Header);
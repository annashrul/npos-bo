import React, { Component } from 'react'
import {connect} from 'react-redux'
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import {setEcaps} from 'redux/actions/site.action'
import {setMobileEcaps} from 'redux/actions/site.action'
import Logo from "../../../assets/images/logo.png"
import { Link } from 'react-router-dom';
import isMobile from 'react-device-detect';
import moment from "moment";
import Swal from "sweetalert2";
import {toRp} from "../../../helper";
let anim = '';
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
      let tgl_tempo = localStorage.getItem("tanggal_tempo");
      let tgl_lokal = moment(new Date()).format("yyyy-MM-DD");
      let tgl_info = localStorage.getItem("tanggal_info");
      console.log(`tgl tampo : ${tgl_tempo}, tgl lokal : ${tgl_lokal}, 7 hari terakhir : ${tgl_info}`);
      console.log(parseInt(moment(tgl_tempo).format("DD")) - parseInt(moment(tgl_lokal).format("DD")));
      let sisa = parseInt(moment(tgl_tempo).format("DD")) - parseInt(moment(tgl_lokal).format("DD"));
      if(tgl_lokal===tgl_info || sisa <= 7){
          this.setState({
              isShowNotif:true,
              isDay:parseInt(moment(tgl_tempo).format("DD")) - parseInt(moment(tgl_lokal).format("DD"))
          })
      }

  }




  handleNotif(e){
      e.preventDefault();
      Swal.fire({
          title: 'Informasi Pembayaran.',
          html:`<div class="card"><div class="card-header"><h6 class="text-left">Silahkan lakukan pembayaran ke akun dibawah ini</h6></div><div class="card-body"><table class="table table-bordered table-hover"><thead><tr><th>Harga Server</th><th>No. Rekening</th><th>Atas Nama</th></tr></thead><tbody><tr><td>${toRp(parseInt(localStorage.server_price))}</td><td>${localStorage.acc_number}</td><td>${localStorage.acc_name}</td></tr></tbody></table></div></div>`,
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
                <div class="mobile-logo mr-3 mr-sm-4">
                    <Link to={'./'} ><img src="/favicon.png" alt="Mobile Logo"></img></Link>
                </div>
              {/* <!-- Triggers --> */}
              <div className="ecaps-triggers mr-1 mr-sm-3">
                  <div className="menu-collasped" id="menuCollasped" onClick={(e)=>{e.preventDefault();this.handleEcaps();}}>
                      <i className="zmdi zmdi-menu"></i>
                  </div>
                  <div className="mobile-menu-open" id="mobileMenuOpen" onClick={(e)=>{e.preventDefault();this.handleMobileEcaps();}}>
                      <i className="zmdi zmdi-menu"></i>
                  </div>
              </div>

              {/* <!-- Left Side Nav --> */}
              <ul className="left-side-navbar d-flex align-items-center">

              </ul>
          </div>

          <div className="right-side-navbar d-flex align-items-center justify-content-end">
              {/* <!-- Mobile Trigger --> */}
              <div className="right-side-trigger" style={{width:'unset',height:'unset',marginRight:'unset'}} >
                <li className="nav-item dropdown">
                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={this.props.auth.user.foto} alt=""></img> <span className="active-status"></span></button>
                    <div className="dropdown-menu dropdown-menu-right">
                        {/* <!-- Top Notifications Area --> */}
                        <div className="user-profile-area">
                            <div className="user-profile-heading">
                                {/* <!-- Thumb --> */}
                                <div className="profile-img">
                                    <img className="chat-img mr-2" src={this.props.auth.user.foto} alt=""></img>
                                </div>
                                {/* <!-- Profile Text --> */}
                                <div className="profile-text">
                                    <h6>{this.props.auth.user.username}</h6>
                                    <span>{this.props.auth.user.lvl}</span>
                                </div>
                            </div>
                            <a onClick={this.handleLogout} className="dropdown-item"><i className="ti-unlink profile-icon bg-warning" aria-hidden="true"></i> Sign-out</a>
                        </div>
                    {/* </div> */}
                    </div>
                </li>
              </div>

              {/* <!-- Top Bar Nav --> */}
              <ul className={"right-side-content d-flex align-items-center " + (this.state.toggleMobileNav === true? "active":"")}>
                  {
                    isShowNotif?(
                        <li className={`full-screen-mode ml-1 animate__animated animate__bounceInRight`} style={{marginTop:"14px",cursor:"pointer"}} onClick={this.handleNotif}>
                            <div className="alert alert-danger" role="alert">
                                <p style={{color:"white"}}>Waktu pemakaian aplikasi tersisa {isDay} hari lagi, <button><i style={{color:"white"}} className="fa fa-eye"/></button></p>
                            </div>
                        </li>
                    ):""
                  }

                  <li className="nav-item dropdown">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={this.props.auth.user.foto} alt=""></img> <span className="active-status"></span></button>
                      <div className="dropdown-menu dropdown-menu-right">
                          {/* <!-- Top Notifications Area --> */}
                          <div className="user-profile-area">
                              <div className="user-profile-heading">
                                  {/* <!-- Thumb --> */}
                                  <div className="profile-img">
                                      <img className="chat-img mr-2" src={this.props.auth.user.foto} alt=""></img>
                                  </div>
                                  {/* <!-- Profile Text --> */}
                                  <div className="profile-text">
                                      <h6>{this.props.auth.user.username}</h6>
                                      <span>{this.props.auth.user.lvl}</span>
                                  </div>
                              </div>
                              <a onClick={this.handleLogout} className="dropdown-item" style={{cursor:"pointer"}}><i className="fa fa-chain-broken profile-icon bg-warning" aria-hidden="true"></i> Sign-out</a>
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
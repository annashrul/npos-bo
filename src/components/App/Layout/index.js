
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Header from '../Layout/header'
import SideMenu from '../Layout/sideMenu'
import {connect} from 'react-redux'
import Logo from "../../../assets/images/logo.png"

class Layout extends Component {

    componentWillMount() {
        document.title = this.props.page;
    }

    getFaviconEl() {
        return document.getElementById("favicon");
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            const favicon = this.getFaviconEl(); // Accessing favicon element
            favicon.href = nextProps.auth.user.fav_icon;
        }
    }

    render() {
        const style = {
            overflowY: 'auto',
            '::-webkit-scrollbar': {
                width: '0px',
                background: 'transparent'
            }
          };
        return (
            <div className={this.props.triggerEcaps?"ecaps-page-wrapper sidemenu-hover-deactive menu-collasped-active":"ecaps-page-wrapper sidemenu-hover-deactive"}>
                {/* Side Menu */}
                <div style={style} className="ecaps-sidemenu-area">
                    {/* Desktop Logo */}
                    <div className="ecaps-logo">
                        <Link to="/" style={{backgroundColor:'#242939'}}><img className="desktop-logo" src={this.props.auth.user.logo} alt="Desktop Logo" style={{paddingTop:'9px',height:"100px"}} /> <img className="small-logo" src={this.props.auth.user.logo} alt="Mobile Logo" /></Link>
                    </div>
                    {/* Side Nav */}
                    <div className="ecaps-sidenav" id="ecapsSideNav">
                        {/* Side Menu Area */}
                        <div className="side-menu-area">
                            {/* Sidebar Menu */}
                            <SideMenu/>
                        </div>
                    </div>
                </div>

                {/* Page Content */}

                <div className="ecaps-page-content">
                    {/* Top Header Area */}
                      <Header/>
                    {/* Main Content Area */}
                    <div className="main-content">
                        <div className="container-fluid">
                            {/* content */}
                            {
                                this.props.children
                            }

                        </div>
                    </div>
                    {/* Page Footer*/}
                    {/* <Footer/>        */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({auth,siteReducer}) =>{
     return{
       auth: auth,
       triggerEcaps: siteReducer.triggerEcaps
     }
}
export default connect(mapStateToProps)(Layout);

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
    render() {
        // if (!this.props.authenticated) {
        //     return <Redirect to = '/auth' /> ;
        // }
        return (
            <div className="ecaps-page-wrapper">
                {/* Side Menu */}
                <div className="ecaps-sidemenu-area">
                    {/* Desktop Logo */}
                    <div className="ecaps-logo">
                        <Link to="/"><img className="desktop-logo" src={Logo} alt="Desktop Logo" /> <img className="small-logo" src={Logo} alt="Mobile Logo" /></Link>
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

const mapStateToProps = ({auth}) =>{
     return{
       auth: auth
     }
}
export default connect(mapStateToProps)(Layout);
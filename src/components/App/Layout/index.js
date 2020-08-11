
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Header from '../Layout/header'
import SideMenu from '../Layout/sideMenu'
import {connect} from 'react-redux'
import Logo from "../../../assets/images/logo.png"
import FreeScrollbar from 'react-free-scrollbar';

class Layout extends Component {
    constructor(props){
        super(props);
        this.mouseEnterHandle = this.mouseEnterHandle.bind(this);
        this.mouseOutHandle = this.mouseOutHandle.bind(this);
        this.state = {
            sideHover:'deactive'
        }
    }

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

    mouseEnterHandle(){
        this.setState({
            sideHover:'active'
        })
    }
    mouseOutHandle(){
        this.setState({
            sideHover:'deactive'
        })
    }

    render() {
        console.log("props", this.props)
        const style = {
            overflowY: 'auto',
            '::-webkit-scrollbar': {
                width: '0px',
                background: 'transparent'
            }
          };
        return (
            <div className={this.props.triggerEcaps?"ecaps-page-wrapper sidemenu-hover-" + this.state.sideHover + " menu-collasped-active":"ecaps-page-wrapper " + (this.props.triggerMobileEcaps?"mobile-menu-active":"")}>
                {/* Side Menu */}
                <div className="ecaps-sidemenu-area" onMouseEnter={this.mouseEnterHandle} onMouseLeave={this.mouseOutHandle}>
                    {/* Desktop Logo */}
                    <div className="ecaps-logo">
                        <Link to="/" style={{backgroundColor:'#242939'}}><img className="desktop-logo" src={this.props.auth.user.logo} alt="Desktop Logo" style={{maxHeight:'50px'}} /> <img className="small-logo" src={this.props.auth.user.fav_icon} alt="Mobile Logo" /></Link>
                    </div>
                    {/* Side Nav */}
                    <div className="slimScrollDiv" style={{position: "relative", width: "auto", height: "100%"}}>
                            <div className="ecaps-sidenav" id="ecapsSideNav" style={{overflowY: "unset",width: "auto", height: "100%"}}>
                        <FreeScrollbar>
                                {/* Side Menu Area */}
                                <div className="side-menu-area" style={{paddingRight:'8px', marginTop:'unset'}}>
                                    {/* Sidebar Menu */}
                                    <SideMenu/>
                                </div>
                        </FreeScrollbar>
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
       triggerEcaps: siteReducer.triggerEcaps,
       triggerMobileEcaps: siteReducer.triggerMobileEcaps
     }
}
export default connect(mapStateToProps)(Layout);
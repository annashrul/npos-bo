import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            isMasterdata: false,
            isTransaction: false,
            isInventory: false,
            isReport: false,
            isReceive: false,
            pageMenu : ''
        }
        this.subChangeMenu = this.subChangeMenu.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
    }

    subChangeMenu(e){
        console.log(e);
        this.setState({isMasterdata : true});
        console.log(this.state.isMasterdata);
        console.log(this.state.isMasterdata===true?"treeview active menu-open" : "treeview")
    }

    changeMenu(param){
        const path = this.props.location.pathname;
        // let arrMenu = ['/user','/location'];
        // console.log(arrMenu.indexOf(path));
        // if(arrMenu.indexOf(path) === 0 || arrMenu.indexOf(path) === -1){
        //     this.setState({isMasterdata : !this.state.isMasterdata,});
        // }
        if(param === 'masterdata'){
            this.setState({isMasterdata : !this.state.isMasterdata});
        }
        if(param === 'transaction'){
            this.setState({isTransaction : !this.state.isTransaction});
        }
        if(param === 'report'){
            this.setState({isReport : !this.state.isReport});
        }
        if(param === 'receive'){
            this.setState({isReceive : !this.state.isReceive});
        }
    }

    render() {


        const path = this.props.location.pathname;
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree" style={{marginTop: '30%'}}>
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="zmdi zmdi-apps" />Dashboard </Link></li>
                    <li className={this.state.isMasterdata===true?"treeview active menu-open" : "treeview"}>
                        <a href="javascript:void(0)" onClick={(e) => this.changeMenu('masterdata')}><i className="zmdi zmdi-apps" /> <span>Masterdata</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/user'?"active":''}><Link to="/user"> <i className="zmdi zmdi-apps" />User</Link></li>
                            <li className={path==='/location'?"active":''}><Link to="/location"> <i className="zmdi zmdi-apps" />Location </Link></li>
                            <li className={path==='/department'?"active":''}><Link to="/department"> <i className="zmdi zmdi-apps" />Department </Link></li>
                            <li className={path==='/supplier'?"active":''}><Link to="/supplier"> <i className="zmdi zmdi-apps" />Supplier </Link></li>
                            <li className={path==='/sales'?"active":''}><Link to="/sales"> <i className="zmdi zmdi-apps" />Sales </Link></li>
                            <li className={path==='/cash'?"active":''}><Link to="/cash"> <i className="zmdi zmdi-apps" />Cash </Link></li>
                            <li className={path==='/customer'?"active":''}><Link to="/customer"> <i className="zmdi zmdi-apps" />Customer </Link></li>
                            <li className={path==='/product'?"active":''}><Link to="/product"> <i className="zmdi zmdi-apps" />Product </Link></li>
                            <li className={path==='/bank'?"active":''}><Link to="/bank"> <i className="zmdi zmdi-apps" />Bank </Link></li>
                        </ul>
                    </li>
                    <li className={this.state.isTransaction===true?"treeview active menu-open" : "treeview"}>
                        <a href="javascript:void(0)" onClick={(e) => this.changeMenu('transaction')}><i className="zmdi zmdi-apps" /> <span>Transaction</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/inventory'?"active":''}><Link to="/inventory"> <i className="zmdi zmdi-apps" />Ineventory</Link></li>
                            <li className={path==='/purchase'?"active":''}><Link to="/purchase"> <i className="zmdi zmdi-apps" />Purchase </Link></li>
                            <li className={path==='/sale'?"active":''}><Link to="/sale"> <i className="zmdi zmdi-apps" />Sale </Link></li>
                            <li className={path==='/debt'?"active":''}><Link to="/debt"> <i className="zmdi zmdi-apps" />Debt </Link></li>
                            <li className={path==='/account_receivable'?"active":''}><Link to="/account_receivable"> <i className="zmdi zmdi-apps" />Accounts Receivable</Link></li>
                        </ul>
                    </li>
                    <li className={
                        this.state.isReceive===true  ||
                        path==='/purchase_order' ||
                        path === '/receive'
                        ?"treeview active menu-open" : "treeview"}>
                        <a href="javascript:void(0)" onClick={(e) => this.changeMenu('receive')}><i className="zmdi zmdi-apps" /> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/purchase_order'?"active":''}><Link to="/purchase_order"> <i className="zmdi zmdi-apps" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''}><Link to="/receive"> <i className="zmdi zmdi-apps" />Receive Pembelian</Link></li>
                        </ul>
                    </li>
                    <li className={this.state.isReport===true?"treeview active menu-open" : "treeview"}>
                        <a href="javascript:void(0)" onClick={(e) => this.changeMenu('report')}><i className="zmdi zmdi-apps" /> <span>Report</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/inventory_report'?"active":''}><Link to="/inventory_report"> <i className="zmdi zmdi-apps" />Inventory</Link></li>
                            <li className={path==='/adjustment_report'?"active":''}><Link to="/adjustment_report"> <i className="zmdi zmdi-apps" />Adjustment</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        )
    }
}
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps)(SideMenu))
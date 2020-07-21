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
            isSale:false,
            pageMenu : '',
            dataUser:[],
            dataUser0:'',
            product:'',
            user:'',
            department:'',
            supplier:'',
            location:'',
            customer:'',
            cash:'',
            sales:'',
            bank:'',
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
        if(param === 'masterdata'){
            this.setState({isMasterdata : !this.state.isMasterdata});
            console.log("COUNTER",this.state.isMasterdata);
        }
        if(param === 'transaction'){
            this.setState({
                isTransaction : !this.state.isTransaction,
            });
        }
        if(param === 'report'){
            this.setState({isReport : !this.state.isReport});
        }
        if(param === 'receive'){
            this.setState({isReceive : !this.state.isReceive});
        }
        if(param === 'sale'){
            this.setState({isSale : !this.state.isSale});
        }
    }
    componentDidMount(){
        let dataUser=[];
        console.log("componentwillmount",this.props.auth.user.access);
        let loc =this.props.auth.user.access;
        if(loc!==undefined&&loc!==null){
            this.setState({
                product:this.props.auth.user.access[10]['label'],
                user:this.props.auth.user.access[11]['label'],
                department:this.props.auth.user.access[12]['label'],
                supplier:this.props.auth.user.access[13]['label'],
                location:this.props.auth.user.access[14]['label'],
                customer:this.props.auth.user.access[15]['label'],
                cash:this.props.auth.user.access[16]['label'],
                sales:this.props.auth.user.access[17]['label'],
                bank:this.props.auth.user.access[18]['label'],
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let loc =nextProps.auth.user.access;
            console.log(loc!==null?"aya":"kosong");
            if(loc!==undefined&&loc!==null){
                this.setState({
                    product:nextProps.auth.user.access[10]['label']!==null?nextProps.auth.user.access[10]['label']:"0",
                    user:nextProps.auth.user.access[11]['label']!==null?nextProps.auth.user.access[11]['label']:"0",
                    department:nextProps.auth.user.access[12]['label']!==null?nextProps.auth.user.access[12]['label']:"0",
                    supplier:nextProps.auth.user.access[13]['label']!==null?nextProps.auth.user.access[13]['label']:"0",
                    location:nextProps.auth.user.access[14]['label']!==null?nextProps.auth.user.access[14]['label']:"0",
                    customer:nextProps.auth.user.access[15]['label']!==null?nextProps.auth.user.access[15]['label']:"0",
                    cash:nextProps.auth.user.access[16]['label']!==null?nextProps.auth.user.access[16]['label']:"0",
                    sales:nextProps.auth.user.access[17]['label']!==null?nextProps.auth.user.access[17]['label']:"0",
                    bank:nextProps.auth.user.access[18]['label']!==null?nextProps.auth.user.access[18]['label']:"0",
                })
            }
        }
    }
    render() {
        // masterdata: [
        //     {id: 10, value: "0", isChecked: false,label:'product'},
        //     {id: 11, value: "0", isChecked: false,label:'user'},
        //     {id: 12, value: "0", isChecked: false,label:'department'},
        //     {id: 13, value: "0", isChecked: false,label:'supplier'},
        //     {id: 14, value: "0", isChecked: false,label:'location'},
        //     {id: 15, value: "0", isChecked: false,label:'customer'},
        //     {id: 16, value: "0", isChecked: false,label:'cash'},
        //     {id: 17, value: "0", isChecked: false,label:'sales'},
        //     {id: 18, value: "0", isChecked: false,label:'bank'},
        //     {id: 19, value: "0", isChecked: false,label:''},
        // ],
        const path = this.props.location.pathname;
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree" style={{marginTop: '30%'}}>
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="zmdi zmdi-apps" />Dashboard </Link></li>
                    <li  className={path==='/setting'?"active":''}><Link to="/"> <i className="zmdi zmdi-apps" />Setting </Link></li>
                    <li className={
                        this.state.isMasterdata===true || path==='/user'||
                        path==='/location' ||
                        path==='/department' ||
                        path==='/supplier' ||
                        path==='/sales' ||
                        path==='/cash' ||
                        path==='/customer' ||
                        path==='/product' ||
                        path==='/bank'
                            ?"treeview active menu-open" : "treeview"
                    }>
                        <a href="#" onClick={(e) => this.changeMenu('masterdata')}><i className="zmdi zmdi-apps" /> <span>Masterdata</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/product'?"active":''} style={this.state.product==="0"?{"display":"none"}:{"display":"block"}}><Link to="/product"> <i className="zmdi zmdi-apps" />Product</Link></li>
                            <li className={path==='/user'?"active":''} style={this.state.user==="0"?{"display":"none"}:{"display":"block"}}><Link to="/user"> <i className="zmdi zmdi-apps" />User</Link></li>
                            <li className={path==='/department'?"active":''} style={this.state.department==="0"?{"display":"none"}:{"display":"block"}}><Link to="/department"> <i className="zmdi zmdi-apps" />Department </Link></li>
                            <li className={path==='/supplier'?"active":''} style={this.state.supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/supplier"> <i className="zmdi zmdi-apps" />Supplier </Link></li>
                            <li className={path==='/location'?"active":''} style={this.state.location==="0"?{"display":"none"}:{"display":"block"}}><Link to="/location"> <i className="zmdi zmdi-apps" />Location </Link></li>
                            <li className={path==='/customer'?"active":''} style={this.state.customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/customer"> <i className="zmdi zmdi-apps" />Customer </Link></li>
                            <li className={path==='/cash'?"active":''} style={this.state.cash==="0"?{"display":"none"}:{"display":"block"}}><Link to="/cash"> <i className="zmdi zmdi-apps" />Cash </Link></li>
                            <li className={path==='/sales'?"active":''} style={this.state.sales==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sales"> <i className="zmdi zmdi-apps" />Sales </Link></li>
                            <li className={path==='/bank'?"active":''} style={this.state.bank==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bank"> <i className="zmdi zmdi-apps" />Bank </Link></li>
                            {/*<li className={path==='/bank'?"active":''}><Link to="/bank"> <i className="zmdi zmdi-apps" />Bank </Link></li>*/}
                        </ul>
                    </li>
                    <li className={this.state.isTransaction===true?"treeview active menu-open" : "treeview"}>
                        <a href="#" onClick={(e) => this.changeMenu('transaction')}><i className="zmdi zmdi-apps" /> <span>Transaction</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/inventory'?"active":''}><Link to="/inventory"> <i className="zmdi zmdi-apps" />Ineventory</Link></li>
                            <li className={path==='/purchase'?"active":''}><Link to="/purchase"> <i className="zmdi zmdi-apps" />Purchase </Link></li>
                            <li className={path==='/sale'?"active":''}><Link to="/sale"> <i className="zmdi zmdi-apps" />Sale </Link></li>
                            <li className={path==='/debt'?"active":''}><Link to="/debt"> <i className="zmdi zmdi-apps" />Debt </Link></li>
                            <li className={path==='/account_receivable'?"active":''}><Link to="/account_receivable"> <i className="zmdi zmdi-apps" />Accounts Receivable</Link></li>
                        </ul>
                    </li>
                    <li className={this.state.isReceive===true  || path==='/purchase_order' || path === '/receive' ?"treeview active menu-open" : "treeview"}>
                        <a href="#" onClick={(e) => this.changeMenu('receive')}><i className="zmdi zmdi-apps" /> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/purchase_order'?"active":''}><Link to="/purchase_order"> <i className="zmdi zmdi-apps" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''}><Link to="/receive"> <i className="zmdi zmdi-apps" />Receive Pembelian</Link></li>
                        </ul>
                    </li>
                    <li className={this.state.isSale===true  || path==='/sale'?"treeview active menu-open" : "treeview"}>
                        <a href="#" onClick={(e) => this.changeMenu('sale')}><i className="zmdi zmdi-apps" /> <span>Penjualan</span> <i className="fa fa-angle-right" /></a>
                        <ul className="treeview-menu">
                            <li className={path==='/sale'?"active":''}><Link to="/sale"> <i className="zmdi zmdi-apps" />Penjualan Barang</Link></li>
                        </ul>
                    </li>
                    <li className={this.state.isReport===true?"treeview active menu-open" : "treeview"}>
                        <a href="#" onClick={(e) => this.changeMenu('report')}><i className="zmdi zmdi-apps" /> <span>Report</span> <i className="fa fa-angle-right" /></a>
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
import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import MenuTemp from "../common/menuTemp";
import MenuTreeviewTemp from "../common/menuTreeviewTemp";
import MenuTreeviewSubTemp from "../common/menuTreeviewSubTemp";
import Preloader from "../../../Preloader";
import {groupByArray} from "../../../helper";

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            //################################## START PARENT MENU ###############################
            isMasterdata:false,
            isInventory:false,
            isReceive:false,
            isSale:false,
            isPaid:false,
            isReport: false,
            isSetting:false,
            //################################## END PARENT MENU ###############################
            //################################## START CHILD MENU ###############################
            isReportLog:false,
            isTrxOpname:false,
            isTrxPengiriman:false,
            isTrxMutasi:false,
            isReportInventory:false,
            isReportPembelian:false,
            isReportPenjualan:false,
            isReportPembayaran:false,
            isArea:false,
            //################################## END CHILD MENU ###############################
            //################################## START STATE DISPLAY MENU ACCESS ###############################
            isMasterdataDisplay:false,
            isProductionDisplay:false,
            isInventoryDisplay:false,
            isReceiveDisplay:false,
            isSaleDisplay:false,
            isPaidDisplay:false,
            isReportDisplay: false,
            isSettingDisplay:false,
            isBarcodeDisplay:false,

            isReportInventoryDisplay:false,
            isReportPembelianDisplay:false,
            isReportPenjualanDisplay:false,
            isReportPembayaranDisplay:false,
            isReportLogDisplay:false,

            //################################## END STATE DISPLAY MENU ACCESS ###############################
            aksesUser:[],
            menuReport:[],
            menuNameReport:[
                {label:'closing',state:''},
                {label:'kas',state:''},
                {label:'laba_rugi',state:''},
                {label:'produksi',state:''},
                {label:'penjualan',state:'isReportPenjualan',display:'isReportPenjualanDisplay'},
                {label:'inventory',state:'isReportInventory',display:'isReportInventoryDisplay'},
                {label:'pembelian',state:'isReportPembelian',display:'isReportPembelianDisplay'},
                {label:'pembayaran',state:'isReportPembayaran',display:'isReportPembayaranDisplay'},
                {label:'log',state:'isReportLog',display:'isReportLogDisplay'},
            ],
            arrState:[
                {temp:1,parent:0,range1:0,range2:10,label:'setting',display:'isSettingDisplay',state:'isSetting'},
                {temp:1,parent:1,range1:10,range2:20,label:'masterdata',display:'isMasterdataDisplay',state:'isMasterdata'},
                {temp:1,parent:2,range1:20,range2:30,label:'inventory',display:'isInventoryDisplay',state:'isInventory'},
                {temp:1,parent:3,range1:30,range2:40,label:'pembelian',display:'isReceiveDisplay',state:'isReceive'},
                {temp:1,parent:4,range1:40,range2:50,label:'transaksi',display:'isSaleDisplay',state:'isSale'},
                {temp:1,parent:5,range1:50,range2:60,label:'pembayaran',display:'isPaidDisplay',state:'isPaid'},
                {temp:2,parent:6,range1:60,range2:90,label:'laporan',display:'isReportDisplay',state:'isReport',data:[
                    {label:'closing',activeChild:''},
                    {label:'kas',activeChild:''},
                    {label:'laba_rugi',activeChild:''},
                    {label:'produksi',activeChild:''},
                    {label:'penjualan',activeChild:'isReportPenjualan',display:'isReportPenjualanDisplay'},
                    {label:'inventory',activeChild:'isReportInventory',display:'isReportInventoryDisplay'},
                    {label:'pembelian',activeChild:'isReportPembelian',display:'isReportPembelianDisplay'},
                    {label:'pembayaran',activeChild:'isReportPembayaran',display:'isReportPembayaranDisplay'},
                    {label:'log',activeChild:'isReportLog',display:'isReportLogDisplay'},
                ]},
                {temp:0,parent:7,range1:90,range2:100,label:'produksi',display:'isProductionDisplay',state:'isProduction'},
                {temp:0,parent:8,range1:100,range2:110,label:'cetak_barcode',display:'isBarcodeDisplay',state:'isBarcode'},
            ],
            isLoading:true,
            path:this.props.location.pathname,
        }
        this.menuChange = this.menuChange.bind(this);
    }

    menuChange(argument){
        this.setState({path:''})
        if(argument.parent!=='' && argument.child===''){
            this.setState({
                [argument.parent]:!this.state[argument.parent],
                [argument.child]:false
            });
            this.forceUpdate();
        }
        if(argument.child!==''){
            this.setState({[argument.child]:!this.state[argument.child]});
            this.forceUpdate();
        }
        if(argument.parent!==''&&argument.child!==''){
            this.setState({
                [argument.parent]:true,
                [argument.child]:!this.state[argument.child]
            });
            this.forceUpdate();
        }
        // this.forceUpdate();
    }
    handleMenuActive(param,active){
        const path = this.props.location.pathname;
        for(let i=0;i<param.length;i++){
            let val=param[i];
            if(val.label!==''){
                let labelReport=val.label.replaceAll(" ","_").replaceAll("Laporan_","").toLowerCase();
                let label=`/${val.label.replaceAll(" ","_").toLowerCase()}`;
                if(val.menu===''){
                    if(path===label){
                        this.setState({[active]:true});
                        break;
                    }
                }else{
                    for(let x=0;x<this.state.menuNameReport.length;x++){
                        if(`/report/${labelReport}`===path&&val.menu===this.state.menuNameReport[x]['label']){
                            this.setState({isReport:true,[this.state.menuNameReport[x]['state']]:true});
                            break;
                        }
                    }
                }
                continue;
            }
            break;
        }
    }
    handleDisplay(param,display){
        this.setState({isLoading:true});
        param.map(val=>{
            if(val.label!==''){
                if(val.value==='1'){
                    this.setState({[display]:true});
                }
            }
        });
        let group=groupByArray(param,menu=>menu['menu']);
        for(let i=0;i<this.state.menuNameReport.length;i++){
            let dataGroup = group.get(this.state.menuNameReport[i]['label']);
            if(dataGroup!==undefined){
                if(this.state.menuNameReport[i]['display']!==''){
                    for(let val=0;val<dataGroup.length;val++){
                        if(dataGroup[val]['value']==='1'){
                            this.setState({
                                [this.state.menuNameReport[i]['display']]:true,
                            });
                        }else{
                            this.setState({
                                [this.state.menuNameReport[i]['display']]:false,
                            });
                        }
                    }
                    continue;
                }
                continue;
            }

            break;

        }
    }
    getProps(param){
        this.setState({isLoading:true});
        if (param.auth.user) {
            let akses =param.auth.user.access;
            if(akses!==undefined&&akses!==null){
                let toArray=[];
                this.state.arrState.forEach((val,i)=>{
                    this.handleMenuActive(akses.slice(val.range1,val.range2),val.state);
                    this.handleDisplay(akses.slice(val.range1,val.range2),val.display);
                });

                if(akses.length>0){
                    akses.forEach((parent,i)=>{
                        toArray.push(parent);
                    });
                    this.setState({aksesUser:toArray,isLoading:false});
                }


            }

        }
    }
    componentDidMount(){
        this.getProps(this.props);
    }
    componentWillMount(){
        this.getProps(this.props);

    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }

    handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Apakah anda yakin akan logout aplikasi?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.value) {
                this.props.logoutUser();
            }
        })
    };
    render() {
        // const path = this.props.location.pathname;
        const {
            path,arrState,
            aksesUser,menuNameReport,
            isMasterdata,isInventory,isReceive,isSale,isPaid,isReport,isSetting,
            isMasterdataDisplay,isInventoryDisplay,isReceiveDisplay,isSaleDisplay,isPaidDisplay,isReportDisplay,isSettingDisplay,
        } = this.state;

        return (
            <nav>
                {
                    this.state.isLoading?<Preloader/>:(
                        <ul className="sidebar-menu" data-widget="tree">
                            {/* ########################################## DASHBOARD MODUL START ########################################## */}
                            <MenuTemp display={'1'} isActive={path==='/'?"active":''} path={"/"} icon={"fa fa-dashboard"} label={"Dashboard"}/>
                            {/* ########################################## DASHBOARD MODUL END ########################################## */}
                            {
                                (()=>{
                                    let child =[];

                                    arrState.map(val=>{
                                        if(aksesUser.length>0){
                                            let group=groupByArray(aksesUser,key=>key['parent']);
                                            let menu = group.get(val.parent);
                                            if(val.temp===0){
                                                child.push(
                                                    <MenuTemp display={'1'} isActive={path===`/${val.label}`?"active":''} path={`/${val.label}`} icon={"fa fa-dashboard"} label={val.label.replaceAll("_"," ")}/>
                                                )
                                            }
                                            else if(val.temp===1){
                                                child.push(
                                                    <MenuTreeviewTemp
                                                        changeMenu={this.menuChange.bind(this)}
                                                        isActive={this.state[val.state]}
                                                        isDisplay={this.state[val.display]}
                                                        arg1={val.state}
                                                        arg2={''}
                                                        icon={'zmdi zmdi-receipt'}
                                                        label={val.label}
                                                        path={path}
                                                        data={
                                                            (()=>{
                                                                let subChild =[];
                                                                menu.map(menuVal=>{
                                                                    if(menuVal.label!==''){
                                                                        subChild.push(
                                                                            {path:`${menuVal.label.replaceAll(" ","_").toLowerCase()}`,display:menuVal.value==='1',label:menuVal.label}
                                                                        )
                                                                    }
                                                                })
                                                                return subChild;
                                                            })()
                                                        }
                                                    />
                                                )
                                            }
                                            else{
                                                child.push(
                                                    <MenuTreeviewSubTemp
                                                        changeMenu={this.menuChange.bind(this)}
                                                        changeSubMenu={this.menuChange.bind(this)}
                                                        isActive={this.state[val.state]}
                                                        isDisplay={this.state[val.display]}
                                                        arg1={val.state}
                                                        arg2={''}
                                                        label={val.label}
                                                        path={path}
                                                        data={
                                                            (()=>{
                                                                let child =[];
                                                                let group=groupByArray(aksesUser,menu=>menu['menu']);
                                                                val.data.map(valKey=>{
                                                                    let dataGroup=group.get(valKey.label);
                                                                    child.push(
                                                                        {
                                                                            isActive:isReport&&this.state[valKey.activeChild], isDisplay:isReport&&this.state[valKey.display], arg1:valKey.activeChild, label:valKey.label.replaceAll("_"," ").toLowerCase(), path:`/report/${valKey.label}`,
                                                                            data:(()=>{
                                                                                let data=[];
                                                                                dataGroup.map((val,x)=>{
                                                                                    let label=val['label'].replaceAll("Laporan ","").toLowerCase();
                                                                                    data.push({isDisplay:val['value']==='1',label:label,path:'/report/'+label.replaceAll(" ","_").toLowerCase()})
                                                                                });
                                                                                return valKey.activeChild===''?undefined:data
                                                                            })()
                                                                        }
                                                                    )
                                                                })


                                                                return child;
                                                            })()
                                                        }
                                                    />
                                                )
                                            }


                                        }
                                        // console.log("array state",data);
                                    });
                                    return child;
                                })()


                            }

                            {/* ########################################## MASTERDATA MODUL START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isMasterdata}
                                isDisplay={isMasterdataDisplay}
                                arg1={'isMasterdata'}
                                arg2={''}
                                icon={'zmdi zmdi-receipt'}
                                label={'Masterdata'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=10; x<20; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                    // {path:path,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )
                                            }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## MASTERDATA MODUL END ########################################## */}
                            {/* ########################################## PRODUKSI MODUL START ########################################## */}
                            <MenuTemp display={this.state.produksi} isActive={path==='/production'?"active":''} path={"/production"} icon={"fa fa-product-hunt"} label={"Produksi"}/>
                            {/* ########################################## PRODUKSI MODUL END ########################################## */}
                            {/* ########################################## INVENTORY MODUL START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isInventory}
                                isDisplay={isInventoryDisplay}
                                arg1={'isInventory'}
                                arg2={''}
                                icon={'zmdi zmdi-storage'}
                                label={'Inventory'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=30; x<40; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )                                    }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## INVENTORY MODUL END ########################################## */}
                            {/* ########################################## PEMBELIAN MODUL START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isReceive}
                                isDisplay={isReceiveDisplay}
                                arg1={'isReceive'}
                                arg2={''}
                                icon={'zmdi zmdi-storage'}
                                label={'Pembelian'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=40; x<50; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )                                    }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## PEMBELIAN MODUL END ########################################## */}
                            {/* ########################################## TRANSAKSI MODUL START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isSale}
                                isDisplay={isSaleDisplay}
                                arg1={'isSale'}
                                arg2={''}
                                icon={'fa fa-shopping-cart'}
                                label={'Transaksi'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=50; x<60; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )                                    }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## TRANSAKSI MODUL END ########################################## */}
                            {/* ########################################## PEMBAYARAN SECTION START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isPaid}
                                isDisplay={isPaidDisplay}
                                arg1={'isPaid'}
                                arg2={''}
                                icon={'fa fa-money'}
                                label={'Pembayaran'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=60; x<70; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )                                    }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## PEMBAYARAN SECTION END ########################################## */}
                            {/* ########################################## LAPORAN MODUL START ########################################## */}
                            <MenuTreeviewSubTemp
                                changeMenu={this.menuChange.bind(this)}
                                changeSubMenu={this.menuChange.bind(this)}
                                isActive={isReport}
                                isDisplay={isReportDisplay}
                                arg1={'isReport'}
                                arg2={''}
                                labelParent={'Laporan'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        let group=groupByArray(aksesUser,menu=>menu['menu']);
                                        menuNameReport.map(arg=>{
                                            let dataGroup=group.get(arg['label']);
                                            child.push(
                                                {
                                                    isActive:isReport&&this.state[arg['state']], isDisplay:isReport&&this.state[arg['display']], arg1:arg['state'], label:arg['label'].replaceAll("_"," ").toLowerCase(), path:`/report/${arg['label']}`,
                                                    data:(()=>{
                                                        let data=[];
                                                        dataGroup.map((val,x)=>{
                                                            let label=val['label'].replaceAll("Laporan ","").toLowerCase();
                                                            data.push({isDisplay:val['value']==='1',label:label,path:'/report/'+label.replaceAll(" ","_").toLowerCase()})
                                                        });
                                                        return arg['state']===''?undefined:data
                                                    })()
                                                }
                                            )
                                        })
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## LAPORAN MODUL END ########################################## */}
                            {/* ########################################## START MODUL CETAK BARCODE ########################################## */}
                            <li className={path==='/cetak_barcode'?"active":''}><Link to="/cetak_barcode"> <i className="fa fa-barcode" /><span>Cetak Barcode </span></Link></li>
                            {/* ########################################## MODUL CETAK BARCODE END ########################################## */}
                            {/* ########################################## SETTINGS MODUL START ########################################## */}
                            <MenuTreeviewTemp
                                changeMenu={this.menuChange.bind(this)}
                                isActive={isSetting}
                                isDisplay={isSettingDisplay}
                                arg1={'isSetting'}
                                arg2={''}
                                icon={'fa fa-gears'}
                                label={'Pengaturan'}
                                path={path}
                                data={
                                    aksesUser.length>0?(()=>{
                                        let child =[];
                                        for(let x=0; x<10; x++){
                                            if(aksesUser[x]['label']!==''){
                                                child.push(
                                                    {path:`${aksesUser[x]['label'].replaceAll(" ","_").toLowerCase()}`,display:aksesUser[x]['value']==='1',label:aksesUser[x]['label']}
                                                )                                    }
                                        }
                                        return child;
                                    })():[]
                                }
                            />
                            {/* ########################################## SETTINGS MODUL END ########################################## */}
                            {/* ########################################## LOGOUT MODUL START ########################################## */}
                            <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-chain-broken" /><span> Logout</span></a></li>
                            {/* ########################################## LOGOUT MODUL END ########################################## */}
                        </ul>
                    )
                }

            </nav>
        )
    }
}
SideMenu.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps,{logoutUser})(SideMenu))
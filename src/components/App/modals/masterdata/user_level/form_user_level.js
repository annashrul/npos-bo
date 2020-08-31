import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createUserLevel,
    FetchUserLevel,
    updateUserLevel
} from "redux/actions/masterdata/user_level/user_level.action";
import {FetchUserList, updateUserList} from "redux/actions/masterdata/user_list/user_list.action";
import {ModalToggle} from "redux/actions/modal.action";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class FormUserLevel extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            setting: [
                {id: 0, value: "0", isChecked: false,label:'Pengaturan Umum'},
                {id: 1, value: "0", isChecked: false,label:'Pengguna'},
                {id: 2, value: "0", isChecked: false,label:'lokasi'},
                {id: 3, value: "0", isChecked: false,label:''},
                {id: 4, value: "0", isChecked: false,label:''},
                {id: 5, value: "0", isChecked: false,label:''},
                {id: 6, value: "0", isChecked: false,label:''},
                {id: 7, value: "0", isChecked: false,label:''},
                {id: 8, value: "0", isChecked: false,label:''},
                {id: 9, value: "0", isChecked: false,label:''},
            ],
            masterdata: [
                {id: 10, value: "0", isChecked: false,label:'Barang'},
                {id: 11, value: "0", isChecked: false,label:'Departemen'},
                {id: 12, value: "0", isChecked: false,label:'Supplier'},
                {id: 13, value: "0", isChecked: false,label:'Customer'},
                {id: 14, value: "0", isChecked: false,label:'Kas'},
                {id: 15, value: "0", isChecked: false,label:'Sales'},
                {id: 16, value: "0", isChecked: false,label:'Bank'},
                {id: 17, value: "0", isChecked: false,label:'Promo'},
                {id: 18, value: "0", isChecked: false,label:''},
                {id: 19, value: "0", isChecked: false,label:''},
            ],
            inventory: [
                {id: 20, value: "0", isChecked: false,label:'Delivery Note'},
                {id: 21, value: "0", isChecked: false,label:'Alokasi'},
                {id: 22, value: "0", isChecked: false,label:'Approval Mutasi'},
                {id: 23, value: "0", isChecked: false,label:'Adjusment'},
                {id: 24, value: "0", isChecked: false,label:'Opname'},
                {id: 25, value: "0", isChecked: false,label:'Approval Opname'},
                {id: 26, value: "0", isChecked: false,label:'Packing'},
                {id: 27, value: "0", isChecked: false,label:'Approval Mutasi Jual Beli'},
                {id: 28, value: "0", isChecked: false,label:'Bayar Mutasi Jual Beli'},
                {id: 29, value: "0", isChecked: false,label:''},
            ],
            pembelian: [
                {id: 30, value: "0", isChecked: false,label:'Purchase Order'},
                {id: 31, value: "0", isChecked: false,label:'Receive Pembelian'},
                {id: 32, value: "0", isChecked: false,label:'Retur Tanpa Nota'},
                {id: 33, value: "0", isChecked: false,label:''},
                {id: 34, value: "0", isChecked: false,label:''},
                {id: 35, value: "0", isChecked: false,label:''},
                {id: 36, value: "0", isChecked: false,label:''},
                {id: 37, value: "0", isChecked: false,label:''},
                {id: 38, value: "0", isChecked: false,label:''},
                {id: 39, value: "0", isChecked: false,label:''},
            ],
            penjualan: [
                {id: 40, value: "0", isChecked: false,label:'penjualan barang'},
                {id: 41, value: "0", isChecked: false,label:''},
                {id: 42, value: "0", isChecked: false,label:''},
                {id: 43, value: "0", isChecked: false,label:''},
                {id: 44, value: "0", isChecked: false,label:''},
                {id: 45, value: "0", isChecked: false,label:''},
                {id: 46, value: "0", isChecked: false,label:''},
                {id: 47, value: "0", isChecked: false,label:''},
                {id: 48, value: "0", isChecked: false,label:''},
                {id: 49, value: "0", isChecked: false,label:''},
            ],
            pembayaran: [
                {id: 50, value: "0", isChecked: false,label:'Hutang'},
                {id: 51, value: "0", isChecked: false,label:'Piutang'},
                {id: 52, value: "0", isChecked: false,label:''},
                {id: 53, value: "0", isChecked: false,label:''},
                {id: 54, value: "0", isChecked: false,label:''},
                {id: 55, value: "0", isChecked: false,label:''},
                {id: 56, value: "0", isChecked: false,label:''},
                {id: 57, value: "0", isChecked: false,label:''},
                {id: 58, value: "0", isChecked: false,label:''},
                {id: 59, value: "0", isChecked: false,label:''},
            ],
            report: [
                {id: 60, value: "0", isChecked: false,label:'Closing'},
                {id: 61, value: "0", isChecked: false,label:'Kas'},
                {id: 62, value: "0", isChecked: false,label:'Laba Rugi'},
                {id: 63, value: "0", isChecked: false,label:'Produksi'},
                {id: 64, value: "0", isChecked: false,label:'Arsip Penjualan'},
                {id: 65, value: "0", isChecked: false,label:'Arsip Retur Penjualan'},
                {id: 66, value: "0", isChecked: false,label:'Penjualan By Customer'},
                {id: 67, value: "0", isChecked: false,label:'Stock'},
                {id: 68, value: "0", isChecked: false,label:'Adjusment'},
                {id: 69, value: "0", isChecked: false,label:'Alokasi'},
                {id: 70, value: "0", isChecked: false,label:'Delivery Note'},
                {id: 71, value: "0", isChecked: false,label:'Opname'},
                {id: 72, value: "0", isChecked: false,label:'Mutasi'},
                {id: 73, value: "0", isChecked: false,label:'Alokasi Transaksi'},
                {id: 74, value: "0", isChecked: false,label:'Expedisi'},
                {id: 75, value: "0", isChecked: false,label:'Purchase Order'},
                {id: 76, value: "0", isChecked: false,label:'Receive Pembelian'},
                {id: 77, value: "0", isChecked: false,label:'Arsip Pembelian By Supplier'},
                {id: 78, value: "0", isChecked: false,label:'Hutang'},
                {id: 79, value: "0", isChecked: false,label:'Piutang'},
            ],
            produksi: [
                {id: 100, value: "0", isChecked: false,label:'Produksi'},
                {id: 101, value: "0", isChecked: false,label:''},
                {id: 102, value: "0", isChecked: false,label:''},
                {id: 103, value: "0", isChecked: false,label:''},
                {id: 104, value: "0", isChecked: false,label:''},
                {id: 105, value: "0", isChecked: false,label:''},
                {id: 106, value: "0", isChecked: false,label:''},
                {id: 107, value: "0", isChecked: false,label:''},
                {id: 108, value: "0", isChecked: false,label:''},
                {id: 109, value: "0", isChecked: false,label:''},
            ],
            cetak_barcode: [
                {id: 110, value: "0", isChecked: false,label:'Cetak Barcode'},
                {id: 111, value: "0", isChecked: false,label:''},
                {id: 112, value: "0", isChecked: false,label:''},
                {id: 113, value: "0", isChecked: false,label:''},
                {id: 114, value: "0", isChecked: false,label:''},
                {id: 115, value: "0", isChecked: false,label:''},
                {id: 116, value: "0", isChecked: false,label:''},
                {id: 117, value: "0", isChecked: false,label:''},
                {id: 118, value: "0", isChecked: false,label:''},
                {id: 119, value: "0", isChecked: false,label:''},
            ],
            lvl : "",
            access : [],
            error:{
                lvl:""
            }

        }
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({lvl:""});
        this.setState({})
    };
    handleLoopAccess(moduls=[],nextProps=[]){
        console.log(moduls);
        if(nextProps!==null)
            moduls.forEach(modul=>{
                for(let i=0;i<nextProps.length;i++){
                    if(modul.id === nextProps[i].id){
                        if(nextProps[i].label==="1"){
                            modul.isChecked = true;
                        }
                        this.setState({cek:nextProps[i].label})
                        modul.value = nextProps[i].label;
                    }
                }
            });
            return moduls;

    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (nextProps.detail !== undefined && nextProps.detail !== []) {
            let akses = [];
            this.handleLoopAccess(
                this.state.setting.concat(this.state.masterdata).concat(this.state.inventory).concat(this.state.pembelian).concat(this.state.penjualan).concat(this.state.pembayaran).concat(this.state.report).concat(this.state.produksi).concat(this.state.cetak_barcode),
                nextProps.detail.access);
            this.setState({lvl:nextProps.detail.lvl});
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        let akses = [];

        this.state.setting.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.masterdata.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.produksi.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.inventory.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.pembelian.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.penjualan.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.pembayaran.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.report.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        this.state.cetak_barcode.forEach(val=>{
            akses.push({"id":val.id,"label":val.value,"name":val.label});
        });
        parseData['lvl'] = this.state.lvl;
        parseData['access'] = akses;
        console.log(parseData);
        let err = this.state.error;
        if(parseData['lvl']===''){
            err = Object.assign({}, err, {lvl:"nama user level tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(this.props.detail !==undefined){
                this.props.dispatch(updateUserLevel(this.props.detail.id,parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(createUserLevel(parseData));
                this.props.dispatch(ModalToggle(false));
            }
        }


    }
    handleAllChecked = (event,param) => {
        let moduls = this.state[param];
        moduls.forEach(modul => {
            modul.isChecked = event.target.checked;
            modul.value = modul.label!==''?modul.isChecked === false ? "0":"1":"0";
        });
        this.setState({param: moduls});
    };
    handleCheckChieldElement = (event,param) => {
        let moduls = this.state[param];
        console.log(event.target.getAttribute("id"));
        moduls.forEach(modul => {
            if (modul.label === event.target.getAttribute("id")){
                modul.isChecked =  event.target.checked;
                modul.value = modul.label!==''? modul.isChecked === false ? "0":"1":"0";
            }
        });
        this.setState({param: moduls});
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah User Level":"Ubah User Level"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="lvl" value={this.state.lvl}  onChange={(e)=>this.handleChange(e)} />
                                    <div className="invalid-feedback"
                                         style={this.state.error.lvl !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.lvl}
                                    </div>
                                </div>
                                {/*START SECTION SETTING*/}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'setting')}  value="checkedall" /> <b style={{color:'red'}}>Setting</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.setting.map((modul, index) => {
                                            return (
                                                modul.label!==''?
                                                    <div className="col-md-3" key={index} >
                                                        <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                            <input onChange={(e)=>this.handleCheckChieldElement(e,'setting')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                        </div>
                                                    </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION SETTING */}

                                {/* START SECTION MASTERDATA */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'masterdata')}  value="checkedall" /> <b style={{color:'red'}}>Masterdata</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.masterdata.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'masterdata')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION MASTERDATA */}
                                {/*START SECTION PRODUKSI*/}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'produksi')}  value="checkedall" /> <b style={{color:'red'}}>Produksi</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.produksi.map((modul, index) => {
                                            return (
                                                modul.label!==''?
                                                    <div className="col-md-2" key={index} >
                                                        <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                            <input onChange={(e)=>this.handleCheckChieldElement(e,'produksi')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                        </div>
                                                    </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION PRODUKSI */}
                                {/* START SECTION INVENTORY */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'inventory')}  value="checkedall" /> <b style={{color:'red'}}>Inventory</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.inventory.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'inventory')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION INVENTORY */}
                                {/* START SECTION PEMBELIAN */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'pembelian')}  value="checkedall" /> <b style={{color:'red'}}>Pembelian</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.pembelian.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'pembelian')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION PEMBELIAN */}
                                {/* START SECTION PENJUALAN */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'penjualan')}  value="checkedall" /> <b style={{color:'red'}}>Penjualan</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.penjualan.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'penjualan')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION PENJUALAN */}
                                {/* START SECTION PEMBAYARAN */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'pembayaran')}  value="checkedall" /> <b style={{color:'red'}}>Pembayaran</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.pembayaran.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'pembayaran')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION PEMBAYARAN */}
                                {/* START SECTION REPORT */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'report')}  value="checkedall" /> <b style={{color:'red'}}>Report</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.report.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'report')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                {/* END SECTION REPORT */}
                                {/* START SECTION CETAK BARCODE */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'cetak_barcode')}  value="checkedall" /> <b style={{color:'red'}}>Cetak Barcode</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.cetak_barcode.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-3" key={index}>
                                                    <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'cetak_barcode')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                <hr/>
                                {/* END SECTION CETAK BARCODE */}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-danger mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Close</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Save</button>
                        </div>
                    </ModalFooter>
                </form>
            </WrapperModal>
        );
    }
}
//
// export const CheckBox = props => {
//     return (
//         <div>
//             <input key={props.id} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.value} /> {props.label}
//         </div>
//     )
// }
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(FormUserLevel);

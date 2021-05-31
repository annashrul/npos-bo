import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createUserLevel,
    updateUserLevel
} from "redux/actions/masterdata/user_level/user_level.action";
import {
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";

import {ModalToggle} from "redux/actions/modal.action";

class FormUserLevel extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            setting         : [
                {id: 0, value: "0", isChecked: false,label:'Pengaturan Umum'},
                {id: 1, value: "0", isChecked: false,label:'Pengguna'},
                {id: 2, value: "0", isChecked: false,label:'Lokasi'},
                {id: 3, value: "0", isChecked: false,label:''},
                {id: 4, value: "0", isChecked: false,label:''},
                {id: 5, value: "0", isChecked: false,label:''},
                {id: 6, value: "0", isChecked: false,label:''},
                {id: 7, value: "0", isChecked: false,label:''},
                {id: 8, value: "0", isChecked: false,label:''},
                {id: 9, value: "0", isChecked: false,label:''},
            ],
            masterdata      : [
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
            inventory       : [
                {id: 20, value: "0", isChecked: false,label:'Delivery Note'},
                {id: 21, value: "0", isChecked: false,label:'Alokasi'},
                {id: 22, value: "0", isChecked: false,label:'Approval Mutasi'},
                {id: 23, value: "0", isChecked: false,label:'Adjusment'},
                {id: 24, value: "0", isChecked: false,label:'Opname'},
                {id: 25, value: "0", isChecked: false,label:'Approval Opname'},
                {id: 26, value: "0", isChecked: false,label:'Packing'},
                {id: 29, value: "0", isChecked: false,label:'Expedisi'},
                {id: 27, value: "0", isChecked: false,label:'Approval Mutasi Jual Beli'},
                {id: 28, value: "0", isChecked: false,label:'Bayar Mutasi Jual Beli'},
            ],
            pembelian       : [
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
            transaksi       : [
                {id: 40, value: "0", isChecked: false,label:'Penjualan Barang'},
                {id: 41, value: "0", isChecked: false,label:'Transaksi Kas'},
                {id: 42, value: "0", isChecked: false,label:''},
                {id: 43, value: "0", isChecked: false,label:''},
                {id: 44, value: "0", isChecked: false,label:''},
                {id: 45, value: "0", isChecked: false,label:''},
                {id: 46, value: "0", isChecked: false,label:''},
                {id: 47, value: "0", isChecked: false,label:''},
                {id: 48, value: "0", isChecked: false,label:''},
                {id: 49, value: "0", isChecked: false,label:''},
            ],
            pembayaran      : [
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
            report          : [
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
                {id: 77, value: "0", isChecked: false,label:'Pembelian By Supplier'},
                {id: 78, value: "0", isChecked: false,label:'Hutang'},
                {id: 79, value: "0", isChecked: false,label:'Piutang'},
                {id: 80, value: "0", isChecked: false,label:'Omset Penjualan'},
                {id: 81, value: "0", isChecked: false,label:'Omset Penj. Periode'},
            ],
            produksi        : [
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
            cetak_barcode   : [
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
            lvl             : "",
            access          : [],
            array_modul     : ['setting','masterdata','produksi','inventory','pembelian','transaksi','pembayaran','report','cetak_barcode'],
            error           : {
                lvl:""
            }
        }
    }
    clearState(){
        this.setState({
            setting         : [
                {id: 0, value: "0", isChecked: false,label:'Pengaturan Umum'},
                {id: 1, value: "0", isChecked: false,label:'Pengguna'},
                {id: 2, value: "0", isChecked: false,label:'Lokasi'},
                {id: 3, value: "0", isChecked: false,label:''},
                {id: 4, value: "0", isChecked: false,label:''},
                {id: 5, value: "0", isChecked: false,label:''},
                {id: 6, value: "0", isChecked: false,label:''},
                {id: 7, value: "0", isChecked: false,label:''},
                {id: 8, value: "0", isChecked: false,label:''},
                {id: 9, value: "0", isChecked: false,label:''},
            ],
            masterdata      : [
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
            inventory       : [
                {id: 20, value: "0", isChecked: false,label:'Delivery Note'},
                {id: 21, value: "0", isChecked: false,label:'Alokasi'},
                {id: 22, value: "0", isChecked: false,label:'Approval Mutasi'},
                {id: 23, value: "0", isChecked: false,label:'Adjusment'},
                {id: 24, value: "0", isChecked: false,label:'Opname'},
                {id: 25, value: "0", isChecked: false,label:'Approval Opname'},
                {id: 26, value: "0", isChecked: false,label:'Packing'},
                {id: 29, value: "0", isChecked: false,label:'Expedisi'},
                {id: 27, value: "0", isChecked: false,label:'Approval Mutasi Jual Beli'},
                {id: 28, value: "0", isChecked: false,label:'Bayar Mutasi Jual Beli'},
            ],
            pembelian       : [
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
            transaksi       : [
                {id: 40, value: "0", isChecked: false,label:'Penjualan Barang'},
                {id: 41, value: "0", isChecked: false,label:'Transaksi Kas'},
                {id: 42, value: "0", isChecked: false,label:''},
                {id: 43, value: "0", isChecked: false,label:''},
                {id: 44, value: "0", isChecked: false,label:''},
                {id: 45, value: "0", isChecked: false,label:''},
                {id: 46, value: "0", isChecked: false,label:''},
                {id: 47, value: "0", isChecked: false,label:''},
                {id: 48, value: "0", isChecked: false,label:''},
                {id: 49, value: "0", isChecked: false,label:''},
            ],
            pembayaran      : [
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
            report          : [
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
                {id: 77, value: "0", isChecked: false,label:'Pembelian By Supplier'},
                {id: 78, value: "0", isChecked: false,label:'Hutang'},
                {id: 79, value: "0", isChecked: false,label:'Piutang'},
                {id: 80, value: "0", isChecked: false,label:'Omset Penjualan'},
                {id: 81, value: "0", isChecked: false,label:'Omset Penj. Periode'},
            ],
            produksi        : [
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
            cetak_barcode   : [
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
            lvl             : "",
            access          : [],
            error           : {
                lvl:""
            }
        })
    }
    getProps(param){
        if (param.detail !== undefined && param.detail !== []) {
            let array=[];
            this.state.array_modul.map(val=>{
                array.push(...this.state[val]);
                return val;
            });
            this.handleLoopAccess(
                array,
                param.detail.access
            );
            this.setState({lvl:param.detail.lvl});
        }
        else{
            this.clearState();
        }
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();
    };
    handleLoopAccess(moduls=[],nextProps=[]){
        if(nextProps!==null){
            moduls.forEach(modul=>{
                for(let i=0;i<nextProps.length;i++){
                    if(modul.id === nextProps[i].id){
                        modul.isChecked = nextProps[i].isChecked;
                        modul.value = nextProps[i].value;
                    }
                }
            });
            return moduls;
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
        moduls.forEach(modul => {
            if (modul.label === event.target.getAttribute("id")){
                modul.isChecked =  event.target.checked;
                modul.value = modul.label!==''? modul.isChecked === false ? "0":"1":"0";
            }
        });
        this.setState({param: moduls});
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    handleSubmit(e){
        e.preventDefault();
        let form        = e.target;
        let data        = new FormData(form);
        let parseData   = stringifyFormData(data);
        let akses       = [];
        let err         = this.state.error;

        this.state.array_modul.forEach(val=>{
            this.state[val].forEach(key=>{
                akses.push({id: key.id, value:key.value, isChecked:key.isChecked, label:key.label})
            })
        });

        parseData['lvl']    = this.state.lvl;
        parseData['access'] = akses;


        if(parseData['lvl']===''){
            err = Object.assign({}, err, {lvl:"nama user level tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(this.props.detail !==undefined){
                this.props.dispatch(updateUserLevel(this.props.detail.id,parseData));
                this.props.dispatch(ModalToggle(false));
                this.clearState();
            }else{
                this.props.dispatch(createUserLevel(parseData));
                this.props.dispatch(ModalToggle(false));
                this.clearState();
            }
        }
    }
    render(){
        const {array_modul} = this.state;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah User Level":"Ubah User Level"}</ModalHeader>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Nama User Level</label>
                                    <input type="text" className="form-control" name="lvl" value={this.state.lvl}  onChange={(e)=>this.handleChange(e)} />
                                    <div className="invalid-feedback" style={this.state.error.lvl !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.lvl}
                                    </div>
                                </div>

                            </div>
                            {
                                array_modul.map((val,i)=>{
                                    return (
                                        <div className="col-12" key={i}>
                                            <div className="form-group">
                                                <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,val)}  value="checkedall" /> <b style={{color:'red'}}>{val.replace('_',' ').toUpperCase()}</b>
                                            </div>
                                            <div className="row">
                                                {
                                                    this.state[val].map((modul, index) => {
                                                        return (
                                                            modul.label!==''? <div className="col-md-3" key={index} >
                                                                <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                                    <input onChange={(e)=>this.handleCheckChieldElement(e,val)} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                                </div>
                                                            </div>:''
                                                        )
                                                    })
                                                }
                                            </div>
                                            <hr/>
                                        </div>
                                    );
                                })
                            }

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

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(FormUserLevel);

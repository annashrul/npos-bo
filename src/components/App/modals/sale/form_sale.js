import React,{Component} from 'react';
import WrapperModal from "components/App/modals/_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {toRp} from "helper";
import {FetchBank} from "redux/actions/masterdata/bank/bank.action";
import Preloader from "../../../../Preloader";
import {storeSale} from "../../../../redux/actions/sale/sale.action";

class FormSale extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            isTransfer:false,
            error:{
                tunai:"",
                bank:"",
            },
            gt:0,
            kode_trx:'',
            jenis_trx:"TUNAI",
            tunai:0,
            change:0,
            bank:''
        };
    }

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps",nextProps);
        if(nextProps.master!==undefined&&nextProps.master!==[]){
            console.log(nextProps.master.kode_trx);
            this.state.gt=nextProps.master.gt;
            this.state.kode_trx=nextProps.master.kode_trx;
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        if(event.target.name === 'tunai'){
            let tunai=event.target.value;
            this.setState({
                change:parseInt(tunai)-this.state.gt
            });
            Object.assign(this.props.master,{
                tunai:this.state.tunai,
                change:this.state.change,
                jenis_trx:this.state.jenis_trx,
                pemilik_kartu:"-",
                kartu:"-"
            });
        }
        if(event.target.name==='jenis_trx'){
            if(event.target.value === "TRANSFER"){
                this.setState({isTransfer:true});
                let bank = this.state.bank.split("-");
                console.log("split",bank);
                Object.assign(this.props.master,{
                    tunai:this.state.tunai,
                    change:this.state.change,
                    jenis_trx:event.target.value,
                    pemilik_kartu:bank[1],
                    kartu:bank[0]
                });
            }else{
                this.setState({isTransfer:false})

            }
        }
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    handleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        if (this.state.tunai === "" || this.state.tunai === 0){
            console.log("if pertama");
            if(this.state.tunai==="" || this.state.tunai === 0){
                console.log("if kedua");
                err = Object.assign({}, err, {
                    tunai:"Jumlah uang tidak boleh kurang dari total pembayaran"
                });
            }
            this.setState({
                error: err
            })
        }else{
            let parsedata={};
            parsedata['master']=this.props.master;
            parsedata['split'] = [];
            parsedata['join'] = [];
            parsedata['detail']=this.props.detail;
            console.log("SUBMITED",parsedata);
            this.props.dispatch(storeSale(parsedata));
        }

    }
    componentWillMount(){
        this.props.dispatch(FetchBank(1,'',100));
    }
    render(){
        const {data} = this.props.bank;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSale"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Pembayaran":this.state.kode_trx}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-success">TOTAL = <b>{this.state.gt}</b></button>
                        </div>
                        <div className="col-md-6" style={{textAlign:"right"}}>
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Simpan</button>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="">Jenis Pembayaran</label>
                                <select name="jenis_trx" id="jenis_trx" className="form-control" value={this.state.jenis_trx} defaultValue={this.state.jenis_trx} onChange={this.handleChange}>
                                    <option value="TUNAI">TUNAI</option>
                                    <option value="TRANSFER">TRANSFER</option>
                                    {/*<option value="KREDIT">KREDIT</option>*/}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Jumlah Uang</label>
                                <input type="text" name="tunai" id="tunai" className="form-control" value={this.state.tunai} onChange={this.handleChange}/>
                                <div className="invalid-feedback"
                                     style={this.state.error.tunai !== "" || this.state.error.tunai !== "0" ? {display: 'block'} : {display: 'none'}}>
                                    {this.state.error.tunai}
                                </div>
                            </div>
                            {/*TRANSFER*/}
                            {
                                this.state.isTransfer===true?(
                                    !this.props.isLoading ? (
                                        <div className="form-group">
                                            <label htmlFor="">BANK</label>
                                            <select name="bank" id="bank" className="form-control" value={this.state.bank} defaultValue={this.state.bank} onChange={this.handleChange}>
                                                <option value="">PILIH BANK</option>
                                                {
                                                    typeof data === 'object' ? data.map((v,i)=>{
                                                        return (
                                                            <option value={`${v.nama}-${v.akun}`}>{v.nama} || {v.akun}</option>
                                                        );
                                                    }) : ""
                                                }

                                                {/*<option value="KREDIT">KREDIT</option>*/}
                                            </select>
                                        </div>
                                    ): <Preloader/>
                                ):""
                            }
                            {/*END TRANSFER*/}
                            <div className="form-group">
                                <label htmlFor="">Kembalian</label>
                                <input readOnly type="text" name="change" id="change" className="form-control" value={this.state.change} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                </ModalBody>

            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        bank:state.bankReducer.data,
        isLoading: state.bankReducer.isLoading,
    }
}
export default connect(mapStateToProps)(FormSale);
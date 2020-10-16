import React,{Component} from 'react';
import WrapperModal from "components/App/modals/_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {FetchBank} from "redux/actions/masterdata/bank/bank.action";
import Preloader from "../../../../Preloader";
import {storeSale} from "../../../../redux/actions/sale/sale.action";
import {toCurrency,rmComma} from 'helper';
import {
    withRouter
} from 'react-router-dom';
import moment from 'moment'
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
                tanggal_tempo:"",
            },
            gt:0,
            kode_trx:'',
            jenis_trx:"Tunai",
            tunai:0,
            tanggal_tempo:'',
            change:0,
            bank:''
        };
        this.handleSetTunai = this.handleSetTunai.bind(this)
    }

    componentWillReceiveProps(nextProps){
        
        if(nextProps.master!==undefined&&nextProps.master!==[]){
            this.setState({
                gt:nextProps.master.gt,
                kode_trx:nextProps.master.kode_trx
            })
        }
    }

    handleChange = (event) => {
        
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.name)
        console.log(event.target.value)
        if(event.target.name === 'tunai'){
            let tunai=event.target.value;
            if(tunai<0){
                
                tunai = 0;
            }
            this.setState({
                change:parseInt(rmComma(tunai),10)-this.state.gt
            });
            Object.assign(this.props.master,{
                tunai:rmComma(this.state.tunai),
                change:this.state.change,
                jenis_trx:this.state.jenis_trx,
                pemilik_kartu:"-",
                kartu:"-"
            });
        }
        if(event.target.name==='jenis_trx'){
            if(event.target.value === "Transfer"){
                this.setState({isTransfer:true});
                let bank = this.state.bank.split("-");
                
                Object.assign(this.props.master,{
                    tunai:rmComma(this.state.tunai),
                    change:this.state.change,
                    jenis_trx:event.target.value,
                    pemilik_kartu:bank[1],
                    kartu:bank[0]
                });
            }else{
                this.setState({isTransfer:false})

            }
        }
        if(event.target.value === 'Kredit'){
            
            this.setState({
                change:0,
                tunai:0,
            });
            Object.assign(this.props.master,{
                change:0,
                tunai:rmComma(this.state.tunai),
                jenis_trx:event.target.value,
            });
        }
        if(event.target.name.toLowerCase() === 'dp'){
            
            this.setState({
                change:0,
                tunai:event.target.value,
            });
            Object.assign(this.props.master,{
                change:0,
                tunai:rmComma(this.state.tunai),
            });
        }
        if(event.target.name === 'tanggal_tempo'){
            Object.assign(this.props.master,{
                tempo:event.target.value,
            });
        }
    }

    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    handleSetTunai(e){
        e.preventDefault();
        this.setState({
            tunai: this.state.gt
        })
    }
    handleSubmit(e){
        e.preventDefault();
        
        let err = this.state.error;
        if (this.state.jenis_trx.toLowerCase() === 'kredit'){
            if(parseFloat(this.state.tunai.toString().replace(/,/g,''))<0){
                err = Object.assign({}, err, {
                    tunai:"Nominal masih kosong!"
                });
                this.setState({
                    error: err
                })
            } else if(this.state.tanggal_tempo===""){
                err = Object.assign({}, err, {
                    tanggal_tempo:"Tanggal masih kosong!"
                });
                this.setState({
                    error: err
                })
            } else {
                let parsedata = {};
                parsedata['master'] = this.props.master;
                parsedata['split'] = [];
                parsedata['join'] = [];
                parsedata['detail'] = this.props.detail;
    
                let newparse = {};
                newparse['parsedata'] = parsedata;
                newparse['alamat'] = this.props.lokasi.alamat;
                newparse['site_title'] = this.props.auth.user.site_title === undefined?this.props.auth.user.title:this.props.auth.user.site_title;
                this.props.dispatch(storeSale(newparse, (arr) => this.props.history.push(arr)));
            }
        }else{ 
            if(parseFloat(this.state.tunai.toString().replace(/,/g,''))<this.state.gt){
                err = Object.assign({}, err, {
                    tunai:"Jumlah uang tidak boleh kurang dari total pembayaran"
                });
                this.setState({
                    error: err
                })
            }else{
                let parsedata={};
                parsedata['master']=this.props.master;
                parsedata['split'] = [];
                parsedata['join'] = [];
                parsedata['detail']=this.props.detail;

                let newparse = {};
                newparse['parsedata'] = parsedata;
                newparse['alamat'] = this.props.lokasi.alamat;
                newparse['site_title'] = this.props.auth.user.site_title === undefined?this.props.auth.user.title:this.props.auth.user.site_title;

                this.props.dispatch(storeSale(newparse,(arr)=>this.props.history.push(arr)));
            }
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
                            <button className="btn btn-success" onClick={(event)=>this.handleSetTunai(event)} data-toggle="tooltip" title="Masukan total ke jumlah uang.">TOTAL: <b>{toCurrency(this.state.gt)}</b></button>

                        </div>
                        <div className="col-md-6" style={{textAlign:"right"}}>
                            <button className="btn btn-primary" onClick={this.handleSubmit} style={parseInt(this.state.change,10)>=0?{display:''}:{display:'none'}}>Simpan</button>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="">Jenis Pembayaran</label>
                                <select name="jenis_trx" id="jenis_trx" className="form-control" value={this.state.jenis_trx} defaultValue={this.state.jenis_trx} onChange={this.handleChange}>
                                    <option value="Tunai">TUNAI</option>
                                    <option value="Transfer">TRANSFER</option>
                                    <option value="Kredit">KREDIT</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">{this.state.jenis_trx==='Kredit'?'Jumlah DP':'Jumlah Uang'}</label>
                                <input type="text" name={this.state.jenis_trx==='Kredit'?'dp':'tunai'} id={this.state.jenis_trx==='Kredit'?'dp':'tunai'} className="form-control" value={toCurrency(this.state.tunai)} onFocus={function(e){e.currentTarget.select()}} onKeyUp={this.handleChange} onChange={this.handleChange}/>
                                <div className="invalid-feedback"
                                     style={this.state.error.tunai !== "" || this.state.error.tunai !== "0" ? {display: 'block'} : {display: 'none'}}>
                                    {this.state.error.tunai}
                                </div>
                            </div>
                            <div className="form-group" style={{display:this.state.jenis_trx==='Kredit'?'':'none'}}>
                                <label htmlFor="">Tanggal Tempo</label>
                                <input type="date" name={"tanggal_tempo"} min={moment(new Date()).add(1,'days').format("yyyy-MM-DD")} className="form-control" value={this.state.tanggal_tempo} onChange={this.handleChange}/>
                                <div className="invalid-feedback"
                                     style={this.state.error.tanggal_tempo !== "" || this.state.error.tanggal_tempo !== "0" ? {display: 'block'} : {display: 'none'}}>
                                    {this.state.error.tanggal_tempo}
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
                            <div className="form-group" style={{display:this.state.jenis_trx==='Kredit'?'none':'block'}}>
                                <label htmlFor="">Kembalian</label>
                                <input readOnly type="text" name="change" id="change" className="form-control" value={toCurrency(this.state.change)} onChange={this.handleChange}/>
                                <div className="invalid-feedback text-center" style={parseInt(this.state.change,10)<0?{display:'block'}:{display:'none'}}>
                                    Kembalian Masih (Minus)
                                </div>
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
        auth:state.auth,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        bank:state.bankReducer.data,
        isLoading: state.bankReducer.isLoading,
    }
}
export default withRouter(connect(mapStateToProps)(FormSale));
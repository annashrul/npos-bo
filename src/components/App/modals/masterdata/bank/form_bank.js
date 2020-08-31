import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "helper";
import {createBank} from "redux/actions/masterdata/bank/bank.action";
import {updateBank} from "../../../../../redux/actions/masterdata/bank/bank.action";

class FormBank extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            id:"",
            akun:'',
            nama:'',
            edc: '',
            status: '',
            charge_debit:'',
            charge_kredit:'',
            foto:"",
            token:'',
            error:{
                akun:'',
                nama:'',
                edc: '',
                status: '',
                charge_debit:'',
                charge_kredit:'',
                foto:"",
            }
        };
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    getProps(param){
        if(Object.keys(param.detail).length > 0){
            this.setState({
                id:param.detail.id,
                akun:param.detail.akun,
                nama:param.detail.nama,
                edc:param.detail.edc,
                status:param.detail.status,
                charge_debit:param.detail.charge_debit,
                charge_kredit:param.detail.charge_kredit,
                foto:"",
            })
        }else{
            this.setState({
                id:'',
                akun:'',
                nama:'',
                edc: '',
                status: '',
                charge_debit:'',
                charge_kredit:'',
                foto:"",
            })
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({});
    };
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nama'] = this.state.nama;
        parseData['akun'] = this.state.akun;
        parseData['edc'] = this.state.edc;
        parseData['status'] = this.state.status;
        parseData['charge_debit'] = this.state.charge_debit;
        parseData['charge_kredit'] = this.state.charge_kredit;
        let err = this.state.error;
        if(parseData['akun']===''||parseData['akun']===undefined){
            err = Object.assign({}, err, {akun:"nama akun tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['nama']===''||parseData['nama']===undefined){
            err = Object.assign({}, err, {nama:"nama bank tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['edc']===''||parseData['edc']===undefined){
            err = Object.assign({}, err, {edc:"edc tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['charge_debit']===''||parseData['charge_debit']===undefined){
            err = Object.assign({}, err, {charge_debit:"charge debit tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['charge_kredit']===''||parseData['charge_kredit']===undefined){
            err = Object.assign({}, err, {charge_kredit:"charge kredit tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(parseData['foto']!==undefined){
                parseData['foto'] = this.state.foto.base64;
            }else{
                parseData['foto'] = '-';
            }
            if(Object.keys(this.props.detail).length > 0){
                this.props.dispatch(updateBank(this.state.id,parseData));
            }else{
                this.props.dispatch(createBank(parseData));
            }

            this.props.dispatch(ModalToggle(false));
        }

    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBank"} size="md">
                <ModalHeader toggle={this.toggle}>{Object.keys(this.props.detail).length > 0?"Ubah Bank":"Tambah Bank"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nama Akun</label>
                            <input type="text" className="form-control" name="akun" value={this.state.akun} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.akun !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.akun}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nama Bank</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.nama}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>EDC</label>
                            <select name="edc" className="form-control" id="edc" defaultValue={this.state.edc} value={this.state.edc} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="1">Aktif</option>
                                <option value="0">Tidak Aktif</option>
                            </select>
                            <div className="invalid-feedback"
                                 style={this.state.error.edc !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.edc}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Charge Debit</label>
                            <input type="text" className="form-control" name="charge_debit" value={this.state.charge_debit} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.charge_debit !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.charge_debit}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Charge Credit</label>
                            <input type="text" className="form-control" name="charge_kredit" value={this.state.charge_kredit} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.charge_kredit !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.charge_kredit}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" className="form-control" id="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="1">Aktif</option>
                                <option value="0">Tidak Aktif</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                            <FileBase64
                                multiple={ false }
                                className="mr-3 form-control-file"
                                onDone={ this.getFiles.bind(this) } />
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Cancel</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
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
export default connect(mapStateToProps)(FormBank);
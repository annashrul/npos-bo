import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "../../../../actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "../../../../helper";
import {createBank} from "../../../../actions/masterdata/bank/bank.action";

class FormBank extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            akun:'',
            nama:'',
            edc: '1',
            status: '1',
            charge_debit:'0',
            charge_kredit:'0',
            foto:"",
            token:''
        };
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
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
        parseData['foto'] = this.state.foto.base64;
        // console.log(parseData);
        // console.log(this.props.token);
        this.props.dispatch(createBank(parseData,this.props.token));
        this.props.dispatch(ModalToggle(false));
    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBank"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Bank":"Update Bank"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Account Name</label>
                            <input type="text" className="form-control" name="akun" value={this.state.akun} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>EDC</label>
                            <select name="edc" className="form-control" id="edc" defaultValue={this.state.edc} value={this.state.edc} onChange={this.handleChange}>
                                <option value="1">Active</option>
                                <option value="0">In Active</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Charge Debit</label>
                            <input type="text" className="form-control" name="charge_debit" value={this.state.charge_debit} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Charge Credit</label>
                            <input type="text" className="form-control" name="charge_kredit" value={this.state.charge_kredit} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                            <FileBase64
                                multiple={ false }
                                className="mr-3 form-control-file"
                                onDone={ this.getFiles.bind(this) } />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" className="form-control" id="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                <option value="1">Active</option>
                                <option value="0">In Active</option>
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
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
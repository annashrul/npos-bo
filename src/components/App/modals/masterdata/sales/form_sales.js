import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createSales, updateSales} from "redux/actions/masterdata/sales/sales.action";
class FormSales extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            nama:'',status:'',
            error:{nama:'',status:''}
        };
    }
    getProps(param){
        if (param.detail !== [] && param.detail !== undefined) {
            this.setState({
                nama: param.detail.nama,
                status: param.detail.status,
                kode: param.detail.kode,
            })
        }else{
            this.setState({
                nama:'',status:'',kode:''
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps)
    }
    componentWillMount(){
        this.getProps(this.props);
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nama'] = this.state.nama;
        parseData['status'] = this.state.status;
        parseData['kode'] = this.state.kode;
        let err = this.state.error;

        if(parseData['nama']===''||parseData['nama']===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if (this.props.detail !== undefined) {
                console.log(this.state.kode);
                this.props.dispatch(updateSales(this.state.kode,parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(createSales(parseData));
                this.props.dispatch(ModalToggle(false));
            }
        }



    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSales"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah Sales":"Ubah Sales"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
                            <div className="invalid-feedback"
                                 style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.nama}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" className="form-control" id="type" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="0">Tidak Aktif</option>
                                <option value="1">Aktif</option>
                            </select>
                            <div className="invalid-feedback"
                                 style={this.state.error.status !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.status}
                            </div>
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
export default connect(mapStateToProps)(FormSales);
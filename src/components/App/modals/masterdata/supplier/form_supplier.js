import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "../../../../actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "../../../../helper";
import {createSupplier, updateSupplier} from "../../../../actions/masterdata/supplier/supplier.action";
class FormSupplier extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            kode:'', nama:'',alamat:'',kota:'',telp:'0',penanggung_jawab:'',no_penanggung_jawab:'0',status:'1',email:''
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            this.setState({
                kode: nextProps.detail.kode,
                nama: nextProps.detail.nama,
                alamat: nextProps.detail.alamat,
                kota: nextProps.detail.kota,
                telp: nextProps.detail.telp,
                penanggung_jawab: nextProps.detail.penanggung_jawab,
                no_penanggung_jawab: nextProps.detail.no_penanggung_jawab,
                status: nextProps.detail.status,
                email: nextProps.detail.email,
            })
        }else{
            this.setState({
                kode:'', nama:'',alamat:'',kota:'',telp:'0',penanggung_jawab:'',no_penanggung_jawab:'0',status:'1',email:''
            })
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
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
        parseData['alamat'] = this.state.alamat;
        parseData['kota'] = this.state.kota;
        parseData['telp'] = this.state.telp;
        parseData['penanggun_jawab'] = this.state.penanggun_jawab;
        parseData['no_penanggun_jawab'] = this.state.no_penanggun_jawab;
        parseData['status'] = this.state.status;
        parseData['email'] = this.state.email;

        if (this.props.detail !== undefined) {
            console.log(this.state.kode);
            this.props.dispatch(updateSupplier(this.state.kode,parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createSupplier(parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }


    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSupplier"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Supplier":"Update Supplier"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" className="form-control" name="kota" value={this.state.kota} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="number" className="form-control" name="telp" value={this.state.telp} onChange={this.handleChange}  />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Responsible</label>
                                    <input type="text" className="form-control" name="penanggung_jawab" value={this.state.penanggung_jawab} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Responsible No</label>
                                    <input type="text" className="form-control" name="no_penanggung_jawab" value={this.state.no_penanggung_jawab} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" className="form-control" id="type" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                        <option value="0">In Active</option>
                                        <option value="1">Active</option>
                                    </select>
                                </div>
                            </div>
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
export default connect(mapStateToProps)(FormSupplier);
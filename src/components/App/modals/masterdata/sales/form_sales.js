import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createSales, updateSales} from "redux/actions/masterdata/sales/sales.action";
import Select from 'react-select'
class FormSales extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.state = {
            nama:'',status:'',
            location_data:[],
            location:"",
            error:{nama:'',status:'',
                location:"",}
        };
    }
    getProps(param){
        if (param.detail !== [] && param.detail !== undefined) {
            let data = this.state.location_data.filter(item => item.value === param.detail.lokasi);
            this.setState({
                nama: param.detail.nama,
                status: param.detail.status,
                kode: param.detail.kode,
                location: data,
            })
        }else{
            this.setState({
                nama:'',status:'',kode:''
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.user) {
            let lk = [];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                    userid: nextProps.auth.user.id
                })
                localStorage.setItem('location_sales_data_form', JSON.stringify(lk));
            }
        }
        
        this.getProps(nextProps)
    }
    componentDidMount(){
        if(localStorage.location_sales_data_form!==undefined&&localStorage.location_sales_data_form!==''){
            
            this.setState({
                lokasi_data:JSON.parse(localStorage.location_sales_data_form)
            })
        }
        this.getProps(this.props);
    }
    // componentWillMount(){
    // }

    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk,
            error: err
        })
        localStorage.setItem('location_sales', lk);
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
        parseData['lokasi'] = this.state.location.value;
        parseData['kode'] = this.state.kode;
        let err = this.state.error;

        if(parseData['nama']===''||parseData['nama']===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(this.state.location===''||this.state.location===undefined){
            err = Object.assign({}, err, {status:"lokasi tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if (this.props.detail !== undefined) {
                this.props.dispatch(updateSales(this.state.kode,parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(createSales(parseData));
                this.props.dispatch(ModalToggle(false));
            }
        }



    }

    render(){
        const lok_val = this.state.location;
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
                            <label>Lokasi</label>
                            <Select
                                options={this.state.location_data}
                                placeholder="Pilih Lokasi"
                                onChange={this.HandleChangeLokasi}
                                value={lok_val}
                            />
                            <div className="invalid-feedback"
                                 style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.location}
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
        auth:state.auth,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(FormSales);
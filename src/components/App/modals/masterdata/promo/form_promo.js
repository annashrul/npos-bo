import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "helper";
import {createPromo} from "redux/actions/masterdata/promo/promo.action";
import {updatePromo} from "../../../../../redux/actions/masterdata/promo/promo.action";
import {toMoney} from "../../../../../helper";

class FormPromo extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toCurrency = this.toCurrency.bind(this);
        this.handleChange = this.handleChange  .bind(this);
        this.state = {
            akun:0,
            nama:'',
            category: '-',
            status: '1',
            charge_debit:'0',
            charge_kredit:'0',
            foto:"",
            token:''
        };
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    getProps(param){
        if(param.detail!==undefined&&param.detail!==[]){
            this.setState({
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
                akun:'',
                nama:'',
                category: '-',
                status: '1',
                charge_debit:'0',
                charge_kredit:'0',
                foto:"",
            })
        }
    }

    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        this.setState({ [column]: value});
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
        if(this.state.foto!==undefined){
            parseData['foto'] = this.state.foto.base64;
        }else{
            parseData['foto'] = '-';
        }
        if(this.props.detail!==undefined&&this.props.detail!==null){
            this.props.dispatch(updatePromo(this.props.detail.id,parseData));
        }else{
            this.props.dispatch(createPromo(parseData));
        }

        this.props.dispatch(ModalToggle(false));
    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };
    toCurrency(number) {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        });

        return formatter.format(number);
    }
    render(){

        const kategori = this.props.kategori;
        console.log(kategori);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPromo"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Promo":"Update Promo"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Account Name</label>
                            <input type="text" className="form-control" name="akun" value={this.toCurrency(this.state.akun)} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" className="form-control" id="category" defaultValue={this.state.category} value={this.state.category} onChange={this.handleChange}>
                            <option value="-">Choose Category</option>
                            {kategori.map((v,i)=>{
                                return(
                                    <option value={v.kode} key={i}>{v.title}</option>
                                )
                            })}
                            </select>
                        </div>

                        <div className="form-group" style={{display:this.state.category==='brg'?'block':'none'}}>
                            <label>Product Code</label>
                            <input type="text" className="form-control" name="kd_brg" value={this.toCurrency(this.state.kd_brg)} onChange={this.handleChange} required/>
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
export default connect(mapStateToProps)(FormPromo);
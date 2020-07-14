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
            nama:'',status:'1'
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            this.setState({
                nama: nextProps.detail.nama,
                status: nextProps.detail.status,
                kode: nextProps.detail.kode,
            })
        }else{
            this.setState({
                nama:'',status:'1',kode:''
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
        parseData['status'] = this.state.status;
        parseData['kode'] = this.state.kode;

        if (this.props.detail !== undefined) {
            console.log(this.state.kode);
            this.props.dispatch(updateSales(this.state.kode,parseData));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createSales(parseData));
            this.props.dispatch(ModalToggle(false));
        }


    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSales"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Sales":"Update Sales"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
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
export default connect(mapStateToProps)(FormSales);
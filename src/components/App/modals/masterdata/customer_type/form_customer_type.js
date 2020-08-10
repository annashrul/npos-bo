import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createCustomerType,
    updateCustomerType
} from "redux/actions/masterdata/customer_type/customer_type.action";
class FormCustomerType extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            kode:'', nama:'',
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            this.setState({
                kode: nextProps.detail.kode,
                nama: nextProps.detail.nama,
            })
        }else{
            this.setState({
                kode:"",nama:""
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
        if (this.props.detail !== undefined) {
            this.props.dispatch(updateCustomerType(this.props.detail.kode,parseData));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createCustomerType(parseData));
            this.props.dispatch(ModalToggle(false));
        }
    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCustomerType"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Customer Type":"Update Customer Type"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
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
export default connect(mapStateToProps)(FormCustomerType);
import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {LOC_VERIF} from "redux/actions/_constants";
import Swal from "sweetalert2";
class FormLocationPrompt extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            password:''
        };
    }

    componentWillMount(){
        this.setState({
            password:''
        })
    }
    componentWillReceiveProps(nextProps) {
       
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({
            password:''
        })
    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['password'] = this.state.password;
        if(btoa(parseData['password'])===LOC_VERIF.password){
            this.props.dispatch(ModalType("formLocation"));
        } else {
            Swal.fire({allowOutsideClick: false,
                title: 'Gagal!',
                text: "Untuk info lebih lanjut, silahkan hubungi cs.",
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok!'
            }).then((result) => {
                this.props.dispatch(ModalToggle(false));
            })
        }
    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formLocationPrompt"} size="sm">
                <ModalHeader toggle={this.toggle}>Verifikasi.</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    {/* <label>Kode Verifikasi</label> */}
                                    <input type="password" className="form-control" name="password" placeholder="Kode Verifikasi" value={this.state.password} onChange={this.handleChange}  />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-sm btn-warning mr-2" onClick={e=>this.toggle(e)}><i className="ti-close" /> Cancel</button>
                            <button type="submit" className="btn btn-sm btn-primary" ><i className="fa fa-check-circle-o" /> Check</button>
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
export default connect(mapStateToProps)(FormLocationPrompt);
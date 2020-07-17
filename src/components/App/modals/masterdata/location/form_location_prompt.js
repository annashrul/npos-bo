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
        // console.log(this.props.dataLocationEdit);
        // const {nextprops} = this.props.dataLocationEdit;
        // console.log(moment(this.props.dataLocationEdit.tgl_ultah).format('DD/MM/yyyy'));
        this.setState({
            password:''
        })
    }
    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps.dataLocationEdit);
        // if (nextProps.dataLocationEdit !== [] && nextProps.dataLocationEdit !== undefined) {
        //     this.setState({
        //         kd_cust:nextProps.dataLocationEdit.kd_cust,
        //         nama:nextProps.dataLocationEdit.nama,
        //         alamat:nextProps.dataLocationEdit.alamat,
        //         status:nextProps.dataLocationEdit.status,
        //         tgl_ultah:nextProps.dataLocationEdit.tgl_ultah,
        //         tlp:nextProps.dataLocationEdit.tlp,
        //         cust_type:nextProps.dataLocationEdit.cust_type,
        //         password:nextProps.dataLocationEdit.password,
        //         register:nextProps.dataLocationEdit.register,
        //         foto:nextProps.dataLocationEdit.foto,
        //         email:nextProps.dataLocationEdit.email,
        //         biografi:nextProps.dataLocationEdit.biografi,
        //         special_price:nextProps.dataLocationEdit.special_price,
        //         jenis_kelamin:nextProps.dataLocationEdit.jenis_kelamin,
        //         discount:nextProps.dataLocationEdit.discount,
        //     })
        // }else{
        //     this.setState({
        //         kd_cust:'',
        //         nama:'',
        //         alamat:'',
        //         status:'1',
        //         tgl_ultah:'-',
        //         tlp:'0',
        //         cust_type:'-',
        //         password:'',
        //         register:'-',
        //         foto:'-',
        //         jenis_kelamin:'1',
        //         email:'',
        //         biografi:'',
        //         special_price:'1',
        //         discount:'0'
        //     })
        // }
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
        // console.log("===============", parseData['password']);
        // console.log("===============", LOC_VERIF.password);
        if(parseData['password']==LOC_VERIF.password){
            // this.props.dispatch(ModalToggle(false));
            this.props.dispatch(ModalType("formLocation"));
        } else {
            Swal.fire({
                title: 'Failed!',
                text: "We could not verify you!",
                type: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: '#d33',
                confirmButtonText: 'Ok!'
            }).then((result) => {
                this.props.dispatch(ModalToggle(false));
            })
        }
    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formLocationPrompt"} size="sm">
                <ModalHeader toggle={this.toggle}>{"Authentication"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange}  />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mr-2"><i className="ti-close" /> Cancel</button>
                            <button type="submit" className="btn btn-primary" ><i className="ti-save" /> Verify</button>
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
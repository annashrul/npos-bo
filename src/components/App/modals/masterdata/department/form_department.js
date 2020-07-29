import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createDepartment, updateDepartment} from "redux/actions/masterdata/department/department.action";

class FormDepartment extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            nama:'',
            id:'',
            error:{
                nama:"",
            },
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
    componentWillReceiveProps(nextProps) {
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            console.log(nextProps.detail);
            this.setState({
                nama: nextProps.detail.nama,
                id:nextProps.detail.id
            })
        }else{
            this.setState({
                nama: '',
                id:''
            })
        }
    }
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        console.log(parseData);
        parseData['nama'] = this.state.nama;
        let err = this.state.error;
        if(this.state.nama===''||this.state.nama===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
            return;
        }else{
            if(this.props.detail===undefined){
                this.props.dispatch(createDepartment(parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                console.log(this.state.id);
                this.props.dispatch(updateDepartment(this.state.id,parseData));
                this.props.dispatch(ModalToggle(false));
            }
        }



    }

    render(){
        // console.log(this.props.detail);

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formDepartment"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Department":"Update Department"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.nama}
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
export default connect(mapStateToProps)(FormDepartment);
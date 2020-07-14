import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createDepartment, updateDepartment} from "redux/actions/masterdata/department/department.action";
import {
    createSubDepartment,
    updateSubDepartment
} from "redux/actions/masterdata/department/sub_department.action";

class FormSubDepartment extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            kode:'',
            nama:'',
            id:''
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
                kode:nextProps.detail.kode,
                id:nextProps.detail.id,
            })
        }else{
            console.log('props kosong');
            this.setState({
                nama: '',
                kode:'',
                id:'',
            })
        }
    }
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        console.log(parseData);
        parseData['kode'] = this.state.kode;
        parseData['nama'] = this.state.nama;
        // console.log(this.props.token);
        if(this.props.detail===undefined){
            this.props.dispatch(createSubDepartment(parseData));
            this.props.dispatch(ModalToggle(false));
        }else{
            console.log(this.state.id);
            this.props.dispatch(updateSubDepartment(this.state.kode,parseData));
            this.props.dispatch(ModalToggle(false));
        }


    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSubDepartment"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Sub Department":"Update Sub Department"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Code</label>
                            <input type="text" className="form-control" name="kode" value={this.state.kode} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} required/>
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
export default connect(mapStateToProps)(FormSubDepartment);
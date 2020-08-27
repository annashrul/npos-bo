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
import Select from "react-select";

class FormSubDepartment extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeDept = this.HandleChangeDept.bind(this);
        this.state = {
            dataKode:[],
            kode:'',
            nama:'',
            kode_dept:'',
            error:{
                kode_dept:"",
                nama:""
            }
        };

    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {
            [event.target.name]: ""
        });
        this.setState({
            error: err
        });
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    getProps(param){
        console.log(param);
        if(param.dataDepartment!==undefined&&param.dataDepartment!==[]){
            let dept = [];
            let depProps = param.dataDepartment.data;
            if(depProps!==undefined){
                depProps.map((i) => {
                    dept.push({
                        value: i.id,
                        label: i.nama
                    });
                });
                this.setState({
                    dataKode: dept,
                })
            }
        }


        if (param.detail !== [] && param.detail !== undefined) {

            console.log(param.detail);
            this.setState({
                nama: param.detail.nama,
                kode:param.detail.kode,
                kode_dept:param.detail.kode_dept,
            })
        }
        else{
            console.log('props kosong');
            this.setState({
                nama: '',
                kode:'',
                kode_dept:'',
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    HandleChangeDept(dept) {
        let err = Object.assign({}, this.state.error, {
            kode_dept: ""
        });
        this.setState({
            kode_dept:dept.value,
            error: err
        })

    }
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['kode_dept'] = this.state.kode_dept;
        parseData['nama'] = this.state.nama;
        // console.log(this.props.token);
        let err = this.state.error;
        if(this.state.kode_dept===''||this.state.kode_dept===undefined){
            err = Object.assign({}, err, {kode_dept:"departemen tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(this.state.nama===''||this.state.nama===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(this.props.detail===undefined){
                this.props.dispatch(createSubDepartment(parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(updateSubDepartment(this.state.kode,parseData));
                this.props.dispatch(ModalToggle(false));
            }

        }




    }

    render(){
        console.log("LIST DEPARTMENT",this.props.dataDepartment);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSubDepartment"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah Sub Departemen":"Ubah Sub Departemen"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label className="control-label font-12">
                                Departemen
                            </label>
                            <Select
                                options={this.state.dataKode}
                                placeholder="Pilih Department"
                                onChange={this.HandleChangeDept}
                                value={
                                    this.state.dataKode.find(op => {
                                        return op.value === this.state.kode_dept
                                    })
                                }

                            />
                            <div className="invalid-feedback"
                                 style={this.state.error.kode_dept !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.kode_dept}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.nama}
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
export default connect(mapStateToProps)(FormSubDepartment);
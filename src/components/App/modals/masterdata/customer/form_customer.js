import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "../../../../actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "../../../../helper";
import {
    createLocation,
    updateLocation
} from "../../../../actions/masterdata/location/location.action";
import {createCustomer, setCustomerEdit, updateCustomer} from "../../../../actions/masterdata/customer/customer.action";
import FileBase64 from "react-file-base64";
import moment from 'moment';
class FormCustomer extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            kd_cust:'',
            nama:'',
            alamat:'',
            status:'1',
            tgl_ultah:'',
            tlp:'0',
            cust_type:'-',
            password:'',
            register:'-',
            foto:'-',
            jenis_kelamin:'1',
            email:'',
            biografi:'',
            special_price:'1',
            discount:'0'
        };
    }



    componentWillMount(){
        // console.log(this.props.dataCustomerEdit);
        // const {nextprops} = this.props.dataCustomerEdit;
        // console.log(moment(this.props.dataCustomerEdit.tgl_ultah).format('DD/MM/yyyy'));
        if(this.props.dataCustomerEdit!==undefined){
            this.setState({
                kd_cust:this.props.dataCustomerEdit.kd_cust,
                nama:this.props.dataCustomerEdit.nama,
                alamat:this.props.dataCustomerEdit.alamat,
                status:this.props.dataCustomerEdit.status,
                tgl_ultah:moment(this.props.dataCustomerEdit.tgl_ultah).format('yyyy-MM-DD'),
                tlp:this.props.dataCustomerEdit.tlp,
                cust_type:this.props.dataCustomerEdit.cust_type,
                password:'',
                register:this.props.dataCustomerEdit.register,
                foto:this.props.dataCustomerEdit.foto,
                email:this.props.dataCustomerEdit.email,
                biografi:this.props.dataCustomerEdit.biografi,
                special_price:this.props.dataCustomerEdit.special_price,
                jenis_kelamin:this.props.dataCustomerEdit.jenis_kelamin,
                discount:this.props.dataCustomerEdit.discount,
            })
        }else{
            this.setState({
                kd_cust:'',
                nama:'',
                alamat:'',
                status:'1',
                tgl_ultah:'-',
                tlp:'0',
                cust_type:'-',
                password:'',
                register:'-',
                foto:'-',
                jenis_kelamin:'1',
                email:'',
                biografi:'',
                special_price:'1',
                discount:'0'
            })
        }

    }
    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps.dataCustomerEdit);
        // if (nextProps.dataCustomerEdit !== [] && nextProps.dataCustomerEdit !== undefined) {
        //     this.setState({
        //         kd_cust:nextProps.dataCustomerEdit.kd_cust,
        //         nama:nextProps.dataCustomerEdit.nama,
        //         alamat:nextProps.dataCustomerEdit.alamat,
        //         status:nextProps.dataCustomerEdit.status,
        //         tgl_ultah:nextProps.dataCustomerEdit.tgl_ultah,
        //         tlp:nextProps.dataCustomerEdit.tlp,
        //         cust_type:nextProps.dataCustomerEdit.cust_type,
        //         password:nextProps.dataCustomerEdit.password,
        //         register:nextProps.dataCustomerEdit.register,
        //         foto:nextProps.dataCustomerEdit.foto,
        //         email:nextProps.dataCustomerEdit.email,
        //         biografi:nextProps.dataCustomerEdit.biografi,
        //         special_price:nextProps.dataCustomerEdit.special_price,
        //         jenis_kelamin:nextProps.dataCustomerEdit.jenis_kelamin,
        //         discount:nextProps.dataCustomerEdit.discount,
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
        this.props.dispatch(setCustomerEdit([]))
        this.setState({
            kd_cust:'',
            nama:'',
            alamat:'',
            status:'1',
            tgl_ultah:'',
            tlp:'0',
            cust_type:'-',
            password:'',
            register:'-',
            foto:'-',
            jenis_kelamin:'1',
            email:'',
            biografi:'',
            special_price:'1',
            discount:'0'
        })
    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nama'] = this.state.nama;
        parseData['alamat'] = this.state.alamat;
        parseData['status'] = this.state.status;
        parseData['tgl_ultah'] = this.state.tgl_ultah;
        parseData['tlp'] = this.state.tlp;
        parseData['cust_type'] = this.state.cust_type;
        parseData['password'] = this.state.password;
        parseData['register'] = this.state.register;
        parseData['foto'] = this.state.foto;
        parseData['jenis_kelamin'] = this.state.jenis_kelamin;
        parseData['email'] = this.state.email;
        parseData['biografi'] = this.state.biografi;
        parseData['special_price'] = this.state.special_price;
        if (this.props.dataCustomerEdit !== undefined||this.props.dataCustomerEdit!==[]) {
            this.props.dispatch(updateCustomer(this.props.dataCustomerEdit.kd_cust,parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createCustomer(parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }
    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };
    render(){
        const curr = new Date();
        curr.setDate(curr.getDate() + 3);
        const date = curr.toISOString().substr(0, 10);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCustomer"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.dataCustomerEdit!==undefined?"Update Customer":"Add Customer"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Customer Type</label>
                                    <select id="inputState" className="form-control" name="cust_type" defaultValue={this.state.cust_type} value={this.state.cust_type} onChange={this.handleChange} required>
                                        <option value="">Choose Customer Type</option>
                                        {
                                            (
                                                typeof this.props.dataCustomerTypeAll.data === 'object' ?
                                                    this.props.dataCustomerTypeAll.data.map((v,i)=>{
                                                        return(
                                                            <option key={i} value={v.kode}>{v.nama}</option>
                                                        )
                                                    })
                                                    :  <option value="">No Option</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select className="form-control" name="jenis_kelamin" defaultValue={this.state.jenis_kelamin} value={this.state.jenis_kelamin} onChange={this.handleChange}>
                                        <option value="1">Male</option>
                                        <option value="0">Female</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="number" className="form-control" name="tlp" value={this.state.tlp} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Password <small>(leave blank if it won't be filled)</small></label>
                                    <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange}  />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Discount (%)</label>
                                    <input type="number" className="form-control" name="discount" value={this.state.discount} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        name="tgl_ultah"
                                        className="form-control"
                                        data-parse="date"
                                        placeholder="MM/DD/YYYY"
                                        defaultValue={date}
                                        value={this.state.tgl_ultah}
                                        pattern="\d{2}\/\d{2}/\d{4}"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" name="jenis_kelamin" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Special Price</label>
                                    <select className="form-control" name="special_price" defaultValue={this.state.special_price} value={this.state.special_price} onChange={this.handleChange}>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                                    <FileBase64
                                        multiple={ false }
                                        className="mr-3 form-control-file"
                                        onDone={ this.getFiles.bind(this) } />
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
export default connect(mapStateToProps)(FormCustomer);
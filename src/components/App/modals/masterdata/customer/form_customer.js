import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createCustomer, setCustomerEdit, updateCustomer} from "redux/actions/masterdata/customer/customer.action";
import FileBase64 from "react-file-base64";
import moment from 'moment';
import Select from "react-select";
class FormCustomer extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeCustomer = this.HandleChangeCustomer.bind(this);
        this.state = {
            kd_cust:'', nama:'', alamat:'', status:'', tgl_ultah:'', tlp:'', cust_type:'',cust_type_data:[], password:'', register:'',
            foto:'', jenis_kelamin:'', email:'', biografi:'', special_price:'', discount:'',
            error:{
                kd_cust:'', nama:'', alamat:'', status:'', tgl_ultah:'', tlp:'', cust_type:'', password:'', register:'',
                foto:'', jenis_kelamin:'', email:'', biografi:'', special_price:'', discount:'',
            }
        };
    }

    getProps(param){
        console.log(param);
        if(param.dataCustomerEdit!==undefined && param.dataCustomerEdit.length!==0){
            this.setState({
                kd_cust:param.dataCustomerEdit.kd_cust,
                nama:param.dataCustomerEdit.nama,
                alamat:param.dataCustomerEdit.alamat,
                status:param.dataCustomerEdit.status,
                tgl_ultah:moment(param.dataCustomerEdit.tgl_ultah).format('yyyy-MM-DD'),
                tlp:param.dataCustomerEdit.tlp,
                cust_type:param.dataCustomerEdit.cust_type,
                password:'',
                register:param.dataCustomerEdit.register,
                foto:param.dataCustomerEdit.foto,
                email:param.dataCustomerEdit.email,
                biografi:param.dataCustomerEdit.biografi,
                special_price:param.dataCustomerEdit.special_price,
                jenis_kelamin:param.dataCustomerEdit.jenis_kelamin,
                discount:param.dataCustomerEdit.discount,
            })
        }
        else{
            this.setState({
                kd_cust:'', nama:'', alamat:'', status:'', tgl_ultah:'', tlp:'', cust_type:'', password:'', register:'',
                foto:'', jenis_kelamin:'', email:'', biografi:'', special_price:'', discount:'',
            })
        }
        let cust=[];
        typeof param.dataCustomerTypeAll.data === 'object' ?
            param.dataCustomerTypeAll.data.map((v,i)=>{
                cust.push({
                    value: v.kode,
                    label: v.nama
                });
            })
        :  "no data";
        this.setState({
            cust_type_data: cust,
        })
    }

    componentWillMount(){
        this.getProps(this.props);

    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
   

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {
            [event.target.name]: ""
        });
        this.setState({
            error: err
        });
    };
    HandleChangeCustomer(sp) {
        let err = Object.assign({}, this.state.error, {
            cust_type: ""
        });
        this.setState({
            cust_type: sp.value,
            error: err
        });
    }

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
        console.log(this.state.foto);
        parseData['nama'] = this.state.nama;
        parseData['alamat'] = this.state.alamat;
        parseData['status'] = this.state.status;
        parseData['tgl_ultah'] = this.state.tgl_ultah;
        parseData['tlp'] = this.state.tlp;
        parseData['cust_type'] = this.state.cust_type;
        parseData['password'] = this.state.password;
        parseData['register'] = this.state.register;
        parseData['foto'] = this.state.foto===null?'-':this.state.foto.base64
        parseData['jenis_kelamin'] = this.state.jenis_kelamin;
        parseData['email'] = this.state.email;
        parseData['biografi'] = '-';
        parseData['special_price'] = this.state.special_price;
        let err = this.state.error;
        if( parseData['nama']===''|| parseData['nama']===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['cust_type']===''|| parseData['cust_type']===undefined){
            err = Object.assign({}, err, {cust_type:"tipe customer tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['jenis_kelamin']===''|| parseData['jenis_kelamin']===undefined){
            err = Object.assign({}, err, {jenis_kelamin:"jenis kelamin tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['tlp']===''|| parseData['tlp']===undefined){
            err = Object.assign({}, err, {tlp:"telepon tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['email']===''|| parseData['email']===undefined){
            err = Object.assign({}, err, {email:"email tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['password']===''|| parseData['password']===undefined){
            err = Object.assign({}, err, {password:"password tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['tgl_ultah']===''|| parseData['tgl_ultah']===undefined){
            err = Object.assign({}, err, {tgl_ultah:"tanggal ulang tahun tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['status']===''|| parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['special_price']===''|| parseData['special_price']===undefined){
            err = Object.assign({}, err, {special_price:"harga spesial tidak boleh kosong"});
            this.setState({error: err});
        }
        else if( parseData['alamat']===''|| parseData['alamat']===undefined){
            err = Object.assign({}, err, {alamat:"alamat tidak boleh kosong"});
            this.setState({error: err});
        }



        else{
            if (this.props.dataCustomerEdit !== undefined) {
                this.props.dispatch(updateCustomer(this.props.dataCustomerEdit.kd_cust,parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(createCustomer(parseData));
                this.props.dispatch(ModalToggle(false));
            }
            console.log(parseData)
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
                <ModalHeader toggle={this.toggle}>{this.props.dataCustomerEdit!==undefined?"Ubah Customer":"Tambah Customer"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Nama</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}  />
                                    <div className="invalid-feedback" style={this.state.error.nama!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.nama}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tipe Customer</label>
                                    <Select
                                        options={this.state.cust_type_data}
                                        placeholder="==== Pilih ===="
                                        onChange={this.HandleChangeCustomer}
                                        value = {
                                            this.state.cust_type_data.find(op => {
                                                return op.value === this.state.cust_type
                                            })
                                        }
                                    />
                                    <div className="invalid-feedback" style={this.state.error.cust_type!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.cust_type}
                                    </div>

                                </div>
                                <div className="form-group">
                                    <label>Jenis Kelamin</label>
                                    <select className="form-control" name="jenis_kelamin" defaultValue={this.state.jenis_kelamin} value={this.state.jenis_kelamin} onChange={this.handleChange}>
                                        <option value="">Pilih</option>
                                        <option value="1">Laki-Laki</option>
                                        <option value="0">Perempuan</option>
                                    </select>
                                    <div className="invalid-feedback" style={this.state.error.jenis_kelamin!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.jenis_kelamin}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Telepon</label>
                                    <input type="number" className="form-control" name="tlp" value={this.state.tlp} onChange={this.handleChange}  />
                                    <div className="invalid-feedback" style={this.state.error.tlp!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.tlp}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange}  />
                                    <div className="invalid-feedback" style={this.state.error.email!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.email}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Password {this.props.dataCustomerEdit!==undefined?<small>(kosongkan bila tidak akan diubah)</small>:""}</label>
                                    <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange}  />
                                    <div className="invalid-feedback" style={this.state.error.password!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.password}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                {/*<div className="form-group">*/}
                                    {/*<label>Diskon (%)</label>*/}
                                    {/*<input type="number" className="form-control" name="discount" value={this.state.discount} onChange={this.handleChange}  />*/}
                                    {/*<div className="invalid-feedback" style={this.state.error.discount!==""?{display:'block'}:{display:'none'}}>*/}
                                        {/*{this.state.error.discount}*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                <div className="form-group">
                                    <label>Ulang Tahun</label>
                                    <input type="date" name="tgl_ultah" className="form-control" data-parse="date" placeholder="MM/DD/YYYY" defaultValue={date} value={this.state.tgl_ultah} pattern="\d{2}\/\d{2}/\d{4}" onChange={this.handleChange}/>
                                    <div className="invalid-feedback" style={this.state.error.tgl_ultah!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.tgl_ultah}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                        <option value="">Pilih</option>
                                        <option value="1" selected={this.state.status==='1'}>Active</option>
                                        <option value="0" selected={this.state.status==='0'}>In Active</option>
                                    </select>
                                    <div className="invalid-feedback" style={this.state.error.status!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.status}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Harga Spesial</label>
                                    <select className="form-control" name="special_price" defaultValue={this.state.special_price} value={this.state.special_price} onChange={this.handleChange}>
                                        <option value="">Pilih</option>
                                        <option value="1" selected={this.state.status==='1'}>Ya</option>
                                        <option value="0" selected={this.state.status==='0'}>Tidak</option>
                                    </select>
                                    <div className="invalid-feedback" style={this.state.error.special_price!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.special_price}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Alamat</label>
                                    <input type="text" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange}  />
                                    <div className="invalid-feedback" style={this.state.error.alamat!==""?{display:'block'}:{display:'none'}}>
                                        {this.state.error.alamat}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Poto {this.props.dataCustomerEdit!==undefined?<small>(kosongkan bila tidak akan diubah)</small>:""}</label><br/>
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
export default connect(mapStateToProps)(FormCustomer);
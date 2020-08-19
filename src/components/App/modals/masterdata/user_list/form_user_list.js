import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import Select from 'react-select';
import {stringifyFormData} from "helper";
import {sendUserList, setUserListEdit, updateUserList} from "redux/actions/masterdata/user_list/user_list.action";
import moment from "moment";
import FileBase64 from "react-file-base64";
import {ModalToggle} from "../../../../../redux/actions/modal.action";
class FormUserList extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            show:false,
            nama:"", username:"", password:"", password_confirmation:"", password_otorisasi:"",
            email:"", alamat:"", tgl_lahir:"", foto:"", nohp:"", lokasi:"",
            user_lvl:"0", status:"1",
            selectedOption: [],
            isChecked: true,
            opt : [],
            opt1:[],
            token:'',
            error:{
                nama:"", username:"", password:"", password_confirmation:"", password_otorisasi:"",
                email:"", alamat:"", tgl_lahir:"", foto:"", nohp:"", lokasi:"",
                user_lvl:"0", status:"1",
            }
        }

    }
    handleLocation(data=[]){
        let loc = [];let val = [];
        for(let i=0;i<data.length;i++){
            loc.push({value:data[i].kode,label:data[i].nama_toko});
            val.push({kode:data[i].kode});
        }
        this.setState({
            opt1:loc,
            selectedOption:loc,
        });
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

    toggleChange = (e) => {
        this.setState({isChecked: e.target.checked,});
        if(e.target.checked === true){
            this.state.opt = [];
            this.state.selectedOption = this.state.opt1;
        }else{
            this.state.opt = this.state.opt1;
            this.state.selectedOption = [];
        }
    }
    componentWillMount(){
        if(this.props.userListEdit!==undefined && this.props.userListEdit!==[]){
            let lokasiUser = typeof this.props.userListEdit.lokasi === 'object' ? this.props.userListEdit.lokasi : [];
            let lokasi = typeof this.props.lokasi.data === 'object' ? this.props.lokasi.data : [];
            let loc=[];let val=[];
            for(let i=0;i<lokasi.length;i++){
                for(let x=0;x<lokasiUser.length;x++){
                    if(lokasi[i].kode === lokasiUser[x].kode){
                        loc.push({value:lokasiUser[x].kode,label:lokasi[i].nama_toko});
                        val.push({kode:lokasiUser[x].kode})
                    }
                }
            }
            this.setState({
                nama: this.props.userListEdit.nama,
                username: this.props.userListEdit.username,
                email: this.props.userListEdit.email,
                alamat: this.props.userListEdit.alamat,
                tgl_lahir: moment(this.props.userListEdit.tgl_lahir).format('yyyy-MM-DD'),
                foto: this.props.userListEdit.foto,
                nohp: this.props.userListEdit.nohp,
                selectedOption:loc,
                opt:val,
                user_lvl: this.props.userListEdit.user_lvl,
                status: this.props.userListEdit.status,
            });
        }

    }
    handleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        if (this.state.nama === "" || this.state.nama === undefined) {
            err = Object.assign({}, err, {
                nama: "nama tidak boleh kosong."
            });
            this.setState({
                error: err
            })
        }else{
            const form = e.target;
            let data = new FormData(form);
            let parseData = stringifyFormData(data);
            let lok = [];
            for(let i=0;i<this.state.selectedOption.length;i++){
                lok.push({"kode":this.state.selectedOption[i].value});
            }
            parseData['username']=this.state.username;
            parseData['user_lvl']=this.state.user_lvl;
            parseData['lokasi']=lok;
            parseData['status']=this.state.status;
            parseData['nama']=this.state.nama;
            parseData['alamat']=this.state.alamat;
            parseData['email']=this.state.email;
            parseData['nohp']=this.state.nohp;
            parseData['tgl_lahir']=this.state.tgl_lahir;
            parseData['password']= parseInt(this.state.password.length) > 0 ? this.state.password : '-';
            parseData['password_confirmation']= parseInt(this.state.password_confirmation.length) > 0 ? this.state.password_confirmation : '-';
            parseData['password_otorisasi']= parseInt(this.state.password_otorisasi.length) > 0 ? this.state.password_otorisasi : '-';
            if(this.state.foto.base64!==undefined){
                parseData['foto']=this.state.foto.base64;
            }
            if(this.props.userListEdit!==undefined && this.props.userListEdit!==[]){
                this.props.dispatch(updateUserList(this.props.userListEdit.id,parseData));
            }else{
                this.props.dispatch(sendUserList(parseData));
            }
        }


    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };
    handleOnChange = (selectedOption) => {
        this.setState({
            selectedOption:selectedOption,
        });
    };
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(setUserListEdit([]));
        this.setState({
            show:false,
            nama:"",
            username:"",
            password:"",
            password_confirmation:"",
            password_otorisasi:"",
            email:"",
            alamat:"",
            tgl_lahir:"",
            foto:"",
            nohp:"",
            lokasi:"",
            user_lvl:"",
            status:"1",
            selectedOption: [],
            isChecked: true,
            opt : [],
            opt1:[],
            token:''
        })

    };
    render(){
        const curr = new Date();
        curr.setDate(curr.getDate() + 3);
        const date = curr.toISOString().substr(0, 10);
        let userLevel = typeof this.props.userLevel.data === 'object' ? this.props.userLevel.data : [];
        let lokasi = typeof this.props.lokasi.data === 'object' ? this.props.lokasi.data : [];

        let locG = [];
        for(let i=0;i<lokasi.length;i++){
            locG.push({value:lokasi[i].kode,label:lokasi[i].nama_toko})
        }
        this.state.opt = locG;

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserList"} size="lg">

                <ModalHeader toggle={this.toggle}>{this.props.userListEdit!==undefined&&this.props.userListEdit!==[]?`Update User List`:`Add User List`}</ModalHeader>

                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama}  onChange={this.handleChange} />
                                    <div className="invalid-feedback" style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>{this.state.error.nama}</div>
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Password <small>{this.props.userListEdit!==undefined&&this.props.userListEdit!==[]?'( kosongkan jika tidak akan diubah )':''}</small></label>
                                    <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Password Confirmation<small>{this.props.userListEdit!==undefined&&this.props.userListEdit!==[]?'(  kosongkan jika tidak akan diubah )':''}</small></label>
                                    <input type="password" className="form-control"  name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Password Otoritation<small>{this.props.userListEdit!==undefined&&this.props.userListEdit!==[]?'( kosongkan jika tidak akan diubah )':''}</small></label>
                                    <input type="password" className="form-control" name="password_otorisasi" value={this.state.password_otorisasi} onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Location<input type="checkbox" checked={this.state.isChecked} onChange={this.toggleChange}/> Select All </label>
                                    <Select
                                        required
                                        disabled
                                        isMulti
                                        value={this.state.selectedOption}
                                        onChange={this.handleOnChange}
                                        options={this.state.opt}
                                        name="lokasi"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">User Level</label>
                                    <select id="inputState" className="form-control" name="user_lvl" defaultValue={this.state.user_lvl} value={this.state.user_lvl} onChange={this.handleChange} required>
                                        <option value="0">Choose User Level</option>
                                        {
                                            userLevel.map(function(item,i){
                                                return (
                                                    <option key={i} value={item.id}>{item.lvl}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>






                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                                    <FileBase64
                                        multiple={ false }
                                        className="mr-3 form-control-file"
                                        onDone={ this.getFiles.bind(this) } />
                                </div>
                                <div className="form-group">
                                    <label>No. Hp</label>
                                    <input type="text" className="form-control" name="nohp" defaultValue="0" onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Emai</label>
                                    <input type="email" className="form-control" aria-describedby="emailHelp" name="email" value={this.state.email} onChange={this.handleChange}  />
                                </div>
                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        name="tgl_lahir"
                                        className="form-control"
                                        data-parse="date"
                                        placeholder="MM/DD//YYYY"
                                        defaultValue={date}
                                        value={this.state.tgl_lahir}
                                        pattern="\d{2}\/\d{2}/\d{4}"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Status</label>
                                    <select id="inputState" className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea rows="2" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange} style={{height:"145px"}}>-</textarea>
                                </div>

                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.props.toggle}><i className="ti-close" /> Cancel</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
                        </div>
                    </ModalFooter>
                </form>

            </WrapperModal>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(FormUserList);


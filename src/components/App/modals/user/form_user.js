import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import ProfileImage from "../../../assets/profile.png";
import FileBase64 from "react-file-base64";

class Modals extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            name:"",
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
            user_lvl:"0",
            status:"0"

        }

    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };
    getFiles(files) {
        this.setState({
            foto: files
        })
    }
    render(){
        const curr = new Date();
        curr.setDate(curr.getDate() + 3);
        const date = curr.toISOString().substr(0, 10);
        const { displayErrors } = this.state;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUser"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add User":"Update User"}</ModalHeader>
                <ModalBody>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nama</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.name} required/>
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" className="form-control" name="username" value={this.state.username} required/>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" name="password" value={this.state.password} required/>
                                </div>
                                <div className="form-group">
                                    <label>Konfirmasi Password</label>
                                    <input type="password" className="form-control"  name="password_confirmation" value={this.state.password_confirmation} required/>
                                </div>
                                <div className="form-group">
                                    <label>Password Otorisasi</label>
                                    <input type="password" className="form-control" name="password_otorisasi" value={this.state.password_otorisasi} required/>
                                </div>
                                <div className="form-group">
                                    <label>Emai</label>
                                    <input type="email" className="form-control" aria-describedby="emailHelp" name="email" value={this.state.email}  required/>
                                </div>
                                <div className="form-group">
                                    <label>Alamat</label>
                                    <textarea rows="2" className="form-control" name="alamat" value={this.state.alamat}>-</textarea>
                                </div>
                                <div className="form-group">
                                    <label>Tanggal Lahir dfdfd</label>
                                    <input
                                        type="date"
                                        name="tgl_lahir"
                                        className="form-control"
                                        data-parse="date"
                                        placeholder="MM/DD//YYYY"
                                        defaultValue={date}
                                        value={this.state.tgl_lahir}
                                        pattern="\d{2}\/\d{2}/\d{4}"
                                    />
                                </div>


                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                                    <div className="img-preview">
                                        {
                                            this.state.foto !==[]?(<img src={this.state.foto.base64} width="100" alt=""/>):<img  src={ProfileImage} width="100" alt=""/>
                                        }
                                    </div>
                                    <FileBase64
                                        multiple={ false }
                                        className="mr-3 form-control-file"
                                        onDone={ this.getFiles.bind(this) } />
                                    {/*<input type="file" className="form-control" name="foto" />*/}
                                </div>
                                <div className="form-group">
                                    <label>No. Hp</label>
                                    <input type="text" className="form-control" name="nohp" defaultValue="0"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Lokasi</label>
                                    <select id="inputState" className="form-control" name="lokasi" defaultValue={this.state.lokasi} value={this.state.lokasi}>
                                        <option>Pilih Lokasi</option>
                                        <option>LK\/0001</option>
                                        <option>LK\/0002</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">User Level</label>
                                    <select id="inputState" className="form-control" name="user_lvl" defaultValue={this.state.user_lvl} value={this.state.user_lvl}>
                                        <option value="0">Administrator</option>
                                        <option value="1">Kasir</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Status</label>
                                    <select id="inputState" className="form-control" name="status" defaultValue={this.state.status} value={this.state.status}>
                                        <option value="0">Aktif</option>
                                        <option  value="1">Non-aktif</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{textAlign:"right"}}>
                                    <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
                                    <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
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
export default connect(mapStateToProps)(Modals);
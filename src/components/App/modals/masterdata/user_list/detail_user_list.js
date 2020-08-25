import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
// import {ModalToggle} from "../../../../actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {statusQ} from "helper";
import moment from "moment";
import {ModalToggle} from "redux/actions/modal.action";
class DetailUserList extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            nama:"",username:"",foto:"",lvl:'',status:'',access:'',alamat:'',email:'',nohp:'',tgl_lahir:'',lokasi:''
        }
    }
    componentWillMount(){
        if(this.props.userListDetail!==undefined && this.props.userListDetail!==[]){
            let lokasiMaster = typeof this.props.lokasi.data === 'object' ? this.props.lokasi.data : [];
            let lokasiUser = typeof this.props.userListDetail.lokasi === 'object' ? this.props.userListDetail.lokasi : [];
            let lokasi = '';
            for(let i=0;i<lokasiMaster.length;i++){
                for(let x=0; x<lokasiUser.length;x++){
                    if(lokasiMaster[i].kode === lokasiUser[x].kode){
                        lokasi+=`${lokasiMaster[i].nama_toko} \n`
                    }
                }
            }
            this.setState({
                nama:this.props.userListDetail.nama,
                username:this.props.userListDetail.username,
                foto:this.props.userListDetail.foto,
                lvl:this.props.userListDetail.lvl,
                status:this.props.userListDetail.status,
                access:this.props.userListDetail.access,
                alamat:this.props.userListDetail.alamat,
                email:this.props.userListDetail.email,
                nohp:this.props.userListDetail.nohp,
                tgl_lahir:moment(this.props.userListDetail.tgl_lahir).format('MMMM Do YYYY'),
                lokasi:lokasi
            })
        }
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };


    render(){

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailUserList"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail User {this.state.nama}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">
                                    <div className="profile-thumb-contact text-center">
                                        <img src={this.state.foto} alt="" style={{width:"100%"}}/>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Name</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.nama}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Level</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.lvl}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Email</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">No Handphone</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.nohp}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Birth Date</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.tgl_lahir}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Status</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.status==='0'?statusQ('danger','In Active'):statusQ('success','Active')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">Address</td>
                                            <td style={{padding:"4px",border:"none"}} className="text-black">: {this.state.alamat}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-12">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>Location</th>
                                            <th>Menu</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td><div style={{whiteSpace:"pre-line"}}>{this.state.lokasi}</div></td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </ModalBody>
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
export default connect(mapStateToProps)(DetailUserList);
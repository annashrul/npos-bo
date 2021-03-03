import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
    ModalBody,
    ModalFooter
} from 'reactstrap';
import WrapperModal from "./_wrapper.modal";
import {ModalToggle} from "../../../redux/actions/modal.action";
import Keamanan from 'assets/keamanan.png'
import {checkOtorisasi,setOtorisasiId} from 'redux/actions/authActions'

class ModalPin extends Component{
    constructor(props){
        super(props);
        this.state={
            pass:'',
            username:'',
            module:'',
            aksi:'',
            id_log:'',
            error:{
                pass:''
            },
            prevIdLog:''
        }
        this.handleChange=this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this);
        this.handleLanjut = this.handleLanjut.bind(this)
    }
    

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            this.setState({
                username: nextProps.auth.user.username
            })
        }

        if (nextProps.datum) {
            this.setState({
                module:nextProps.datum.module,
                aksi:nextProps.datum.aksi,
            })
        }

        if (nextProps.id_log !== "") {
            if (nextProps.id_log !== this.state.prevIdLog) {
                const id = nextProps.id_log;
                nextProps.dispatch(ModalToggle(false));
                this.props.onDone(id,this.props.datum.id_trx);
                this.props.dispatch(setOtorisasiId(''))
                this.setState({
                    prevIdLog: nextProps.id_log,
                    id_log: nextProps.id_log,
                    pass: ''
                })
            }
        }

    }


    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        // this.props.dispatch(ModalType(this.props.typePage));
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value});
        let err = Object.assign({}, this.state.error, {
            [event.target.name]: ""
        });
        this.setState({
            error: err
        });
    }

    handleLanjut(event){
        event.preventDefault();
        this.props.dispatch(checkOtorisasi({
            username: this.state.username,
            password: this.state.pass,
            module: this.props.datum.module,
            aksi: this.props.datum.aksi,
            id_trx: this.props.datum.id_trx
        }));
    }

    
    render(){
        console.log(this.props);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "modalOtorisasi"} size="lg" style={{backgroundColor:"black"}}>

                <ModalBody style={{backgroundColor:"black"}}>
                    <div className="row">
                        <div className="col-md-6">
                            <img src={Keamanan} alt="Keamanan"/>
                        </div>
                        <div className="col-md-6" style={{margin:"auto"}}>
                            <p className={"text-white"} style={{textAlign:"center"}}>Sebelum melanjutkan aksi <i>{this.props.datum.aksi}</i> pada modul {this.props.datum.module}, silahkan masukan password anda terlebih dahulu.</p>
                            <div className="form-group">
                                    <input type="password" className="form-control" name="pass" value={this.state.pass} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.pass !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.pass}
                                    </div>
                            </div>
                            <br/>
                            {
                                this.props.isLoading?(
                                    <div className="col-md-12">
                                        <div className="d-flex align-items-center">
                                            <div className="spinner-border text-primary ml-10" role="status" aria-hidden="true"/>
                                            <strong className={"text-black text-center"} style={{position:"absolute",marginLeft:"10px",marginTop:"5px",verticalAlign:"middle"}}>Tunggu sebentar..</strong>
                                        </div>
                                    </div>
                                ):null
                            }
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter style={{backgroundColor:"black",padding:0,borderTop:'none'}}>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Cancel</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleLanjut}><i className="ti-save" /> Lanjutkan</button>
                    </div>
                </ModalFooter>

            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        id_log: state.auth.id_log
    }
}
export default connect(mapStateToProps)(ModalPin);

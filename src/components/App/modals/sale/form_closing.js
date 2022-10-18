import React,{Component} from 'react';
import WrapperModal from "components/App/modals/_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {toCurrency,rmComma} from 'helper';

import moment from 'moment'
import Select from 'react-select'
import {ToastQ} from "../../../../helper";
import {postClosing} from "../../../../redux/actions/report/closing/closing.action";

class FormClosing extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChangeLokasi = this.handleChangeLokasi.bind(this);
        this.state={
            tgl:moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            lokasi:'',
            tunai:'',
            data_lokasi:[]
        }

    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleChangeLokasi(val){
            this.setState({
            lokasi:val.value
        })
    }

    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    getProps(props){
        // if(props.isLoading){
            
        // }
        let data_lokasi=[];
        if(props.auth.user){
            if(props.auth.user.lokasi.length>0){
                props.auth.user.lokasi.map(val=>{
                    data_lokasi.push({value:val.kode,label:val.nama});
                    return null;
                });
                this.setState({data_lokasi:data_lokasi});
            }
        }

    }


    handleSubmit(){
        let data={};
        let dataUser={};
        
        data['kasir']=this.props.auth.user.id;
        data['kassa']='Z';
        data['tgl']=moment(this.state.tgl).format("yyyy-MM-DD HH:mm:ss");
        data['lokasi']=this.state.lokasi;
        data['tunai']=rmComma(this.state.tunai);
        data['param']='closing';

        dataUser['nama'] = this.props.auth.user.nama;
        dataUser['site'] = this.props.auth.user.site_title;

        
        if(data['lokasi']===''){
            ToastQ.fire({icon:'error',title:`Lokasi tidak boleh kosong`});
            return false;
        }
        if(data['tunai']===''||isNaN(data['tunai'])){
            ToastQ.fire({icon:'error',title:`Tunai tidak boleh kosong`});
            return false;
        }
        this.props.dispatch(postClosing(data,dataUser));

    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formClosing"} size="md">
                <ModalHeader toggle={this.toggle}>Closing</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="control-label font-12">Tanggal</label>
                                <input type="datetime-local" name={"tgl"} className={"form-control"} value={this.state.tgl.toString().substring(0, 16)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-12">Lokasi</label>
                                <Select options={this.state.data_lokasi} placeholder="Pilih Lokasi"
                                        onChange={this.handleChangeLokasi.bind(this)}
                                        value={this.state.data_lokasi.find(op => {return op.value === this.state.lokasi})}
                                />
                            </div>
                            <div className="form-group">
                                <label className="control-label font-12">Tunai</label>
                                <input type="text" name={"tunai"} className={"form-control"} value={toCurrency(this.state.tunai)} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <button className={"btn btn-primary"} onClick={this.handleSubmit}>Simpan</button>
                </ModalFooter>

            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth:state.auth,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        data:state.closingReducer.data,
        isLoading:state.closingReducer.isLoading
    }
}
export default connect(mapStateToProps)(FormClosing);
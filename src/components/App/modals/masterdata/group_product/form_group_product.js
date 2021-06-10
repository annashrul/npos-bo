import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle,ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createGroupProduct,
    updateGroupProduct, FetchGroupProduct
} from "redux/actions/masterdata/group_product/group_product.action";
import Select from "react-select";
import FileBase64 from "react-file-base64";
class FormGroupProduct extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeGroup2 = this.HandleChangeGroup2.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.state = {
            kel_brg:'', nm_kel_brg:'', margin:'', status:'', group2:'', dis_persen:'', gambar:'',group2_data:[],
            error:{kel_brg:'', nm_kel_brg:'', margin:'', status:'', group2:'', dis_persen:'', gambar:''}
        };
    }
    getProps(param){
        let group2=[];
        
        if(param.group2.data!==undefined){
            if(typeof param.group2.data === 'object'){
                param.group2.data.map((v,i)=>{
                    group2.push({
                        value:v.kode,
                        label:v.nama,
                    })
                    return null;
                })
            }
            // typeof param.group2.data === 'object' ?
            //     param.group2.data.map((v,i)=>{
            //         group2.push({
            //             value:v.kode,
            //             label:v.nama,
            //         })
            //         return null;
            //     })
            //     : "";
        }
        this.setState({group2_data:group2});
        if (param.detail !== [] && param.detail !== undefined) {
            this.setState({
                kel_brg: param.detail.kel_brg,
                nm_kel_brg: param.detail.nm_kel_brg,
                margin: param.detail.margin,
                status: param.detail.status,
                group2: param.detail.group2,
                dis_persen: param.detail.dis_persen,
                gambar: param.detail.gambar,
            })
        }
        else{
            this.setState({
                kel_brg:'', nm_kel_brg:'', margin:'', status:'', group2:'', dis_persen:'', gambar:'',
            })
        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }

    HandleChangeGroup2(sp) {
        let err = Object.assign({}, this.state.error, {group2: ""});
        this.setState({group2: sp.value, error: err});
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    toggle(e){
        e.preventDefault();
        if(this.props.fastAdd===undefined){
          const bool = !this.props.isOpen;
          this.props.dispatch(ModalToggle(bool));
        }
        if(this.props.fastAdd===true){
            this.props.dispatch(ModalType('formProduct'));
            this.props.dispatch(FetchGroupProduct(1, "", "1000"));
        }
    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nm_kel_brg'] = this.state.nm_kel_brg;
        // parseData['margin'] = this.state.margin;
        parseData['status'] = this.state.status;
        parseData['group2'] = this.state.group2;
        // parseData['dis_persen'] = this.state.dis_persen;
        // parseData['gambar'] = this.state.gambar;
        let err = this.state.error;

        if(parseData['nm_kel_brg']===''||parseData['nm_kel_brg']===undefined){
            err = Object.assign({}, err, {nm_kel_brg:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['group2']===''||parseData['group2']===undefined){
            err = Object.assign({}, err, {group2:"sub departemen tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['status']===''||parseData['status']===undefined){
            err = Object.assign({}, err, {status:"status tidak boleh kosong"});
            this.setState({error: err});
        }
        // else if(parseData['margin']===''||parseData['margin']===undefined){
        //     err = Object.assign({}, err, {margin:"margin tidak boleh kosong"});
        //     this.setState({error: err});
        // }
        // else if(parseData['dis_persen']===''||parseData['dis_persen']===undefined){
        //     err = Object.assign({}, err, {dis_persen:"diskon tidak boleh kosong"});
        //     this.setState({error: err});
        // }
        else{
            if(parseData['gambar']!==''){
                parseData['gambar'] = this.state.gambar.base64;
            }
            if (this.props.detail !== undefined) {
                this.props.dispatch(updateGroupProduct(this.props.detail.kel_brg,parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(createGroupProduct(parseData,this.props.fastAdd!==undefined));
                if(this.props.fastAdd===undefined){
                    this.props.dispatch(ModalToggle(false));
                }
                if(this.props.fastAdd===true){
                    this.props.dispatch(ModalType('formProduct'));
                }
            }
        }

        

    }
    handleChangeImage(files) {
        this.setState({
            gambar: files
        })
    };
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formGroupProduct"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah Kelompok Barang":"Ubah Kelompok Barang"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" className="form-control" name="nm_kel_brg" value={this.state.nm_kel_brg} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.nm_kel_brg!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.nm_kel_brg}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Sub Department</label>
                            <Select
                                options={this.state.group2_data}
                                placeholder="==== Pilih ===="
                                onChange={this.HandleChangeGroup2}
                                value = {
                                    this.state.group2_data.find(op => {
                                        return op.value === this.state.group2
                                    })
                                }
                            />
                            <div className="invalid-feedback" style={this.state.error.group2!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.group2}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="1">Aktif</option>
                                <option value="0">Tidak Aktif</option>
                            </select>
                            <div className="invalid-feedback" style={this.state.error.status!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.status}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputState" className="col-form-label">Foto {this.props.detail===undefined?<small>kosongkan apabila tidak akan diubah</small>:""}</label><br/>
                            <FileBase64
                                multiple={ false }
                                className="mr-3 form-control-file"
                                onDone={ this.handleChangeImage } />
                        </div>
                        {/*<div className="form-group">*/}
                            {/*<label>Diskon (%)</label>*/}
                            {/*<input type="number" className="form-control" name="dis_persen" value={this.state.dis_persen} onChange={this.handleChange}  />*/}
                            {/*<div className="invalid-feedback" style={this.state.error.dis_persen!==""?{display:'block'}:{display:'none'}}>*/}
                                {/*{this.state.error.dis_persen}*/}
                            {/*</div>*/}
                        {/*</div>*/}
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
export default connect(mapStateToProps)(FormGroupProduct);
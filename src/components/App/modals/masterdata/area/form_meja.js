import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createMeja, updateMeja} from "redux/actions/masterdata/meja/meja.action";
import Select from 'react-select';

class FormMeja extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeArea = this.HandleChangeArea.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            nama:'',
            kapasitas:'',
            width:'',
            height:'',
            bentuk:'',
            area:'',
            jumlah:'',
            area_data:[],
            id:'',
            user:'',
            error:{
                nama:"",
                kapasitas:"",
                width:"",
                height:"",
                bentuk:"",
                area:"",
                jumlah:"",
            },
        };
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value});
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
    HandleChangeArea(ar){
        let err = Object.assign({}, this.state.error, {
            area: ""
        });
        this.setState({
            area: ar,
            error: err
        })
        localStorage.setItem('area_meja', ar);
    }
    componentWillReceiveProps(nextProps) {
        console.log("ffffffffffff",nextProps);
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            let data = nextProps.area.filter(item => item.id_area === nextProps.detail.area);
            console.log("vvvvvvvvvvvvvvv",data[0]);
            this.setState({
                nama: nextProps.detail.nama,
                kapasitas: nextProps.detail.kapasitas,
                area: {"value":data[0]===undefined?'':data[0].id_area,"label":data[0]===undefined?'':data[0].nama},
                height: nextProps.detail.height,
                width: nextProps.detail.width,
                bentuk: nextProps.detail.bentuk,
                id: nextProps.detail.id
            })
        }else{
            this.setState({
                nama: '',
                kapasitas: '',
                area: '',
                height: '',
                width: '',
                bentuk: '',
                id:''
            })
        }
        console.log("aaaaaaaaaaaaaaa",nextProps);
        if (nextProps.auth.user) {
            let ar = [];
            let are = nextProps.area;
            if(are!==undefined){
                are.map((i) => {
                    ar.push({
                        value: i.id_area,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    area_data: ar,
                    userid: nextProps.auth.user.id
                })
            }
        }
    }
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        // let data = new FormData(form);
        let parseData = {};
        let parseDataU = {};
        ;
        let jml = [];
            for(let i=0;i<parseInt(this.state.jumlah,10);i++){
                jml.push(
                    {
                        "nama":this.state.nama+" "+(i+1),
                        "kapasitas":this.state.kapasitas,
                        "area":this.state.area.value,
                        "height":this.state.height,
                        "width":this.state.width,
                        "bentuk":this.state.bentuk,
                    }
                );
            }
        parseData['master'] = jml;
        
        parseDataU['nama'] = this.state.nama;
        parseDataU['kapasitas'] = this.state.kapasitas;
        parseDataU['area'] = this.state.area.value;
        parseDataU['height'] = this.state.height;
        parseDataU['width'] = this.state.width;
        parseDataU['bentuk'] = this.state.bentuk;

        let err = this.state.error;
        if(this.state.nama===''||this.state.nama===undefined){
            err = Object.assign({}, err, {nama:"nama tidak boleh kosong"});
            this.setState({error: err});
            return;
        } else if (this.state.area===''||this.state.area===undefined){
            err = Object.assign({}, err, {area:"lokasi tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        else{
            if(this.props.detail===undefined){
                this.props.dispatch(createMeja(parseData));
                this.props.dispatch(ModalToggle(false));
            }else{
                this.props.dispatch(updateMeja(this.state.id,parseDataU));
                this.props.dispatch(ModalToggle(false));
            }
        }

    }

    getFiles(files) {
        this.setState({
            gambar: files
        })
    };
    render(){
        console.log("mmmmmmmmmm",this.state.area);
        console.log("jjjjjjjjjj",this.props);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formMeja"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Meja":"Update Meja"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Area</label>
                            <Select
                                options={this.state.area_data}
                                placeholder="Pilih Area"
                                onChange={this.HandleChangeArea}
                                value={this.state.area}
                            />
                            <div className="invalid-feedback"
                                 style={this.state.error.area !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.area}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="form-group">
                                    <label>Nama Meja</label>
                                    <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.nama !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.nama}
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Jumlah Meja</label>
                                    <input type="number" className="form-control" readOnly={this.props.detail===undefined?false:true} name="jumlah" value={this.state.jumlah} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.jumlah !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.jumlah}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Width</label>
                                    <input type="number" className="form-control" name="width" value={this.state.width} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.width !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.width}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>Height</label>
                                    <input type="text" className="form-control" name="height" value={this.state.height} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.height !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.height}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Kapasitas</label>
                                    <input type="number" className="form-control" name="kapasitas" value={this.state.kapasitas} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.kapasitas !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.kapasitas}
                                    </div>
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="form-group">
                                    <label>Bentuk</label>
                                    <input type="text" className="form-control" name="bentuk" value={this.state.bentuk} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                        style={this.state.error.bentuk !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.bentuk}
                                    </div>
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
        auth:state.auth,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(FormMeja);
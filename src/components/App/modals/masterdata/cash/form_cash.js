import React,{Component} from 'react';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {createCash, FetchCash, updateCash} from "redux/actions/masterdata/cash/cash.action";
import {stringifyFormData} from "helper";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader,ModalFooter} from "reactstrap";


class FormCash extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            title:'',
            jenis: '',
            type:'',
            error:{
                title:'',
                jenis: '',
                type:'',
            }
        };

    }
    getProps(param){
        if (param.detail !== [] && param.detail !== undefined) {
            console.log("object");
            this.setState({
                title: param.detail.title,
                jenis: param.detail.jenis,
                type: param.detail.type,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
       this.getProps(nextProps)
    }
    componentWillMount(){
        this.getProps(this.props);
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

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['title']=this.state.title;
        parseData['jenis']=this.state.jenis;
        parseData['type']=this.state.type;
        console.log(parseData);
        let err = this.state.error;
        if(parseData['jenis']===''||parseData['jenis']===undefined){
            err = Object.assign({}, err, {jenis:"nama tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['type']===''||parseData['type']===undefined){
            err = Object.assign({}, err, {type:"tipe tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['title']===''||parseData['title']===undefined){
            err = Object.assign({}, err, {title:"catatan tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(this.props.detail===undefined){
                this.props.dispatch(createCash(parseData));
            }else{
                this.props.dispatch(updateCash(this.props.detail.id,parseData));
            }
            this.props.dispatch(FetchCash(1,'masuk',''));
            this.props.dispatch(ModalToggle(false));
        }


    }
    toggle = (e) => {
        e.preventDefault();
        // window.scrollTo(0, 0);
        // const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(false));
        this.setState({})
    };
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCash"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Cash":"Update Cash"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nama</label>
                            <select name="jenis" className="form-control" id="jenis" defaultValue={this.state.jenis} value={this.state.jenis} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="0">Kas Kecil</option>
                                <option value="1">Kas Besar</option>
                            </select>
                            <div className="invalid-feedback"
                                 style={this.state.error.jenis !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.jenis}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tipe</label>
                            <select name="type" className="form-control" id="type" defaultValue={this.state.type} value={this.state.type} onChange={this.handleChange}>
                                <option value="">==== Pilih ====</option>
                                <option value="0">Kas Masuk</option>
                                <option value="1">Kas Keluar</option>
                            </select>
                            <div className="invalid-feedback"
                                 style={this.state.error.type !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.type}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Catatan</label>
                            <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange}/>
                            <div className="invalid-feedback"
                                 style={this.state.error.title !== "" ? {display: 'block'} : {display: 'none'}}>
                                {this.state.error.title}
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
export default connect(mapStateToProps)(FormCash);
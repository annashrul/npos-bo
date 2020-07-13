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
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            title:'',
            jenis: '0',
            type:'0',
            token:''
        };

    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps.detail);
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            console.log("object");
            this.setState({
                title: nextProps.detail.title,
                jenis: nextProps.detail.jenis,
                type: nextProps.detail.type,
            })
        }
    }



    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleOnChange(e) {
        let name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
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
        if(this.props.detail===undefined){
            this.props.dispatch(createCash(parseData));
        }else{
            this.props.dispatch(updateCash(this.props.detail.id,parseData));
        }
        this.props.dispatch(FetchCash(1,'masuk',''));
        this.props.dispatch(ModalToggle(false));
    }
    toggle = (e) => {
        e.preventDefault();
        // window.scrollTo(0, 0);
        // const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(false));
        this.setState({})
    };
    render(){
        // const {data} = this.props.detail;
        // console.log();

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCash"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Cash":"Update Cash"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Name</label>
                            <select name="jenis" className="form-control" id="jenis" defaultValue={this.state.jenis} value={this.state.jenis} onChange={this.handleChange}>
                                <option value="0">Kas Kecil</option>
                                <option value="1">Kas Besar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" className="form-control" id="type" defaultValue={this.state.type} value={this.state.type} onChange={this.handleChange}>
                                <option value="0">Kas Masuk</option>
                                <option value="1" selected>Kas Keluar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Note</label>
                            <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} required/>
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
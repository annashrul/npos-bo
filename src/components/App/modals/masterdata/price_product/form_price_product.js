import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createCustomerType,
    updateCustomerType
} from "redux/actions/masterdata/customer_type/customer_type.action";
import {updatePriceProduct} from "../../../../../redux/actions/masterdata/price_product/price_product.action";
class FormPriceProduct extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            id:'',harga:'', harga2:'',harga3:'',harga4:'',ppn:'',service:'',
            error:{
                harga:'', harga2:'',harga3:'',harga4:'',ppn:'',service:'',
            }
        };
    }
    getProps(param){
        if (param.detail !== [] && param.detail !== undefined) {
            this.setState({
                id:param.detail.id,
                harga:param.detail.harga,
                harga2:param.detail.harga2,
                harga3:param.detail.harga3,
                harga4:param.detail.harga4,
                ppn:param.detail.ppn,
                service:param.detail.service,
            })
        }else{
            this.setState({harga:'', harga2:'',harga3:'',harga4:'',ppn:'',service:''})
        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['harga'] = this.state.harga;
        parseData['ppn'] = this.state.ppn;
        parseData['service'] = this.state.service;
        parseData['harga2'] = this.state.harga2;
        parseData['harga3'] = this.state.harga3;
        parseData['harga4'] = this.state.harga4;
        let err = this.state.error;
        if(parseData['harga']===''||parseData['harga']===undefined){
            err = Object.assign({}, err, {harga:"harga 1 tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['harga2']===''||parseData['harga2']===undefined){
            err = Object.assign({}, err, {harga2:"harga 2 tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['harga3']===''||parseData['harga3']===undefined){
            err = Object.assign({}, err, {harga3:"harga 3 tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['harga4']===''||parseData['harga4']===undefined){
            err = Object.assign({}, err, {harga4:"harga 4 tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['ppn']===''||parseData['ppn']===undefined){
            err = Object.assign({}, err, {ppn:"ppn tidak boleh kosong"});
            this.setState({error: err});
        }
        else if(parseData['service']===''||parseData['service']===undefined){
            err = Object.assign({}, err, {service:"service tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(parseInt(parseData['harga']) < 0){
                err = Object.assign({}, err, {harga:"harga 1 tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else if(parseInt(parseData['harga2']) < 0){
                err = Object.assign({}, err, {harga2:"harga 2 tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else if(parseInt(parseData['harga3']) < 0){
                err = Object.assign({}, err, {harga3:"harga 3 tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else if(parseInt(parseData['harga4']) < 0){
                err = Object.assign({}, err, {harga4:"harga 4 tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else if(parseInt(parseData['ppn']) < 0){
                err = Object.assign({}, err, {ppn:"ppn tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else if(parseInt(parseData['service']) < 0){
                err = Object.assign({}, err, {service:"service tidak boleh kurang dari 0"});
                this.setState({error: err});
            }
            else{
                this.props.dispatch(updatePriceProduct(this.state.id,parseData));
                this.props.dispatch(ModalToggle(false));
            }
            console.log("SUBMITTED",parseData);
            // if (this.props.detail !== undefined) {
            //     this.props.dispatch(updateCustomerType(this.props.detail.kd_brg,parseData));
            //     this.props.dispatch(ModalToggle(false));
            // }else{
            //     this.props.dispatch(createCustomerType(parseData));
            //     this.props.dispatch(ModalToggle(false));
            // }
        }

    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPriceProduct"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"":"Ubah Harga Barang"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Harga 1</label>
                            <input type="number" className="form-control" name="harga" value={this.state.harga} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.harga!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.harga}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Harga 2</label>
                            <input type="number" className="form-control" name="harga2" value={this.state.harga2} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.harga2!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.harga2}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Harga 3</label>
                            <input type="number" className="form-control" name="harga3" value={this.state.harga3} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.harga3!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.harga3}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Harga 4</label>
                            <input type="number" className="form-control" name="harga4" value={this.state.harga4} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.harga4!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.harga4}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>PPN</label>
                            <input type="number" className="form-control" name="ppn" value={this.state.ppn} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.ppn!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.ppn}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Servis</label>
                            <input type="number" className="form-control" name="service" value={this.state.service} onChange={this.handleChange}  />
                            <div className="invalid-feedback" style={this.state.error.service!==""?{display:'block'}:{display:'none'}}>
                                {this.state.error.service}
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
export default connect(mapStateToProps)(FormPriceProduct);
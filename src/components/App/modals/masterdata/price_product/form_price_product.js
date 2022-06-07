import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { updatePriceProduct } from "../../../../../redux/actions/masterdata/price_product/price_product.action";
import {handleError, isEmptyOrUndefined, rmComma, toCurrency} from "../../../../../helper";

import ButtonActionForm from "../../../common/ButtonActionForm";

class FormPriceProduct extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            id: "",
            harga1: "0",
            harga2: "0",
            harga3: "0",
            harga4: "0",
            ppn: "0",
            service: "0",
            harga_beli: "0",
            dataHarga:[],
        };
    }
    closeModal(e) {
        e.preventDefault();
        this.resetState();
        this.props.dispatch(ModalToggle(false));
    }
    resetState() {
        this.setState({
            id: "",
            harga1: "0",
            harga2: "0",
            harga3: "0",
            harga4: "0",
            ppn: "0",
            service: "0",
            harga_beli: "0",
        });
    }
    getProps(param) {
        if (param.detail.id !== "") {
            let dataHrg=[];
            for(let i=0;i<this.props.auth.user.set_harga;i++){
                dataHrg.push({
                    label:this.props.auth.user.nama_harga[i][`harga${i+1}`],
                    value:i===0?parseInt(param.detail.harga,10):(param.detail[`harga${i+1}`]===undefined?0:parseInt(param.detail[`harga${i+1}`],10))
                });
            }
            this.setState({
                dataHarga:dataHrg,
                id: param.detail.id,
                harga1: param.detail.harga,
                harga2: param.detail.harga2,
                harga3: param.detail.harga3,
                harga4: param.detail.harga4,
                ppn: param.detail.ppn,
                service: param.detail.service,
                harga_beli: param.detail.harga_beli,
            });
        } else {
            this.resetState();
        }
    }
    componentWillMount() {
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    handleChange = (event,i=null) => {
        if(i!==null){
            let dataHarga=this.state.dataHarga;
            dataHarga[i][`value`] = parseInt(rmComma(event.target.value),10);
            this.setState({dataHarga})
        }else{
            this.setState({ [event.target.name]: event.target.value });

        }
    };
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        // let parseData = stringifyFormData(data);
        let parseData={};
        const propsUser=this.props.auth.user;
        const setHarga=propsUser.set_harga;
        parseData["ppn"] = rmComma(this.state.ppn);
        parseData["service"] = rmComma(this.state.service);
        let i=2;
        this.state.dataHarga.map((val,key)=>{
            if(isNaN(val['value'])){
                handleError(`harga ${val['label']}`);
                return false;
            }

            if(key===0){
                parseData['harga'] = parseInt(rmComma(val['value']),10);
            }else{
                i++;
                parseData[`harga${i-1}`] = parseInt(rmComma(val['value']),10);
            }

        });
        parseData["harga_beli"] = rmComma(this.state.harga_beli);
        if (!isEmptyOrUndefined(parseData.harga_beli, "harga beli")) return;
        if (!isEmptyOrUndefined(this.state.ppn, "ppn")) return;
        if (!isEmptyOrUndefined(this.state.service, "service")) return;
        this.props.dispatch(updatePriceProduct(this.state.id, parseData, this.props.detail.where));
    }

    render() {
        const propsUser=this.props.auth.user;
        const setHarga=propsUser.set_harga;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPriceProduct"} siindexHargae="md">
                <ModalHeader toggle={this.closeModal}>Ubah Harga Barang</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Harga Beli <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" name="harga_beli" value={toCurrency(this.state.harga_beli)} onChange={this.handleChange} />
                        </div>
                        <div className="row">
                            {
                                typeof propsUser.nama_harga === "object" && (() => {
                                    let container = [];
                                    for (let indexHarga = 0; indexHarga < this.state.dataHarga.length; indexHarga++) {
                                        container.push(
                                            <div key={indexHarga} className={setHarga>1?`col-md-6`:`col-md-12`}>
                                                <div className="form-group">
                                                    <label>{ setHarga>1?`Harga ${this.state.dataHarga[indexHarga][`label`]}`:"Harga"} <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name={`harga${indexHarga+1}`} value={toCurrency(this.state.dataHarga[indexHarga][`value`])} onChange={(e)=>this.handleChange(e,indexHarga)} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    return container;
                                })()}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>PPN <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="ppn" value={toCurrency(this.state.ppn)} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Servis <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="service" value={toCurrency(this.state.service)} onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonActionForm callback={this.closeModal} />
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
        auth: state.auth,

    };
};
export default connect(mapStateToProps)(FormPriceProduct);

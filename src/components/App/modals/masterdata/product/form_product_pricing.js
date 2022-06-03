import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { setProductEdit, updateProduct } from "redux/actions/masterdata/product/product.action";
import { FetchCheck } from "redux/actions/site.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import moment from "moment";
import {getMargin, rmComma, toCurrency} from "../../../../../helper";
import { isNaN } from "lodash";
import FormSubDepartment from "../../../../../components/App/modals/masterdata/department/form_sub_department";
import FormGroupProduct from "../../../../../components/App/modals/masterdata/group_product/form_group_product";
import FormSupplier from "../../../../../components/App/modals/masterdata/supplier/form_supplier";
import { convertBase64 } from "helper";
class FormProductPricing extends Component {
    constructor(props) {
        super(props);
        this.state={
            zoom: 13,
            barangSku:[],
            lokasi:[],dataSku:[]
        };
        this.toggle=this.toggle.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        if (this.props.barangSku !== undefined) {
            this.props.dispatch(ModalType("formProduct"));
        } else {
            const bool = !this.props.isOpen;
            this.props.dispatch(ModalToggle(bool));
        }
    };
    handleChange(event, i,key,idx) {
        let col = event.target.name;
        let value = parseInt(rmComma(event.target.value));
        let state=this.state;
        // let dataSku = state.dataSku;
        let lokasi=state.lokasi;
        if(col==="hrgBeli"){
            lokasi[i]["dataHarga"][key]["hrgBeli"]=value;
        }
        else if(col==="nominal"){
            const valMargin=getMargin(value,lokasi[i]["dataHarga"][key]["hrgBeli"],"margin");
            lokasi[i]["dataHarga"][key]["harga"][idx]["nominal"]=value;
            lokasi[i]["dataHarga"][key]["harga"][idx]["margin"] = valMargin;
        }
        else if(col==="margin"){
            const valNominal=getMargin(value,lokasi[i]["dataHarga"][key]["hrgBeli"],"nominal");
            lokasi[i]["dataHarga"][key]["harga"][idx]["nominal"]=valNominal;
            lokasi[i]["dataHarga"][key]["harga"][idx]["margin"] = value;
        }

        this.setState({lokasi});
    }

    handleSubmit(e){
        e.preventDefault();
    }

    getProps(param) {
        let dataLokasi=param.auth.user.lokasi;
        let dataSku = [];
        let hargaBeli;
        let varHrg="";
        dataLokasi.map((val,key)=>{
            varHrg=`harga-${key}`;
            if(key===0){
                let cek=[];
                param.barangSku.map((row,idx)=>{
                    if(param.barangSku.length>1){
                        cek.push({[`${varHrg}`]:row.hrgBeli});
                        hargaBeli=cek;
                    }
                    else{
                        hargaBeli = row.hrgBeli;
                    }
                });
            }
            dataSku.push({hrgBeli:hargaBeli,nama:val.nama});
            Object.assign(val,{dataHarga:param.barangSku})
        });
        console.log(dataSku);
        this.setState({barangSku:param.barangSku,lokasi:dataLokasi,dataSku:dataSku});
    }

    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    componentWillMount() {
        this.getProps(this.props);
    }



    render() {
        const {zoom,barangSku,lokasi,dataSku}=this.state;
        const dataCol=[{"label":"Margin","value":"margin"},{"label":"Harga Jual","value":"nominal"}];
        const colorHeader=["#5c6bc0","#3949ab","#1a237e"];
        return (
            <div>
                <WrapperModal
                    isOpen={this.props.isOpen && this.props.type === "formProductPricing"}
                    size="xl"
                >
                    <ModalHeader toggle={this.toggle}>
                        {this.props.dataEdit === undefined ? "Tambah Harga Barang" : "Ubah Harga Barang"}
                    </ModalHeader>

                    <form onSubmit={this.handleSubmit}>
                        <ModalBody>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4 className="mb-2">Set harga per lokasi</h4>
                                        <div className="form-group">
                                            <label htmlFor="zoom" className="m-0 p-0">
                                                Zoom in/out table
                                            </label>
                                            <input className="custom-range border-0" id="zoom" type="range" name="zoom" onChange={(e) => this.handleChange(e)} value={zoom} min={0} max={25} step={1} />
                                        </div>
                                    </div>
                                    <hr className="mt-0" />
                                </div>


                                <div className="col-md-12" style={{zoom:75 + parseInt(zoom, 10) + "%"}}>
                                    {
                                        lokasi.length>0&&lokasi.map((val,key)=>{
                                            return <div className="card" key={key}>
                                                <div className="card-header">
                                                    <h4><b>SETTING HARGA DI {val.nama}</b></h4>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        {
                                                            val.dataHarga.length>0&&val.dataHarga.map((res,idx)=>{

                                                                return <div className="col-md-12" key={idx}>
                                                                    <div className="row">
                                                                        {val.dataHarga.length>1&&<div className="col-md-12" style={{marginBottom:"10px"}}>
                                                                            <div className="card-header" style={{backgroundColor:colorHeader[idx],fontWeight:"bold",color:"white"}}>HARGA BARANG DENGAN SATUAN {res.qty.toUpperCase()}</div>
                                                                        </div>}
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label>Harga Beli</label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder={`Harga Beli`}
                                                                                    className={`form-control`}
                                                                                    name={`hrgBeli`}
                                                                                    value={toCurrency(res.hrgBeli)}
                                                                                    onChange={(e) => this.handleChange(e, key,idx)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            dataCol.length>0&&dataCol.map((v,i)=>{
                                                                                return <div className="col-md-4" key={i}>
                                                                                    {
                                                                                        res.harga.length>0&&res.harga.map((row,index)=>{
                                                                                            return <div className="form-group" key={index}>
                                                                                                <label>{v.label} {row.label}</label>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className={`form-control`}
                                                                                                    name={v.value}
                                                                                                    value={isNaN(row[`${dataCol[i]['value']}`])?0:toCurrency(row[`${dataCol[i]['value']}`])}
                                                                                                    onChange={(e) => this.handleChange(e, key,idx,index)}
                                                                                                />
                                                                                            </div>
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                    <div className="form-group" style={{ textAlign: "right" }}>
                                        <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
                                            <i className="ti-close" /> Batal
                                        </button>
                                        {this.props.allState === undefined ? (
                                            <button type="submit" className="btn btn-primary mb-2 mr-2">
                                                <i className="ti-save" /> Simpan
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary mb-2 mr-2">
                                                <i className="ti-save" /> Terapkan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </form>
                </WrapperModal>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        location: state.locationReducer.data,
        auth: state.auth,
    };
};
export default connect(mapStateToProps)(FormProductPricing);

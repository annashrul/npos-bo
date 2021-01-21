import React,{Component} from 'react';
import {ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {ModalToggle} from "redux/actions/modal.action";
import {
    // FetchApprovalMutation,
    saveApprovalMutation} from "../../../../../redux/actions/inventory/mutation.action";
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

class FormApprovalMutation extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnEnter = this.handleOnEnter.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.state = {
            dataApproval: [],
            q:'',
            checked_all:false,
            allCheck:false,
            error:{

            },

        }
    }
    componentWillReceiveProps(nextProps){
        
        let data=[];
        let isAppove = [];
        if(typeof nextProps.dataApproval.data==='object'){
            nextProps.dataApproval.data.map((v,i)=>{
                data.push({
                    "checked":false,
                    "kd_brg":v.kd_brg,
                    "barcode":v.barcode,
                    "nm_brg":v.nm_brg,
                    "satuan":v.satuan,
                    "hrg_beli":v.hrg_beli,
                    "total_qty":v.total_qty,
                    "total_approval":v.total_approval,
                    "sisa_approval":v.total_qty,
                    "isReadonly":parseInt(v.total_qty,10)===parseInt(v.total_approval,10)?true:false,
                });
                if(parseInt(v.total_qty,10)===parseInt(v.total_approval,10)){
                    isAppove.push({"count":i})
                }
                // Object.assign(v,{
                //     isReadonly:false,
                // });
                return null;
            })
        }
        if(isAppove.length!==0){
            if(isAppove.length===nextProps.dataApproval.data.length){
                this.setState({allCheck:true})
            }
        }
        // typeof nextProps.dataApproval.data==='object'?
        //     nextProps.dataApproval.data.map((v,i)=>{
        //         data.push({
        //             "kd_brg":v.kd_brg,
        //             "barcode":v.barcode,
        //             "nm_brg":v.nm_brg,
        //             "satuan":v.satuan,
        //             "hrg_beli":v.hrg_beli,
        //             "total_qty":v.total_qty,
        //             "total_approval":v.total_approval,
        //             "sisa_approval":v.total_qty,
        //             "isReadonly":parseInt(v.total_qty,10)===parseInt(v.total_approval,10)?true:false,
        //         });
        //         // Object.assign(v,{
        //         //     isReadonly:false,
        //         // });
        //         return null;
        //     })
        //     : "";
        this.setState({dataApproval:data});
    }
    handleChange(event,i){
        // event.preventDefault()
        this.setState({ [event.target.name]: event.target.value });
        let dataApproval = [...this.state.dataApproval];
        dataApproval[i] = {...dataApproval[i], [event.target.name]: event.target.value};
        this.setState({ dataApproval });
    }
    handleCheck(event,i){
            // event.preventDefault()
            let dataApproval = [...this.state.dataApproval];
            if(event.target.name==='checked_all'){
                for(let j=0;j<this.state.dataApproval.length;j++){
                    dataApproval[j] = {...dataApproval[j], checked: !this.state.checked_all };
                }
                this.setState({checked_all:!this.state.checked_all})
            } else {
                dataApproval[i] = {...dataApproval[i], checked: !this.state.dataApproval[i].checked };
            }
            this.setState({ dataApproval });
    }
    handleOnEnter(i){
        // let data={};
        // if(parseInt(this.state.dataApproval[i].sisa_approval,10) > (parseInt(this.state.dataApproval[i].total_qty,10)-parseInt(this.state.dataApproval[i].total_approval,10))){

        // }else{
        //     data['kd_trx']          = localStorage.getItem("kd_trx_mutasi");
        //     data['sisa_approval']   = this.state.dataApproval[i].sisa_approval;
        //     data['barcode']         = this.state.dataApproval[i].barcode;
        //     // 
        //     // let total_qty =  this.state.dataApproval[i].total_qty;
        //     // let total_approval =  this.state.dataApproval[i].total_approval;
        //     if(parseInt(this.state.dataApproval[i].sisa_approval,10)>0){
        //         this.props.dispatch(saveApprovalMutation(data,(arr)=>this.props.history.push(arr)));
        //         // this.state.dataApproval[i].isReadonly=true;
        //         var dataApproval = this.state.dataApproval;
        //         dataApproval[i].isReadonly = true;
        //         this.setState({dataApproval: dataApproval});
        //     }
        //     this.setState({});
        // }
    }
    handleApproveAll(e){
        e.preventDefault();
        let isValid = true
        let data = [];
        let detail = [];
        for( let i = 0 ; i<this.state.dataApproval.length ; i++){
            if(parseInt(this.state.dataApproval[i].sisa_approval,10)>0){
                if(this.state.dataApproval[i].checked){
                    if(parseInt(this.state.dataApproval[i].total_qty,10)!==parseInt(this.state.dataApproval[i].total_approval,10)){
                        let val = {}
                        val['sisa_approval'] = this.state.dataApproval[i].sisa_approval;
                        val['barcode'] = this.state.dataApproval[i].barcode;
                        data.push(val);
                        detail.push(this.state.dataApproval[i]);
                        if(parseInt(this.state.dataApproval[i].sisa_approval,10) > (parseInt(this.state.dataApproval[i].total_qty,10)-parseInt(this.state.dataApproval[i].total_approval,10))){
                            Swal.fire({allowOutsideClick: false,
                                title: 'Informasi',
                                type: 'error',
                                text: 'Terdapat QTY yang tidak sesuai!',
                            });
                            isValid = false
                        }
                    }
                }
            } else {
                isValid = false
                break;
            }
        }
        let parsedata = {}
        parsedata['kd_trx'] = localStorage.getItem("kd_trx_mutasi");
        parsedata['detail'] = data

        let newParse = {}
        newParse['data'] = parsedata
        newParse['detail'] = detail
        if(data.length>0){
            if(isValid){
                this.props.dispatch(saveApprovalMutation(newParse, (arr)=>this.props.history.push(arr)));
            }
        } else {
            Swal.fire({allowOutsideClick: false,
                title: 'failed',
                type: 'error',
                text: 'ceklis item yang akan di approve!',
            });
        }
        this.setState({});
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        // this.props.dispatch(FetchApprovalMutation(1,'','',this.props.parameterMutasi==='TR'?'TR':''))
    };

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formApprovalMutation"} size="lg" className="custom-map-modal">
                <ModalHeader toggle={this.toggle}><p>{localStorage.getItem("kd_trx_mutasi")} <br/> <small style={{color:"red"}}>( Enter Atau Klik Button Approval Untuk Menyimpan Data )</small> </p></ModalHeader>
                <ModalBody>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="text-black" style={columnStyle}><input type="checkbox" name="checked_all" className={this.state.allCheck?'d-none':''} checked={this.state.checked_all} defaultValue={this.state.checked_all} onChange={(e)=>this.handleCheck(e)} /></th>
                            <th className="text-black" style={columnStyle}>No</th>
                            <th className="text-black" style={columnStyle}>Kode Barang</th>
                            <th className="text-black" style={columnStyle}>Barcode</th>
                            <th className="text-black" style={columnStyle}>Nama Barang</th>
                            <th className="text-black" style={columnStyle}>Satuan</th>
                            <th className="text-black" style={columnStyle}>Harga Beli</th>
                            <th className="text-black" style={columnStyle}>Total Qty</th>
                            <th className="text-black" style={columnStyle}>Total Approval</th>
                            <th className="text-black" style={columnStyle}>Qty Approval</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.dataApproval.length > 0 ?
                                this.state.dataApproval.map((v,i)=>{
                                    return(
                                        <tr key={i}>
                                            <td style={columnStyle}><input type="checkbox" className={v.isReadonly?'d-none':''} name="checked" checked={v.checked} defaultValue={v.checked} onChange={(e)=>this.handleCheck(e,i)} /></td>
                                            <td style={columnStyle}>{i+1}</td>
                                            <td style={columnStyle}>{v.kd_brg}</td>
                                            <td style={columnStyle}>{v.barcode}</td>
                                            <td style={columnStyle}>{v.nm_brg}</td>
                                            <td style={columnStyle}>{v.satuan}</td>
                                            <td style={columnStyle}>{v.hrg_beli}</td>
                                            <td style={columnStyle}>{v.total_qty}</td>
                                            <td style={columnStyle}>{v.total_approval}</td>
                                            <td style={columnStyle}>
                                                <input readOnly={v.isReadonly} type="text" name="sisa_approval" className={`form-control ${v.isReadonly?'d-none':''}`} value={v.sisa_approval} onChange={(e)=>this.handleChange(e,i)}  onKeyPress = {
                                                    event => {
                                                        if (event.key === 'Enter') {
                                                            this.handleOnEnter(i);
                                                        }
                                                    }
                                                }/>
                                                {!v.isReadonly?<div className="invalid-feedback"
                                                     style={parseInt(v.sisa_approval,10) > (parseInt(v.total_qty,10)-parseInt(v.total_approval,10)) ? {display: 'block'} : {display: 'none'}}>
                                                    Qty Approval Melebihi Total Qty.
                                                </div>:''}

                                            </td>
                                        </tr>
                                    )
                                })
                                : "No data."
                        }
                        </tbody>
                    </table>
                </ModalBody>
                <ModalFooter>
                <button onClick={(e)=>this.handleApproveAll(e)} className="btn btn-primary float-right">Approve Checked</button>
                </ModalFooter>
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
// const mapDispatch
export default withRouter(connect(mapStateToProps)(FormApprovalMutation));
// export default withRouter(connect(mapStateToPropsCreateItem)(ReturTanpaNota));
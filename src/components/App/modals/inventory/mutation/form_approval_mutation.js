import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {ModalToggle} from "redux/actions/modal.action";
import {FetchApprovalMutation, saveApprovalMutation} from "../../../../../redux/actions/inventory/mutation.action";

class FormApprovalMutation extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnEnter = this.handleOnEnter.bind(this);
        this.state = {
            dataApproval: [],
            q:'',
            error:{

            },

        }
    }
    componentWillReceiveProps(nextProps){
        
        let data=[];
        if(typeof nextProps.dataApproval.data==='object'){
            nextProps.dataApproval.data.map((v,i)=>{
                data.push({
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
                // Object.assign(v,{
                //     isReadonly:false,
                // });
                return null;
            })
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
    handleOnEnter(i){
        let data={};
        if(parseInt(this.state.dataApproval[i].sisa_approval,10) > (parseInt(this.state.dataApproval[i].total_qty,10)-parseInt(this.state.dataApproval[i].total_approval,10))){

        }else{
            data['kd_trx']          = localStorage.getItem("kd_trx_mutasi");
            data['sisa_approval']   = this.state.dataApproval[i].sisa_approval;
            data['barcode']         = this.state.dataApproval[i].barcode;
            // 
            // let total_qty =  this.state.dataApproval[i].total_qty;
            // let total_approval =  this.state.dataApproval[i].total_approval;
            if(parseInt(this.state.dataApproval[i].sisa_approval,10)>0){
                this.props.dispatch(saveApprovalMutation(data));
                // this.state.dataApproval[i].isReadonly=true;
                var dataApproval = this.state.dataApproval;
                dataApproval[i].isReadonly = true;
                this.setState({dataApproval: dataApproval});
                
            }
            this.setState({});
        }




    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(FetchApprovalMutation(1,'','',this.props.parameterMutasi==='TR'?'TR':''))
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
                                            <td style={columnStyle}>{i+1}</td>
                                            <td style={columnStyle}>{v.kd_brg}</td>
                                            <td style={columnStyle}>{v.barcode}</td>
                                            <td style={columnStyle}>{v.nm_brg}</td>
                                            <td style={columnStyle}>{v.satuan}</td>
                                            <td style={columnStyle}>{v.hrg_beli}</td>
                                            <td style={columnStyle}>{v.total_qty}</td>
                                            <td style={columnStyle}>{v.total_approval}</td>
                                            <td style={columnStyle}>
                                                <input readOnly={v.isReadonly} type="text" name="sisa_approval" className="form-control" value={v.sisa_approval} onChange={(e)=>this.handleChange(e,i)}  onKeyPress = {
                                                    event => {
                                                        if (event.key === 'Enter') {
                                                            this.handleOnEnter(i);
                                                        }
                                                    }
                                                }/>
                                                <div className="invalid-feedback"
                                                     style={parseInt(v.sisa_approval,10) > (parseInt(v.total_qty,10)-parseInt(v.total_approval,10)) ? {display: 'block'} : {display: 'none'}}>
                                                    Qty Approval Melebihi Total Qty.
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                })
                                : "No data."
                        }
                        </tbody>
                    </table>
                </ModalBody>
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
export default connect(mapStateToProps)(FormApprovalMutation);
import React,{Component} from 'react';
import {ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp,getMargin} from "helper";
import Paginationq from "helper";
import moment from "moment";
import {FetchReportDetail} from "redux/actions/purchase/receive/receive.action";
import {storeReturTanpaNota} from "../../../../../../redux/actions/purchase/retur_tanpa_nota/return_tanpa_nota.action";
class FormReturReceive extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            data_retur:[],
            userid:0,

        }

    }
    componentWillReceiveProps(nextprops){
        console.log("component will receive props",nextprops)
        if(nextprops.dataRetur!==undefined&&nextprops.dataRetur!==[]){
            let dataRetur=[];
            typeof nextprops.dataRetur.detail === 'object'? nextprops.dataRetur.detail.map((v,i)=>{
                dataRetur.push({
                    "kode_barang":v.kode_barang,
                    "harga":v.harga,
                    "harga_beli":v.harga_beli,
                    "barcode":v.barcode,
                    "satuan":v.satuan,
                    "stock":v.stock,
                    "nm_brg":v.nm_brg,
                    "qty":v.qty,
                    "qty_retur":0
                })
            }) : [];
            this.setState({
                data_retur:dataRetur,
                userid: nextprops.auth.user.id
            })
        }
    }

    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };

    HandleChangeInputValue(e,i) {
        const column = e.target.name;
        const val = e.target.value;
        console.log(column,val);
        let data_retur = [...this.state.data_retur];
        data_retur[i] = {...data_retur[i], [column]: val};
        this.setState({ data_retur });
    }
    handleSubmit(e){
        e.preventDefault();
        let data={};
        let detail=[];
        let subtotal=0;
        this.state.data_retur.map((v,i)=>{
           if(parseInt(v.qty_retur) > parseInt(v.stock)){
               return;
           }
            subtotal+=parseInt(v.qty_retur)*parseInt(v.harga_beli);
            detail.push({
                "kd_brg":v.kode_barang,
                "barcode":v.barcode,
                "satuan":v.satuan,
                "qty":v.qty_retur,
                "harga_beli":v.harga_beli,
                "keterangan":"-",
                "kondisi":"Good Stock"
            })
        });
        data['tanggal'] = moment(new Date()).format("yyyy-MM-DD");
        data['supplier'] = this.props.dataRetur.master.kode_supplier;
        data['keterangan'] = '-';
        data['subtotal'] = subtotal;
        data['lokasi'] = this.props.dataRetur.master.lokasi;
        data['userid'] = this.state.userid;
        data['nobeli'] = this.props.dataRetur.master.no_faktur_beli;
        data['detail'] = detail;
        this.props.dispatch(storeReturTanpaNota(data));
        console.log("SUBMITTED",data);
    }
    render(){
        // const {total,last_page,per_page,current_page,from,to,data} = this.props.receiveReportDetail;
        // let que=`detail_receive_report`;
        const columnStyle = {verticalAlign: "middle", textAlign: "center"};
        console.log("STATE DATA RETUR",this.state.data_retur);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formReturReceive"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>{"Retur Pembelian"}</ModalHeader>
                <ModalBody>
                    <table className="table">
                        <thead>
                        <tr>
                            <td className="text-black">Tanggal Retur</td>
                            <td>: {moment(new Date()).format("yyyy-MM-DD")}</td>
                            <td className="text-black">Lokasi</td>
                            <td>: </td>
                        </tr>
                        <tr>
                            <td className="text-black">No. Pembelian</td>
                            <td>: </td>
                            <td className="text-black">Keterangan</td>
                            <td>: </td>
                        </tr>
                        </thead>
                    </table>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Kode Barang</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Nama Barang</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Satuan</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Stock</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Harga Beli</th>
                                <th className="text-black" style={columnStyle} colSpan={2}>Diskon (%)</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Qty Beli</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>PPN</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Subtotal</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Qty Retur</th>
                                <th className="text-black" style={columnStyle} rowSpan={2}>Nilai Retur</th>
                            </tr>
                            <tr>
                                <th className="text-black" style={columnStyle}>1</th>
                                <th className="text-black" style={columnStyle}>2</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.data_retur.length > 0 ? this.state.data_retur.map((v,i)=>{
                                    return (
                                        <tr>
                                            <td style={columnStyle}>{v.kode_barang}</td>
                                            <td style={columnStyle}>{v.nm_brg}</td>
                                            <td style={columnStyle}>{v.satuan}</td>
                                            <td style={columnStyle}>{v.stock}</td>
                                            <td style={columnStyle}>{toRp(parseInt(v.harga_beli))}</td>
                                            <td style={columnStyle}>0</td>
                                            <td style={columnStyle}>0</td>
                                            <td style={columnStyle}>{v.qty}</td>
                                            <td style={columnStyle}>0</td>
                                            <td style={columnStyle}>{toRp(parseInt(v.qty)*parseInt(v.harga_beli))}</td>
                                            <td style={columnStyle}>
                                                <input type="text" name="qty_retur" className="form-control" value={v.qty_retur}  onChange={(e)=>this.HandleChangeInputValue(e,i)}/>
                                                {
                                                    parseInt(v.qty_retur) > parseInt(v.stock) ? (<small style={{fontWeight:"bold",color:"red"}}>stock tidak tersedia</small>) : ""
                                                }
                                            </td>
                                            <td style={columnStyle}>
                                                <input readOnly={true} type="text" className="form-control" value={toRp(parseInt(v.qty_retur)*parseInt(v.harga_beli))}/>
                                            </td>
                                        </tr>
                                    );
                                }) : "No data."
                            }
                            </tbody>

                        </table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={this.handleSubmit}>Simpan</button>
                </ModalFooter>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        auth:state.auth,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(FormReturReceive);
import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle} from "redux/actions/modal.action";
import Paginationq, {toRp} from "helper";
import {FetchMutationData} from "redux/actions/inventory/mutation.action";

class DetailMutation extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        localStorage.removeItem("code");
        localStorage.removeItem("barcode");
        localStorage.removeItem("name");
    };

    handlePageChange(pageNumber) {
        this.props.dispatch(FetchMutationData(pageNumber, this.props.mutationDetail.no_faktur_mutasi))
    }

    render(){
        // const data = this.props.mutationDetail.detail===undefined?[]:this.props.mutationDetail.detail.data;
        const {
            data,
            current_page,
            per_page,
            last_page
        } = this.props.mutationDetail.detail === undefined ? [] : this.props.mutationDetail.detail;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            keterangan,
            lokasi_asal,
            lokasi_tujuan,
            no_faktur_beli,
            no_faktur_mutasi,
            operator,
            tgl_mutasi,
            total
        } = this.props.mutationDetail
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailMutation"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Mutation</ModalHeader>
                    <ModalBody>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className="text-black">Faktur</td>
                                <td className="text-black">: {no_faktur_mutasi}</td>
                                <td className="text-black">Keterangan</td>
                                <td className="text-black">: {keterangan}</td>
                            </tr>
                            <tr>
                                <td className="text-black">Operator</td>
                                <td className="text-black">: {operator}</td>
                                <td className="text-black">Faktur Beli</td>
                                <td className="text-black">: {no_faktur_beli}</td>
                            </tr>
                            <tr>
                                 <td className="text-black">Lokasi Asal</td>
                                <td className="text-black">: {lokasi_asal}</td>
                                <td className="text-black">Lokasi Tujuan</td>
                                <td className="text-black">: {lokasi_tujuan}</td>
                            </tr>
                            <tr>
                                 <td className="text-black">Total Transaksi</td>
                                <td className="text-black">: {toRp(total)}</td>
                                <td className="text-black">Tanggal Mutasi</td>
                                <td className="text-black">: {tgl_mutasi}</td>
                            </tr>

                            </tbody>
                        </table>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>Faktur</th>
                                    <th className="text-black" style={columnStyle}>Kode</th>
                                    <th className="text-black" style={columnStyle}>Barcode</th>
                                    <th className="text-black" style={columnStyle}>Barang</th>
                                    <th className="text-black" style={columnStyle}>QTY</th>
                                    <th className="text-black" style={columnStyle}>HPP</th>
                                    <th className="text-black" style={columnStyle}>Harga Jual</th>
                                    <th className="text-black" style={columnStyle}>Type</th>
                                </tr>
                                
                                </thead>
                                <tbody>
                                {
                                    (
                                        typeof data === 'object' ? data.length > 0 ?
                                            data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>

                                                                {/* "no_faktur_mutasi": "MC-2006190001-2",
                                                                        "kd_brg": "010000003",
                                                                        "qty": "10",
                                                                        "hrg_beli": "170000",
                                                                        "hrg_jual": "180000",
                                                                        "barcode": "123123123",
                                                                        "satuan": "Karton",
                                                                        "nm_brg": "seprit orange" */}
                                                        <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                        <td style={columnStyle}>{v.barcode}</td>
                                                        <td style={columnStyle}>{v.kd_brg}</td>
                                                        <td style={columnStyle}>{v.nm_brg}</td>
                                                        <td style={columnStyle}>{v.qty}</td>
                                                        <td style={columnStyle}>{v.hrg_beli}</td>
                                                        <td style={columnStyle}>{v.hrg_jual}</td>
                                                        <td style={columnStyle}>{v.satuan}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="17">Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                                }
                                </tbody>
                                
                            </table>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={parseInt(current_page,10)}
                                    per_page={parseInt(per_page,10)}
                                    total={parseInt((per_page*last_page),10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                        </div>
                    </ModalBody>

                </WrapperModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        // stockReportDetailTransaction:state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
        mutationDetail: state.mutationReducer.report_data,

    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailMutation);
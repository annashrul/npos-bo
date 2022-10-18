import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import Paginationq,{toRp} from "helper";
class DetailSaleByProductReport extends Component{
    constructor(props){
        super(props);
        this.state={
            startDate:'',
            endDate:'',
            isExport:false,
        }
        this.toggle = this.toggle.bind(this);
    }
    componentWillUnmount(){
    }
    componentWillMount(){
        
        this.setState({
            startDate:this.props.startDate,
            endDate:this.props.endDate,
        })
    }

    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
 
    handlePageChange(pageNumber){
        this.checkingParameter(pageNumber);
    }    

    render(){

        const {data,last_page, per_page,current_page} = this.props.datum;
        const columnStyle = {verticalAlign: "middle", textAlign: "left",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailSaleBySalesReport"} size={this.state.isExport===false?'lg':'sm'}>
                <ModalHeader toggle={this.toggle}>Detail Penjualan by Sales</ModalHeader>
                <ModalBody>
                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover table-bordered">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Barcode</th>
                                <th className="text-black" style={columnStyle}>Nama Barang</th>
                                <th className="text-black" style={columnStyle}>Harga Jual</th>
                                <th className="text-black" style={columnStyle}>Qty</th>
                                <th className="text-black" style={columnStyle}>Qty Retur</th>
                                <th className="text-black" style={columnStyle}>Diskon</th>
                                <th className="text-black" style={columnStyle}>Total Penjualan</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                typeof data === 'object' ? data.length>0?
                                    data.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td style={columnStyle}>{v.barcode}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={columnStyle}>{v.hrg_jual}</td>
                                                <td style={{textAlign:"right"}}>{v.qty}</td>
                                                <td style={{textAlign:"right"}}>{v.qty_retur}</td>
                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.dis_persen,10))}</td>
                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.total,10))}</td>
                                            </tr>
                                        );
                                    }) : <tr>No data.</tr> : <tr>No data.</tr>
                            }
                            </tbody>
                        </table>
                        
                        <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={parseInt(current_page,10)}
                                        per_page={parseInt(per_page,10)}
                                        total={parseInt(last_page*per_page,10)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                    </div>
                </ModalBody>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        datum: state.saleBySalesReducer.detail
    }
}
export default connect(mapStateToProps)(DetailSaleByProductReport);
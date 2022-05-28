import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import {generateNo, getFetchWhere, getPeriode, noData, parseToRp, toRp} from "../../../../../helper";
import TableCommon from "../../../common/TableCommon";
import {FetchReportDetailSaleByProduct} from "../../../../../redux/actions/sale/sale_by_group_product.action";
import HeaderDetailCommon from "../../../common/HeaderDetailCommon";
class DetailSaleByGroupProductReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }

    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    handlePageChange(pageNumber) {
        this.handleService(pageNumber);
    }

    handleService(pageNumber = 1) {
        let master = this.props.detail;
        let where = getFetchWhere(master.where, pageNumber);
        this.props.dispatch(FetchReportDetailSaleByProduct(master.kel_brg, where,false));
    }
    render(){
        const {data,last_page,total, per_page,current_page} = this.props.data;
        const master = this.props.detail;
        const splitMaster=master.where.split("&");
        const dateFrom = splitMaster[1].replaceAll("datefrom=","");
        const dateTo = splitMaster[2].replaceAll("dateto=","");
        const head = [
            { label: "No", className: "text-center", width: "1%" },
            { label: "Barang" },
            { label: "Qty Terjual" },
            { label: "Diskon Item" },
            { label: "Gross Sales" },
            { label: "Tax" },
            { label: "Service" },
            { label: "Net Sales" },
        ];
        let totalQtyPerHalaman=0;
        let totalDiskonItemPerHalaman=0;
        let totalGrossSalesPerHalaman=0;
        let totalTaxPerHalaman=0;
        let totalServicePerHalaman=0;
        let totalNetSalesPerHalaman=0;

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailSaleByGroupProductReport"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Penjualan By Kelompok Barang</ModalHeader>
                <ModalBody>
                    <HeaderDetailCommon
                        md="col-md-12"
                        data={[
                            { title: "Kelompok Barang", desc: master.kel_brg},
                            { title: "Lokasi", desc: master.nama_lokasi==="-"?"Semua Lokasi":master.nama_lokasi },
                            { title: "Periode", desc: `${dateFrom} / ${dateTo}` },
                        ]}
                    />
                    <TableCommon
                        head={head}
                        meta={{ total: total, current_page: current_page, per_page: per_page }}
                        current_page={current_page}
                        callbackPage={this.handlePageChange.bind(this)}
                        renderRow={
                            typeof data === "object"? data.length > 0 ? data.map((v, i) => {
                                totalQtyPerHalaman+=parseInt(v.qty,10);
                                totalDiskonItemPerHalaman+=parseInt(v.diskon_item,10);
                                totalGrossSalesPerHalaman+=parseInt(v.gross,10);
                                totalNetSalesPerHalaman+=parseInt(v.net_sales,10);
                                totalTaxPerHalaman+=parseInt(v.tax,10);
                                totalServicePerHalaman+=parseInt(v.service,10);
                                    return (
                                        <tr key={i}>
                                            <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                                            <td className="middle nowrap">{v.nm_brg}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.qty)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.diskon_item)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.gross)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.tax)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.service)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.net_sales)}</td>
                                        </tr>
                                    );
                                }): noData(head.length)
                            : noData(head.length)
                        }
                        footer={[
                            {
                                data: [
                                    { colSpan: 2, label: "Total perhalaman", className: "text-left" },
                                    { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                                    { colSpan: 1, label: parseToRp(totalDiskonItemPerHalaman) },
                                    { colSpan: 1, label: parseToRp(totalGrossSalesPerHalaman) },
                                    { colSpan: 1, label: parseToRp(totalTaxPerHalaman) },
                                    { colSpan: 1, label: parseToRp(totalServicePerHalaman) },
                                    { colSpan: 1, label: parseToRp(totalNetSalesPerHalaman) },

                                ],
                            },
                        ]}
                    />
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
export default connect(mapStateToProps)(DetailSaleByGroupProductReport);
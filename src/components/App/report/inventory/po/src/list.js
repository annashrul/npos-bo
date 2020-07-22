import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {fetchPoReport, poReportDetail} from "redux/actions/purchase/purchase_order/po.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import DetailPoReport from "components/App/modals/report/purchase/purchase_order/detail_po_report";
import Swal from "sweetalert2";
import moment from "moment";

class ListPoReport extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        console.log(`active page is ${pageNumber}`);
        localStorage.setItem("page_po",pageNumber);
        this.props.dispatch(fetchPoReport(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_po',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(fetchPoReport(1,''))
        }else{
            this.props.dispatch(fetchPoReport(1,any))
        }
    }
    toggleModal(e, no_po) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("poReportDetail"));
        this.props.dispatch(poReportDetail(1,no_po))
    }
    // handleDelete(e,id){
    //     console.log(id);
    //     e.preventDefault();
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.value) {
    //             this.props.dispatch(deleteAdjustment(id,this.props.token));
    //         }
    //     })

    // }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {data} = this.props.data;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_por')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-4 col-md-4">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e,null)} className="btn btn-primary"><i className="fa fa-plus"></i></button> */}
                            </div>
                        </div>


                    </div>

                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Date</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Location</th>
                            <th className="text-black" style={columnStyle}>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(e,v.no_po)}>Detail</a>
                                                            {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</a> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.no_po}</td>
                                                <td style={columnStyle}>{moment(v.tgl_po).format("YYYY-MM-DD")}</td>
                                                <td style={columnStyle}>{v.nama_supplier}</td>
                                                <td style={columnStyle}>{v.lokasi}</td>
                                                <td style={columnStyle}>{v.catatan}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                    </table>

                </div>
                {/* <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div> */}
                <DetailPoReport token={this.props.token} poReportDetail={this.state.poReportDetail}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        isLoading: state.poReducer.isLoading,
        poReportDetail: state.poReducer.dataReportDetail,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListPoReport)
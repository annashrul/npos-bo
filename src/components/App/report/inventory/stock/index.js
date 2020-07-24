import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Preloader from "Preloader";
import {FetchStockReport} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import ListStockReport from "./src/list";
class InventoryReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:"",
            selectedIndex : 0
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillMount(){
        // sessionService.loadSession().then(session => {
        //     this.setState({
        //         token:session.token
        //     },()=>{
                // this.setState({token:session.token});
                let anyStockReport = localStorage.getItem("any_stock_report");
                let pageStockReport = localStorage.getItem('page_stock_report');
                this.props.dispatch(FetchStockReport(pageStockReport?pageStockReport:1,'','',''));
        //     })}
        // );
        // sessionService.loadUser()
        //     .then(user=>{
        //         this.setState({
        //             id:user.id
        //         },()=>{
        //         })
        //     })
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };
    render(){
        return (
            <Layout page="Inventory Report">
                {/*{this.props.isLoadingDetailSatuan?<Preloader/>:*/}
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                        {
                                !this.props.isLoading ? (  <ListStockReport
                                    // token={this.state.token}
                                    data={this.props.stockReport}
                                    total={this.props.total}
                                    /> ) : <Preloader/>
                            }
                            
                        </div>
                    </div>

                </div>
                {/*}*/}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // authenticated: state.sessionReducer.authenticated,
        stockReport:state.stockReportReducer.data,
        total:state.stockReportReducer.total,
        isLoading: state.stockReportReducer.isLoading,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(InventoryReport);
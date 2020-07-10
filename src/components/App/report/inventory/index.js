import React,{Component} from 'react'
import Layout from '../../_layout'
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ListLocation from "../../masterdata/location/master_location/list";
import Preloader from "../../../Preloader";
import ListLocationCategory from "../../masterdata/location/master_location_catergory/list";
import {sessionService} from "redux-react-session";
import {FetchLocation} from "../../../actions/masterdata/location/location.action";
import {FetchLocationCategory} from "../../../actions/masterdata/location_category/location_category.action";
import {FetchStockReport} from "../../../actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import ListStockReport from "./stock/list";
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
        sessionService.loadSession().then(session => {
            this.setState({
                token:session.token
            },()=>{
                this.setState({token:session.token});
                let anyStockReport = localStorage.getItem("any_stock_report");
                let pageStockReport = localStorage.getItem('page_stock_report');
                this.props.dispatch(FetchStockReport(session.token,pageStockReport?pageStockReport:1,'','',''));
            })}
        );
        sessionService.loadUser()
            .then(user=>{
                this.setState({
                    id:user.id
                },()=>{
                })
            })
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
                            <Tabs>
                                <TabList>
                                    <Tab onClick={(e) =>this.handleSelect(e,0)} >Stock</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,1)} >Stock Opname</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,2)} >Purchase</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,3)} >Sale</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,4)} >Adjusment</Tab>
                                </TabList>
                                <TabPanel>
                                    {
                                        !this.props.isLoading ? ( <ListStockReport
                                            token={this.state.token}
                                            data={this.props.stockReport}
                                            total={this.props.total}
                                            />
                                        ) : <Preloader/>
                                    }
                                </TabPanel>
                                <TabPanel>
                                    <h1>Stock Opname</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Purchase</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Sale</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Adjusment</h1>
                                </TabPanel>
                            </Tabs>
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
        authenticated: state.sessionReducer.authenticated,
        stockReport:state.stockReportReducer.data,
        total:state.stockReportReducer.total,
        isLoading: state.stockReportReducer.isLoading,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(InventoryReport);
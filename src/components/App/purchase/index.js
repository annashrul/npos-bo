import React,{Component} from 'react'
import Layout from 'Layout'
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {sessionService} from "redux-react-session";
import connect from "react-redux/es/connect/connect";
import TrxAdjustment from "./adjusment/trx_adjusment";
class Inventory extends Component{
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
                // this.setState({token:session.token});
                // let anyStockReport = localStorage.getItem("any_stock_report");
                // let pageStockReport = localStorage.getItem('page_stock_report');
                // this.props.dispatch(FetchStockReport(session.token,pageStockReport?pageStockReport:1,'','',''));
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
                                    <Tab onClick={(e) =>this.handleSelect(e,0)} >Adjusment</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,1)} >Delivery Note</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,2)} >Alocation / Mutation</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,3)} >Expedition</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,4)} >Packing</Tab>
                                </TabList>
                                <TabPanel>
                                   <TrxAdjustment/>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Delivery Note</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Alcation / Mutation</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Expedition</h1>
                                </TabPanel>
                                <TabPanel>
                                    <h1>Packing</h1>
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
    }
}
export default connect(mapStateToProps)(Inventory);
import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {fetchPoReport} from "redux/actions/purchase/purchase_order/po.action";
import Preloader from "Preloader";
import ListPoReport from "./src/list";

class PoReport extends Component{
    constructor(props){
        super(props);
        this.state={token:''};
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillMount(){
        let any = localStorage.getItem("any_po_report");
        let page = localStorage.getItem("page_po_report");
        this.props.dispatch(fetchPoReport(page?page:1,any?any:''));
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    render(){
        return (
            <Layout page="PoReport">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListPoReport
                                    data={this.props.poReport}
                                    pagin={this.handlePagin}
                                    search={this.handleSearch}
                                    token={this.state.token}
                                /> ) : <Preloader/>
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        poReport:state.poReducer.data,
        total:state.adjustmentReducer.total,
        isLoading: state.adjustmentReducer.isLoading,
        isLoadingDetailSatuan: state.adjustmentReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(AdjustmentReport)
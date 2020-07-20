import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchAdjustment} from "redux/actions/adjustment/adjustment.action";
import Preloader from "Preloader";
import ListAdjustmentReport from "./src/list";

class AdjustmentReport extends Component{
    constructor(props){
        super(props);
        this.state={token:''};
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillMount(){
        let any = localStorage.getItem("any_adjustment_report");
        let page = localStorage.getItem("page_adjustment_report");
        this.props.dispatch(FetchAdjustment(page?page:1,any?any:''));
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    render(){
        return (
            <Layout page="AdjustmentReport">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListAdjustmentReport
                                    data={this.props.adjustmentReport}
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
        adjustmentReport:state.adjustmentReducer.data,
        total:state.adjustmentReducer.total,
        isLoading: state.adjustmentReducer.isLoading,
        isLoadingDetailSatuan: state.adjustmentReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(AdjustmentReport)
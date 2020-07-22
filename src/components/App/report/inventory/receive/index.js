import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchReceiveReport} from "redux/actions/purchase/receive/receive.action";
import Preloader from "Preloader";
import ListReceiveReport from "./src/list";

class ReceiveReport extends Component{
    constructor(props){
        super(props);
        this.state={token:''};
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillMount(){
        let any = localStorage.getItem("any_receive_report");
        let page = localStorage.getItem("page_receive_report");
        this.props.dispatch(FetchReceiveReport(page?page:1,any?any:''));
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    render(){
        return (
            <Layout page="ReceiveReport">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListReceiveReport
                                    data={this.props.receiveReport}
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
        receiveReport:state.receiveReducer.data,
        // total:state.receiveReducer.total,
        isLoading: state.receiveReducer.isLoading,
        // isLoadingDetail: state.poReducer.isLoadingDetail,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(ReceiveReport)
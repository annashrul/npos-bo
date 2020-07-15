import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchSales} from "redux/actions/masterdata/sales/sales.action";
import Preloader from "Preloader";
import ListSales from "./src/list";

class Sales extends Component{
    constructor(props){
        super(props);
        this.state={token:''}
    }
    componentWillMount(){
        let any = localStorage.getItem("any_sales");
        let page = localStorage.getItem("page_sales");
        this.props.dispatch(FetchSales(page?page:1,any?any:''));
    }



    render(){
        return (
            <Layout page="Sales">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListSales
                                    data={this.props.sales}
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
        sales:state.salesReducer.data,
        isLoading: state.salesReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Sales)
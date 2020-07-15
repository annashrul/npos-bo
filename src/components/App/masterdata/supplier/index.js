import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchSupplier} from "redux/actions/masterdata/supplier/supplier.action";
import Preloader from "Preloader";
import ListSupplier from "./src/list";

class Supplier extends Component{
    constructor(props){
        super(props);
        this.state={token:''}
    }
    componentWillMount(){
        let any = localStorage.getItem("any_supplier");
        let page = localStorage.getItem("page_supplier");
        this.props.dispatch(FetchSupplier(page?page:1,any?any:''));
    }



    render(){
        return (
            <Layout page="Supplier">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListSupplier
                                    data={this.props.supplier}
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
        supplier:state.supplierReducer.data,
        isLoading: state.supplierReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Supplier)
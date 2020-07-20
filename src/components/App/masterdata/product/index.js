import React,{Component} from 'react';
import Layout from "../../Layout";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import connect from "react-redux/es/connect/connect";
import Preloader from "Preloader";
import {FetchProduct} from "redux/actions/masterdata/product/product.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {FetchPriceProduct} from "redux/actions/masterdata/price_product/price_product.action";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import ListGroupProduct from "./src/master_group_product/list";
import ListPriceProduct from "./src/master_price_product/list";
import ListProduct from "./src/master_product/list";


class Product extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:'',
            activeTab : 0,
            selectedIndex : 0,
            any : localStorage.getItem('any_product'),
            by : localStorage.getItem('by_product'),
        };
    }
    componentWillMount(){
        let by = this.state.by;
        let any = this.state.any;
        let anyGroupProduct = localStorage.getItem("any_group_product");
        let anyPriceProduct = localStorage.getItem("any_price_product");
        let pageGroupProduct = localStorage.getItem("page_group_product");
        let pagePriceProduct = localStorage.getItem("page_price_product");
        // this.props.dispatch(FetchProduct(1, by===''||by===null||by===undefined?'':by, any===''||any===null||any===undefined?'':any));
        this.props.dispatch(FetchProduct(1, ''));
        this.props.dispatch(FetchPriceProduct(pagePriceProduct?pagePriceProduct:1,anyPriceProduct?anyPriceProduct:''));
        this.props.dispatch(FetchGroupProduct(pageGroupProduct?pageGroupProduct:1,anyGroupProduct?anyGroupProduct:''));
    }
    //Use arrow functions to avoid binding
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
            console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };


    render(){
        return (
            <Layout page="Product">
                <div className="col-12 box-margin">
                    <div className="card">
                        <Tabs>
                            <div className="card-body">
                                <TabList>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(0)}>Product List</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(1)}>Product Price</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(2)}>Product Group</Tab>
                                </TabList>
                            </div>
                            <div className="card-header" style={{"height":"5px","backgroundColor":"#f9fafb"}}></div>
                            <div className="card-body">
                                <TabPanel>
                                    {
                                        !this.props.isLoading ? ( <ListProduct
                                            token={this.state.token}
                                            data={this.props.product}
                                            group={this.props.groupProduct}
                                        /> ) : <Preloader/>
                                    }
                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading1 ? ( <ListPriceProduct
                                            token={this.state.token}
                                            data={this.props.priceProduct}
                                        /> ) : <Preloader/>
                                    }
                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading2 ? ( <ListGroupProduct
                                            token={this.state.token}
                                            data={this.props.groupProduct}
                                        /> ) : <Preloader/>
                                    }
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        product:state.productReducer.data,
        priceProduct:state.priceProductReducer.data,
        groupProduct:state.groupProductReducer.data,
        isLoading: state.productReducer.isLoading,
        isLoading1: state.priceProductReducer.isLoading,
        isLoading2: state.groupProductReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Product)
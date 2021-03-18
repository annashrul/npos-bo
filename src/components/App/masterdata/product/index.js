import React,{Component} from 'react';
import Layout from "../../Layout";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import connect from "react-redux/es/connect/connect";
import Preloader from "Preloader";
import {FetchProduct} from "redux/actions/masterdata/product/product.action";
import {FetchPriceProduct} from "redux/actions/masterdata/price_product/price_product.action";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import ListGroupProduct from "./src/master_group_product/list";
import ListPriceProduct from "./src/master_price_product/list";
import ListProduct from "./src/master_product/list";
import { Link } from 'react-router-dom';
import moment from 'moment'


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
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[10]['label']==="0"){
                    alert("bukan halaman kamu");
                    this.props.history.push({
                        pathname: '/',
                        state: {from: this.props.location.pathname}
                    });
                }
            }
        }
    }
    componentWillMount(){
        let anyGroupProduct = localStorage.getItem("any_group_product");
        let anyPriceProduct = localStorage.getItem("any_price_product");
        let pageGroupProduct = localStorage.getItem("page_group_product");
        let pagePriceProduct = localStorage.getItem("page_price_product");
        // this.props.dispatch(FetchProduct(1, by===''||by===null||by===undefined?'':by, any===''||any===null||any===undefined?'':any));
        this.checkingProduct();
        this.props.dispatch(FetchPriceProduct(pagePriceProduct?pagePriceProduct:1,anyPriceProduct?anyPriceProduct:''));
        this.props.dispatch(FetchGroupProduct(pageGroupProduct?pageGroupProduct:1,anyGroupProduct?anyGroupProduct:''));
    }
    checkingProduct(){
        let where='';
        let que = 'any_master';
        let kode=localStorage.getItem(`${que}_kode_barang`);
        let nama=localStorage.getItem(`${que}_nama_barang`);
        let kelompok=localStorage.getItem(`${que}_kelompok_barang`);
        let supplier=localStorage.getItem(`${que}_supplier_barang`);
        let subdept=localStorage.getItem(`${que}_subdept_barang`);
        let kategori=localStorage.getItem(`${que}_kategori_barang`);
        let dateFrom=localStorage.getItem(`date_from_master_barang`);
        let dateTo=localStorage.getItem(`date_to_master_barang`);
        if(kode!==undefined&&kode!==null&&kode!==''){
            if(where!==''){where+='&';}
            where+=`searchby=kd_brg&q=${btoa(kode)}`;
        }
        if(nama!==undefined&&nama!==null&&nama!==''){
            if(where!==''){where+='&';}
            where += `searchby=nm_brg&q=${btoa(nama)}`;
        }
        if(kelompok!==undefined&&kelompok!==null&&kelompok!==''){
            if(where!==''){where+='&';}
            where += `searchby=kel_brg&q=${btoa(kelompok)}`;
        }
        if(supplier!==undefined&&supplier!==null&&supplier!==''){
            if(where!==''){where+='&';}
            where += `searchby=supplier&q=${btoa(supplier)}`;
        }
        if(subdept!==undefined&&subdept!==null&&subdept!==''){
            if(where!==''){where+='&';}
            where += `searchby=subdept&q=${btoa(subdept)}`;
        }
        if(kategori!==undefined&&kategori!==null&&kategori!==''){
            if(where!==''){where+='&';}
            where += `searchby=kategori&q=${btoa(kategori)}`;
        }
        if(localStorage.semuaPeriode==='false'){
            if(dateFrom!==undefined&&dateFrom!==null&&dateFrom!==''){
                if(where!==''){where+='&';}
                where+=`datefrom=${dateFrom}&dateto=${dateTo}`;
            }
        }
        
        if(localStorage.semuaPeriode===undefined){ 
            if(where!==''){where+='&';}
            where+=`datefrom=${moment(new Date()).format('YYYY-MM-DD')}&dateto=${moment(new Date()).format('YYYY-MM-DD')}`;
        }

        this.props.dispatch(FetchProduct(1,where));
    }
    //Use arrow functions to avoid binding
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
        });
    };


    render(){
        return (
            <Layout page="Product">
                <div className="col-12 box-margin">
                    <div className="card">
                        <Tabs>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <TabList>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(0)}>Barang</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(1)}>Harga Barang</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(2)}>Kelompok Barang</Tab>
                                </TabList>
                                <div>
                                    <Link to="upload" className="btn btn-outline-info"><i className="fa fa-upload"></i>&nbsp;IMPORT FROM CSV</Link>
                                </div>
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
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Product)
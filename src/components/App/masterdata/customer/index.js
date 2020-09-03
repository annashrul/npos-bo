import React,{Component} from 'react'
import Preloader from "Preloader";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {FetchCustomer} from "redux/actions/masterdata/customer/customer.action";
import ListCustomer from "./src/master_customer/list";
import {FetchCustomerType} from "redux/actions/masterdata/customer_type/customer_type.action";
import ListCustomerType from "./src/master_customer_type/list";

class Customer extends Component{
    constructor(props){
        super(props);
        this.state={
            token:""
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[15]['label']==="0"){
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
        let anyCustomer = localStorage.getItem("any_customer");
        let anyCustomerType = localStorage.getItem("any_customer_type");
        let pageCustomer = localStorage.getItem("page_customer");
        let pageCustomerType = localStorage.getItem("page_customer_type");
        this.props.dispatch(FetchCustomer(pageCustomer?pageCustomer:1,anyCustomer?anyCustomer:''));
        this.props.dispatch(FetchCustomerType(pageCustomerType?pageCustomerType:1,anyCustomerType?anyCustomerType:''));
    }
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
            
        })
    };


    render(){
        return (
            <Layout page="Customer">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <Tabs>
                                <TabList>
                                    <Tab onClick={() =>this.handleSelect(0)}>Master Customer</Tab>
                                    <Tab onClick={() =>this.handleSelect(1)}>Master Customer Type</Tab>
                                </TabList>
                                <TabPanel>
                                    {
                                        !this.props.isLoading?<ListCustomer token={this.state.token} data={this.props.customer}/>:<Preloader/>
                                    }

                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading1?<ListCustomerType token={this.state.token} data={this.props.customerType}/>:<Preloader/>
                                    }
                                </TabPanel>
                            </Tabs>

                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        customer: state.customerReducer.data,
        customerType: state.customerTypeReducer.data,
        isOpen:state.modalReducer,
        isLoading: state.customerReducer.isLoading,
        isLoading1: state.customerTypeReducer.isLoading,
        auth: state.auth

    }
}
export default connect(mapStateToProps)(Customer)